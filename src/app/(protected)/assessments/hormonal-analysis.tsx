import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { ToggleRow } from "@/components/ToggleRow";
import { theme } from "@/theme";

const signalGroups = [
  {
    id: "androgen",
    title: "Androgen-related indicators",
    subtitle: "Common signs linked to androgen excess.",
    items: [
      {
        id: "acne_oily_skin",
        title: "Acne or oily skin",
        helperText: "Recurring breakouts or persistent oiliness.",
      },
      {
        id: "excess_hair_growth",
        title: "Excess hair growth",
        helperText: "Face, chest, or abdomen hair growth changes.",
      },
      {
        id: "hair_loss",
        title: "Hair loss or thinning",
        helperText: "Diffuse shedding or visible reduction in density.",
      },
    ],
  },
  {
    id: "metabolic",
    title: "Cycle and metabolic indicators",
    subtitle: "Signals that may overlap with insulin resistance patterns.",
    items: [
      {
        id: "irregular_cycles",
        title: "Irregular cycles",
        helperText: "Cycle length changes, skipped cycles, or frequent delays.",
      },
      {
        id: "weight_gain",
        title: "Weight gain",
        helperText: "Recent gain or difficulty with weight trend.",
      },
      {
        id: "high_bmi",
        title: "High BMI",
        helperText: "BMI category in overweight or obesity range.",
      },
      {
        id: "increased_waist",
        title: "Increased waist circumference",
        helperText: "Central adiposity trend over recent months.",
      },
    ],
  },
] as const;

const symptomTitles = signalGroups.reduce<Record<string, string>>((acc, group) => {
  group.items.forEach((item) => {
    acc[item.id] = item.title;
  });
  return acc;
}, {});

const totalSignals = Object.keys(symptomTitles).length;

export default function HormonalAnalysisScreen() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    acne_oily_skin: true,
    excess_hair_growth: false,
    hair_loss: false,
    irregular_cycles: true,
    weight_gain: true,
    high_bmi: false,
    increased_waist: false,
  });

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((key) => selected[key]),
    [selected],
  );

  const selectedCount = selectedIds.length;
  const signalPercent = Math.round((selectedCount / totalSignals) * 100);

  const score = useMemo(() => {
    if (selectedCount >= 5) {
      return {
        label: "Higher signal cluster",
        description:
          "Multiple pattern clusters are selected. A clinician-guided hormonal and metabolic workup may be helpful.",
        tone: "high" as const,
      };
    }

    if (selectedCount >= 3) {
      return {
        label: "Moderate signal cluster",
        description:
          "Several indicators are present. Consider targeted labs to clarify hormonal and metabolic context.",
        tone: "moderate" as const,
      };
    }

    return {
      label: "Lower signal cluster",
      description:
        "Fewer indicators are selected. Continue symptom tracking and discuss concerns if patterns persist.",
      tone: "low" as const,
    };
  }, [selectedCount]);

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Hormonal analysis check-in"
        subtitle="Review symptom clusters associated with hormone imbalance and decide whether deeper testing is worth discussing."
      />
      <ProgressStepper
        currentStep={1}
        totalSteps={2}
        label="Step 1 of 2 - Symptom signal mapping"
      />

      <InfoCard
        title="How to use this screen"
        description="This is a pattern-aware check, not a diagnosis. Toggle current symptoms to build a structured conversation before selecting potential follow-up labs."
      />

      <View style={styles.scoreCard}>
        <View style={styles.scoreTopRow}>
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreLabel}>Current signal score</Text>
            <Text style={styles.scoreValue}>
              {selectedCount}/{totalSignals} selected
            </Text>
          </View>
          <View
            style={[
              styles.tonePill,
              score.tone === "high"
                ? styles.tonePillHigh
                : score.tone === "moderate"
                  ? styles.tonePillModerate
                  : styles.tonePillLow,
            ]}
          >
            <Text
              style={[
                styles.tonePillLabel,
                score.tone === "high"
                  ? styles.tonePillLabelHigh
                  : score.tone === "moderate"
                    ? styles.tonePillLabelModerate
                    : styles.tonePillLabelLow,
              ]}
            >
              {score.label}
            </Text>
          </View>
        </View>

        <Text style={styles.scoreDescription}>{score.description}</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(signalPercent, 8)}%` }]} />
        </View>

        {selectedCount > 0 ? (
          <View style={styles.chipWrap}>
            {selectedIds.map((id) => (
              <View key={id} style={styles.chip}>
                <Text style={styles.chipText}>{symptomTitles[id]}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No indicators selected yet.</Text>
        )}
      </View>

      {signalGroups.map((group) => (
        <FormSection key={group.id}>
          <Text style={styles.sectionHeading}>{group.title}</Text>
          <Text style={styles.sectionSubheading}>{group.subtitle}</Text>
          <View style={styles.stack}>
            {group.items.map((item) => (
              <ToggleRow
                key={item.id}
                title={item.title}
                subtitle={item.helperText}
                value={Boolean(selected[item.id])}
                onValueChange={(value) =>
                  setSelected((previous) => ({
                    ...previous,
                    [item.id]: value,
                  }))
                }
              />
            ))}
          </View>
        </FormSection>
      ))}

      <FormSection>
        <Text style={styles.sectionHeading}>What happens next</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Review selected signals with a clinician for context.</Text>
          <Text style={styles.bullet}>• Use targeted labs to confirm or rule out hormone-related concerns.</Text>
          <Text style={styles.bullet}>• Track symptom trend over 8-12 weeks for better pattern clarity.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="See recommended tests"
          onPress={() => router.push("/assessments/recommended-tests")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  scoreCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.card,
  },
  scoreTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  scoreMeta: {
    flex: 1,
    minWidth: 180,
  },
  scoreLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  scoreValue: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  scoreDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  tonePill: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    maxWidth: "100%",
  },
  tonePillLow: {
    backgroundColor: "#E7F6F0",
    borderColor: "#B5E3D2",
  },
  tonePillModerate: {
    backgroundColor: "#FFF5DF",
    borderColor: "#F2DB9F",
  },
  tonePillHigh: {
    backgroundColor: "#FBE5E9",
    borderColor: "#EDBAC5",
  },
  tonePillLabel: {
    ...theme.typography.small,
    flexShrink: 1,
  },
  tonePillLabelLow: {
    color: theme.colors.success,
  },
  tonePillLabelModerate: {
    color: theme.colors.warning,
  },
  tonePillLabelHigh: {
    color: theme.colors.danger,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.surfaceAccent,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxWidth: "100%",
  },
  chipText: {
    ...theme.typography.small,
    color: theme.colors.text,
    flexShrink: 1,
  },
  emptyText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  sectionHeading: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sectionSubheading: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: -theme.spacing.sm,
  },
  stack: {
    gap: theme.spacing.xs,
  },
  bulletList: {
    gap: theme.spacing.sm,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
