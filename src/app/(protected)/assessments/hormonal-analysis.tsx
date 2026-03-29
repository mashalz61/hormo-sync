import { router } from "expo-router";
import { View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { ToggleRow } from "@/components/ToggleRow";

export default function HormonalAnalysisScreen() {
  const items = [
    "Weight gain",
    "Excess hair growth",
    "Hair loss",
    "Acne or oily skin",
    "Irregular cycles",
    "High BMI",
    "Increased waist circumference",
  ];

  return (
    <Screen>
      <SectionTitle
        title="Hormonal analysis"
        subtitle="Use symptom patterns to decide whether deeper hormone-related testing may be helpful."
      />
      <FormSection>
        <View style={{ gap: 12 }}>
          {items.map((item, index) => (
            <ToggleRow
              key={item}
              title={item}
              subtitle="Mock toggle for current prototype"
              value={index < 4}
            />
          ))}
        </View>
      </FormSection>
      <CustomButton label="See recommended tests" onPress={() => router.push("/assessments/recommended-tests")} />
    </Screen>
  );
}
