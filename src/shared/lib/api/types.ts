type ParamsValue = string | number | boolean | null | undefined;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ParamsObject = Record<string, string[][] | ParamsValue | ParamsValue[]>;

export interface ApiRequestConfig {
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public url: string,
    public responseText?: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

