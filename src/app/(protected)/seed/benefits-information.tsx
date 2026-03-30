import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function BenefitsInformationScreen() {
  return (
    <FeatureScaffoldScreen
      title="Benefits information"
      subtitle="Learn how seed cycling is commonly used as a supportive wellness practice."
      fallbackRoute="/seed/seed-cycle-tracker"
      sections={[
        {
          title: "Potential benefits",
          description: "Supportive education for the current prototype.",
          bullets: [
            "Hormonal balance support",
            "Menstrual cycle support",
            "PCOS symptom support",
            "Reproductive wellness support",
          ],
        },
      ]}
      ctaLabel="Back to tracker"
      onCtaPress={() => router.push("/tracker")}
    />
  );
}
