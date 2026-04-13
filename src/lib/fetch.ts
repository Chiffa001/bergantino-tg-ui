import { getApiUrl } from '@/lib/api';
import { authStore } from '@/lib/auth';
import { getTelegramHash } from '@/lib/tma';

export class ApiStatusError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ApiStatusError';
    this.status = status;
    this.payload = payload;
  }
}

async function parseErrorPayload(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return undefined;
  }

  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export const apiFetch = (path: string, init?: RequestInit) => {
  const headers = new Headers(init?.headers);
  const token = authStore.getToken();
  const tgHash = getTelegramHash();

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (tgHash) {
    headers.set('X-TG-HASH', tgHash);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
  });
};

export const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await apiFetch(path, init);

  if (res.status >= 400 && res.status < 500) {
    throw new ApiStatusError(res.status, 'client_error', await parseErrorPayload(res));
  }

  if (!res.ok) {
    throw new ApiStatusError(res.status, 'server_error', await parseErrorPayload(res));
  }

  return res.json() as Promise<T>;
};

export const requestJsonWithStatus = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await apiFetch(path, init);

  if (res.status >= 400 && res.status < 500) {
    throw new ApiStatusError(res.status, 'client_error', await parseErrorPayload(res));
  }

  if (!res.ok) {
    throw new ApiStatusError(res.status, 'server_error', await parseErrorPayload(res));
  }

  return res.json() as Promise<T>;
};
