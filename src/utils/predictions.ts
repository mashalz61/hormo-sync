import { AppApiError, isAppApiError } from "@/services/api/client";
import { PredictionRequest, PredictionResponse, PredictionUiResult } from "@/types/api";

const cyclePatternToCode = {
  Regular: 2,
  Irregular: 4,
} as const;

export const buildPredictionPayload = ({
  age,
  weight,
  cyclePattern,
  weightGain,
}: {
  age: string;
  weight: string;
  cyclePattern: "Regular" | "Irregular";
  weightGain: boolean;
}): PredictionRequest => ({
  features: {
    "Age (yrs)": parseNumericInput(age),
    "Weight (Kg)": parseNumericInput(weight),
    // This mirrors the common PCOS dataset encoding used by many FastAPI demos.
    "Cycle(R/I)": cyclePatternToCode[cyclePattern],
    "Weight gain(Y/N)": weightGain ? 1 : 0,
  },
});

export const validatePredictionInputs = ({ age, weight }: { age: string; weight: string }) => {
  const errors: Partial<Record<"age" | "weight", string>> = {};

  if (!isPositiveNumber(age)) {
    errors.age = "Enter a valid age greater than 0.";
  }

  if (!isPositiveNumber(weight)) {
    errors.weight = "Enter a valid weight greater than 0.";
  }

  return errors;
};

export const formatPredictionResult = (
  endpoint: "pcos" | "ir",
  response: PredictionResponse,
): PredictionUiResult => {
  const verdictSource =
    readFirstDefined(response, ["prediction", "result", "label", "classification", "class", "outcome", "risk"]) ??
    "Prediction received";

  const detailSource =
    readFirstDefined(response, ["summary", "message", "detail"]) ??
    "The backend returned a prediction successfully.";

  const scoreValue =
    readNumericValue(response, ["probability", "confidence", "score"]) ??
    readFirstDefined(response, ["probability", "confidence", "score"]);

  const scoreLabel = response.probability !== undefined
    ? "Probability"
    : response.confidence !== undefined
      ? "Confidence"
      : response.score !== undefined
        ? "Score"
        : undefined;

  return {
    endpoint,
    title: endpoint === "pcos" ? "PCOS Prediction" : "Insulin Resistance Prediction",
    verdict: formatScalarValue(verdictSource),
    detail: formatScalarValue(detailSource),
    scoreLabel,
    scoreValue:
      scoreLabel && scoreValue !== undefined
        ? typeof scoreValue === "number"
          ? formatScore(scoreValue)
          : formatScalarValue(scoreValue)
        : undefined,
    raw: response,
  };
};

export const parseNumericInput = (value: string) => {
  const normalized = normalizeNumericInput(value);

  if (!Number.isFinite(normalized)) {
    return 0;
  }

  return normalized;
};

export const toUserFacingApiError = (error: unknown) => {
  if (isAppApiError(error)) {
    return error;
  }

  return new AppApiError({
    kind: "unknown",
    message: "Something unexpected happened while contacting the backend.",
    raw: error,
  });
};

function readFirstDefined(source: PredictionResponse, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function readNumericValue(source: PredictionResponse, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

function formatScalarValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Positive" : "Negative";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? `${value}` : value.toFixed(3);
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

function formatScore(value: number) {
  if (value >= 0 && value <= 1) {
    return `${Math.round(value * 100)}%`;
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(3);
}

function isPositiveNumber(value: string) {
  const normalized = normalizeNumericInput(value);

  return Number.isFinite(normalized) && normalized > 0;
}

function normalizeNumericInput(value: string) {
  return Number(value.replace(",", ".").trim());
}
