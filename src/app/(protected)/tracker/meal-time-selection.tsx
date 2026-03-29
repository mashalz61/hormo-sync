import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { SelectChips } from "@/components/SelectChips";

export default function MealTimeSelectionScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Meal time selection"
        subtitle="Choose a meal to get supportive suggestions or add your intake."
      />
      <FormSection>
        <SelectChips options={["Breakfast", "Lunch", "Dinner", "Snacks"]} value="Breakfast" />
      </FormSection>
      <CustomButton label="See breakfast ideas" onPress={() => router.push("/tracker/suggested-breakfast")} />
    </Screen>
  );
}
