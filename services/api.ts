import type { ApiErrorBody } from '@/types/api';
import { storageDelete, storageGet, storageSet } from '@/utils/storage';

const TOKEN_KEY = 'pb_auth_token';

export const getApiBaseUrl = () =>
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await storageGet(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await storageSet(TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  await storageDelete(TOKEN_KEY);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, auth = true }: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError(
      0,
      'EXPO_PUBLIC_API_URL is not set. Add it to your environment.',
    );
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const bearer = auth ? (token ?? (await getStoredToken())) : null;
  if (auth && bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    onUnauthorized?.();
    const errBody = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(
      response.status,
      errBody.error || errBody.message || 'Unauthorized',
    );
  }

  if (!response.ok) {
    const errBody = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(
      response.status,
      errBody.error || errBody.message || `Request failed (${response.status})`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
