import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";

export default function LabResultsInputScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Lab results input"
        subtitle="Enter placeholder values for blood sugar, insulin, and hormone markers."
      />
      <FormSection>
        <InputField label="Blood sugar" keyboardType="decimal-pad" value="96" />
        <InputField label="Insulin" keyboardType="decimal-pad" value="15" />
        <InputField label="LH" keyboardType="decimal-pad" value="8.2" />
        <InputField label="FSH" keyboardType="decimal-pad" value="5.1" />
      </FormSection>
      <CustomButton label="View final recommendations" onPress={() => router.push("/assessments/final-recommendations")} />
    </Screen>
  );
}
