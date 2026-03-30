import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentHeroCard } from "@/components/AssessmentHeroCard";
import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { ToggleRow } from "@/components/ToggleRow";
import { symptomOptions } from "@/data/mockData";
import { theme } from "@/theme";

export default function SymptomCheckerScreen() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    acne: true,
    hair_growth: false,
    weight_gain: true,
    hair_thinning: false,
    dark_patches: true,
    fatigue: true,
    cravings: false,
  });

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader title="Symptom Checker" />

      <AssessmentHeroCard
        description="Track recurring signs and generate a clean symptom summary for your next review."
        eyebrow="Quick Screening"
        icon="medkit-outline"
        title="Symptom Checker"
      />

      <InfoCard
        title="How to use this"
        description="Turn on symptoms you notice frequently. This tool supports pattern tracking and does not replace diagnosis."
      />

      <FormSection>
        <Text style={styles.sectionTitle}>Androgen Pattern Clues</Text>
        <View style={styles.stack}>
          {symptomOptions
            .filter((item) => ["acne", "hair_growth", "hair_thinning"].includes(item.id))
            .map((item) => (
              <ToggleRow
                key={item.id}
                title={item.label}
                subtitle={item.helperText}
                value={Boolean(selected[item.id])}
                onValueChange={(value) =>
                  setSelected((prev) => ({
                    ...prev,
                    [item.id]: value,
                  }))
                }
              />
            ))}
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Metabolic Pattern Clues</Text>
        <View style={styles.stack}>
          {symptomOptions
            .filter((item) => ["weight_gain", "dark_patches", "fatigue", "cravings"].includes(item.id))
            .map((item) => (
              <ToggleRow
                key={item.id}
                title={item.label}
                subtitle={item.helperText}
                value={Boolean(selected[item.id])}
                onValueChange={(value) =>
                  setSelected((prev) => ({
                    ...prev,
                    [item.id]: value,
                  }))
                }
              />
            ))}
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryPillLabel}>Selected symptoms</Text>
          <Text style={styles.summaryPillValue}>{selectedCount}</Text>
        </View>
        <Text style={styles.summaryCopy}>
          {selectedCount >= 4
            ? "Your current selection suggests a stronger symptom cluster. A full step-by-step PCOS and metabolic assessment is recommended next."
            : "Your current selection suggests a lighter symptom cluster. Continue tracking weekly, and use the full assessment if symptoms increase."}
        </Text>
      </FormSection>

      <View style={styles.ctaStack}>
        <CustomButton
          label="Start 4-Step PCOS Assessment"
          onPress={() => router.push("/assessments/basic-health")}
        />
        <CustomButton
          label="Open Hormonal Analysis"
          onPress={() => router.push("/assessments/hormonal-analysis")}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.xs,
  },
  summaryPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#FFF8FB",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  summaryPillLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  summaryPillValue: {
    ...theme.typography.title2,
    color: theme.colors.primaryDark,
  },
  summaryCopy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  ctaStack: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
});
