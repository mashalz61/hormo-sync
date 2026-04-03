import { HealthResponse, PredictionRequest, PredictionResponse } from "@/types/api";

import { requestJson } from "./client";

export const getApiHealth = () => requestJson<HealthResponse>("/health", { method: "GET" });

export const predictPcos = (payload: PredictionRequest) =>
  requestJson<PredictionResponse>("/predict/pcos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const predictIr = (payload: PredictionRequest) =>
  requestJson<PredictionResponse>("/predict/ir", {
    method: "POST",
    body: JSON.stringify(payload),
  });
