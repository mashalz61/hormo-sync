import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { analyzeFood } from "@/services/api/foodAnalyzer";
import { isAppApiError } from "@/services/api/client";
import { theme } from "@/theme";
import {
  CategoryAnalysisResult,
  FoodAnalysisCompletePayload,
  FoodAnalyzerFormValues,
  FoodAnalyzerMeals,
  MealQuantityMode,
} from "@/types/foodAnalyzer";
import {
  extractMealCaloriesFromResponse,
  formatAnalysisScalarForDisplay,
  normalizeStoredCalories,
} from "@/utils/calorieResponse";
import { mealCategories, MealCategory } from "@/utils/mealCsv";
import { CustomButton } from "./CustomButton";
import { FormSection } from "./FormSection";
import { GramInput } from "./GramInput";
import { MealSelector } from "./MealSelector";

const mealSelectionSchema = z
  .object({
    meal: z.string().trim().optional(),
    grams: z
      .number()
      .int()
      .min(1, "Grams must be at least 1.")
      .max(2000, "Grams must stay under 2000.")
      .optional(),
    portionCount: z
      .number()
      .int()
      .min(1, "Portions must be at least 1.")
      .max(20, "Portions must stay under 20.")
      .optional(),
    quantityMode: z.enum(["grams", "portion"]).default("grams"),
  })
  .superRefine((value, context) => {
    const hasMeal = Boolean(value.meal);
    const hasGrams = typeof value.grams === "number";
    const hasPortionCount = typeof value.portionCount === "number";
    const usingGrams = value.quantityMode === "grams";

    if (hasMeal && usingGrams && !hasGrams) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grams are required when a meal is selected.",
        path: ["grams"],
      });
    }

    if (hasMeal && !usingGrams && !hasPortionCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Portion count is required when a meal is selected.",
        path: ["portionCount"],
      });
    }

    if (!hasMeal && (hasGrams || hasPortionCount)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a meal before entering quantity.",
        path: ["meal"],
      });
    }
  });

export const foodAnalyzerSchema = z
  .object({
    breakfast: mealSelectionSchema,
    lunch: mealSelectionSchema,
    dinner: mealSelectionSchema,
    snacks: mealSelectionSchema,
  })
  .superRefine((values, context) => {
    const hasAtLeastOneMeal = Object.values(values).some((entry) => Boolean(entry.meal));

    if (!hasAtLeastOneMeal) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one meal to analyze.",
        path: ["breakfast", "meal"],
      });
    }
  });

interface FoodAnalyzerFormProps {
  mealsByCategory: FoodAnalyzerMeals;
  onAnalysisComplete?: (payload: FoodAnalysisCompletePayload) => Promise<void> | void;
  showResults?: boolean;
  submitLabel?: string;
  validationMode?: "onChange" | "onSubmit";
  initialCategory?: MealCategory;
  initialEntry?: {
    category: MealCategory;
    mealName: string;
    grams?: number;
    portionCount?: number;
    quantityMode: MealQuantityMode;
  };
}

export const FoodAnalyzerForm = ({
  mealsByCategory,
  onAnalysisComplete,
  showResults = true,
  submitLabel = "Analyze Food",
  validationMode = "onChange",
  initialCategory = "breakfast",
  initialEntry,
}: FoodAnalyzerFormProps) => {
  const [results, setResults] = useState<CategoryAnalysisResult[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>(
    initialEntry?.category ?? initialCategory,
  );
  const resolvedDefaultValues = useMemo<FoodAnalyzerFormValues>(() => {
    const baseValues = {
      breakfast: { quantityMode: "grams" as const },
      lunch: { quantityMode: "grams" as const },
      dinner: { quantityMode: "grams" as const },
      snacks: { quantityMode: "grams" as const },
    };

    if (!initialEntry) {
      return baseValues;
    }

    return {
      ...baseValues,
      [initialEntry.category]: {
        meal: initialEntry.mealName,
        grams: initialEntry.grams,
        portionCount: initialEntry.portionCount,
        quantityMode: initialEntry.quantityMode,
      },
    };
  }, [initialEntry]);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FoodAnalyzerFormValues>({
    defaultValues: resolvedDefaultValues,
    mode: validationMode,
    resolver: zodResolver(foodAnalyzerSchema),
  });

  const activeEntry = watch(selectedCategory);
  const quantityMode = activeEntry.quantityMode ?? "grams";
  const activeOptions = useMemo(
    () => mealsByCategory[selectedCategory] ?? [],
    [mealsByCategory, selectedCategory],
  );

  const onSubmit = async (values: FoodAnalyzerFormValues) => {
    setSubmitError(null);

    const selectedMeals = mealCategories
      .map((category) => ({
        category,
        meal: values[category].meal,
        grams: values[category].grams,
        portionCount: values[category].portionCount,
        quantityMode: values[category].quantityMode ?? "grams",
      }))
      .filter((entry) => {
        if (!entry.meal) {
          return false;
        }

        if (entry.quantityMode === "grams") {
          return typeof entry.grams === "number";
        }

        return typeof entry.portionCount === "number";
      })
      .map((entry) => ({
        category: entry.category,
        meal: entry.meal as string,
        grams: entry.grams,
        portionCount: entry.portionCount,
        quantityMode: entry.quantityMode as MealQuantityMode,
      }));

    try {
      const responseEntries = await Promise.all(
        selectedMeals.map(async (entry) => ({
          category: entry.category,
          meal: entry.meal,
          grams: entry.grams,
          portionCount: entry.portionCount,
          quantityMode: entry.quantityMode,
          data: await analyzeFood({
            meal_name: entry.meal,
            grams: entry.quantityMode === "grams" ? entry.grams : undefined,
            portion_count: entry.quantityMode === "portion" ? entry.portionCount : undefined,
          }),
        })),
      );

      const totalCalories = normalizeStoredCalories(
        responseEntries.reduce((sum, entry) => sum + extractMealCaloriesFromResponse(entry.data), 0),
      );

      if (showResults) {
        setResults(responseEntries);
      } else {
        setResults([]);
      }

      await onAnalysisComplete?.({
        results: responseEntries,
        totalCalories,
      });
    } catch (error) {
      const message = isAppApiError(error)
        ? error.details?.[0] ?? error.message
        : error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the selected meals.";

      setSubmitError(message);
      setResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.introCard}>
        <Text style={styles.eyebrow}>Smart Food Analyzer</Text>
        <Text style={styles.title}>Choose a meal category, pick a dish, and log it your way.</Text>
        <Text style={styles.body}>
          Users can log breakfast, lunch, dinner, or snacks, then choose grams or portions before analysis.
        </Text>
      </View>

      <View style={styles.categoryGroup}>
        <Text style={styles.groupTitle}>Meal category</Text>
        <View style={styles.categoryRow}>
          {mealCategories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {formatCategoryTitle(category)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FormSection>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>{formatCategoryTitle(selectedCategory)}</Text>
            <Text style={styles.sectionHint}>Pick a meal and one quantity style</Text>
          </View>
          <View style={styles.categoryCountPill}>
            <Text style={styles.categoryCountText}>{activeOptions.length} meals</Text>
          </View>
        </View>

        <Controller
          control={control}
          name={`${selectedCategory}.meal`}
          render={({ field: { onChange, value } }) => (
            <MealSelector
              errorText={errors[selectedCategory]?.meal?.message}
              label="Select meal"
              onChange={onChange}
              options={activeOptions}
              placeholder={`Search ${formatCategoryTitle(selectedCategory).toLowerCase()} options`}
              value={value}
            />
          )}
        />

        <View style={styles.modeBlock}>
          <Text style={styles.modeLabel}>How do you want to enter quantity?</Text>
          <View style={styles.modeRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setValue(`${selectedCategory}.quantityMode`, "grams", { shouldValidate: true });
                setValue(`${selectedCategory}.portionCount`, undefined, { shouldValidate: true });
              }}
              style={[styles.modeChip, quantityMode === "grams" && styles.modeChipActive]}
            >
              <Ionicons
                color={quantityMode === "grams" ? theme.colors.primaryDark : theme.colors.textMuted}
                name="scale-outline"
                size={16}
              />
              <Text style={[styles.modeChipText, quantityMode === "grams" && styles.modeChipTextActive]}>
                Grams
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setValue(`${selectedCategory}.quantityMode`, "portion", { shouldValidate: true });
                setValue(`${selectedCategory}.grams`, undefined, { shouldValidate: true });
              }}
              style={[styles.modeChip, quantityMode === "portion" && styles.modeChipActive]}
            >
              <Ionicons
                color={quantityMode === "portion" ? theme.colors.primaryDark : theme.colors.textMuted}
                name="pie-chart-outline"
                size={16}
              />
              <Text style={[styles.modeChipText, quantityMode === "portion" && styles.modeChipTextActive]}>
                Portions
              </Text>
            </Pressable>
          </View>
        </View>

        {quantityMode === "grams" ? (
          <Controller
            control={control}
            name={`${selectedCategory}.grams`}
            render={({ field: { onChange, value } }) => (
              <GramInput
                errorText={errors[selectedCategory]?.grams?.message}
                helperText="Use grams when you know the approximate weight."
                label="Grams"
                onChange={onChange}
                value={value}
              />
            )}
          />
        ) : (
          <Controller
            control={control}
            name={`${selectedCategory}.portionCount`}
            render={({ field: { onChange, value } }) => (
              <GramInput
                errorText={errors[selectedCategory]?.portionCount?.message}
                helperText="Use portions for servings like 1 plate, 2 bowls, or 1 slice."
                label="Portion count"
                maxLength={2}
                onChange={onChange}
                placeholder="e.g. 2"
                value={value}
              />
            )}
          />
        )}
      </FormSection>

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <CustomButton
        disabled={validationMode === "onChange" ? !isValid || isSubmitting : isSubmitting}
        label={isSubmitting ? "Analyzing meal..." : submitLabel}
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />

      {isSubmitting ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>Sending selected meals for nutrition analysis.</Text>
        </View>
      ) : null}

      {showResults && results.length ? (
        <View style={styles.resultsBlock}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            <Text style={styles.resultsCaption}>{results.length} meal(s) analyzed</Text>
          </View>

          {results.map((result) => (
            <View key={`${result.category}-${result.meal}`} style={styles.resultCard}>
              <View style={styles.resultCardHeader}>
                <View style={styles.resultTitleBlock}>
                  <Text style={styles.resultCategory}>{formatCategoryTitle(result.category)}</Text>
                  <Text style={styles.resultMeal}>{result.meal}</Text>
                </View>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultBadgeText}>
                    {result.quantityMode === "portion"
                      ? `${result.portionCount} portion${result.portionCount === 1 ? "" : "s"}`
                      : `${result.grams} g`}
                  </Text>
                </View>
              </View>

              <View style={styles.metricGrid}>
                {buildResultItems(result.data).map((item) => (
                  <View key={`${result.category}-${item.label}`} style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{item.label}</Text>
                    <Text style={styles.metricValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

function formatCategoryTitle(category: MealCategory) {
  if (category === "snacks") {
    return "Snack";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function buildResultItems(data: CategoryAnalysisResult["data"]) {
  const scalarEntries = Object.entries(data).filter(([, value]) =>
    ["string", "number", "boolean"].includes(typeof value),
  );

  if (!scalarEntries.length) {
    return [{ label: "Response", value: "Analysis received" }];
  }

  return scalarEntries.slice(0, 6).map(([key, value]) => ({
    label: formatResultKey(key),
    value: formatAnalysisScalarForDisplay(key, value),
  }));
}

function formatResultKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  introCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E9D5DF",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
  },
  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  categoryGroup: {
    gap: theme.spacing.sm,
  },
  groupTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryChipActive: {
    backgroundColor: "#FCECF3",
    borderColor: "#E9CBD8",
  },
  categoryChipText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textMuted,
  },
  categoryChipTextActive: {
    color: theme.colors.primaryDark,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  sectionCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sectionHint: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  categoryCountPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FAEDF3",
    borderWidth: 1,
    borderColor: "#EAD0DB",
  },
  categoryCountText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  modeBlock: {
    gap: theme.spacing.md,
  },
  modeLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  modeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  modeChip: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  modeChipActive: {
    backgroundColor: "#FCECF3",
    borderColor: "#E9CBD8",
  },
  modeChipText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textMuted,
  },
  modeChipTextActive: {
    color: theme.colors.primaryDark,
  },
  submitError: {
    ...theme.typography.small,
    color: theme.colors.danger,
  },
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  loadingText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  resultsBlock: {
    gap: theme.spacing.md,
  },
  resultsHeader: {
    gap: 2,
  },
  resultsTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  resultsCaption: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  resultCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  resultCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  resultTitleBlock: {
    flex: 1,
    gap: 2,
  },
  resultCategory: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
  },
  resultMeal: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  resultBadge: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  resultBadgeText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  metricCard: {
    width: "48%",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#F0DFE7",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.md,
    gap: 2,
  },
  metricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  metricValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
});
