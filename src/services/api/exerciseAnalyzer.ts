import { requestJson } from "@/services/api/client";
import { PredictExerciseRequest, PredictExerciseResponse } from "@/types/exerciseAnalyzer";

export function predictExercise(payload: PredictExerciseRequest) {
  return requestJson<PredictExerciseResponse>("/predict/exercise", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
