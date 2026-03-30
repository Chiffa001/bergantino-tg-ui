import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/lib/query-client';

import { createWorkspace, getWorkspaces } from './requests';

export const workspacesQueryKey = ['workspaces'] as const;

export const createWorkspacesQuery = () =>
  createQuery(() => ({
    queryFn: getWorkspaces,
    queryKey: workspacesQueryKey,
    staleTime: 30_000,
  }));

export const createWorkspaceMutation = () =>
  createMutation(() => ({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  }));
