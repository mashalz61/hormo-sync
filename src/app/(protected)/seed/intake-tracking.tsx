import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function IntakeTrackingScreen() {
  return (
    <FeatureScaffoldScreen
      title="Intake tracking"
      subtitle="Mark daily seed intake completion and build consistency over time."
      sections={[
        {
          title: "Today’s status",
          description: "Mock completion view for the current day.",
          bullets: ["Flaxseeds: Completed", "Pumpkin seeds: Completed", "Consistency streak: 4 days"],
        },
      ]}
      ctaLabel="Learn about benefits"
      onCtaPress={() => router.push("/seed/benefits-information")}
    />
  );
}
