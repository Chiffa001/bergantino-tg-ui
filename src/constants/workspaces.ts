export const WORKSPACE_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
} as const;

export const WORKSPACE_ROLE = {
  ASSISTANT: 'assistant',
  CLIENT: 'client',
  WORKSPACE_ADMIN: 'workspace_admin',
} as const;

export const WORKSPACE_ROLE_LABELS = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: 'Админ',
  [WORKSPACE_ROLE.ASSISTANT]: 'Помощник',
  [WORKSPACE_ROLE.CLIENT]: 'Клиент',
} as const;

export const WORKSPACE_STATUS_LABELS = {
  [WORKSPACE_STATUS.ACTIVE]: 'Active',
  [WORKSPACE_STATUS.SUSPENDED]: 'Suspended',
  [WORKSPACE_STATUS.ARCHIVED]: 'Archived',
} as const;

export const WORKSPACE_PLAN = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export const WORKSPACE_PLAN_OPTIONS = [
  { value: WORKSPACE_PLAN.FREE, label: 'Free' },
  { value: WORKSPACE_PLAN.BASIC, label: 'Basic' },
  { value: WORKSPACE_PLAN.PRO, label: 'Pro' },
  { value: WORKSPACE_PLAN.BUSINESS, label: 'Business' },
] as const;

export const WORKSPACE_PLAN_LABELS = Object.fromEntries(
  WORKSPACE_PLAN_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<(typeof WORKSPACE_PLAN)[keyof typeof WORKSPACE_PLAN], string>;
