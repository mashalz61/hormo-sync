import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { FoodAnalyzerForm } from "@/components/FoodAnalyzerForm";
import { Screen } from "@/components/Screen";
import { mealOptionsByCategory } from "@/data/mealOptionsCsv";
import { useCalorieStore } from "@/store/calorieStore";
import { theme } from "@/theme";

export const MealLogScreen = () => {
  const { entryId } = useLocalSearchParams<{ entryId?: string }>();
  const addMealEntry = useCalorieStore((state) => state.addMealEntry);
  const updateMealEntry = useCalorieStore((state) => state.updateMealEntry);
  const existingEntry = useCalorieStore((state) =>
    state.mealEntries.find((item) => item.id === entryId),
  );
  const isEditing = Boolean(existingEntry);

  return (
    <Screen contentStyle={styles.content}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardShell}
      >
        <ChildRouteHeader
          fallbackRoute="/tracker/smart-food-dashboard"
          subtitle={
            isEditing
              ? "Update a saved meal entry and the tracker totals will refresh automatically."
              : "Use the same meal-first flow, but now send calories straight into the shared tracker."
          }
          title={isEditing ? "Edit Meal Log" : "Meal Log"}
        />

        <FoodAnalyzerForm
          key={entryId ?? "new-meal"}
          initialCategory={existingEntry?.category}
          initialEntry={
            existingEntry
              ? {
                  category: existingEntry.category,
                  mealName: existingEntry.mealName,
                  grams: existingEntry.grams,
                  portionCount: existingEntry.portionCount,
                  quantityMode: existingEntry.quantityMode,
                }
              : undefined
          }
          mealsByCategory={mealOptionsByCategory}
          onAnalysisComplete={({ results, totalCalories }) => {
            const [result] = results;

            if (!result) {
              return;
            }

            const payload = {
              category: result.category,
              mealName: result.meal,
              calories: totalCalories,
              grams: result.grams,
              portionCount: result.portionCount,
              quantityMode: result.quantityMode,
            };

            if (existingEntry) {
              updateMealEntry(existingEntry.id, payload);
            } else {
              addMealEntry(payload);
            }

            router.dismissTo("/tracker/smart-food-dashboard");
          }}
          showResults={false}
          submitLabel={isEditing ? "Update Meal Log" : "Analyze Meal"}
          validationMode={isEditing ? "onSubmit" : "onChange"}
        />
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
});
