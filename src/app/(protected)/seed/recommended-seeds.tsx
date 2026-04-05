import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { CyclePhase } from "@/types";
import { theme } from "@/theme";
import { getSeedGuide, getSeedPlan } from "@/utils/seedCycle";

export default function RecommendedSeedsScreen() {
  const { phase } = useLocalSearchParams<{ phase?: string }>();
  const resolvedPhase = (phase as CyclePhase) ?? "Follicular";
  const plan = getSeedPlan(resolvedPhase);
  const guide = getSeedGuide(resolvedPhase);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="Recommended seeds"
        subtitle="This screen shows the common seed-cycling pairing for the selected phase and explains what the routine can and cannot promise."
      />

      <LinearGradient colors={["#EEF3E6", "#F8F7F1", "#FFF8ED"]} style={styles.heroCard}>
        <Text style={styles.phaseLabel}>{plan.phase} phase</Text>
        <Text style={styles.heroTitle}>{plan.seeds.join(" + ")}</Text>
        <Text style={styles.heroBody}>{plan.amount}</Text>
        <View style={styles.seedCapsules}>
          {plan.seeds.map((seed) => (
            <View key={seed} style={styles.seedCapsule}>
              <Text style={styles.seedCapsuleText}>{seed}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Why people use this pairing</Text>
        <Text style={styles.body}>{guide.commonRationale}</Text>
        <View style={styles.infoRow}>
          <Ionicons color={theme.colors.primaryDark} name="nutrition-outline" size={18} />
          <Text style={styles.infoText}>{guide.nutrientSupport}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What the evidence supports</Text>
        <View style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{guide.evidenceSummary}</Text>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>
            It is more accurate to describe this as a structured food habit than as a validated
            hormone-balancing protocol.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Safety notes</Text>
        {guide.safetyNotes.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={[styles.bulletDot, styles.warningDot]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <CustomButton
          label="See easy ways to eat these"
          onPress={() =>
            router.push({
              pathname: "/seed/how-to-consume",
              params: { phase: resolvedPhase },
            })
          }
        />
        <CustomButton
          label="Set reminder preference"
          variant="secondary"
          onPress={() => router.push("/seed/intake-reminder")}
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
    borderColor: "#E2D8C8",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  phaseLabel: {
    ...theme.typography.small,
    color: "#6A7A49",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  seedCapsules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  seedCapsule: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderWidth: 1,
    borderColor: "#E5DDCF",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  seedCapsuleText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E6DBCE",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  infoRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
    borderRadius: theme.radius.md,
    backgroundColor: "#FBF7EE",
    borderWidth: 1,
    borderColor: "#EDE2CF",
    padding: theme.spacing.md,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
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
    backgroundColor: "#B5C493",
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
  actions: {
    gap: theme.spacing.md,
  },
});
