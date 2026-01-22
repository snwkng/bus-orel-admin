type ParamsValue = string | number | boolean | null | undefined;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ParamsObject = Record<string, string[][] | ParamsValue | ParamsValue[]>;

export interface ApiRequestConfig {
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiResponse<T> {
  success: boolean,
  data: T,
  meta: {
    timestamp: Date,
    path: string,
    statusCode: number,
  };
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

