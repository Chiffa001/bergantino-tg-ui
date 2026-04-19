import {
  WORKSPACE_PLAN_LABELS,
  type WorkspaceBilling,
  type WorkspaceBillingPlan,
} from '@/core/workspace/model/types';

import { formatFeeRateValue, formatPrice } from './formatting';

type PlanAccent = 'solid' | 'muted';

export type BillingPlanView = {
  value: WorkspaceBillingPlan['plan'];
  label: string;
  priceLabel: string;
  features: string[];
  participantsLimit: number | null;
  currentUsage: number;
  ratio: number;
  usageLabel: string;
  accent: PlanAccent;
  isCurrent: boolean;
};

export function toBillingPlanView(
  plan: WorkspaceBillingPlan,
  billing?: Pick<WorkspaceBilling, 'fee_rate' | 'limits_usage' | 'plan'>,
): BillingPlanView {
  const priceLabel = plan.price_monthly > 0 ? `${formatPrice(plan.price_monthly)} / мес` : '0 ₽ / мес';
  const participantsLimit = plan.limits.members;
  const currentUsage = billing?.limits_usage.members.current ?? 0;
  const ratio = participantsLimit ? Math.min(currentUsage / participantsLimit, 1) : 1;
  const usageLabel = participantsLimit ? `${currentUsage} / ${participantsLimit}` : `${currentUsage} / ∞`;
  const features = [
    participantsLimit ? `До ${participantsLimit} участников` : 'Безлимит участников',
    plan.limits.projects ? `${plan.limits.projects} проектов` : 'Безлимит проектов',
    plan.limits.crypto ? 'Crypto-оплаты включены' : 'Без crypto оплат',
    plan.plan === 'free'
      ? `Комиссия ${formatFeeRateValue(billing?.fee_rate ?? '0')}%`
      : 'Без комиссии платформы',
  ];

  return {
    value: plan.plan,
    label: WORKSPACE_PLAN_LABELS[plan.plan],
    priceLabel,
    features,
    participantsLimit,
    currentUsage,
    ratio,
    usageLabel,
    accent: plan.price_monthly >= 2490 ? 'solid' : 'muted',
    isCurrent: plan.is_current,
  };
}

export function getCurrentBillingPlan(
  plans: WorkspaceBillingPlan[],
  activePlan: WorkspaceBilling['plan'],
) {
  return plans.find((plan) => plan.is_current) ?? plans.find((plan) => plan.plan === activePlan) ?? null;
}
