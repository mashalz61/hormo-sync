import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { SelectChips } from "@/components/SelectChips";
import { theme } from "@/theme";
import { calculateBmi } from "@/utils/health";

export default function BasicHealthScreen() {
  const [weight, setWeight] = useState("68");
  const [height, setHeight] = useState("165");
  const bmi = useMemo(() => calculateBmi(Number(weight), Number(height)), [height, weight]);

  return (
    <Screen>
      <SectionTitle
        title="Basic health and menstrual information"
        subtitle="Start with a few supportive baseline details for your assessment."
      />
      <ProgressStepper currentStep={1} totalSteps={4} />
      <FormSection>
        <InputField label="Age" keyboardType="number-pad" value="28" />
        <InputField
          label="Weight (kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />
        <InputField
          label="Height (cm)"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
        />
        <InfoCard
          title="BMI preview"
          description={`Your BMI is ${bmi || "--"}. This updates automatically as height and weight change.`}
        />
        <InputField label="Average cycle length (days)" keyboardType="number-pad" value="31" />
        <SelectChips options={["Regular", "Irregular"]} value="Irregular" />
        <SelectChips options={["No missed periods", "Occasional delays", "Frequent delays"]} value="Occasional delays" />
      </FormSection>
      <Text style={styles.todo}>
        TODO: Persist this form to local store or API once backend endpoints are available.
      </Text>
      <CustomButton
        label="Continue to symptoms"
        onPress={() => router.push("/assessments/symptoms-metabolic")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  todo: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
});
