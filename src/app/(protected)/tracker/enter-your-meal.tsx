import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";

export default function EnterYourMealScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Enter your meal"
        subtitle="Log your meal manually for a simple nutrition summary."
      />
      <FormSection>
        <InputField label="Meal title" value="Greek yogurt bowl" />
        <InputField label="Ingredients or notes" value="Berries, seeds, cinnamon" multiline />
      </FormSection>
      <CustomButton label="View daily food summary" onPress={() => router.push("/tracker/daily-food-summary")} />
    </Screen>
  );
}
