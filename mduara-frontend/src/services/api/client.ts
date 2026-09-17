export interface ApiErrorShape {
  message?: string;
  error?: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type TokenGetter = () => string | null | Promise<string | null>;
type UnauthorizedHandler = () => void | Promise<void>;

let getAccessToken: TokenGetter = () => null;
let onUnauthorized: UnauthorizedHandler = () => undefined;

export const API_BASE_URL = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export function configureApiClient(options: { tokenGetter?: TokenGetter; unauthorizedHandler?: UnauthorizedHandler }) {
  if (options.tokenGetter) getAccessToken = options.tokenGetter;
  if (options.unauthorizedHandler) onUnauthorized = options.unauthorizedHandler;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { authenticated?: boolean } = { authenticated: true },
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.authenticated !== false) {
    const token = await getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (response.status === 401 && options.authenticated !== false) {
    await onUnauthorized();
  }

  if (!response.ok) {
    const body = payload as ApiErrorShape;
    const message = typeof payload === 'string' ? payload : body?.message ?? body?.error ?? 'Request failed';
    throw new ApiError(message, response.status, typeof payload === 'string' ? undefined : body?.details);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, authenticated = true) => apiRequest<T>(path, { method: 'GET' }, { authenticated }),
  post: <T>(path: string, body?: unknown, authenticated = true) => apiRequest<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  }, { authenticated }),
  patch: <T>(path: string, body?: unknown, authenticated = true) => apiRequest<T>(path, {
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
  }, { authenticated }),
  put: <T>(path: string, body?: unknown, authenticated = true) => apiRequest<T>(path, {
    method: 'PUT',
    body: body === undefined ? undefined : JSON.stringify(body),
  }, { authenticated }),
  delete: <T>(path: string, authenticated = true) => apiRequest<T>(path, { method: 'DELETE' }, { authenticated }),
};
