import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { ExerciseSelector } from "@/components/ExerciseSelector";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { exerciseOptions } from "@/data/exerciseOptionsCsv";
import { predictExercise } from "@/services/api/exerciseAnalyzer";
import { isAppApiError } from "@/services/api/client";
import { ExerciseLogEntry, useCalorieStore } from "@/store/calorieStore";
import { theme } from "@/theme";
import { extractExerciseCaloriesFromResponse } from "@/utils/calorieResponse";

const exerciseLogSchema = z
  .object({
    exerciseName: z.string().trim().min(1, "Choose an exercise."),
    inputMode: z.enum(["sets_reps", "duration"]),
    sets: z.number().optional(),
    reps: z.number().optional(),
    durationMinutes: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.inputMode === "sets_reps") {
      if (data.sets == null || !Number.isFinite(data.sets)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter the number of sets.", path: ["sets"] });
      } else if (data.sets < 1 || data.sets > 500) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Sets must be between 1 and 500.", path: ["sets"] });
      }
      if (data.reps == null || !Number.isFinite(data.reps)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter reps per set.", path: ["reps"] });
      } else if (data.reps < 1 || data.reps > 2000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Reps must be between 1 and 2000.", path: ["reps"] });
      }
    } else {
      const d = data.durationMinutes;
      if (d == null || !Number.isFinite(d)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter duration in minutes.",
          path: ["durationMinutes"],
        });
      } else if (d < 0.5 || d > 600) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duration must be between 0.5 and 600 minutes.",
          path: ["durationMinutes"],
        });
      }
    }
  });

type ExerciseLogFormValues = z.infer<typeof exerciseLogSchema>;

function exerciseEntryToFormDefaults(entry?: ExerciseLogEntry): Partial<ExerciseLogFormValues> {
  if (!entry) {
    return {};
  }

  if (entry.logMode === "sets_reps") {
    return {
      exerciseName: entry.exerciseName,
      inputMode: "sets_reps",
      sets: entry.sets,
      reps: entry.reps,
      durationMinutes: undefined,
    };
  }

  return {
    exerciseName: entry.exerciseName,
    inputMode: "duration",
    durationMinutes: entry.durationMinutes,
    sets: undefined,
    reps: undefined,
  };
}

function parsePositiveInt(text: string): number | undefined {
  const digitsOnly = text.replace(/[^0-9]/g, "");
  if (!digitsOnly) {
    return undefined;
  }
  const n = Number(digitsOnly);
  return Number.isFinite(n) ? n : undefined;
}

function parseDurationMinutes(text: string): number | undefined {
  const t = text.trim().replace(",", ".");
  if (!t) {
    return undefined;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

export const ExerciseLogScreen = () => {
  const { entryId } = useLocalSearchParams<{ entryId?: string }>();
  const addExerciseEntry = useCalorieStore((state) => state.addExerciseEntry);
  const updateExerciseEntry = useCalorieStore((state) => state.updateExerciseEntry);
  const existingEntry = useCalorieStore((state) => state.exerciseEntries.find((item) => item.id === entryId));
  const isEditing = Boolean(existingEntry);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<ExerciseLogFormValues>({
    defaultValues: {
      exerciseName: "",
      inputMode: "duration",
      sets: undefined,
      reps: undefined,
      durationMinutes: undefined,
      ...exerciseEntryToFormDefaults(existingEntry),
    },
    mode: "onChange",
    resolver: zodResolver(exerciseLogSchema),
  });

  const inputMode = watch("inputMode");

  const setInputMode = (mode: ExerciseLogFormValues["inputMode"]) => {
    setValue("inputMode", mode, { shouldValidate: true });
    if (mode === "sets_reps") {
      setValue("durationMinutes", undefined, { shouldValidate: true });
    } else {
      setValue("sets", undefined, { shouldValidate: true });
      setValue("reps", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: ExerciseLogFormValues) => {
    try {
      const response =
        values.inputMode === "sets_reps"
          ? await predictExercise({
              exercise_name: values.exerciseName,
              sets: values.sets!,
              reps: values.reps!,
            })
          : await predictExercise({
              exercise_name: values.exerciseName,
              duration_minutes: values.durationMinutes!,
            });
      const calories = extractExerciseCaloriesFromResponse(response);

      const payload =
        values.inputMode === "sets_reps"
          ? {
              exerciseName: values.exerciseName,
              calories,
              logMode: "sets_reps" as const,
              sets: values.sets!,
              reps: values.reps!,
            }
          : {
              exerciseName: values.exerciseName,
              calories,
              logMode: "duration" as const,
              durationMinutes: values.durationMinutes!,
            };

      if (existingEntry) {
        updateExerciseEntry(existingEntry.id, payload);
      } else {
        addExerciseEntry(payload);
      }

      router.dismissTo("/tracker/smart-food-dashboard");
    } catch (error) {
      const message = isAppApiError(error)
        ? error.details?.[0] ?? error.message
        : error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the exercise.";

      setError("root", { message });
    }
  };

  return (
    <Screen contentStyle={styles.content} key={entryId ?? "new-exercise"}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardShell}
      >
        <ChildRouteHeader
          fallbackRoute="/tracker/smart-food-dashboard"
          subtitle={
            isEditing
              ? "Update a saved exercise entry and the burned calories will refresh automatically."
              : "Pick an activity, then log either sets and reps or time in minutes."
          }
          title={isEditing ? "Edit Exercise Log" : "Exercise Log"}
        />

        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <View style={styles.introCopy}>
              <Text style={styles.eyebrow}>Exercise Burn Sync</Text>
              <Text style={styles.title}>Estimate burned calories without extra steps.</Text>
              <Text style={styles.body}>
                Switch between reps-based and time-based input to match how you track the workout.
              </Text>
            </View>
            <View style={styles.introIconShell}>
              <Ionicons color={theme.colors.primaryDark} name="walk-outline" size={22} />
            </View>
          </View>
        </View>

        <FormSection>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <Text style={styles.sectionHint}>Choose one exercise to analyze</Text>
          </View>
          <Controller
            control={control}
            name="exerciseName"
            render={({ field: { onChange, value } }) => (
              <ExerciseSelector
                errorText={errors.exerciseName?.message}
                label="Exercise Name"
                onChange={onChange}
                options={exerciseOptions.map((item) => item.name)}
                value={value}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How are you logging this?</Text>
            <Text style={styles.sectionHint}>Toggle between sets and reps, or duration only</Text>
          </View>
          <View style={styles.modeToggle}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: inputMode === "sets_reps" }}
              onPress={() => setInputMode("sets_reps")}
              style={[styles.modeSegment, inputMode === "sets_reps" && styles.modeSegmentActive]}
            >
              <Text style={[styles.modeSegmentText, inputMode === "sets_reps" && styles.modeSegmentTextActive]}>
                Sets & reps
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: inputMode === "duration" }}
              onPress={() => setInputMode("duration")}
              style={[styles.modeSegment, inputMode === "duration" && styles.modeSegmentActive]}
            >
              <Text style={[styles.modeSegmentText, inputMode === "duration" && styles.modeSegmentTextActive]}>
                Minutes
              </Text>
            </Pressable>
          </View>
        </FormSection>

        {inputMode === "duration" ? (
          <>
            <View style={styles.quickBlock}>
              <Text style={styles.quickLabel}>Quick durations</Text>
              <View style={styles.quickRow}>
                {[15, 30, 45, 60].map((minutes) => (
                  <Pressable
                    key={minutes}
                    accessibilityRole="button"
                    onPress={() => setValue("durationMinutes", minutes, { shouldValidate: true })}
                    style={styles.quickChip}
                  >
                    <Text style={styles.quickChipText}>{minutes} min</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <FormSection>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Duration</Text>
                <Text style={styles.sectionHint}>Enter the time spent on the activity</Text>
              </View>
              <Controller
                control={control}
                name="durationMinutes"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    errorText={errors.durationMinutes?.message}
                    helperText="Session length in minutes (decimals allowed, e.g. 45 or 12.5)."
                    keyboardType="decimal-pad"
                    label="Duration (minutes)"
                    maxLength={8}
                    onChangeText={(text) => {
                      onChange(parseDurationMinutes(text));
                    }}
                    placeholder="e.g. 45"
                    returnKeyType="done"
                    value={value != null && Number.isFinite(value) ? String(value) : ""}
                  />
                )}
              />
            </FormSection>
          </>
        ) : (
          <FormSection>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sets & reps</Text>
              <Text style={styles.sectionHint}>Both values are required for this mode</Text>
            </View>
            <Controller
              control={control}
              name="sets"
              render={({ field: { onChange, value } }) => (
                <InputField
                  errorText={errors.sets?.message}
                  helperText="Total sets completed."
                  keyboardType="number-pad"
                  label="Sets"
                  maxLength={3}
                  onChangeText={(text) => onChange(parsePositiveInt(text))}
                  placeholder="e.g. 3"
                  returnKeyType="next"
                  value={value != null && Number.isFinite(value) ? String(value) : ""}
                />
              )}
            />
            <View style={styles.repsFieldGap}>
              <Controller
                control={control}
                name="reps"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    errorText={errors.reps?.message}
                    helperText="Repetitions per set."
                    keyboardType="number-pad"
                    label="Reps per set"
                    maxLength={4}
                    onChangeText={(text) => onChange(parsePositiveInt(text))}
                    placeholder="e.g. 15"
                    returnKeyType="done"
                    value={value != null && Number.isFinite(value) ? String(value) : ""}
                  />
                )}
              />
            </View>
          </FormSection>
        )}

        {errors.root?.message ? <Text style={styles.submitError}>{errors.root.message}</Text> : null}

        <CustomButton
          disabled={!isValid || isSubmitting}
          label={
            isSubmitting
              ? "Analyzing Exercise..."
              : isEditing
                ? "Update Exercise Log"
                : "Analyze Exercise"
          }
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        {isSubmitting ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.loadingText}>Calculating calories burned.</Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  keyboardShell: {
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
  introHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  introCopy: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  introIconShell: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCECF3",
    borderWidth: 1,
    borderColor: "#E9D0DC",
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
  quickBlock: {
    gap: theme.spacing.sm,
  },
  quickLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  quickChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#E7D0DB",
    backgroundColor: "#FFF5F9",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickChipText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
  },
  modeToggle: {
    flexDirection: "row",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#E7D0DB",
    backgroundColor: theme.colors.surface,
    padding: 4,
    gap: 4,
  },
  modeSegment: {
    flex: 1,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeSegmentActive: {
    backgroundColor: "#FCECF3",
    borderWidth: 1,
    borderColor: "#E2BFD0",
  },
  modeSegmentText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textMuted,
  },
  modeSegmentTextActive: {
    color: theme.colors.primaryDark,
  },
  sectionHeader: {
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
  repsFieldGap: {
    marginTop: theme.spacing.md,
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
});
