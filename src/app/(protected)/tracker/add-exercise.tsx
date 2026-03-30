import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function AddExerciseScreen() {
  return (
    <FeatureScaffoldScreen
      title="Add exercise"
      subtitle="Track walking, running, yoga, gym work, or any custom activity."
      fallbackRoute="/tracker"
      sections={[
        {
          title: "Exercise options",
          description: "Choose a movement type and duration in a future backend-connected version.",
          bullets: ["Walking", "Running", "Yoga", "Gym workout", "Custom activity"],
        },
      ]}
      ctaLabel="View calories and cycle insights"
      onCtaPress={() => router.push("/tracker/calories-cycle-tracker")}
    />
  );
}
