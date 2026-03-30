import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { theme } from "@/theme";

const mealOptions = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
type MealOption = (typeof mealOptions)[number];

const analyzerContent: Record<
  MealOption,
  {
    title: string;
    summary: string;
    focusLabel: string;
    focusValue: string;
    addOns: string[];
    sampleIdeas: string[];
    primaryLabel: string;
  }
> = {
  Breakfast: {
    title: "Set up steadier energy early",
    summary:
      "A breakfast that combines protein, fiber, and color tends to hold up better than a carb-only start.",
    focusLabel: "Best focus",
    focusValue: "Protein + fiber",
    addOns: ["Include a protein anchor", "Add fruit or another fiber source", "Choose a whole-grain base when it fits"],
    sampleIdeas: ["Greek yogurt, berries, and seeds", "Eggs with toast and greens", "Oats with nuts, cinnamon, and fruit"],
    primaryLabel: "See breakfast ideas",
  },
  Lunch: {
    title: "Build a midday plate that lasts",
    summary:
      "Lunch works better when it has enough protein and produce, not just a quick starch.",
    focusLabel: "Best focus",
    focusValue: "Half plate produce",
    addOns: ["Start with a protein", "Add vegetables or fruit", "Use grains or starches to round it out, not carry the whole meal"],
    sampleIdeas: ["Chicken and quinoa salad", "Rice bowl with tofu and vegetables", "Lentil wrap with yogurt sauce"],
    primaryLabel: "Plan this meal",
  },
  Dinner: {
    title: "Keep dinner structured, not heavy",
    summary:
      "A balanced dinner can support fullness and make late-night snacking feel less necessary.",
    focusLabel: "Best focus",
    focusValue: "Balanced plate",
    addOns: ["Keep vegetables visible on the plate", "Choose a satisfying protein", "Use a practical portion of grains or starches"],
    sampleIdeas: ["Salmon, roasted vegetables, and rice", "Bean chili with salad", "Chicken, sweet potato, and greens"],
    primaryLabel: "Plan this meal",
  },
  Snacks: {
    title: "Make snacks do a little more work",
    summary:
      "Pairing produce or whole grains with protein or healthy fats usually creates a steadier snack than sweets alone.",
    focusLabel: "Best focus",
    focusValue: "Pair food groups",
    addOns: ["Pair fruit with protein", "Use seeds or nuts for crunch and staying power", "Aim for at least two food groups"],
    sampleIdeas: ["Apple with peanut butter", "Yogurt with seeds", "Hummus with carrots and crackers"],
    primaryLabel: "Build snack ideas",
  },
};

export default function MealTimeSelectionScreen() {
  const [selectedMeal, setSelectedMeal] = useState<MealOption>("Breakfast");

  const current = useMemo(() => analyzerContent[selectedMeal], [selectedMeal]);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Smart food analyzer"
        subtitle="Choose a meal, then get practical guidance built around balanced plates, better pairings, and more useful logging."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color={theme.colors.primaryDark} name="nutrition-outline" size={14} />
            <Text style={styles.heroBadgeText}>Meal Analysis</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>Guidance over perfection</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{current.title}</Text>
        <Text style={styles.heroBody}>{current.summary}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{selectedMeal}</Text>
            <Text style={styles.metricLabel}>current focus</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{current.focusValue}</Text>
            <Text style={styles.metricLabel}>{current.focusLabel.toLowerCase()}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>MyPlate</Text>
            <Text style={styles.metricLabel}>food-group framing</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Pick a meal</Text>
        <Text style={styles.sectionTitle}>Shift the analysis based on what you are about to eat</Text>
        <Text style={styles.sectionBody}>
          The suggestions below update immediately so the tool feels specific to the meal in front of you.
        </Text>
        <SelectChips
          options={[...mealOptions]}
          value={selectedMeal}
          onChange={(value) => setSelectedMeal(value as MealOption)}
        />
      </View>

      <View style={styles.analysisCard}>
        <View style={styles.analysisHeader}>
          <View>
            <Text style={styles.analysisTitle}>{selectedMeal} checklist</Text>
            <Text style={styles.analysisSubtitle}>Use this before you log the meal</Text>
          </View>
          <View style={styles.analysisIcon}>
            <Ionicons color={theme.colors.primaryDark} name="sparkles-outline" size={18} />
          </View>
        </View>

        <View style={styles.bulletList}>
          {current.addOns.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sampleCard}>
          <Text style={styles.sampleTitle}>Sample ideas</Text>
          <View style={styles.sampleList}>
            {current.sampleIdeas.map((idea) => (
              <View key={idea} style={styles.sampleRow}>
                <Ionicons color={theme.colors.primaryDark} name="checkmark-circle-outline" size={15} />
                <Text style={styles.sampleText}>{idea}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          label={current.primaryLabel}
          onPress={() =>
            router.push({
              pathname: "/tracker/suggested-breakfast",
              params: { mealType: selectedMeal },
            })
          }
        />
        <CustomButton
          label={`Log ${selectedMeal.toLowerCase()}`}
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/tracker/enter-your-meal",
              params: { mealType: selectedMeal },
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E8D5D8",
    backgroundColor: "#FFF9F5",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "#FCEFE7",
    borderWidth: 1,
    borderColor: "#EBD9CB",
  },
  heroBadgeText: {
    ...theme.typography.small,
    color: "#8A6A34",
  },
  heroPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#E8DAD0",
  },
  heroPillText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#EBDCCB",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 3,
  },
  metricValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  metricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  sectionCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D8CE",
    backgroundColor: "#FFFDFC",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionEyebrow: {
    ...theme.typography.small,
    color: "#8A6A34",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sectionBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  analysisCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E7D8CE",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  analysisTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  analysisSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  analysisIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF0E6",
    borderWidth: 1,
    borderColor: "#EADBCF",
  },
  bulletList: {
    gap: theme.spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "#D7A97B",
    marginTop: 7,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  sampleCard: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#EBDCCB",
    backgroundColor: "#FFFAF6",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sampleTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  sampleList: {
    gap: theme.spacing.sm,
  },
  sampleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  sampleText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
