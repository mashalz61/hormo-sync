import { env } from "@/config/env";
import { ApiErrorPayload } from "@/types/api";

export class ApiError extends Error {
  status: number;
  data?: ApiErrorPayload;

  constructor(message: string, status: number, data?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path: string) => `${env.apiBaseUrl.replace(/\/$/, "")}${path}`;

const parseErrorMessage = (status: number, data?: ApiErrorPayload) => {
  if (status === 422) {
    const detail = Array.isArray(data?.detail)
      ? data?.detail.map((issue) => issue.msg).filter(Boolean).join(", ")
      : data?.detail;
    return detail || "Some submitted values were rejected by the backend.";
  }

  if (status === 503) {
    return typeof data?.detail === "string"
      ? data.detail
      : "The prediction model is currently unavailable.";
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  return "Something went wrong while talking to the backend.";
};

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { detail: text };
  }
};

export const apiClient = {
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;

    try {
      response = await fetch(buildUrl(path), {
        ...init,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      });
    } catch {
      throw new ApiError(
        "Unable to reach the backend. Check your API base URL and make sure the FastAPI server is running.",
        0,
      );
    }

    const data = (await parseJsonSafely(response)) as ApiErrorPayload | T | undefined;

    if (!response.ok) {
      throw new ApiError(
        parseErrorMessage(response.status, data as ApiErrorPayload | undefined),
        response.status,
        data as ApiErrorPayload | undefined,
      );
    }

    return data as T;
  },
};
