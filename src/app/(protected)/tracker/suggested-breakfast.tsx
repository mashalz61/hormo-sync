import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function SuggestedBreakfastScreen() {
  return (
    <FeatureScaffoldScreen
      title="Suggested breakfast"
      subtitle="Simple breakfast ideas designed for steadier energy and fuller mornings."
      sections={[
        {
          title: "Breakfast recommendations",
          description: "These ideas are supportive and non-prescriptive for the current prototype.",
          bullets: [
            "Greek yogurt with berries and pumpkin seeds",
            "Eggs with avocado toast and leafy greens",
            "Protein oats with flaxseeds and cinnamon",
          ],
        },
      ]}
      ctaLabel="Enter your meal"
      onCtaPress={() => router.push("/tracker/enter-your-meal")}
    />
  );
}
