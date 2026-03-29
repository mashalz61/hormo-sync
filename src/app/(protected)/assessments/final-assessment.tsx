import { assessmentResults } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function FinalAssessmentScreen() {
  return (
    <FeatureScaffoldScreen
      title="Final results and assessment"
      subtitle="This combines your cycle, symptom, and metabolic inputs into a supportive informational view."
      progress={{ step: 4, total: 4, label: "Assessment summary" }}
      result={assessmentResults[0]}
      sections={[
        {
          title: "Likely stage",
          description: "Current mock logic suggests early metabolic stress with irregular cycle patterns.",
          bullets: ["Risk: Moderate", "Stage: Early metabolic stress", "Recommendation: Clinical follow-up can help confirm next steps"],
        },
      ]}
    />
  );
}
