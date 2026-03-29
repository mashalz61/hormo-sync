import { router } from "expo-router";
import { useMemo, useState } from "react";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { calculateBmi } from "@/utils/health";

export default function BmiCalculationScreen() {
  const [weight, setWeight] = useState("68");
  const [height, setHeight] = useState("165");
  const bmi = useMemo(() => calculateBmi(Number(weight), Number(height)), [height, weight]);

  return (
    <Screen>
      <SectionTitle
        title="BMI calculation"
        subtitle="Use a simple weight-to-height ratio to understand your current BMI range."
      />
      <FormSection>
        <InfoCard title="Formula" description="BMI = weight (kg) / height (m)^2" />
        <InputField label="Weight (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
        <InputField label="Height (cm)" keyboardType="decimal-pad" value={height} onChangeText={setHeight} />
        <InfoCard title="Current BMI result" description={`${bmi || "--"} based on your inputs.`} />
      </FormSection>
      <CustomButton label="View BMI category" onPress={() => router.push("/assessments/bmi-result")} />
    </Screen>
  );
}
