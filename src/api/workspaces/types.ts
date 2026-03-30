export type WorkspaceStatus = 'active' | 'suspended' | 'archived';

export const WORKSPACE_PLAN = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export type WorkspacePlan = (typeof WORKSPACE_PLAN)[keyof typeof WORKSPACE_PLAN];

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

export type CreateWorkspaceRequest = {
  title: string;
  slug: string;
  plan: WorkspacePlan;
};
