import { env } from '@/app/config/env';
import type { ApiError } from '@/shared/types/api.types';
import { isValidationErrors } from '@/shared/utils/isValidationErrors';

const buildUrl = (path: string): string => {
  const normalizedBaseUrl: string = env.apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath: string = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

const createHeaders = (options?: RequestInit): Headers => {
  const headers: Headers = new Headers(options?.headers);
  const token: string | null = localStorage.getItem('auth_token');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType: string = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as unknown;
  }

  const text: string = await response.text();

  return text.length > 0 ? text : null;
};

const toApiError = (payload: unknown, status: number, fallbackMessage: string): ApiError => {
  if (typeof payload === 'object' && payload !== null) {
    const message: unknown = Reflect.get(payload, 'message');
    const errors: unknown = Reflect.get(payload, 'errors');

    return {
      message: typeof message === 'string' && message.length > 0 ? message : fallbackMessage,
      status,
      errors: isValidationErrors(errors) ? errors : undefined,
    };
  }

  if (typeof payload === 'string' && payload.length > 0) {
    return {
      message: payload,
      status,
    };
  }

  return {
    message: fallbackMessage,
    status,
  };
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const headers: Headers = createHeaders(options);
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });
  } catch (error: unknown) {
    throw {
      message: error instanceof Error ? error.message : 'Network error',
      status: 0,
    } satisfies ApiError;
  }

  const payload: unknown = await parseResponseBody(response);

  if (!response.ok) {
    throw toApiError(payload, response.status, response.statusText || 'Request failed');
  }

  return payload as T;
};

export const get = async <T>(path: string, options?: RequestInit): Promise<T> =>
  request<T>(path, {
    ...options,
    method: 'GET',
  });

export const post = async <T>(path: string, options?: RequestInit): Promise<T> =>
  request<T>(path, {
    ...options,
    method: 'POST',
  });

export const patch = async <T>(path: string, options?: RequestInit): Promise<T> =>
  request<T>(path, {
    ...options,
    method: 'PATCH',
  });

export const del = async <T>(path: string, options?: RequestInit): Promise<T> =>
  request<T>(path, {
    ...options,
    method: 'DELETE',
  });
