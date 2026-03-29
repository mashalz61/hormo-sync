import { router } from "expo-router";

import { seedRecommendations } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function HowToConsumeScreen() {
  const current = seedRecommendations[1];

  return (
    <FeatureScaffoldScreen
      title="How to consume"
      subtitle="Easy ways to add seeds to everyday meals."
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
