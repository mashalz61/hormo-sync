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
import { symptomOptions } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function SymptomsMetabolicScreen() {
  const weightGain = useAppStore((state) => state.pcosAssessmentDraft.weightGain);
  const updateAssessmentDraft = useAppStore((state) => state.updatePcosAssessmentDraft);
  const [selected, setSelected] = useState<Record<string, boolean>>({
    acne: true,
    hair_growth: false,
    weight_gain: weightGain,
    hair_thinning: false,
    dark_patches: true,
    fatigue: true,
    cravings: true,
    sleep_apnea: false,
  });

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 2: Symptoms and Metabolic Clues"
        subtitle="Track signals linked to androgen excess and insulin resistance to improve pattern recognition."
      />
      <ProgressStepper
        currentStep={2}
        totalSteps={4}
        label="Step 2 of 4 - Symptom clustering"
      />

      <InfoCard
        title="Clinical context"
        description="Symptoms help identify patterns, but diagnosis still requires labs and clinician evaluation. Dark velvety skin patches (acanthosis nigricans) can be associated with insulin resistance."
      />

      <FormSection>
        <Text style={styles.sectionHeading}>Androgen-related clues</Text>
        <View style={styles.stack}>
          {symptomOptions
            .filter((item) => ["acne", "hair_growth", "hair_thinning"].includes(item.id))
            .map((option) => (
              <ToggleRow
                key={option.id}
                title={option.label}
                subtitle={option.helperText}
                value={Boolean(selected[option.id])}
                onValueChange={(value) => {
                  setSelected((prev) => ({
                    ...prev,
                    [option.id]: value,
                  }));

                  if (option.id === "weight_gain") {
                    updateAssessmentDraft({ weightGain: value });
                  }
                }}
              />
            ))}
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionHeading}>Insulin-resistance clues</Text>
        <View style={styles.stack}>
          {symptomOptions
            .filter((item) => ["weight_gain", "dark_patches", "fatigue", "cravings"].includes(item.id))
            .map((option) => (
              <ToggleRow
                key={option.id}
                title={option.label}
                subtitle={option.helperText}
                value={Boolean(selected[option.id])}
                onValueChange={(value) =>
                  setSelected((prev) => ({
                    ...prev,
                    [option.id]: value,
                  }))
                }
              />
            ))}
          <ToggleRow
            title="Possible sleep apnea pattern"
            subtitle="Snoring plus daytime sleepiness/fatigue may need follow-up."
            value={Boolean(selected.sleep_apnea)}
            onValueChange={(value) =>
              setSelected((prev) => ({
                ...prev,
                sleep_apnea: value,
              }))
            }
          />
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Step 2 summary</Text>
        <Text style={styles.copy}>
          {selectedCount} symptom indicators selected. Higher clustering can justify deeper lab assessment, especially when cycle irregularity is also present.
        </Text>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="Continue to Step 3"
          onPress={() => {
            updateAssessmentDraft({ weightGain: Boolean(selected.weight_gain) });
            router.push("/assessments/lab-results-input");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  sectionHeading: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.xs,
  },
  cardTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
