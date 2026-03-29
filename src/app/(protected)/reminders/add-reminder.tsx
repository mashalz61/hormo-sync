import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { SelectChips } from "@/components/SelectChips";

export default function AddReminderScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Add reminder"
        subtitle="Create a reminder for daily wellness support."
      />
      <FormSection>
        <InputField label="Activity" value="Morning hydration" />
        <InputField label="Time" value="09:00 AM" />
        <SelectChips options={["Daily", "Weekdays", "Custom"]} value="Daily" />
      </FormSection>
      <CustomButton label="Save reminder" onPress={() => router.push("/reminders/reminder-details")} />
    </Screen>
  );
}
