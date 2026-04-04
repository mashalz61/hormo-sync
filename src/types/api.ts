import { RiskLevel } from "@/types";

export interface ApiValidationIssue {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export type ValidationErrorItem = ApiValidationIssue;

export interface ApiErrorPayload {
  detail?: string | ApiValidationIssue[];
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface AppApiErrorShape {
  kind:
    | "config"
    | "network"
    | "validation"
    | "service_unavailable"
    | "http"
    | "unknown";
  message: string;
  status?: number;
  details?: string[];
  raw?: unknown;
}

export interface HealthResponse {
  status?: string;
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export interface PredictionRequest {
  features: Record<string, number>;
}

export interface PredictionResponseRaw {
  prediction?: string | number | boolean;
  result?: string | number | boolean;
  label?: string | number | boolean;
  risk?: string;
  pcos_level?: string;
  pcos_present?: boolean;
  pcos_probability?: number | string;
  pcos_risk_level?: string;
  pcos_probability_of_developing?: number | string;
  probability?: number | string;
  confidence?: number | string;
  score?: number | string;
  message?: string;
  detail?: string;
  recommendations?: string[];
  [key: string]: unknown;
}

export type PredictionResponse = PredictionResponseRaw;

export interface PredictionUiResult {
  endpoint: "pcos" | "ir";
  title: string;
  verdict: string;
  detail: string;
  scoreLabel?: string;
  scoreValue?: string;
  raw: PredictionResponse;
}

export interface NormalizedPredictionResult {
  title: string;
  risk: RiskLevel;
  summary: string;
  rawLabel: string;
  confidenceText?: string;
  recommendations: string[];
  details: Array<{ label: string; value: string }>;
}
