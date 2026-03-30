import { router, useLocalSearchParams } from "expo-router";

import { seedRecommendations } from "@/data/mockData";
import { CyclePhase } from "@/types";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function HowToConsumeScreen() {
  const { phase } = useLocalSearchParams<{ phase?: string }>();
  const resolvedPhase = (phase as CyclePhase) ?? "Follicular";
  const current =
    seedRecommendations.find((item) => item.phase === resolvedPhase) ?? seedRecommendations[1];

  return (
    <FeatureScaffoldScreen
      title="How to consume"
      subtitle="Easy ways to add the selected phase seeds to everyday meals."
      fallbackRoute="/seed/seed-cycle-tracker"
      sections={[
        {
          title: "Serving ideas",
          description: `Recommended quantity: ${current.amount}`,
          bullets: current.ideas,
        },
      ]}
      ctaLabel="Track intake"
      onCtaPress={() => router.push("/seed/intake-tracking")}
    />
  );
}
