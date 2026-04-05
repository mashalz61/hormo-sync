import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { DatePickerField } from "@/components/DatePickerField";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { useCycleTrackerStore } from "@/store/cycleTrackerStore";
import { theme } from "@/theme";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";

const reminders = [
  "Cycle length is measured from the first day of one period to the first day of the next.",
  "Phase and fertile-window cards are estimates from date tracking only, so they are less precise when cycles vary.",
];

export default function MenstrualCycleTrackerScreen() {
  const [showErrors, setShowErrors] = useState(false);
  const { draft, logs, updateDraft, saveDraft } = useCycleTrackerStore();
  const summary = buildCycleSummaryInsight(draft, logs);
  const hasErrors = Object.keys(summary.validationErrors).length > 0;

  const cycleHighlights = [
    {
      label: "Estimated phase",
      value: summary.estimatedPhase ?? "Waiting for dates",
      icon: "sparkles-outline" as const,
    },
    {
      label: "Latest cycle",
      value: summary.latestCompletedCycleLength
        ? `${summary.latestCompletedCycleLength} days`
        : "Need 2 starts",
      icon: "calendar-outline" as const,
    },
    {
      label: "This period",
      value: summary.periodLength ? `${summary.periodLength} days` : "Add end date",
      icon: "water-outline" as const,
    },
  ];

  const handleContinue = () => {
    setShowErrors(true);

    if (hasErrors) {
      return;
    }

    saveDraft();
    router.push("/tracker/cycle-summary");
  };

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Menstrual cycle tracker"
        subtitle="Track two recent periods, then let the app calculate cycle length, bleeding length, and an estimated phase from your dates."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color={theme.colors.primaryDark} name="heart-outline" size={14} />
            <Text style={styles.heroBadgeText}>Research-backed basics</Text>
          </View>
          <View style={styles.heroStatus}>
            <Text style={styles.heroStatusText}>{summary.regularityLabel}</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{summary.summaryHeadline}</Text>
          <Text style={styles.heroBody}>{summary.summaryBody}</Text>
        </View>

        <View style={styles.highlightRow}>
          {cycleHighlights.map((item) => (
            <View key={item.label} style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons color={theme.colors.primaryDark} name={item.icon} size={16} />
              </View>
              <Text style={styles.highlightValue}>{item.value}</Text>
              <Text style={styles.highlightLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <FormSection>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Cycle timeline</Text>
          <Text style={styles.sectionTitle}>Add the key dates the summary depends on</Text>
          <Text style={styles.sectionBody}>
            The most important dates are the first day of this period, the day bleeding ended, and
            the first day of the previous period.
          </Text>
        </View>

        <DatePickerField
          helperText="The first day bleeding started for your current period."
          label="Current period start date"
          onChange={(value) => updateDraft("currentPeriodStart", value)}
          value={draft.currentPeriodStart}
          errorText={showErrors ? summary.validationErrors.currentPeriodStart : undefined}
        />
        <DatePickerField
          helperText="The day your current period fully ended."
          label="Current period end date"
          minimumDate={draft.currentPeriodStart || undefined}
          onChange={(value) => updateDraft("currentPeriodEnd", value)}
          value={draft.currentPeriodEnd}
          errorText={showErrors ? summary.validationErrors.currentPeriodEnd : undefined}
        />
        <DatePickerField
          helperText="Use the first day of your last period for comparison."
          label="Previous cycle start date"
          maximumDate={draft.currentPeriodStart || undefined}
          onChange={(value) => updateDraft("previousPeriodStart", value)}
          value={draft.previousPeriodStart}
          errorText={showErrors ? summary.validationErrors.previousPeriodStart : undefined}
        />
      </FormSection>

      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Live summary preview</Text>
          <View
            style={[
              styles.previewTone,
              summary.summaryTone === "good"
                ? styles.previewToneGood
                : summary.summaryTone === "watch"
                  ? styles.previewToneWatch
                  : styles.previewToneLimited,
            ]}
          >
            <Text style={styles.previewToneText}>{summary.regularityLabel}</Text>
          </View>
        </View>

        <View style={styles.previewGrid}>
          <View style={styles.previewMetric}>
            <Text style={styles.previewMetricLabel}>Cycle day</Text>
            <Text style={styles.previewMetricValue}>{summary.currentCycleDay ?? "--"}</Text>
          </View>
          <View style={styles.previewMetric}>
            <Text style={styles.previewMetricLabel}>Average length</Text>
            <Text style={styles.previewMetricValue}>
              {summary.averageCycleLength ? `${summary.averageCycleLength}d` : "--"}
            </Text>
          </View>
          <View style={styles.previewMetric}>
            <Text style={styles.previewMetricLabel}>Variation</Text>
            <Text style={styles.previewMetricValue}>
              {summary.cycleVariation !== null ? `${summary.cycleVariation}d` : "--"}
            </Text>
          </View>
          <View style={styles.previewMetric}>
            <Text style={styles.previewMetricLabel}>Ovulation estimate</Text>
            <Text style={styles.previewMetricValue}>
              {summary.estimatedOvulationDay ? `Day ${summary.estimatedOvulationDay}` : "--"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>How the app interprets your dates</Text>
          <View style={styles.insightPill}>
            <Text style={styles.insightPillText}>Transparent rules</Text>
          </View>
        </View>

        <View style={styles.bulletList}>
          {[...summary.quickFacts.slice(0, 2), ...reminders].map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <CustomButton label="Save and view cycle summary" onPress={handleContinue} />
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
    borderColor: "#E8D0DC",
    backgroundColor: "#FFF9FB",
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
    backgroundColor: "#FBEAF1",
    borderWidth: 1,
    borderColor: "#EDD5E0",
  },
  heroBadgeText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.3,
  },
  heroStatus: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#EDD6E2",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
  },
  heroStatusText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  heroContent: {
    gap: theme.spacing.xs,
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  highlightRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  highlightCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#F0DDE6",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 4,
  },
  highlightIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEEF4",
    borderWidth: 1,
    borderColor: "#ECD3DE",
    marginBottom: 2,
  },
  highlightValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  highlightLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  sectionHeader: {
    gap: theme.spacing.xs,
  },
  sectionEyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
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
  previewCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E7CFDA",
    backgroundColor: "#FFFDFE",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  previewTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  previewTone: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  previewToneGood: {
    backgroundColor: "#EAF7F1",
  },
  previewToneWatch: {
    backgroundColor: "#FFF2E5",
  },
  previewToneLimited: {
    backgroundColor: "#F4EDF2",
  },
  previewToneText: {
    ...theme.typography.small,
    color: theme.colors.text,
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  previewMetric: {
    minWidth: "47%",
    flexGrow: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#EED8E2",
    backgroundColor: "#FFF7FA",
    padding: theme.spacing.md,
    gap: 2,
  },
  previewMetricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  previewMetricValue: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  insightCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D3DD",
    backgroundColor: "#FFFDFE",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  insightTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    flex: 1,
  },
  insightPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#FBEAF1",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
  },
  insightPillText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
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
    backgroundColor: theme.colors.secondary,
    marginTop: 7,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
