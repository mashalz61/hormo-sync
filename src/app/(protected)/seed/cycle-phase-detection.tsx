import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function CyclePhaseDetectionScreen() {
  return (
    <FeatureScaffoldScreen
      title="Cycle phase detection"
      subtitle="Identify your likely current phase for more aligned reminders and seed suggestions."
      fallbackRoute="/seed/seed-cycle-tracker"
      sections={[
        {
          title: "Detected phase",
          description: "Mock logic currently places you in the follicular phase.",
          bullets: ["Menstrual", "Follicular", "Ovulation", "Luteal"],
        },
      ]}
      ctaLabel="See recommended seeds"
      onCtaPress={() =>
        router.push({
          pathname: "/seed/recommended-seeds",
          params: { phase: "Follicular" },
        })
      }
    />
  );
}
