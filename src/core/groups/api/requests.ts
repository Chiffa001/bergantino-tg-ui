import { requestJson } from '@/shared/api/fetch';

import type {
  CreateWorkspaceGroupRequest,
  GroupFavoriteResponse,
  WorkspaceGroup,
} from '../model/types';

export const getWorkspaceGroups = async (id: string): Promise<WorkspaceGroup[]> => {
  return requestJson<WorkspaceGroup[]>(`/workspaces/${id}/groups`);
};

export const favoriteGroup = async (groupId: string): Promise<GroupFavoriteResponse> => {
  return requestJson<GroupFavoriteResponse>(`/groups/${groupId}/favorite`, {
    method: 'POST',
  });
};

export const unfavoriteGroup = async (groupId: string): Promise<GroupFavoriteResponse> => {
  return requestJson<GroupFavoriteResponse>(`/groups/${groupId}/favorite`, {
    method: 'DELETE',
  });
};

export const createWorkspaceGroup = async (
  id: string,
  data: CreateWorkspaceGroupRequest,
): Promise<WorkspaceGroup> => {
  return requestJson<WorkspaceGroup>(`/workspaces/${id}/groups`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
