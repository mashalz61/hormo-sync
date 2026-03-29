import { router } from "expo-router";

import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";
import { symptomOptions } from "@/data/mockData";

export default function SymptomCheckerScreen() {
  return (
    <FeatureScaffoldScreen
      title="Symptom checker"
      subtitle="Review recurring signs that may be useful to track over time."
      sections={[
        {
          title: "Checklist",
          description: "Use this checklist to log symptoms before moving into results.",
          bullets: symptomOptions.map((item) => item.label),
        },
      ]}
      ctaLabel="View combined assessment"
      onCtaPress={() => router.push("/assessments/final-assessment")}
    />
  );
}
