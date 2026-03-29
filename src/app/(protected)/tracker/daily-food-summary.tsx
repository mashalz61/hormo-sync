import { meals } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function DailyFoodSummaryScreen() {
  return (
    <FeatureScaffoldScreen
      title="Daily food intake summary"
      subtitle="Review meals, diet balance feedback, and simple nutrition suggestions."
      sections={[
        {
          title: "Today’s meals",
          description: "Mock daily summary from stored sample data.",
          bullets: meals.map((item) => `${item.mealType}: ${item.title} (${item.balance})`),
        },
        {
          title: "Nutrition suggestion",
          description: "A little more protein or fiber in snacks may support steadier energy.",
        },
      ]}
    />
  );
}
