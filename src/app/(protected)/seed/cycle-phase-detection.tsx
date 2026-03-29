import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function CyclePhaseDetectionScreen() {
  return (
    <FeatureScaffoldScreen
      title="Cycle phase detection"
      subtitle="Identify your likely current phase for more aligned reminders and seed suggestions."
      sections={[
        {
          title: "Detected phase",
          description: "Mock logic currently places you in the follicular phase.",
          bullets: ["Menstrual", "Follicular", "Ovulation", "Luteal"],
        },
      ]}
      ctaLabel="See recommended seeds"
      onCtaPress={() => router.push("/seed/recommended-seeds")}
    />
  );
}
