import { apiConfig, hasApiBaseUrl } from "@/config/api";
import { ApiErrorPayload, AppApiErrorShape, ValidationErrorItem } from "@/types/api";

export class AppApiError extends Error implements AppApiErrorShape {
  kind: AppApiErrorShape["kind"];
  status?: number;
  details?: string[];
  raw?: unknown;

  constructor({ kind, message, status, details, raw }: AppApiErrorShape) {
    super(message);
    this.name = "AppApiError";
    this.kind = kind;
    this.status = status;
    this.details = details;
    this.raw = raw;
  }
}

interface RequestJsonOptions extends RequestInit {
  timeoutMs?: number;
}

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const isAppApiError = (value: unknown): value is AppApiError => value instanceof AppApiError;

export async function requestJson<T>(path: string, options: RequestJsonOptions = {}): Promise<T> {
  if (!hasApiBaseUrl) {
    throw new AppApiError({
      kind: "config",
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL before using predictions.",
    });
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? apiConfig.requestTimeoutMs;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const requestUrl = `${apiConfig.baseUrl}${path}`;

  try {
    console.log("[API request]", {
      url: requestUrl,
      method: options.method ?? "GET",
      body: parseRequestBodyForLog(options.body),
    });

    const response = await fetch(requestUrl, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
      throw buildHttpError(response.status, responseBody);
    }

    return responseBody as T;
  } catch (error) {
    if (error instanceof AppApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new AppApiError({
        kind: "network",
        message: "The request timed out. Check the backend and try again.",
      });
    }

    throw new AppApiError({
      kind: "network",
      message: "Unable to reach the backend. Check your network and API base URL.",
      raw: error,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseRequestBodyForLog(body: RequestInit["body"]) {
  if (!body) {
    return null;
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  return body;
}

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

function buildHttpError(status: number, payload: unknown) {
  if (status === 422) {
    return new AppApiError({
      kind: "validation",
      status,
      message: "Some prediction inputs were rejected by the backend.",
      details: extractErrorDetails(payload),
      raw: payload,
    });
  }

  if (status === 503) {
    return new AppApiError({
      kind: "service_unavailable",
      status,
      message: "The prediction model is currently unavailable. Please try again shortly.",
      details: extractErrorDetails(payload),
      raw: payload,
    });
  }

  return new AppApiError({
    kind: "http",
    status,
    message: extractPrimaryMessage(payload) ?? `Request failed with status ${status}.`,
    details: extractErrorDetails(payload),
    raw: payload,
  });
}

function extractPrimaryMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as ApiErrorPayload;

  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message;
  }

  if (typeof candidate.error === "string" && candidate.error.trim()) {
    return candidate.error;
  }

  if (typeof candidate.detail === "string" && candidate.detail.trim()) {
    return candidate.detail;
  }

  return null;
}

function extractErrorDetails(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const candidate = payload as ApiErrorPayload;

  if (Array.isArray(candidate.detail)) {
    return candidate.detail
      .map((item: ValidationErrorItem) => {
        const location = Array.isArray(item.loc) ? item.loc.join(" > ") : undefined;
        const message = item.msg?.trim();

        if (location && message) {
          return `${location}: ${message}`;
        }

        return message;
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof candidate.detail === "string" && candidate.detail.trim()) {
    return [candidate.detail];
  }

  return undefined;
}
