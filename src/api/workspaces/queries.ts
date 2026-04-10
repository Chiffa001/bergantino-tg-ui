import { createMutation, createQuery } from '@tanstack/svelte-query';

import { queryClient } from '@/lib/query-client';

import {
  adminOverrideWorkspaceBillingPlan,
  createWorkspace,
  createWorkspaceInvite,
  getWorkspaceBilling,
  getWorkspaceBillingPlans,
  getWorkspaceDetail,
  getWorkspaces,
  getWorkspaceUsers,
  updateWorkspace,
} from './requests';
import type {
  AdminWorkspaceBillingPlanRequest,
  CreateWorkspaceInviteRequest,
  UpdateWorkspaceRequest,
  WorkspaceUsersFilters,
} from './types';

export const workspacesQueryKey = ['workspaces'] as const;
export const workspaceDetailQueryKey = (id: string) => ['workspace', id] as const;
export const workspaceBillingQueryKey = (id: string) => ['workspaces', id, 'billing'] as const;
export const workspaceBillingPlansQueryKey = (id: string) => ['workspaces', id, 'billing', 'plans'] as const;
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

export const createWorkspaceBillingQuery = (id: () => string) =>
  createQuery(() => ({
    queryFn: () => getWorkspaceBilling(id()),
    queryKey: workspaceBillingQueryKey(id()),
    staleTime: 30_000,
  }));

export const createWorkspaceBillingPlansQuery = (id: () => string) =>
  createQuery(() => ({
    queryFn: () => getWorkspaceBillingPlans(id()),
    queryKey: workspaceBillingPlansQueryKey(id()),
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

export const createUpdateWorkspaceMutation = (id: () => string) =>
  createMutation(() => ({
    mutationFn: (data: UpdateWorkspaceRequest) => updateWorkspace(id(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceDetailQueryKey(id()) });
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
    },
  }));

export const createAdminOverrideWorkspaceBillingPlanMutation = (id: () => string) =>
  createMutation(() => ({
    mutationFn: (data: AdminWorkspaceBillingPlanRequest) =>
      adminOverrideWorkspaceBillingPlan(id(), data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceBillingQueryKey(id()) }),
        queryClient.invalidateQueries({ queryKey: workspaceBillingPlansQueryKey(id()) }),
        queryClient.invalidateQueries({ queryKey: workspaceDetailQueryKey(id()) }),
        queryClient.invalidateQueries({ queryKey: workspacesQueryKey }),
      ]);
    },
  }));
