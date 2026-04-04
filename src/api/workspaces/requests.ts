import { requestJson } from '@/lib/fetch';

import type { CreateWorkspaceRequest, Workspace, WorkspaceDetail } from './types';

export const getWorkspaces = async (): Promise<Workspace[]> => {
  return requestJson<Workspace[]>('/workspaces');
};

export const getWorkspaceDetail = async (id: string): Promise<WorkspaceDetail> => {
  return requestJson<WorkspaceDetail>(`/workspaces/${id}`);
};

export const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
  return requestJson<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
