import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

const helperCopy = {
  Breakfast: {
    title: "Think protein first",
    body: "A protein anchor plus fruit, seeds, or whole grains usually makes breakfast feel more complete.",
    starter: "Greek yogurt bowl",
    notes: "Berries, seeds, cinnamon",
  },
  Lunch: {
    title: "Look for protein and produce",
    body: "Lunch tends to hold up better when you can name a protein, a vegetable or fruit, and a practical carb.",
    starter: "Chicken quinoa salad",
    notes: "Leafy greens, chickpeas, olive oil dressing",
  },
  Dinner: {
    title: "Keep the plate balanced",
    body: "Dinner does not need to be perfect. Aim for a protein, color, and a satisfying starch when needed.",
    starter: "Salmon with rice",
    notes: "Roasted vegetables, lemon, herbs",
  },
  Snacks: {
    title: "Pair two food groups",
    body: "Snacks are often more useful when they combine produce, whole grains, protein, or healthy fats.",
    starter: "Apple and peanut butter",
    notes: "Optional cinnamon, side yogurt if needed",
  },
} as const;

export default function EnterYourMealScreen() {
  const { mealType } = useLocalSearchParams<{ mealType?: string }>();
  const selectedMeal = (mealType ?? "Breakfast") as keyof typeof helperCopy;
  const guidance = useMemo(() => helperCopy[selectedMeal] ?? helperCopy.Breakfast, [selectedMeal]);

  const [mealTitle, setMealTitle] = useState<string>(guidance.starter);
  const [mealNotes, setMealNotes] = useState<string>(guidance.notes);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title={`Log your ${selectedMeal.toLowerCase()}`}
        subtitle="Capture what you ate so the summary can respond to the actual meal you are tracking."
      />

      <View style={styles.helperCard}>
        <View style={styles.helperHeader}>
          <View style={styles.helperIcon}>
            <Ionicons color={theme.colors.primaryDark} name="restaurant-outline" size={16} />
          </View>
          <View style={styles.helperCopy}>
            <Text style={styles.helperTitle}>{guidance.title}</Text>
            <Text style={styles.helperBody}>{guidance.body}</Text>
          </View>
        </View>
      </View>

      <FormSection>
        <InputField
          label="Meal title"
          value={mealTitle}
          onChangeText={setMealTitle}
          helperText="Use a short name you will recognize later."
        />
        <InputField
          label="Ingredients or notes"
          value={mealNotes}
          onChangeText={setMealNotes}
          multiline
          helperText="List major ingredients, sides, or anything that affected fullness or energy."
        />
      </FormSection>

      <CustomButton
        label="View daily food summary"
        onPress={() =>
          router.push({
            pathname: "/tracker/daily-food-summary",
            params: {
              mealType: selectedMeal,
              mealTitle,
              mealNotes,
            },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  helperCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E8D5D8",
    backgroundColor: "#FFF9F5",
    padding: theme.spacing.lg,
  },
  helperHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  helperIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEFE7",
    borderWidth: 1,
    borderColor: "#EADBCF",
  },
  helperCopy: {
    flex: 1,
    gap: 2,
  },
  helperTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  helperBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
