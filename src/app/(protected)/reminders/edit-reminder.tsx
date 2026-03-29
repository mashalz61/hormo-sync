import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function EditReminderScreen() {
  return (
    <FeatureScaffoldScreen
      title="Edit reminder"
      subtitle="Adjust activity, time, and frequency for an existing reminder."
      sections={[
        {
          title: "Editable fields",
          description: "This screen is ready for backend-connected editing.",
          bullets: ["Activity", "Time", "Frequency", "Enabled state"],
        },
      ]}
      ctaLabel="Save changes"
      onCtaPress={() => router.push("/reminders/reminder-details")}
    />
  );
}
