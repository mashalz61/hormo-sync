import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { SelectChips } from "@/components/SelectChips";

export default function SeedCycleTrackerScreen() {
  return (
    <Screen>
      <SectionTitle
        title="Seed cycle tracker"
        subtitle="Track seed cycling routines aligned with your current phase."
      />
      <FormSection>
        <SelectChips options={["Menstrual", "Follicular", "Ovulation", "Luteal"]} value="Follicular" />
      </FormSection>
      <CustomButton label="Detect cycle phase" onPress={() => router.push("/seed/cycle-phase-detection")} />
    </Screen>
  );
}
