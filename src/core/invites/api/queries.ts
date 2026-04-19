import { createMutation, createQuery } from '@tanstack/svelte-query';

import { acceptInvite, getInvite } from './requests';

export const inviteDetailQueryKey = (token: string) => ['invite', token] as const;

export const createInviteDetailQuery = (token: () => string) =>
  createQuery(() => ({
    queryFn: () => getInvite(token()),
    queryKey: inviteDetailQueryKey(token()),
    retry: false,
    staleTime: 30_000,
  }));

export const createAcceptInviteMutation = (token: () => string) =>
  createMutation(() => ({
    mutationFn: () => acceptInvite(token()),
  }));
