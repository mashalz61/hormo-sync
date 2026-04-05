import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { useCycleTrackerStore } from "@/store/cycleTrackerStore";
import { useSeedCycleStore } from "@/store/seedCycleStore";
import { theme } from "@/theme";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";
import {
  getCompletionStreak,
  getDetectedSeedPhase,
  getSeedPlan,
  getTodaySeedKey,
} from "@/utils/seedCycle";

export default function IntakeTrackingScreen() {
  const { draft, logs } = useCycleTrackerStore();
  const { selectedPhase, phaseMode, completedDates, toggleTodayCompletion } = useSeedCycleStore();
  const cycleSummary = buildCycleSummaryInsight(draft, logs);
  const detected = getDetectedSeedPhase(cycleSummary);
  const effectivePhase = phaseMode === "cycle" && detected.phase ? detected.phase : selectedPhase;
  const currentPlan = getSeedPlan(effectivePhase);
  const todayKey = getTodaySeedKey();
  const completedToday = completedDates.includes(todayKey);
  const streak = getCompletionStreak(completedDates);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="Intake tracking"
        subtitle="Mark whether you completed today's seed routine so the flow can show progress without pretending to measure hormone outcomes."
      />

      <LinearGradient colors={["#EFF4E7", "#F8F8F3", "#FFF7ED"]} style={styles.heroCard}>
        <Text style={styles.title}>{effectivePhase} today</Text>
        <Text style={styles.body}>
          Target pairing: {currentPlan.seeds.join(" + ")}. Use the completion toggle as a habit
          check-in, not as proof that the routine is working.
        </Text>
        <View style={styles.statusBand}>
          <Text style={styles.statusBandLabel}>Today</Text>
          <Text style={styles.statusBandValue}>
            {completedToday ? "Routine logged" : "Waiting for check-in"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Today&apos;s status</Text>
          <Text style={styles.metricValue}>{completedToday ? "Completed" : "Not yet logged"}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Current streak</Text>
          <Text style={styles.metricValue}>{streak} days</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today&apos;s checklist</Text>
        {currentPlan.seeds.map((seed) => (
          <View key={seed} style={styles.row}>
            <View style={[styles.dot, completedToday && styles.dotDone]} />
            <Text style={styles.text}>{seed}</Text>
          </View>
        ))}
      </View>

      <CustomButton
        label={completedToday ? "Undo today's completion" : "Mark today's intake complete"}
        onPress={toggleTodayCompletion}
      />
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
    borderColor: "#E2DACE",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  statusBand: {
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: "#E8DEC9",
    padding: theme.spacing.md,
    gap: 2,
  },
  statusBandLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBandValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  metricCard: {
    minWidth: "47%",
    flexGrow: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#E6DBCF",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    gap: 4,
  },
  metricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  metricValue: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E6DCCF",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#D8D6CF",
    marginTop: 7,
  },
  dotDone: {
    backgroundColor: "#8FAE5A",
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
