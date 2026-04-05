import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { Screen } from "@/components/Screen";
import { useCycleTrackerStore } from "@/store/cycleTrackerStore";
import { theme } from "@/theme";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";

const sourceNotes = [
  "Typical adult cycles are commonly described as about 21-35 days.",
  "Bleeding that lasts more than 7 days, or long gaps between periods, should be reviewed clinically.",
  "Calendar-based ovulation estimates are less reliable when cycles are irregular.",
];

export default function CycleSummaryScreen() {
  const { draft, logs } = useCycleTrackerStore();
  const summary = buildCycleSummaryInsight(draft, logs);

  const metricCards = [
    {
      label: "Latest completed cycle",
      value: summary.latestCompletedCycleLength
        ? `${summary.latestCompletedCycleLength} days`
        : "Not enough data",
      icon: "calendar-clear-outline" as const,
    },
    {
      label: "Average cycle length",
      value: summary.averageCycleLength ? `${summary.averageCycleLength} days` : "Need another cycle",
      icon: "analytics-outline" as const,
    },
    {
      label: "Current cycle day",
      value: summary.currentCycleDay ? `Day ${summary.currentCycleDay}` : "Waiting for date",
      icon: "today-outline" as const,
    },
    {
      label: "Estimated phase",
      value: summary.estimatedPhase ?? "Estimate unavailable",
      icon: "sparkles-outline" as const,
    },
  ];

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker/menstrual-cycle-tracker"
        title="Cycle summary"
        subtitle="This summary separates what your dates directly show from what the app can only estimate."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroEyebrow}>Your pattern</Text>
            <Text style={styles.heroTitle}>{summary.summaryHeadline}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              summary.summaryTone === "good"
                ? styles.statusGood
                : summary.summaryTone === "watch"
                  ? styles.statusWatch
                  : styles.statusLimited,
            ]}
          >
            <Text style={styles.statusText}>{summary.regularityLabel}</Text>
          </View>
        </View>

        <Text style={styles.heroBody}>{summary.summaryBody}</Text>
        {summary.estimatedFertileWindow ? (
          <View style={styles.calloutRow}>
            <Ionicons
              color={theme.colors.primaryDark}
              name="information-circle-outline"
              size={18}
            />
            <Text style={styles.calloutText}>{summary.estimatedFertileWindow}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metricGrid}>
        {metricCards.map((card) => (
          <View key={card.label} style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons color={theme.colors.primaryDark} name={card.icon} size={18} />
            </View>
            <Text style={styles.metricValue}>{card.value}</Text>
            <Text style={styles.metricLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>What your dates directly show</Text>
        {summary.quickFacts.map((fact) => (
          <View key={fact} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{fact}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>When to get extra support</Text>
        {(summary.clinicianFlags.length ? summary.clinicianFlags : sourceNotes).map((fact) => (
          <View key={fact} style={styles.bulletRow}>
            <View style={[styles.bulletDot, styles.warningDot]} />
            <Text style={styles.bulletText}>{fact}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>How to read this</Text>
        <Text style={styles.noteBody}>
          The tracker measures period length and cycle length from the dates you enter. Phase and
          fertile-window cards are calendar estimates, not confirmation of ovulation or a
          diagnosis.
        </Text>
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
    borderColor: "#E6CEDB",
    backgroundColor: "#FFF9FC",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    flexWrap: "wrap",
  },
  heroEyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    marginTop: 2,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  statusBadge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  statusGood: {
    backgroundColor: "#EAF7F1",
  },
  statusWatch: {
    backgroundColor: "#FFF1E4",
  },
  statusLimited: {
    backgroundColor: "#F5EDF2",
  },
  statusText: {
    ...theme.typography.small,
    color: theme.colors.text,
  },
  calloutRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: "#FBEFF4",
    borderWidth: 1,
    borderColor: "#EFD8E3",
  },
  calloutText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  metricCard: {
    width: "48%",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E8D4DE",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FCECF3",
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  metricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  detailCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D3DD",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  bulletRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    marginTop: 7,
  },
  warningDot: {
    backgroundColor: theme.colors.warning,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  noteCard: {
    borderRadius: theme.radius.lg,
    backgroundColor: "#F7EDF3",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  noteTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  noteBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
