import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/lib/query-client';

import {
  createWorkspace,
  createWorkspaceInvite,
  getWorkspaceDetail,
  getWorkspaces,
  getWorkspaceUsers,
} from './requests';
import type { CreateWorkspaceInviteRequest, WorkspaceUsersFilters } from './types';

export const workspacesQueryKey = ['workspaces'] as const;
export const workspaceDetailQueryKey = (id: string) => ['workspace', id] as const;
export const workspaceUsersQueryKey = (id: string, filters: WorkspaceUsersFilters) =>
  ['workspaces', id, 'users', filters] as const;

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

export const createWorkspaceUsersQuery = (
  id: () => string,
  filters: () => WorkspaceUsersFilters,
) =>
  createQuery(() => ({
    queryFn: () => getWorkspaceUsers(id(), filters()),
    queryKey: workspaceUsersQueryKey(id(), filters()),
    staleTime: 30_000,
  }));

export const createWorkspaceMutation = () =>
  createMutation(() => ({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  }));

export const createWorkspaceInviteMutation = (id: () => string) =>
  createMutation(() => ({
    mutationFn: (data: CreateWorkspaceInviteRequest) => createWorkspaceInvite(id(), data),
  }));
