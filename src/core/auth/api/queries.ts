import { createQuery } from '@tanstack/svelte-query';

import { authByTelegram } from './requests';

export const authQueryKey = ['auth'] as const;

export const createAuthQuery = (enabled: () => boolean = () => true) =>
  createQuery(() => ({
    enabled: enabled(),
    queryFn: authByTelegram,
    queryKey: authQueryKey,
    retry: false,
    staleTime: Infinity,
  }));
