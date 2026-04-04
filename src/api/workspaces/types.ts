export type WorkspaceStatus = 'active' | 'suspended' | 'archived';

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
