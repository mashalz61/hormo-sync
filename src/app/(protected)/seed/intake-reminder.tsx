import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function IntakeReminderScreen() {
  return (
    <FeatureScaffoldScreen
      title="Intake reminder"
      subtitle="Set a daily reminder to stay consistent with seed cycling."
      sections={[
        {
          title: "Reminder suggestion",
          description: "A morning reminder often pairs well with breakfast or smoothies.",
          bullets: ["Time: 08:30 AM", "Frequency: Daily", "Purpose: Seed intake consistency"],
        },
      ]}
      ctaLabel="See how to consume"
      onCtaPress={() => router.push("/seed/how-to-consume")}
    />
  );
}
