import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function LifestyleReminderScreen() {
  return (
    <FeatureScaffoldScreen
      title="Lifestyle reminder"
      subtitle="Introduce reminders for water, exercise, sleep, and stress management."
      sections={[
        {
          title: "Reminder categories",
          description: "Lifestyle reminders can help make health tracking more sustainable over time.",
          bullets: ["Water", "Exercise", "Sleep", "Stress management"],
        },
      ]}
      ctaLabel="Open reminder list"
      onCtaPress={() => router.push("/reminders/reminder-list")}
    />
  );
}
