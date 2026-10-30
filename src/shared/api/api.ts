import type { ApiResponse, HttpMethod, ParamsObject } from './types';
import { ApiError } from './types';
import { clearAuthTokens, getAuthState, saveAuthTokens } from './auth-session';

// === Вспомогательные функции ===

function buildUrlWithParams(url: string, params?: ParamsObject): string {
  if (!params) return url;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => v != null && searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  const delimiter = url.includes('?') ? '&' : '?';
  return `${url}${delimiter}${searchParams.toString()}`;
}

function getAuthHeader(): string | null {
  const state = getAuthState();
  return state?.accessToken ? `Bearer ${state.accessToken}` : null;
}

const AUTH_PATHS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];
const isAuthEndpoint = (url: string) => AUTH_PATHS.some((p) => url.includes(p));

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const state = getAuthState();
  if (!state?.refreshToken) return false;

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.refreshToken}` },
    });

    if (!response.ok) return false;

    const body = await response.json();
    const data =
      (body as ApiResponse<{ access_token?: string; refresh_token?: string }>)?.data ?? body;
    if (!data?.access_token) return false;

    saveAuthTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// Параллельные запросы с протухшим access-токеном делят один refresh
function refreshTokensSingleFlight(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function forceLogout(): void {
  clearAuthTokens();
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login');
  }
}

// === Приватный request (не экспортируем) ===

async function _request<T>(
  method: HttpMethod,
  url: string,
  config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  body?: BodyInit,
  isRetry = false,
): Promise<ApiResponse<T>> {
  const headers = new Headers(config.headers ?? {});

  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const authHeader = getAuthHeader();
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: config.signal,
    });

    if (response.status === 401 && !isAuthEndpoint(url)) {
      const refreshed = !isRetry ? await refreshTokensSingleFlight() : false;

      if (refreshed) {
        return _request<T>(method, url, config, body, true);
      }

      forceLogout();
      throw new ApiError('Session expired', 401, url, 'Unauthorized');
    }

    if (response.status === 401) {
      throw new ApiError('Unauthorized', 401, url, 'Unauthorized');
    }

    let data: unknown;
    try {
      // 204 No Content - null
      data = response.status === 204 ? null : await response.json();
    } catch (e) {
      console.error(e);
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url,
        typeof data === 'string' ? data : '',
        null,
        (data as { data: { message?: string[]; }; })?.data?.message
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.log(error, 'error');
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request aborted', 0, url);
    }
    throw error;
  }
}

// === Публичный API ===

export const api = {
  get: <T>(
    url: string,
    config: { params?: ParamsObject; headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => {
    const finalUrl = buildUrlWithParams(url, config.params);
    const rest = { ...config };
    delete rest.params;
    return _request<T>('GET', finalUrl, rest);
  },

  post: <T>(
    url: string,
    data?: unknown,
    config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => _request<T>('POST', url, config, data == null ? undefined : JSON.stringify(data)),

  put: <T>(
    url: string,
    data?: unknown,
    config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => _request<T>('PUT', url, config, data == null ? undefined : JSON.stringify(data)),

  patch: <T>(
    url: string,
    data?: unknown,
    config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => _request<T>('PATCH', url, config, data == null ? undefined : JSON.stringify(data)),

  delete: <T = void | boolean>(
    url: string,
    config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => _request<T>('DELETE', url, config),

  upload: <T>(
    url: string,
    data: FormData,
    config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  ) => _request<T>('POST', url, config, data),

  // upload: <T>(url: string, file: FormData, config: { headers?: HeadersInit; signal?: AbortSignal; } = {}) => {

  //   const authHeader = getAuthHeader();
  //   const headers = new Headers(config.headers ?? {});
  //   if (authHeader) {
  //     headers.set('Authorization', authHeader);
  //   }
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers,
  //     body: file
  //   });
  //   if (response.ok) {
  //     return await response.text();
  //   } else {
  //     let errorText = '';
  //     try {
  //       errorText = await response.text();
  //     } catch {
  //       errorText = response.statusText;
  //     }
  //     throw new ApiError(`Upload failed: ${response.status}`, response.status, url, errorText);
  //   }
  // },

  downloadBlob: async (
    url: string,
    config: { params?: ParamsObject; headers?: HeadersInit; signal?: AbortSignal; } = {},
    isRetry = false,
  ): Promise<Blob> => {
    const finalUrl = buildUrlWithParams(url, config.params);
    const headers = new Headers(config.headers ?? {});
    const authHeader = getAuthHeader();
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers,
      signal: config.signal,
    });

    if (response.status === 401 && !isAuthEndpoint(finalUrl)) {
      const refreshed = !isRetry ? await refreshTokensSingleFlight() : false;

      if (refreshed) {
        return api.downloadBlob(url, config, true);
      }

      forceLogout();
      throw new ApiError('Session expired', 401, finalUrl, 'Unauthorized');
    }

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch {
        errorText = response.statusText;
      }
      throw new ApiError(`Download failed: ${response.status}`, response.status, finalUrl, errorText);
    }

    return await response.blob();
  },


  saveBlobAs: (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};