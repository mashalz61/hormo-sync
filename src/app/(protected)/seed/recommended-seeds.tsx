import { router, useLocalSearchParams } from "expo-router";

import { seedRecommendations } from "@/data/mockData";
import { CyclePhase } from "@/types";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function RecommendedSeedsScreen() {
  const { phase } = useLocalSearchParams<{ phase?: string }>();
  const resolvedPhase = (phase as CyclePhase) ?? "Follicular";
  const current =
    seedRecommendations.find((item) => item.phase === resolvedPhase) ?? seedRecommendations[1];

  return (
    <FeatureScaffoldScreen
      title="Recommended seeds"
      subtitle="Suggestions based on the phase you selected."
      fallbackRoute="/seed/seed-cycle-tracker"
      sections={[
        {
          title: current.phase,
          description: `Suggested amount: ${current.amount}`,
          bullets: current.seeds,
        },
      ]}
      ctaLabel="Set seed intake reminder"
      onCtaPress={() => router.push("/seed/intake-reminder")}
    />
  );
}
