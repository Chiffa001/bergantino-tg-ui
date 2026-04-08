export type WorkspaceStatus = 'active' | 'suspended' | 'archived';
export type WorkspaceRole = 'workspace_admin' | 'assistant' | 'client';
export type WorkspaceInviteRole = 'assistant';

export const WORKSPACE_STATUS_LABELS: Record<WorkspaceStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  archived: 'Archived',
};

export const WORKSPACE_PLAN = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export type WorkspacePlan = (typeof WORKSPACE_PLAN)[keyof typeof WORKSPACE_PLAN];

export const WORKSPACE_PLAN_OPTIONS: { value: WorkspacePlan; label: string }[] = [
  { value: WORKSPACE_PLAN.FREE, label: 'Free' },
  { value: WORKSPACE_PLAN.BASIC, label: 'Basic' },
  { value: WORKSPACE_PLAN.PRO, label: 'Pro' },
  { value: WORKSPACE_PLAN.BUSINESS, label: 'Business' },
];

export const WORKSPACE_PLAN_LABELS: Record<WorkspacePlan, string> = Object.fromEntries(
  WORKSPACE_PLAN_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<WorkspacePlan, string>;

// Соответствует WorkspaceOut из API (GET /workspaces)
export type Workspace = {
  id: string;
  title: string;
  slug: string;
  status: WorkspaceStatus;
  plan: WorkspacePlan;
  created_at: string;
  has_bot: boolean;
};

// Соответствует WorkspaceDetailResponse из API (GET /workspaces/{id})
export type WorkspaceMembersCount = Record<WorkspaceRole, number>;

export type WorkspaceDetail = Workspace & {
  fee_rate: string;
  members_count: WorkspaceMembersCount;
  bot_username: string | null;
};

export type WorkspaceUser = {
  id: string;
  full_name: string;
  username: string | null;
  role: WorkspaceRole;
  joined_at: string;
};

export type WorkspaceUsersFilters = {
  role?: WorkspaceRole;
  search?: string;
};

export type CreateWorkspaceRequest = {
  title: string;
  slug: string;
  plan: WorkspacePlan;
};

export type CreateWorkspaceInviteRequest = {
  role: WorkspaceInviteRole;
};

export type UpdateWorkspaceBotRequest = {
  bot_token: string | null;
  bot_username: string | null;
};

export type WorkspaceInvite = {
  id: string;
  token: string;
  role: WorkspaceInviteRole;
  expires_at: string;
  invite_url: string;
};
