import {
  WORKSPACE_PLAN_LABELS,
  type WorkspaceBilling,
  type WorkspaceBillingPayment,
  type WorkspaceBillingPlan,
  type WorkspaceSubscription,
} from '@/api/workspaces/types';
import { formatDate } from '@/lib/format-date';

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

type BillingDetailRow = {
  key: string;
  label: string;
  value: string;
};

type BillingHistoryItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  amount: string;
};

function formatFeeRateValue(value: string) {
  const normalized = value.trim();

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return value;
  }

  return normalized.replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1');
}

function formatPrice(amount: number, currency: WorkspaceBillingPayment['currency'] = 'RUB') {
  if (currency === 'USD') {
    return `$${amount}`;
  }

  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}

export function getBillingStatusLabel(status: WorkspaceSubscription['status']) {
  switch (status) {
    case 'cancelled':
      return 'Отменён';
    case 'expired':
      return 'Истёк';
    case 'past_due':
      return 'Просрочен';
    case 'renewal_pending':
      return 'Ожидает продления';
    default:
      return 'Активен';
  }
}

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

export function getCurrentBillingPlan(plans: WorkspaceBillingPlan[], activePlan: WorkspaceBilling['plan']) {
  return plans.find((plan) => plan.is_current) ?? plans.find((plan) => plan.plan === activePlan) ?? null;
}

export function getWorkspaceBillingDetails(
  billing: WorkspaceBilling,
  paymentMethodLast4: string | null,
): BillingDetailRow[] {
  if (!billing.subscription || billing.plan === 'free') {
    return [
      { key: 'next_charge', label: 'Следующее списание', value: 'Подписка не активна' },
      {
        key: 'payment_method',
        label: 'Способ оплаты',
        value: `Комиссия ${formatFeeRateValue(billing.fee_rate)}%`,
      },
      { key: 'autopay', label: 'Автопродление', value: 'Выключено' },
    ];
  }

  return [
    {
      key: 'next_charge',
      label: 'Следующее списание',
      value: billing.subscription.expires_at ? formatDate(billing.subscription.expires_at) : 'Не указано',
    },
    {
      key: 'payment_method',
      label: 'Способ оплаты',
      value: paymentMethodLast4 ? `•••• ${paymentMethodLast4}` : 'Не привязан',
    },
    {
      key: 'autopay',
      label: 'Автопродление',
      value: billing.subscription.auto_renew ? 'Включено' : 'Выключено',
    },
  ];
}

export function getWorkspaceBillingHistory(payments: WorkspaceBillingPayment[]): BillingHistoryItem[] {
  return payments.map((payment) => ({
    id: payment.id,
    date: formatDate(payment.paid_at ?? payment.created_at),
    title: payment.description.split('—')[0]?.trim() || 'Платёж',
    subtitle: payment.description,
    amount: formatPrice(Number(payment.amount), payment.currency),
  }));
}
