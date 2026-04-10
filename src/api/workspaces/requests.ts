import { requestJson } from '@/lib/fetch';

import type {
  AdminWorkspaceBillingPlanRequest,
  CreateWorkspaceInviteRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceBilling,
  WorkspaceBillingPlan,
  WorkspaceDetail,
  WorkspaceInvite,
  WorkspaceUser,
  WorkspaceUsersFilters,
} from './types';

export const getWorkspaces = async (): Promise<Workspace[]> => {
  return requestJson<Workspace[]>('/workspaces');
};

export const getWorkspaceDetail = async (id: string): Promise<WorkspaceDetail> => {
  return requestJson<WorkspaceDetail>(`/workspaces/${id}`);
};

export const getWorkspaceUsers = async (
  id: string,
  filters: WorkspaceUsersFilters = {},
): Promise<WorkspaceUser[]> => {
  const params = new URLSearchParams();

  if (filters.role) {
    params.set('role', filters.role);
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  const query = params.toString();

  return requestJson<WorkspaceUser[]>(`/workspaces/${id}/users${query ? `?${query}` : ''}`);
};

export const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
  return requestJson<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateWorkspace = async (id: string, data: UpdateWorkspaceRequest): Promise<WorkspaceDetail> => {
  return requestJson<WorkspaceDetail>(`/workspaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const getWorkspaceBilling = async (id: string): Promise<WorkspaceBilling> => {
  return requestJson<WorkspaceBilling>(`/workspaces/${id}/billing`);
};

export const getWorkspaceBillingPlans = async (id: string): Promise<WorkspaceBillingPlan[]> => {
  return requestJson<WorkspaceBillingPlan[]>(`/workspaces/${id}/billing/plans`);
};

export const adminOverrideWorkspaceBillingPlan = async (
  id: string,
  data: AdminWorkspaceBillingPlanRequest,
): Promise<WorkspaceBilling> => {
  return requestJson<WorkspaceBilling>(`/workspaces/${id}/billing/admin`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const createWorkspaceInvite = async (
  id: string,
  data: CreateWorkspaceInviteRequest,
): Promise<WorkspaceInvite> => {
  return requestJson<WorkspaceInvite>(`/workspaces/${id}/invites`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
