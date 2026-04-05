import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { useCycleTrackerStore } from "@/store/cycleTrackerStore";
import { useSeedCycleStore } from "@/store/seedCycleStore";
import { theme } from "@/theme";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";
import { getDetectedSeedPhase } from "@/utils/seedCycle";

export default function CyclePhaseDetectionScreen() {
  const { draft, logs } = useCycleTrackerStore();
  const { setPhaseMode, setSelectedPhase } = useSeedCycleStore();
  const summary = buildCycleSummaryInsight(draft, logs);
  const detected = getDetectedSeedPhase(summary);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="Cycle phase detection"
        subtitle="This phase estimate comes from the period dates you entered, not from ovulation testing or hormone measurements."
      />

      <LinearGradient
        colors={["#F6F3E8", "#FBFAF6", "#F1F5EA"]}
        style={styles.heroCard}
      >
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.eyebrow}>Detected phase</Text>
            <Text style={styles.title}>{detected.phase ?? "Not enough cycle data"}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{detected.confidence}</Text>
          </View>
        </View>

        <Text style={styles.sourceLabel}>
          {detected.phase ? detected.sourceLabel : "Cycle tracker is missing a start date"}
        </Text>
        <Text style={styles.body}>{detected.detail}</Text>

        {detected.phase ? (
          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Cycle day</Text>
              <Text style={styles.metricValue}>{summary.currentCycleDay ?? "--"}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Variation</Text>
              <Text style={styles.metricValue}>
                {summary.cycleVariation !== null ? `${summary.cycleVariation}d` : "--"}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Ionicons color={theme.colors.primaryDark} name="information-circle-outline" size={18} />
          <Text style={styles.infoText}>
            Ovulation is especially hard to estimate from dates alone when cycles are irregular.
          </Text>
        </View>
      </LinearGradient>

      <CustomButton
        label={detected.phase ? "Use this phase in seed plan" : "Add cycle dates"}
        onPress={() => {
          if (!detected.phase) {
            router.push("/tracker/menstrual-cycle-tracker");
            return;
          }

          setSelectedPhase(detected.phase);
          setPhaseMode("cycle");
          router.push({
            pathname: "/seed/recommended-seeds",
            params: { phase: detected.phase },
          });
        }}
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
    borderColor: "#E6D7C6",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  eyebrow: {
    ...theme.typography.small,
    color: "#6A7A49",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
    marginTop: 2,
  },
  pill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#F3EEE3",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  pillText: {
    ...theme.typography.small,
    color: "#7A6742",
  },
  sourceLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
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
    borderColor: "#E5DACD",
    backgroundColor: theme.colors.white,
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
  infoRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,246,235,0.92)",
    borderWidth: 1,
    borderColor: "#EEDDC1",
    padding: theme.spacing.md,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
