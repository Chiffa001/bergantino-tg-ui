export type WorkspaceStatus = 'active' | 'suspended' | 'archived';
export const WORKSPACE_ROLE = {
  ASSISTANT: 'assistant',
  CLIENT: 'client',
  WORKSPACE_ADMIN: 'workspace_admin',
} as const;

export type WorkspaceRole = (typeof WORKSPACE_ROLE)[keyof typeof WORKSPACE_ROLE];
export type WorkspaceInviteRole = typeof WORKSPACE_ROLE.ASSISTANT;

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: 'Админ',
  [WORKSPACE_ROLE.ASSISTANT]: 'Помощник',
  [WORKSPACE_ROLE.CLIENT]: 'Клиент',
};

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
  mini_app_url: string | null;
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
  mini_app_url: string | null;
};

export type UpdateWorkspaceRequest = Partial<{
  title: string;
  status: WorkspaceStatus;
  bot_token: string | null;
  bot_username: string | null;
  mini_app_url: string | null;
}>;

export type WorkspaceBillingStatus =
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'past_due'
  | 'renewal_pending';

export type WorkspaceBillingPeriod = 'monthly' | 'annual';
export type WorkspaceBillingProvider = 'stripe' | 'yokassa' | 'manual';

export type WorkspaceBillingLimitUsage = {
  current: number;
  max: number | null;
};

export type WorkspaceBillingLimitsUsage = {
  members: WorkspaceBillingLimitUsage;
  projects: WorkspaceBillingLimitUsage;
};

export type WorkspaceSubscription = {
  id: string;
  plan: WorkspacePlan;
  billing_period: WorkspaceBillingPeriod;
  status: WorkspaceBillingStatus;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  auto_renew: boolean;
  provider: WorkspaceBillingProvider;
};

export type WorkspaceBilling = {
  plan: WorkspacePlan;
  fee_rate: string;
  subscription: WorkspaceSubscription | null;
  limits_usage: WorkspaceBillingLimitsUsage;
  recent_payments: WorkspaceBillingPayment[];
};

export type WorkspaceBillingPlan = {
  plan: WorkspacePlan;
  price_monthly: number;
  price_annual: number;
  limits: {
    members: number | null;
    projects: number | null;
    crypto: boolean;
  };
  is_current: boolean;
};

export type WorkspaceBillingPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type WorkspaceBillingPayment = {
  id: string;
  amount: number | string;
  currency: 'RUB' | 'USD';
  status: WorkspaceBillingPaymentStatus;
  paid_at: string | null;
  payment_method_last4: string | null;
  description: string;
  created_at: string;
};

export type AdminWorkspaceBillingPlanRequest = {
  plan: WorkspacePlan;
  billing_period: WorkspaceBillingPeriod;
  expires_at?: string | null;
};

export type WorkspaceInvite = {
  id: string;
  token: string;
  role: WorkspaceInviteRole;
  expires_at: string;
  invite_url: string;
};
