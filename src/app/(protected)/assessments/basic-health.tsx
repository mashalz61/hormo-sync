import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";
import { calculateBmi } from "@/utils/health";

export default function BasicHealthScreen() {
  const assessmentDraft = useAppStore((state) => state.pcosAssessmentDraft);
  const updateAssessmentDraft = useAppStore((state) => state.updatePcosAssessmentDraft);
  const [age, setAge] = useState(assessmentDraft.age);
  const [weight, setWeight] = useState(assessmentDraft.weight);
  const [height, setHeight] = useState("165");
  const [cycleLength, setCycleLength] = useState("31");
  const [cyclePattern, setCyclePattern] = useState<"Regular" | "Irregular">(assessmentDraft.cyclePattern);
  const [missedPeriods, setMissedPeriods] = useState("Occasional delays");

  const bmi = useMemo(() => calculateBmi(parseNumber(weight), parseNumber(height)), [height, weight]);

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 1: Baseline Health and Cycle Pattern"
        subtitle="Capture cycle timing and body metrics that can indicate ovulatory dysfunction and metabolic risk."
      />
      <ProgressStepper
        currentStep={1}
        totalSteps={4}
        label="Step 1 of 4 - Baseline profile"
      />

      <FormSection>
        <InputField label="Age (years)" keyboardType="number-pad" value={age} onChangeText={setAge} />
        <InputField
          label="Weight (kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          helperText="Used with height to estimate BMI context."
        />
        <InputField
          label="Height (cm)"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
        />
        <InputField
          label="Average cycle length (days)"
          keyboardType="number-pad"
          value={cycleLength}
          onChangeText={setCycleLength}
          helperText="Adult cycles <21 or >35 days can suggest ovulatory dysfunction."
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Cycle pattern</Text>
          <SelectChips
            options={["Regular", "Irregular"]}
            value={cyclePattern}
            onChange={(value) => setCyclePattern(value as "Regular" | "Irregular")}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Missed periods</Text>
          <SelectChips
            options={["No missed periods", "Occasional delays", "Frequent delays"]}
            value={missedPeriods}
            onChange={setMissedPeriods}
          />
        </View>

        <InfoCard
          title="BMI preview"
          description={`Current BMI: ${bmi || "--"}. BMI is supportive context and not enough on its own for PCOS diagnosis.`}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Why this step matters</Text>
        <Text style={styles.copy}>
          International PCOS guidance uses combined features, not one test alone. In adults, diagnosis is generally based on two of three findings: ovulatory dysfunction, hyperandrogenism, and ovarian/AMH evidence.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Irregular cycles can be an early ovulation signal.</Text>
          <Text style={styles.bullet}>• BMI and weight trend help interpret insulin-related risk.</Text>
          <Text style={styles.bullet}>• Final diagnosis requires clinician review and exclusion of other causes.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="Continue to Step 2"
          onPress={() => {
            updateAssessmentDraft({
              age,
              weight,
              cyclePattern,
            });
            router.push("/assessments/symptoms-metabolic");
          }}
        />
      </View>
    </Screen>
  );
}

const parseNumber = (value: string) => Number(value.replace(",", "."));

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  cardTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
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
