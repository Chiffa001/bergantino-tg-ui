import {
  WORKSPACE_PLAN,
  WORKSPACE_PLAN_LABELS,
  WORKSPACE_PLAN_OPTIONS,
  WORKSPACE_ROLE,
  WORKSPACE_ROLE_LABELS,
  WORKSPACE_STATUS,
  WORKSPACE_STATUS_LABELS,
} from '@/constants/workspaces';

export {
  WORKSPACE_PLAN,
  WORKSPACE_PLAN_LABELS,
  WORKSPACE_PLAN_OPTIONS,
  WORKSPACE_ROLE,
  WORKSPACE_ROLE_LABELS,
  WORKSPACE_STATUS,
  WORKSPACE_STATUS_LABELS,
};

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

export type WorkspaceStatus = (typeof WORKSPACE_STATUS)[keyof typeof WORKSPACE_STATUS];
export type WorkspaceGroupStatus =
  (typeof WORKSPACE_GROUP_STATUS)[keyof typeof WORKSPACE_GROUP_STATUS];

export type WorkspaceRole = (typeof WORKSPACE_ROLE)[keyof typeof WORKSPACE_ROLE];
export type WorkspaceInviteRole = WorkspaceRole;

export type WorkspacePlan = (typeof WORKSPACE_PLAN)[keyof typeof WORKSPACE_PLAN];

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

export type WorkspaceUsersFilters = {
  role?: WorkspaceRole;
  search?: string;
};

export type GroupFavoriteResponse = {
  is_favorite: boolean;
};

export type CreateWorkspaceGroupRequest = {
  title: string;
  description?: string | null;
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
