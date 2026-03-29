import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function ReminderDetailsScreen() {
  return (
    <FeatureScaffoldScreen
      title="Reminder details"
      subtitle="Review the purpose, schedule, and current status of a reminder."
      sections={[
        {
          title: "Reminder overview",
          description: "Hydration reminder set for 09:00 AM every day.",
          bullets: ["Purpose: Support hydration and energy", "Schedule: Daily at 09:00 AM", "Status: Active"],
        },
      ]}
      ctaLabel="Edit reminder"
      onCtaPress={() => router.push("/reminders/edit-reminder")}
    />
  );
}
