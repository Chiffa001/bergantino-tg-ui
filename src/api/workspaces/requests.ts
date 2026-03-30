import { requestJson } from '@/lib/fetch';

import type { CreateWorkspaceRequest, Workspace } from './types';

export const getWorkspaces = async (): Promise<Workspace[]> => {
  return requestJson<Workspace[]>('/workspaces');
};

export const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
  return requestJson<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
