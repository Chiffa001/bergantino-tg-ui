import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/lib/query-client';

import {
  createWorkspace,
  createWorkspaceInvite,
  getWorkspaceDetail,
  getWorkspaces,
  getWorkspaceUsers,
  updateWorkspaceBot,
} from './requests';
import type { CreateWorkspaceInviteRequest, UpdateWorkspaceBotRequest, WorkspaceUsersFilters } from './types';

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

export const createUpdateWorkspaceBotMutation = (id: () => string) =>
  createMutation(() => ({
    mutationFn: (data: UpdateWorkspaceBotRequest) => updateWorkspaceBot(id(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceDetailQueryKey(id()) });
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  }));
