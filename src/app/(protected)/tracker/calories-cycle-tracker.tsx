import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function CaloriesCycleTrackerScreen() {
  return (
    <FeatureScaffoldScreen
      title="Calories and cycle tracker"
      subtitle="See consumed and burned calories alongside your current cycle phase."
      sections={[
        {
          title: "Today’s snapshot",
          description: "Mock placeholder values for the current build.",
          bullets: ["Calories consumed: 1,640", "Calories burned: 420", "Cycle phase relation: energy may be improving"],
        },
      ]}
    />
  );
}
