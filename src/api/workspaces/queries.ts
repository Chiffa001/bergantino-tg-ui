import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/lib/query-client';

import { createWorkspace, getWorkspaceDetail, getWorkspaces } from './requests';

export const workspacesQueryKey = ['workspaces'] as const;
export const workspaceDetailQueryKey = (id: string) => ['workspace', id] as const;

export const createWorkspacesQuery = () =>
  createQuery(() => ({
    queryFn: getWorkspaces,
    queryKey: workspacesQueryKey,
    staleTime: 30_000,
  }));

export const createWorkspaceDetailQuery = (id: () => string) =>
  createQuery(() => ({
    queryFn: () => getWorkspaceDetail(id()),
    queryKey: workspaceDetailQueryKey(id()),
    staleTime: 30_000,
  }));

export const createWorkspaceMutation = () =>
  createMutation(() => ({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  }));
