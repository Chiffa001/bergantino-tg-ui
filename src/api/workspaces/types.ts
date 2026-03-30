export type WorkspaceStatus = 'active' | 'suspended' | 'archived';

export type WorkspacePlan = 'free' | 'basic' | 'pro' | 'business';

// Соответствует WorkspaceOut из API (GET /workspaces)
export type Workspace = {
  id: string;
  title: string;
  slug: string;
  status: WorkspaceStatus;
  plan: WorkspacePlan;
  created_at: string;
};

// Соответствует WorkspaceDetailResponse из API (GET /workspaces/{id})
export type WorkspaceMembersCount = {
  workspace_admin: number;
  assistant: number;
  client: number;
};

export type WorkspaceDetail = Workspace & {
  fee_rate: string;
  members_count: WorkspaceMembersCount;
};
