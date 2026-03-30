import { retrieveLaunchParams } from '@tma.js/sdk-svelte';

import { requestJson } from '@/lib/fetch';

import type { AuthResponse } from './types';

export const authByTelegram = async (): Promise<AuthResponse> => {
  const params = retrieveLaunchParams();

  return requestJson<AuthResponse>('/auth/telegram', {
    method: 'POST',
    body: JSON.stringify(params.tgWebAppData),
  });
};
