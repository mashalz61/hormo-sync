import { router, useLocalSearchParams } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function SuggestedBreakfastScreen() {
  const { mealType } = useLocalSearchParams<{ mealType?: string }>();
  const selectedMeal = mealType ?? "Breakfast";
  const content = getMealSuggestions(selectedMeal);

  return (
    <FeatureScaffoldScreen
      title={content.title}
      subtitle={content.subtitle}
      fallbackRoute="/tracker"
      sections={[
        {
          title: content.sectionTitle,
          description: "These ideas are supportive and non-prescriptive for the current prototype.",
          bullets: content.bullets,
        },
      ]}
      ctaLabel="Enter your meal"
      onCtaPress={() =>
        router.push({
          pathname: "/tracker/enter-your-meal",
          params: { mealType: selectedMeal },
        })
      }
    />
  );
}

const getMealSuggestions = (mealType: string) => {
  switch (mealType) {
    case "Lunch":
      return {
        title: "Suggested lunch ideas",
        subtitle: "Simple lunch ideas built around protein, color, and staying power.",
        sectionTitle: "Lunch recommendations",
        bullets: [
          "Grilled chicken quinoa salad with olive oil dressing",
          "Tofu rice bowl with vegetables and sesame seeds",
          "Lentil wrap with yogurt sauce and cucumber",
        ],
      };
    case "Dinner":
      return {
        title: "Suggested dinner ideas",
        subtitle: "Balanced dinner ideas designed to feel satisfying without being too heavy.",
        sectionTitle: "Dinner recommendations",
        bullets: [
          "Salmon with roasted vegetables and rice",
          "Bean chili with avocado and a side salad",
          "Chicken, sweet potato, and sauteed greens",
        ],
      };
    case "Snacks":
      return {
        title: "Suggested snack ideas",
        subtitle: "Snack ideas that pair food groups for steadier energy.",
        sectionTitle: "Snack recommendations",
        bullets: [
          "Apple slices with peanut butter",
          "Greek yogurt with berries and seeds",
          "Hummus with carrots and whole-grain crackers",
        ],
      };
    default:
      return {
        title: "Suggested breakfast",
        subtitle: "Simple breakfast ideas designed for steadier energy and fuller mornings.",
        sectionTitle: "Breakfast recommendations",
        bullets: [
          "Greek yogurt with berries and pumpkin seeds",
          "Eggs with avocado toast and leafy greens",
          "Protein oats with flaxseeds and cinnamon",
        ],
      };
  }
};
