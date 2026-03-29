import { assessmentResults } from "@/data/mockData";
import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";

export default function FinalRecommendationsScreen() {
  return (
    <FeatureScaffoldScreen
      title="Final results and recommendations"
      subtitle="A refined overview combining symptom and lab placeholders."
      result={assessmentResults[0]}
      sections={[
        {
          title: "Supportive next steps",
          description: "These suggestions are intentionally simple and appropriate for an early-stage prototype.",
          bullets: [
            "Emphasize protein and fiber at meals.",
            "Use regular movement to support insulin sensitivity.",
            "Review results with a qualified healthcare professional.",
          ],
        },
      ]}
    />
  );
}
