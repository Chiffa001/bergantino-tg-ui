import {
  WORKSPACE_PLAN_LABELS,
  type WorkspaceBilling,
  type WorkspacePlan,
} from '@/core/workspace/model/types';
import { ApiStatusError } from '@/shared/api/fetch';

export type PlanLimitExceededDetail = {
  current: number;
  limit: number;
  plan: WorkspacePlan;
};

type PlanLimitExceededPayload = {
  detail?: PlanLimitExceededDetail;
  error?: string;
};

export function hasReachedMembersLimit(
  membersUsage: WorkspaceBilling['limits_usage']['members'] | null | undefined,
): boolean {
  if (!membersUsage || membersUsage.max === null) {
    return false;
  }

  return membersUsage.current >= membersUsage.max;
}

export function getPlanLimitExceededDetail(error: unknown): PlanLimitExceededDetail | null {
  if (!(error instanceof ApiStatusError) || error.status !== 403) {
    return null;
  }

  const payload = error.payload as PlanLimitExceededPayload | undefined;

  if (payload?.error !== 'plan_limit_exceeded' || !payload.detail) {
    return null;
  }

  return payload.detail;
}

export function getPlanLimitExceededMessage(detail: PlanLimitExceededDetail): string {
  return `В вашем тарифе «${WORKSPACE_PLAN_LABELS[detail.plan]}» максимум ${detail.limit} участников, все слоты заняты.`;
}
