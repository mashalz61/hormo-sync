import type { AnalyzeFoodResponse } from "@/types/foodAnalyzer";
import type { PredictExerciseResponse } from "@/types/exerciseAnalyzer";

export const KCAL_DECIMAL_PLACES = 2;
const KCAL_ROUND_MULT = 10 ** KCAL_DECIMAL_PLACES;

/** Clamp invalid values to 0 and keep up to two decimal places for storage and sums. */
export function normalizeStoredCalories(calories: number): number {
  if (!Number.isFinite(calories) || calories <= 0) {
    return 0;
  }

  return Math.round(calories * KCAL_ROUND_MULT) / KCAL_ROUND_MULT;
}

/** Pretty-print kcal for labels (no trailing zeros). */
export function formatKcalForDisplay(calories: number): string {
  if (!Number.isFinite(calories) || calories <= 0) {
    return "0";
  }

  const v = Math.round(calories * KCAL_ROUND_MULT) / KCAL_ROUND_MULT;

  if (Number.isInteger(v)) {
    return String(v);
  }

  return v.toFixed(KCAL_DECIMAL_PLACES).replace(/0+$/, "").replace(/\.$/, "");
}

/** Same kcal wording as the smart food dashboard (`CalorieRing` stats row). */
export function formatKcalWithUnit(calories: number): string {
  return `${formatKcalForDisplay(calories)} kcal`;
}

const calorieKeyMatchers = [
  "calories",
  "calorie",
  "kcal",
  "totalcalories",
  "estimatedcalories",
  "burnedcalories",
  "caloriesburned",
] as const;

export function isCalorieMetricKey(key: string): boolean {
  const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();

  return calorieKeyMatchers.some((matcher) => normalizedKey.includes(matcher));
}

/** Format API analysis fields; calorie-like keys use the same kcal rules as the dashboard. */
export function formatAnalysisScalarForDisplay(key: string, value: unknown): string {
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (isCalorieMetricKey(key)) {
      return formatKcalWithUnit(normalizeStoredCalories(Math.max(value, 0)));
    }

    return String(value);
  }

  return String(value);
}

export function extractCaloriesFromResponse(payload: unknown) {
  const value = findCalorieValue(payload);

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Calories were not found in the API response.");
  }

  return normalizeStoredCalories(Math.max(value, 0));
}

/** Prefer `estimated_calories_burned` from exercise prediction, then generic calorie fields. */
export function extractExerciseCaloriesFromResponse(payload: PredictExerciseResponse) {
  const direct = normalizeNumber(payload.estimated_calories_burned);
  if (direct !== null) {
    return normalizeStoredCalories(Math.max(direct, 0));
  }
  return extractCaloriesFromResponse(payload);
}

/** Prefer `estimated_calories` from meal prediction, then generic calorie fields. */
export function extractMealCaloriesFromResponse(payload: AnalyzeFoodResponse) {
  const direct = normalizeNumber(payload.estimated_calories);
  if (direct !== null) {
    return normalizeStoredCalories(Math.max(direct, 0));
  }
  return extractCaloriesFromResponse(payload);
}

function findCalorieValue(payload: unknown): number | null {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const match = findCalorieValue(item);

      if (typeof match === "number") {
        return match;
      }
    }

    return null;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  for (const [key, value] of Object.entries(payload)) {
    const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();

    if (calorieKeyMatchers.some((matcher) => normalizedKey.includes(matcher))) {
      const numericValue = normalizeNumber(value);

      if (numericValue !== null) {
        return numericValue;
      }
    }
  }

  for (const value of Object.values(payload)) {
    const nestedValue = findCalorieValue(value);

    if (typeof nestedValue === "number") {
      return nestedValue;
    }
  }

  return null;
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/-?\d+(\.\d+)?/);

    if (match) {
      const parsed = Number(match[0]);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}
