import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ActionCard } from "@/components/ActionCard";
import { CalorieRing } from "@/components/CalorieRing";
import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { Screen } from "@/components/Screen";
import { CalorieLogEntry, ExerciseLogEntry, selectNetCalories, useCalorieStore } from "@/store/calorieStore";
import { theme } from "@/theme";
import { formatKcalWithUnit } from "@/utils/calorieResponse";

export const SmartFoodDashboardScreen = () => {
  const consumedCalories = useCalorieStore((state) => state.consumedCalories);
  const burnedCalories = useCalorieStore((state) => state.burnedCalories);
  const netCalories = useCalorieStore(selectNetCalories);
  const mealEntries = useCalorieStore((state) => state.mealEntries);
  const exerciseEntries = useCalorieStore((state) => state.exerciseEntries);
  const logEntries = useMemo(
    (): CalorieLogEntry[] =>
      [...mealEntries, ...exerciseEntries].sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      ),
    [mealEntries, exerciseEntries],
  );

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/home"
        subtitle="Track food and exercise from one place with instant calorie feedback."
        title="Smart Food Analyzer"
      />

      <LinearGradient
        colors={["#FFF8FB", "#FFF1F6", "#FFF9FC"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.hero}
      >
        <Text style={styles.heroEyebrow}>Daily Balance</Text>
        <Text style={styles.heroTitle}>Stay on top of your calorie cycle without leaving the flow.</Text>
        <Text style={styles.heroBody}>
          Log meals, log movement, and watch the tracker update automatically.
        </Text>
      </LinearGradient>

      <CalorieRing
        burnedCalories={burnedCalories}
        consumedCalories={consumedCalories}
        netCalories={netCalories}
      />

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>What do you want to log?</Text>
        <Text style={styles.sectionBody}>
          Keep the experience lightweight. Pick a single action and return to the same dashboard.
        </Text>

        <View style={styles.actionList}>
          <ActionCard
            description="Choose meals by category, enter grams, and analyze calories."
            icon="restaurant"
            onPress={() => router.push("/tracker/meal-time-selection")}
            title="Log Meal"
          />
          <ActionCard
            description="Pick an activity, add duration, and sync calories burned."
            icon="walk"
            onPress={() => router.push("/tracker/add-exercise")}
            title="Log Exercise"
          />
        </View>
      </View>

      <View style={styles.logSection}>
        <View style={styles.logHeader}>
          <View>
            <Text style={styles.sectionTitle}>Saved entries</Text>
            <Text style={styles.sectionBody}>
              Review what you logged and tap any entry to edit it.
            </Text>
          </View>
          <View style={styles.logCountPill}>
            <Text style={styles.logCountText}>{logEntries.length}</Text>
          </View>
        </View>

        <View style={styles.logList}>
          {logEntries.length ? (
            logEntries.map((entry) => (
              <Pressable
                key={entry.id}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname:
                      entry.type === "meal"
                        ? "/tracker/meal-time-selection"
                        : "/tracker/add-exercise",
                    params: { entryId: entry.id },
                  })
                }
                style={styles.logCard}
              >
                <View style={styles.logLeading}>
                  <View style={styles.logIconWrap}>
                    <Ionicons
                      color={theme.colors.primaryDark}
                      name={entry.type === "meal" ? "restaurant-outline" : "walk-outline"}
                      size={17}
                    />
                  </View>
                  <View style={styles.logCopy}>
                    <Text style={styles.logTitle}>
                      {entry.type === "meal" ? entry.mealName : entry.exerciseName}
                    </Text>
                    <Text style={styles.logMeta}>
                      {entry.type === "meal"
                        ? `${formatMealCategory(entry.category)} • ${
                            entry.quantityMode === "portion"
                              ? `${entry.portionCount} portion${entry.portionCount === 1 ? "" : "s"}`
                              : `${entry.grams} g`
                          }`
                        : formatExerciseLogSubtitle(entry)}
                    </Text>
                  </View>
                </View>

                <View style={styles.logTrailing}>
                  <Text style={styles.logCalories}>
                    {entry.type === "meal" ? "+" : "-"}
                    {formatKcalWithUnit(entry.calories)}
                  </Text>
                  <Text style={styles.logEditText}>Edit</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyLogState}>
              <Text style={styles.emptyLogTitle}>No entries yet</Text>
              <Text style={styles.emptyLogBody}>
                Add a meal or exercise and it will appear here for quick editing.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
};

function formatMealCategory(category: string) {
  if (category === "snacks") {
    return "Snack";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatExerciseLogSubtitle(entry: ExerciseLogEntry) {
  if (entry.logMode === "sets_reps" && entry.sets != null && entry.reps != null) {
    return `${entry.sets} sets × ${entry.reps} reps`;
  }

  const minutes = entry.durationMinutes;
  if (minutes == null || !Number.isFinite(minutes)) {
    return "Exercise";
  }

  const display = Number.isInteger(minutes) ? String(minutes) : String(Math.round(minutes * 10) / 10);
  return `${display} min exercise`;
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  hero: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#EFD7E1",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  heroEyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  actionSection: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sectionBody: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  actionList: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  logSection: {
    gap: theme.spacing.md,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  logCountPill: {
    minWidth: 32,
    height: 32,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAEDF3",
    borderWidth: 1,
    borderColor: "#EAD0DB",
  },
  logCountText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
  },
  logList: {
    gap: theme.spacing.sm,
  },
  logCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E9D6DE",
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  logLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flex: 1,
  },
  logIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCECF3",
    borderWidth: 1,
    borderColor: "#EAD2DD",
  },
  logCopy: {
    flex: 1,
    gap: 3,
  },
  logTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  logMeta: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  logTrailing: {
    alignItems: "flex-end",
    gap: 4,
  },
  logCalories: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  logEditText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  emptyLogState: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E9D6DE",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: theme.spacing.xl,
    gap: theme.spacing.xs,
    alignItems: "center",
  },
  emptyLogTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  emptyLogBody: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
