import { retrieveLaunchParams } from '@tma.js/sdk-svelte';

import { apiFetch } from '@/lib/fetch';

import type { AuthResponse } from './types';

export const authByTelegram = async (): Promise<AuthResponse> => {
  const params = retrieveLaunchParams();

  const res = await apiFetch('/auth/telegram', {
    method: 'POST',
    body: JSON.stringify(params.tgWebAppData),
  });

  if (res.status >= 400 && res.status < 500) {
    throw new Error('client_error');
  }

  if (!res.ok) {
    throw new Error('server_error');
  }

  return res.json();
};
