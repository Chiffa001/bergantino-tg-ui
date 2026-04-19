import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/shared/lib/query-client';

import type { CreateWorkspaceGroupRequest } from '../model/types';
import {
  createWorkspaceGroup,
  favoriteGroup,
  getWorkspaceGroups,
  unfavoriteGroup,
} from './requests';

export const workspaceGroupsQueryKey = (id: string) => ['workspaces', id, 'groups'] as const;

export const createWorkspaceGroupsQuery = (id: () => string) =>
  createQuery(() => ({
    queryFn: () => getWorkspaceGroups(id()),
    queryKey: workspaceGroupsQueryKey(id()),
    staleTime: 30_000,
  }));

export const createFavoriteGroupMutation = () =>
  createMutation(() => ({
    mutationFn: (groupId: string) => favoriteGroup(groupId),
  }));

export const createUnfavoriteGroupMutation = () =>
  createMutation(() => ({
    mutationFn: (groupId: string) => unfavoriteGroup(groupId),
  }));

export const createWorkspaceGroupMutation = (id: () => string) =>
  createMutation(() => ({
    mutationFn: (data: CreateWorkspaceGroupRequest) => createWorkspaceGroup(id(), data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceGroupsQueryKey(id()) });
    },
  }));
