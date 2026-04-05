import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { CyclePhase } from "@/types";
import { theme } from "@/theme";
import { getSeedGuide, getSeedPlan } from "@/utils/seedCycle";

const corePrepNotes = [
  "Ground flax is often easier to digest and mix into foods than whole flaxseed.",
  "Start smaller if seeds upset your stomach, then work up gradually with water.",
  "Use meals you already eat instead of adding complicated prep steps.",
];

export default function HowToConsumeScreen() {
  const { phase } = useLocalSearchParams<{ phase?: string }>();
  const resolvedPhase = (phase as CyclePhase) ?? "Follicular";
  const plan = getSeedPlan(resolvedPhase);
  const guide = getSeedGuide(resolvedPhase);

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="How to consume"
        subtitle="The easiest seed routine is the one that fits into meals you already repeat."
      />

      <LinearGradient colors={["#F0F3E8", "#F8F8F2", "#FFF6EA"]} style={styles.heroCard}>
        <Text style={styles.title}>{resolvedPhase} meal ideas</Text>
        <Text style={styles.body}>{guide.practicalNote}</Text>
        <View style={styles.inlinePlan}>
          {plan.seeds.map((seed) => (
            <View key={seed} style={styles.inlinePlanChip}>
              <Text style={styles.inlinePlanChipText}>{seed}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Simple serving ideas</Text>
        {plan.ideas.map((idea) => (
          <View key={idea} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>{idea}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preparation notes</Text>
        {corePrepNotes.map((idea) => (
          <View key={idea} style={styles.row}>
            <View style={[styles.dot, styles.greenDot]} />
            <Text style={styles.text}>{idea}</Text>
          </View>
        ))}
      </View>

      <CustomButton label="Track today's intake" onPress={() => router.push("/seed/intake-tracking")} />
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
    borderColor: "#E2D9CC",
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
  inlinePlan: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  inlinePlanChip: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: "#E5DDCE",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inlinePlanChipText: {
    ...theme.typography.caption,
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
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    marginTop: 7,
  },
  greenDot: {
    backgroundColor: "#99B56C",
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
