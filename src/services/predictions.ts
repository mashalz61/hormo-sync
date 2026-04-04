import { AssessmentResult, RiskLevel } from "@/types";
import { ApiError, apiClient } from "@/services/apiClient";
import {
  HealthResponse,
  NormalizedPredictionResult,
  PredictionRequest,
  PredictionResponseRaw,
} from "@/types/api";

const parseMetric = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? undefined : numeric;
  }

  return undefined;
};

const toRiskLevel = (raw: string): RiskLevel => {
  const normalized = raw.toLowerCase();

  if (normalized.includes("high") || normalized === "1" || normalized.includes("positive")) {
    return "High";
  }

  if (normalized.includes("moderate") || normalized.includes("medium")) {
    return "Moderate";
  }

  return "Low";
};

const humanizeKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

export const normalizePredictionResponse = (
  response: PredictionResponseRaw | string | number | boolean,
  title: string,
): NormalizedPredictionResult => {
  const normalizedResponse =
    response && typeof response === "object"
      ? response
      : ({ prediction: String(response) } as PredictionResponseRaw);
  const rawLabel = String(
    normalizedResponse.prediction ??
      normalizedResponse.result ??
      normalizedResponse.label ??
      normalizedResponse.pcos_level ??
      normalizedResponse.risk ??
      "No prediction returned",
  );
  const confidenceValue =
    parseMetric(normalizedResponse.pcos_probability) ??
    parseMetric(normalizedResponse.confidence) ??
    parseMetric(normalizedResponse.probability) ??
    parseMetric(normalizedResponse.score);

  const details = Object.entries(normalizedResponse)
    .filter(([key, value]) => !["prediction", "result", "label", "risk", "pcos_level", "pcos_present", "pcos_probability", "probability", "confidence", "score", "recommendations"].includes(key) && value !== null && value !== undefined)
    .slice(0, 6)
    .map(([key, value]) => ({
      label: humanizeKey(key),
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));

  const recommendations =
    normalizedResponse.recommendations?.length
      ? normalizedResponse.recommendations
      : [
          "Review this prediction alongside your clinician rather than using it as a diagnosis on its own.",
          "Retest after updating any missing optional fields if the output feels incomplete.",
        ];

  return {
    title,
    risk: toRiskLevel(rawLabel),
    rawLabel,
    confidenceText:
      confidenceValue !== undefined
        ? `${confidenceValue > 1 ? confidenceValue.toFixed(2) : `${Math.round(confidenceValue * 100)}%`} confidence`
        : undefined,
    summary:
      typeof normalizedResponse.message === "string"
        ? normalizedResponse.message
        : typeof normalizedResponse.detail === "string"
          ? normalizedResponse.detail
          : typeof normalizedResponse.pcos_present === "boolean"
            ? normalizedResponse.pcos_present
              ? "The model indicates PCOS is present."
              : "The model indicates PCOS is not present."
            : `Backend returned "${rawLabel}" for ${title.toLowerCase()}.`,
    recommendations,
    details,
  };
};

export const toAssessmentResult = (prediction: NormalizedPredictionResult): AssessmentResult => ({
  risk: prediction.risk,
  stage: `${prediction.title}: ${prediction.rawLabel}`,
  summary: prediction.confidenceText
    ? `${prediction.summary} ${prediction.confidenceText}.`
    : prediction.summary,
  recommendations: prediction.recommendations,
});

export const predictionService = {
  getHealth: () => apiClient.request<HealthResponse>("/health"),
  predictPcos: (payload: PredictionRequest) => {
    console.log("POST /predict/pcos payload", payload);
    return apiClient.request<PredictionResponseRaw>("/predict/pcos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  predictIr: (payload: PredictionRequest) => {
    console.log("POST /predict/ir payload", payload);
    return apiClient.request<PredictionResponseRaw>("/predict/ir", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
