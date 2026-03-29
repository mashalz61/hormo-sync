import { router } from "expo-router";
import { View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ResultCard } from "@/components/ResultCard";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { ToggleRow } from "@/components/ToggleRow";
import { assessmentResults, symptomOptions } from "@/data/mockData";

export default function SymptomsMetabolicScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Symptoms and metabolic indicators"
        subtitle="Capture the symptoms and signals that can support a more complete picture."
      />
      <ProgressStepper currentStep={2} totalSteps={4} />
      <FormSection>
        <View style={{ gap: 12 }}>
          {symptomOptions.map((option) => (
            <ToggleRow
              key={option.id}
              title={option.label}
              subtitle={option.helperText}
              value={["acne", "weight_gain", "fatigue"].includes(option.id)}
            />
          ))}
          <ToggleRow title="Blood sugar trending higher" subtitle="Mock metabolic input" value />
        </View>
      </FormSection>
      <ResultCard result={assessmentResults[0]} />
      <CustomButton
        label="Continue to final assessment"
        onPress={() => router.push("/assessments/final-assessment")}
      />
    </Screen>
  );
}
