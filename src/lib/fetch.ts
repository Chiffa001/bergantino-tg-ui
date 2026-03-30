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
