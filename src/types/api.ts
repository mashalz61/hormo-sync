export interface PredictionFeatures {
  "Age (yrs)": number;
  "Weight (Kg)": number;
  "Cycle(R/I)": number;
  "Weight gain(Y/N)": number;
  [key: string]: number;
}

export interface PredictionRequest {
  features: PredictionFeatures;
}

export interface ValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export interface ApiErrorPayload {
  detail?: string | ValidationErrorItem[];
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface HealthResponse {
  status?: string;
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export interface PredictionResponse {
  prediction?: string | number | boolean;
  result?: string | number | boolean;
  label?: string;
  class?: string | number;
  classification?: string | number;
  outcome?: string | number | boolean;
  risk?: string;
  probability?: number;
  confidence?: number;
  score?: number;
  message?: string;
  detail?: string;
  summary?: string;
  [key: string]: unknown;
}

export type ApiErrorKind =
  | "config"
  | "network"
  | "validation"
  | "service_unavailable"
  | "http"
  | "unknown";

export interface AppApiErrorShape {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  details?: string[];
  raw?: unknown;
}

export interface PredictionUiResult {
  endpoint: "pcos" | "ir";
  title: string;
  verdict: string;
  detail: string;
  scoreLabel?: string;
  scoreValue?: string;
  raw: PredictionResponse;
}
