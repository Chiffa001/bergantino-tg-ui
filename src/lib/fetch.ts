import { getApiUrl } from '@/lib/api';
import { authStore } from '@/lib/auth';
import { getTelegramHash } from '@/lib/tma';

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
    throw new Error('client_error');
  }

  if (!res.ok) {
    throw new Error('server_error');
  }

  return res.json() as Promise<T>;
};
