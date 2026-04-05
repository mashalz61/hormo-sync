import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { useCycleTrackerStore } from "@/store/cycleTrackerStore";
import { useSeedCycleStore } from "@/store/seedCycleStore";
import { CyclePhase } from "@/types";
import { theme } from "@/theme";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";
import {
  getDetectedSeedPhase,
  getSeedEvidenceBullets,
  getSeedGuide,
  getSeedPlan,
} from "@/utils/seedCycle";

const phases: CyclePhase[] = ["Menstrual", "Follicular", "Ovulation", "Luteal"];

export default function SeedCycleTrackerScreen() {
  const { draft, logs } = useCycleTrackerStore();
  const { selectedPhase, phaseMode, setSelectedPhase, setPhaseMode } = useSeedCycleStore();
  const cycleSummary = buildCycleSummaryInsight(draft, logs);
  const detectedPhase = getDetectedSeedPhase(cycleSummary);
  const effectivePhase =
    phaseMode === "cycle" && detectedPhase.phase ? detectedPhase.phase : selectedPhase;
  const currentPlan = getSeedPlan(effectivePhase);
  const guide = getSeedGuide(effectivePhase);
  const evidenceBullets = getSeedEvidenceBullets();

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Seed cycle tracker"
        subtitle="Use seed cycling as an optional food routine, while keeping the nutrition benefits separate from stronger hormone claims."
      />

      <LinearGradient
        colors={["#F4F1E3", "#FAF8EF", "#EEF3E6"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.heroCard}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color="#5A7851" name="leaf-outline" size={14} />
            <Text style={styles.heroBadgeText}>Food routine</Text>
          </View>
          <View style={styles.evidencePill}>
            <Text style={styles.evidencePillText}>Direct evidence is limited</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Build a seed plan that is practical, not rigid</Text>
        <Text style={styles.heroBody}>
          Seeds can be a useful nutrition habit. The part that is best supported is adding
          nutrient-dense foods consistently, not perfectly matching seed changes to hormone shifts.
        </Text>

        <View style={styles.phaseSpotlight}>
          <View style={styles.phaseIconWrap}>
            <Ionicons color="#556E47" name="sparkles-outline" size={18} />
          </View>
          <View style={styles.phaseSpotlightCopy}>
            <Text style={styles.phaseSpotlightLabel}>Current plan focus</Text>
            <Text style={styles.phaseSpotlightValue}>{effectivePhase}</Text>
          </View>
          <View style={styles.phaseSourcePill}>
            <Text style={styles.phaseSourcePillText}>
              {phaseMode === "cycle" && detectedPhase.phase ? "Cycle-linked" : "Manual"}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>seeds in the current pairing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Common routine</Text>
            <Text style={styles.statLabel}>{currentPlan.amount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{effectivePhase}</Text>
            <Text style={styles.statLabel}>active phase view</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Choose your phase source</Text>
        <Text style={styles.sectionTitle}>Use your cycle estimate or pick manually</Text>
        <Text style={styles.sectionBody}>
          The app can use your date-based cycle estimate, or you can switch to a manual phase if
          you want a different plan.
        </Text>

        <View style={styles.modeRow}>
          <View style={[styles.modeCard, phaseMode === "cycle" && styles.modeCardActive]}>
            <Text style={styles.modeTitle}>From cycle tracker</Text>
            <Text style={styles.modeBody}>
              {detectedPhase.phase
                ? `${detectedPhase.phase} • ${detectedPhase.sourceLabel}`
                : "No detected phase yet"}
            </Text>
            <Text style={styles.modeMeta}>
              {detectedPhase.phase
                ? detectedPhase.detail
                : "Add cycle dates to let the app estimate the most likely phase from timing."}
            </Text>
            <CustomButton
              label={detectedPhase.phase ? "Use detected phase" : "Add cycle dates first"}
              variant={phaseMode === "cycle" ? "primary" : "secondary"}
              onPress={() =>
                detectedPhase.phase
                  ? setPhaseMode("cycle")
                  : router.push("/tracker/menstrual-cycle-tracker")
              }
            />
          </View>

          <View style={[styles.modeCard, phaseMode === "manual" && styles.modeCardActive]}>
            <Text style={styles.modeTitle}>Manual choice</Text>
            <Text style={styles.modeBody}>
              Use this if your dates are incomplete or you want to browse another phase plan.
            </Text>
            <CustomButton
              label="Switch to manual"
              variant={phaseMode === "manual" ? "primary" : "secondary"}
              onPress={() => setPhaseMode("manual")}
            />
          </View>
        </View>

        <SelectChips
          options={phases}
          value={selectedPhase}
          onChange={(value) => {
            setSelectedPhase(value as CyclePhase);
            setPhaseMode("manual");
          }}
        />
      </View>

      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planTitle}>{effectivePhase} seed plan</Text>
            <Text style={styles.planAmount}>{currentPlan.amount}</Text>
          </View>
          <View style={styles.planIconWrap}>
            <Ionicons color={theme.colors.primaryDark} name="flower-outline" size={18} />
          </View>
        </View>

        <View style={styles.seedRow}>
          {currentPlan.seeds.map((seed) => (
            <View key={seed} style={styles.seedChip}>
              <View style={styles.seedChipDot} />
              <Text style={styles.seedChipText}>{seed}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calloutCard}>
          <Text style={styles.calloutLabel}>How to think about this phase</Text>
          <Text style={styles.calloutText}>{guide.phaseFocus}</Text>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{guide.nutrientSupport}</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{guide.commonRationale}</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{guide.practicalNote}</Text>
          </View>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Evidence reality check</Text>
        {evidenceBullets.map((item) => (
          <View key={item} style={styles.noteRow}>
            <Ionicons color={theme.colors.primaryDark} name="checkmark-circle-outline" size={15} />
            <Text style={styles.noteText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <CustomButton
          label="See seed plan details"
          onPress={() =>
            router.push({
              pathname: "/seed/recommended-seeds",
              params: { phase: effectivePhase },
            })
          }
        />
        <CustomButton
          label="Review phase estimate"
          variant="secondary"
          onPress={() => router.push("/seed/cycle-phase-detection")}
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E4D8C8",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroGlow: {
    position: "absolute",
    top: -42,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.45)",
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
  phaseSpotlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderWidth: 1,
    borderColor: "#E5DDCD",
    padding: theme.spacing.md,
  },
  phaseIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4E8",
    borderWidth: 1,
    borderColor: "#D8E2CB",
  },
  phaseSpotlightCopy: {
    flex: 1,
    gap: 2,
  },
  phaseSpotlightLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phaseSpotlightValue: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  phaseSourcePill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#F4EAD8",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  phaseSourcePillText: {
    ...theme.typography.small,
    color: "#7B6640",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statCard: {
    minWidth: "30%",
    flexGrow: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#E3DACB",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 4,
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
    borderColor: "#E7DCCF",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  sectionEyebrow: {
    ...theme.typography.small,
    color: "#6A7A49",
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
  modeRow: {
    gap: theme.spacing.sm,
  },
  modeCard: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#E7DDCF",
    backgroundColor: "#FFFDF9",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modeCardActive: {
    borderColor: "#C8D5B4",
    backgroundColor: "#F8FAF3",
  },
  modeTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  modeBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  modeMeta: {
    ...theme.typography.small,
    color: theme.colors.textSoft,
  },
  planCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E6D9C9",
    backgroundColor: "#FDFCF8",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  planAmount: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  planIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5EEDF",
    borderWidth: 1,
    borderColor: "#E9DFC7",
  },
  seedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  seedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: "#EEF3E6",
    borderWidth: 1,
    borderColor: "#D9E3CB",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  seedChipDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#90AE63",
  },
  seedChipText: {
    ...theme.typography.caption,
    color: "#5A7851",
  },
  calloutCard: {
    borderRadius: theme.radius.md,
    backgroundColor: "#FFF7EC",
    borderWidth: 1,
    borderColor: "#ECDCC0",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  calloutLabel: {
    ...theme.typography.small,
    color: "#89672F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    borderRadius: 999,
    backgroundColor: "#B5C493",
    marginTop: 7,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  noteCard: {
    borderRadius: theme.radius.lg,
    backgroundColor: "#F5F3ED",
    borderWidth: 1,
    borderColor: "#E5DFD4",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  noteTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  noteRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  noteText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
