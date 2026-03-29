import { router } from "expo-router";

import { seedRecommendations } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function RecommendedSeedsScreen() {
  const current = seedRecommendations[1];

  return (
    <FeatureScaffoldScreen
      title="Recommended seeds"
      subtitle="Suggestions based on your current cycle phase."
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
