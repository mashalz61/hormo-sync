import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { Screen } from "@/components/Screen";
import { meals } from "@/data/mockData";
import { theme } from "@/theme";

export default function DailyFoodSummaryScreen() {
  const { mealType, mealTitle, mealNotes } = useLocalSearchParams<{
    mealType?: string;
    mealTitle?: string;
    mealNotes?: string;
  }>();

  const selectedMeal = mealType ?? "Breakfast";
  const latestTitle = mealTitle ?? "Greek yogurt bowl";
  const latestNotes = mealNotes ?? "Berries, seeds, cinnamon";
  const summary = getMealSummary(selectedMeal);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Daily food summary"
        subtitle="Review today’s meals, the latest item you logged, and the next improvement worth making."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color={theme.colors.primaryDark} name="analytics-outline" size={14} />
            <Text style={styles.heroBadgeText}>Daily review</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{selectedMeal} logged</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{summary.title}</Text>
        <Text style={styles.heroBody}>{summary.body}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{meals.length + 1}</Text>
            <Text style={styles.metricLabel}>items reviewed</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{summary.metric}</Text>
            <Text style={styles.metricLabel}>current focus</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>1</Text>
            <Text style={styles.metricLabel}>next adjustment</Text>
          </View>
        </View>
      </View>

      <View style={styles.latestCard}>
        <Text style={styles.sectionTitle}>Latest meal entry</Text>
        <Text style={styles.latestMealType}>{selectedMeal}</Text>
        <Text style={styles.latestMealTitle}>{latestTitle}</Text>
        <Text style={styles.latestMealNotes}>{latestNotes}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Today&apos;s meals</Text>
        <View style={styles.list}>
          {meals.map((item) => (
            <View key={item.id} style={styles.listRow}>
              <View style={styles.listIcon}>
                <Ionicons color={theme.colors.primaryDark} name="checkmark-outline" size={15} />
              </View>
              <View style={styles.listCopy}>
                <Text style={styles.listTitle}>
                  {item.mealType}: {item.title}
                </Text>
                <Text style={styles.listSubtitle}>{item.balance}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.sectionTitle}>Most useful next step</Text>
        <Text style={styles.noteText}>{summary.nextStep}</Text>
      </View>
    </Screen>
  );
}

const getMealSummary = (mealType: string) => {
  switch (mealType) {
    case "Lunch":
      return {
        title: "Lunch quality improves when it has enough structure",
        body: "The biggest win is usually making sure lunch has visible protein plus produce, not just convenience carbs.",
        metric: "Protein + produce",
        nextStep: "If lunch feels light, add a protein anchor first, then a fruit or vegetable before adding more snack foods later.",
      };
    case "Dinner":
      return {
        title: "Dinner can support fullness without feeling heavy",
        body: "A simple plate with protein, vegetables, and a satisfying starch is often enough to close the day well.",
        metric: "Balanced plate",
        nextStep: "If you tend to snack late, make dinner a little more complete instead of relying on willpower afterward.",
      };
    case "Snacks":
      return {
        title: "Snacks work better when they are paired on purpose",
        body: "Two food groups usually create a steadier snack than sweets or refined carbs on their own.",
        metric: "Pair food groups",
        nextStep: "Keep one snack pairing ready to repeat, such as fruit plus yogurt or crackers plus hummus.",
      };
    default:
      return {
        title: "Breakfast quality shapes the rest of the morning",
        body: "Protein and fiber early in the day often make energy dips and grazing less likely.",
        metric: "Protein + fiber",
        nextStep: "If breakfast is mostly carbs, add one protein source before trying to change everything else.",
      };
  }
};

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
    borderRadius: theme.radius.pill,
    backgroundColor: "#FCEFE7",
    borderWidth: 1,
    borderColor: "#EADBCF",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
  },
  heroBadgeText: {
    ...theme.typography.small,
    color: "#8A6A34",
  },
  heroPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#E8DAD0",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
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
  latestCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D8CE",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    gap: 6,
  },
  sectionCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D8CE",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  latestMealType: {
    ...theme.typography.small,
    color: "#8A6A34",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  latestMealTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  latestMealNotes: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  list: {
    gap: theme.spacing.sm,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  listIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF0E6",
    borderWidth: 1,
    borderColor: "#EADBCF",
  },
  listCopy: {
    flex: 1,
    gap: 2,
  },
  listTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  listSubtitle: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  noteCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E8D5D8",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  noteText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
