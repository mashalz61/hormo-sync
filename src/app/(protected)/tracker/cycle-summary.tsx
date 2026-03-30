import { cycleLogs } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function CycleSummaryScreen() {
  return (
    <FeatureScaffoldScreen
      title="Cycle summary"
      subtitle="Understand your average cycle length, regularity, and potential irregular patterns."
      fallbackRoute="/tracker"
      sections={[
        {
          title: "Cycle overview",
          description: "Mock summary based on the latest two logs.",
          bullets: [
            `Average cycle length: ${Math.round((cycleLogs[0].cycleLength + cycleLogs[1].cycleLength) / 2)} days`,
            "Regularity: Mostly irregular",
            "Abnormalities: Occasional long gaps",
            "Missed periods: Noted occasionally",
          ],
        },
      ]}
    />
  );
}
