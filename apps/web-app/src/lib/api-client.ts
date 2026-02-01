import { createApiClient } from "@repo/api-client";

const API_BASE_URL_ROOT = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = `${API_BASE_URL_ROOT}/api`;

export const apiClient = createApiClient(API_BASE_URL_ROOT);

export function updateApiClientToken(token: string) {
  return createApiClient(API_BASE_URL_ROOT, token);
}
