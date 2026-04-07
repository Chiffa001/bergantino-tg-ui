import { requestJson } from '@/lib/fetch';

import type {
  CreateWorkspaceInviteRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceBotRequest,
  Workspace,
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

export const updateWorkspaceBot = async (
  id: string,
  data: UpdateWorkspaceBotRequest,
): Promise<WorkspaceDetail> => {
  return requestJson<WorkspaceDetail>(`/workspaces/${id}`, {
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
