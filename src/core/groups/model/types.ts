export const WORKSPACE_GROUP_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const;

export const WORKSPACE_GROUP_STATUS_LABELS = {
  [WORKSPACE_GROUP_STATUS.ACTIVE]: 'Актуально',
  [WORKSPACE_GROUP_STATUS.PENDING]: 'На рассмотрении',
  [WORKSPACE_GROUP_STATUS.ARCHIVED]: 'Завершено',
} as const;

export type WorkspaceGroupStatus =
  (typeof WORKSPACE_GROUP_STATUS)[keyof typeof WORKSPACE_GROUP_STATUS];

export type WorkspaceGroup = {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  status: WorkspaceGroupStatus;
  is_favorite: boolean;
  created_by_user_id: string | null;
  created_at: string;
};

export type GroupFavoriteResponse = {
  is_favorite: boolean;
};

export type CreateWorkspaceGroupRequest = {
  title: string;
  description?: string | null;
};
