import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { seedRecommendations } from "@/data/mockData";
import { CyclePhase } from "@/types";
import { theme } from "@/theme";

const phases: CyclePhase[] = ["Menstrual", "Follicular", "Ovulation", "Luteal"];

const phaseSupport: Record<
  CyclePhase,
  {
    focus: string;
    mealCue: string;
    evidenceLabel: string;
  }
> = {
  Menstrual: {
    focus: "Keep the routine gentle and easy to repeat.",
    mealCue: "Pair seeds with steady meals and iron-containing foods if bleeding is heavy.",
    evidenceLabel: "Food-first support matters more than rigid timing.",
  },
  Follicular: {
    focus: "Use this phase to rebuild consistency after your period.",
    mealCue: "Smoothies, oats, or yogurt bowls make the seeds easy to keep up with.",
    evidenceLabel: "Balanced meals are the strongest evidence-backed foundation.",
  },
  Ovulation: {
    focus: "Choose light, repeatable meals you can stick with even on busy days.",
    mealCue: "Add seeds to salads, grain bowls, or toast for a quick crunch.",
    evidenceLabel: "Phase-based routines are optional, not required for hormone health.",
  },
  Luteal: {
    focus: "Aim for more structure when cravings or low energy tend to show up.",
    mealCue: "Pair seeds with protein and fiber to support fuller snacks and steadier energy.",
    evidenceLabel: "Use the routine as a cue for consistency, not as a treatment on its own.",
  },
};

export default function SeedCycleTrackerScreen() {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>("Follicular");

  const currentPlan = useMemo(
    () => seedRecommendations.find((item) => item.phase === selectedPhase) ?? seedRecommendations[0],
    [selectedPhase],
  );

  const support = phaseSupport[selectedPhase];

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Seed cycle tracker"
        subtitle="Use phase-based seed reminders as a routine tool, while keeping expectations grounded in balanced eating and consistency."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color={theme.colors.primaryDark} name="leaf-outline" size={14} />
            <Text style={styles.heroBadgeText}>Routine Support</Text>
          </View>
          <View style={styles.evidencePill}>
            <Text style={styles.evidencePillText}>Evidence is still emerging</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Build a seed routine that matches your current phase</Text>
        <Text style={styles.heroBody}>
          Seed cycling can be a simple habit cue. The strongest support still comes from overall
          meal quality, not from perfect phase timing.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>seeds per phase</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1 tbsp</Text>
            <Text style={styles.statLabel}>each, daily</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Food-first</Text>
            <Text style={styles.statLabel}>keep it practical</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Choose your phase</Text>
        <Text style={styles.sectionTitle}>See the phase plan before you commit to the routine</Text>
        <Text style={styles.sectionBody}>
          Your selection changes the seed pairing, serving ideas, and the guidance shown below.
        </Text>
        <SelectChips
          options={phases}
          value={selectedPhase}
          onChange={(value) => setSelectedPhase(value as CyclePhase)}
        />
      </View>

      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planTitle}>{currentPlan.phase} plan</Text>
            <Text style={styles.planAmount}>{currentPlan.amount}</Text>
          </View>
          <View style={styles.planIconWrap}>
            <Ionicons color={theme.colors.primaryDark} name="flower-outline" size={18} />
          </View>
        </View>

        <View style={styles.seedRow}>
          {currentPlan.seeds.map((seed) => (
            <View key={seed} style={styles.seedChip}>
              <Text style={styles.seedChipText}>{seed}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calloutCard}>
          <Text style={styles.calloutLabel}>Why this phase view matters</Text>
          <Text style={styles.calloutText}>{support.focus}</Text>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{support.mealCue}</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{support.evidenceLabel}</Text>
          </View>
        </View>

        <View style={styles.ideaBlock}>
          <Text style={styles.ideaTitle}>Serving ideas</Text>
          <View style={styles.ideaList}>
            {currentPlan.ideas.map((idea) => (
              <View key={idea} style={styles.ideaRow}>
                <Ionicons color={theme.colors.primaryDark} name="checkmark-circle-outline" size={15} />
                <Text style={styles.ideaText}>{idea}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Evidence note</Text>
        <Text style={styles.noteText}>
          Inference from current evidence: seed cycling may be a low-cost adjunct for PMS or PCOS
          routines, but stronger data still support overall healthy eating and repeatable habits.
        </Text>
        <Text style={styles.noteText}>
          Safety cue: keep this food-based, and check with a clinician before using flaxseed or
          flax oil supplements if you are pregnant, breastfeeding, or taking medications.
        </Text>
      </View>

      <View style={styles.actions}>
        <CustomButton
          label="See phase plan"
          onPress={() =>
            router.push({
              pathname: "/seed/recommended-seeds",
              params: { phase: selectedPhase },
            })
          }
        />
        <CustomButton
          label="Detect cycle phase"
          variant="secondary"
          onPress={() => router.push("/seed/cycle-phase-detection")}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/seed/how-to-consume",
              params: { phase: selectedPhase },
            })
          }
          style={styles.textAction}
        >
          <Text style={styles.textActionLabel}>See easy meal ideas for this phase</Text>
          <Ionicons color={theme.colors.primaryDark} name="arrow-forward" size={14} />
        </Pressable>
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
    borderColor: "#E4D8C8",
    backgroundColor: "#FBFBF6",
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
    backgroundColor: "#EEF3E6",
    borderWidth: 1,
    borderColor: "#DDE5D0",
  },
  heroBadgeText: {
    ...theme.typography.small,
    color: "#5A7851",
  },
  evidencePill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#FFF4E8",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#EBD8BE",
  },
  evidencePillText: {
    ...theme.typography.small,
    color: "#89672F",
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#E5DED1",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 3,
  },
  statValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  sectionCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E5D8C9",
    backgroundColor: "#FFFDF9",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionEyebrow: {
    ...theme.typography.small,
    color: "#6A7D54",
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
  planCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#DDD8C8",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  planTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  planAmount: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  planIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4E8",
    borderWidth: 1,
    borderColor: "#DCE2CB",
  },
  seedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  seedChip: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#F4F7ED",
    borderWidth: 1,
    borderColor: "#DDE5D0",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  seedChipText: {
    ...theme.typography.caption,
    color: "#4F7147",
  },
  calloutCard: {
    borderRadius: theme.radius.md,
    backgroundColor: "#FAF5EC",
    borderWidth: 1,
    borderColor: "#E8DEC8",
    padding: theme.spacing.md,
    gap: 4,
  },
  calloutLabel: {
    ...theme.typography.small,
    color: "#8A6A34",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  calloutText: {
    ...theme.typography.body,
    color: theme.colors.text,
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
    backgroundColor: "#93AD73",
    marginTop: 7,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  ideaBlock: {
    gap: theme.spacing.sm,
  },
  ideaTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  ideaList: {
    gap: theme.spacing.sm,
  },
  ideaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  ideaText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  noteCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E9D8DE",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  noteTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  noteText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  actions: {
    gap: theme.spacing.md,
  },
  textAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    minHeight: 44,
  },
  textActionLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
  },
});
