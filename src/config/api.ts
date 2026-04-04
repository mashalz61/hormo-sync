const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

export const apiConfig = {
  baseUrl: normalizeBaseUrl(rawApiBaseUrl),
  requestTimeoutMs: 15000,
};

export const hasApiBaseUrl = apiConfig.baseUrl.length > 0;
