import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { DatePickerField } from "@/components/DatePickerField";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";

export default function MenstrualCycleTrackerScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Menstrual cycle tracker"
        subtitle="Log your current and previous cycles to support clearer pattern review."
      />
      <FormSection>
        <DatePickerField label="Current period start date" value="2026-03-02" />
        <DatePickerField label="Current period end date" value="2026-03-06" />
        <DatePickerField label="Previous cycle start date" value="2026-02-01" />
      </FormSection>
      <CustomButton label="View cycle summary" onPress={() => router.push("/tracker/cycle-summary")} />
    </Screen>
  );
}
