import { FeatureScaffoldScreen } from "@/components/FeatureScaffoldScreen";
import { getBmiCategory } from "@/utils/health";

export default function BmiResultScreen() {
  const bmi = 24.8;

  return (
    <FeatureScaffoldScreen
      title="BMI result and weight category"
      subtitle={`BMI ${bmi} is currently in the ${getBmiCategory(bmi).toLowerCase()} range.`}
      sections={[
        {
          title: "What this means",
          description:
            "BMI is one data point. In PCOS and insulin resistance discussions, it can provide useful context alongside symptoms and lab results.",
          bullets: [
            "Current BMI: 24.8",
            "Category: Normal",
            "Recommendation: Continue balanced meals and regular movement.",
          ],
        },
      ]}
    />
  );
}
