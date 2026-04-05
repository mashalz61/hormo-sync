import { requestJson } from "@/services/api/client";
import { AnalyzeFoodRequest, AnalyzeFoodResponse } from "@/types/foodAnalyzer";

export function analyzeFood(payload: AnalyzeFoodRequest) {
  return requestJson<AnalyzeFoodResponse>("/predict/calories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
