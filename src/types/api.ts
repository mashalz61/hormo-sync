import { RiskLevel } from "@/types";

export interface ApiValidationIssue {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export interface ApiErrorPayload {
  detail?: string | ApiValidationIssue[];
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
  probability?: number | string;
  confidence?: number | string;
  score?: number | string;
  message?: string;
  detail?: string;
  recommendations?: string[];
  [key: string]: unknown;
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
