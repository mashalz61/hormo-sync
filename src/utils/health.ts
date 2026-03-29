import { AssessmentResult, CyclePhase, RiskLevel } from "@/types";

export const calculateBmi = (weightKg: number, heightCm: number) => {
  if (!weightKg || !heightCm) {
    return 0;
  }

  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) {
    return "Underweight";
  }
  if (bmi < 25) {
    return "Normal";
  }
  if (bmi < 30) {
    return "Overweight";
  }
  return "Obese";
};

export const detectCyclePhase = (dayOfCycle: number): CyclePhase => {
  if (dayOfCycle <= 5) {
    return "Menstrual";
  }
  if (dayOfCycle <= 13) {
    return "Follicular";
  }
  if (dayOfCycle <= 16) {
    return "Ovulation";
  }
  return "Luteal";
};

export const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "Low":
      return "#4C8B6A";
    case "Moderate":
      return "#C98734";
    case "High":
      return "#C95F69";
    default:
      return "#7A8FB8";
  }
};

export const formatAssessmentNarrative = (result: AssessmentResult) =>
  `${result.risk} risk. ${result.summary} ${result.recommendations[0] ?? ""}`.trim();
