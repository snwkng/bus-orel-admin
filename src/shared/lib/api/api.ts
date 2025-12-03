import type { ApiResponse, HttpMethod, ParamsObject } from './types';
import { ApiError } from './types';

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

/**
 * Безопасное чтение токена с защитой от неактивной сессии
 */
function getAuthHeader(): string | null {
  try {
    const raw = localStorage.getItem('token');
    if (!raw) return null;

    const state = JSON.parse(raw) as { accessToken: string; lastActive: number; expiresAt: number; } | null;
    if (!state?.accessToken) return null;

    const now = Date.now();
    const tokenAlive = now < state.expiresAt;
    const activeRecently = state.lastActive && now - state.lastActive < 30 * 60 * 1000; // 30 мин

    if (tokenAlive && activeRecently) {
      // Обновляем lastActive при использовании токена
      state.lastActive = now;
      localStorage.setItem('token', JSON.stringify(state));
      return `Bearer ${state.accessToken}`;
    }
  } catch (e) {
    console.warn('[api] Failed to get auth header', e);
  }
  return null;
}

// === Приватный request (не экспортируем) ===

async function _request<T>(
  method: HttpMethod,
  url: string,
  config: { headers?: HeadersInit; signal?: AbortSignal; } = {},
  body?: BodyInit,
): Promise<ApiResponse<T>> {
  const headers = new Headers(config.headers ?? {});

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 🔐 Добавляем Authorization, только если сессия активна
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

    let data: unknown;
    try {
      // 204 No Content → null
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
        typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      );
    }

    return {
      // ✅ Безопасное приведение (общепринято для API-клиентов)
      data: data as any as T,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
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
    const { params: _, ...rest } = config;
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

  downloadBlob: async (
    url: string,
    config: { params?: ParamsObject; headers?: HeadersInit; signal?: AbortSignal; } = {},
  ): Promise<Blob> => {
    const finalUrl = buildUrlWithParams(url, config.params);
    const headers = new Headers(config.headers ?? {});
    const authHeader = getAuthHeader();
    if (authHeader) headers.set('Authorization', authHeader);

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers,
      signal: config.signal,
    });

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

  /**
   * Утилита: сохранить Blob как файл
   */
  saveBlobAs: (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};