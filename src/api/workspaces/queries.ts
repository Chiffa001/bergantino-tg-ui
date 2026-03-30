import { createQuery } from '@tanstack/svelte-query';

import { getWorkspaces } from './requests';

export const workspacesQueryKey = ['workspaces'] as const;

export const createWorkspacesQuery = () =>
  createQuery(() => ({
    queryFn: getWorkspaces,
    queryKey: workspacesQueryKey,
    staleTime: 30_000,
  }));
