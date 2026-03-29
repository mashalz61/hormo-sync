import { router } from "expo-router";

import { hormonalSummaries } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function RecommendedTestsScreen() {
  return (
    <FeatureScaffoldScreen
      title="Recommended tests"
      subtitle="Potential follow-up tests for a clinician-guided conversation."
      sections={hormonalSummaries.map((item) => ({
        title: item.title,
        description: item.description,
        bullets: item.tests,
      }))}
      ctaLabel="Continue to lab input"
      onCtaPress={() => router.push("/assessments/lab-results-input")}
    />
  );
}
