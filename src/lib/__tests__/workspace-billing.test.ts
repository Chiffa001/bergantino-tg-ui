import { describe, expect, it, vi } from 'vitest';

import type {
  WorkspaceBilling,
  WorkspaceBillingPayment,
  WorkspaceBillingPlan,
} from '@/api/workspaces/types';

vi.mock('../format-date', () => ({
  formatDate: vi.fn((value: string) => `formatted:${value}`),
}));

import {
  getBillingStatusLabel,
  getCurrentBillingPlan,
  getWorkspaceBillingDetails,
  getWorkspaceBillingHistory,
  toBillingPlanView,
} from '../workspace-billing';

const proPlan: WorkspaceBillingPlan = {
  plan: 'pro',
  price_monthly: 2490,
  price_annual: 24900,
  limits: {
    members: 50,
    projects: null,
    crypto: true,
  },
  is_current: true,
};

const freePlan: WorkspaceBillingPlan = {
  plan: 'free',
  price_monthly: 0,
  price_annual: 0,
  limits: {
    members: 5,
    projects: 1,
    crypto: false,
  },
  is_current: false,
};

const proBilling: WorkspaceBilling = {
  plan: 'pro',
  fee_rate: '5.0',
  subscription: {
    id: 'sub_1',
    plan: 'pro',
    billing_period: 'monthly',
    status: 'active',
    started_at: '2025-03-01T00:00:00Z',
    expires_at: '2025-04-01T00:00:00Z',
    cancelled_at: null,
    auto_renew: true,
    provider: 'manual',
  },
  limits_usage: {
    members: { current: 35, max: 50 },
    projects: { current: 6, max: null },
  },
  recent_payments: [],
};

const freeBilling: WorkspaceBilling = {
  plan: 'free',
  fee_rate: '5.0',
  subscription: null,
  limits_usage: {
    members: { current: 4, max: 5 },
    projects: { current: 1, max: 1 },
  },
  recent_payments: [],
};

describe('getBillingStatusLabel', () => {
  it('returns russian labels for known statuses', () => {
    expect(getBillingStatusLabel('active')).toBe('Активен');
    expect(getBillingStatusLabel('cancelled')).toBe('Отменён');
    expect(getBillingStatusLabel('expired')).toBe('Истёк');
    expect(getBillingStatusLabel('past_due')).toBe('Просрочен');
    expect(getBillingStatusLabel('renewal_pending')).toBe('Ожидает продления');
  });
});

describe('toBillingPlanView', () => {
  it('maps paid plan data to UI view model', () => {
    expect(toBillingPlanView(proPlan, proBilling)).toEqual({
      value: 'pro',
      label: 'Pro',
      priceLabel: '2 490 ₽ / мес',
      features: [
        'До 50 участников',
        'Безлимит проектов',
        'Crypto-оплаты включены',
        'Без комиссии платформы',
      ],
      participantsLimit: 50,
      currentUsage: 35,
      ratio: 0.7,
      usageLabel: '35 / 50',
      accent: 'solid',
      isCurrent: true,
    });
  });

  it('maps free plan with fee and finite limits', () => {
    expect(toBillingPlanView(freePlan, freeBilling)).toEqual({
      value: 'free',
      label: 'Free',
      priceLabel: '0 ₽ / мес',
      features: ['До 5 участников', '1 проектов', 'Без crypto оплат', 'Комиссия 5%'],
      participantsLimit: 5,
      currentUsage: 4,
      ratio: 0.8,
      usageLabel: '4 / 5',
      accent: 'muted',
      isCurrent: false,
    });
  });
});

describe('getCurrentBillingPlan', () => {
  it('prefers explicitly current plan', () => {
    expect(getCurrentBillingPlan([freePlan, proPlan], 'free')).toBe(proPlan);
  });

  it('falls back to active plan code when no item is marked current', () => {
    const plans = [
      { ...freePlan, is_current: false },
      { ...proPlan, is_current: false },
    ];

    expect(getCurrentBillingPlan(plans, 'pro')).toEqual(plans[1]);
  });

  it('returns null when no matching plan exists', () => {
    expect(getCurrentBillingPlan([], 'pro')).toBeNull();
  });
});

describe('getWorkspaceBillingDetails', () => {
  it('builds free-tier details using fee rate', () => {
    expect(getWorkspaceBillingDetails(freeBilling, null)).toEqual([
      { key: 'next_charge', label: 'Следующее списание', value: 'Подписка не активна' },
      { key: 'payment_method', label: 'Способ оплаты', value: 'Комиссия 5%' },
      { key: 'autopay', label: 'Автопродление', value: 'Выключено' },
    ]);
  });

  it('trims trailing zeros for fractional fee rate', () => {
    const billing: WorkspaceBilling = {
      ...freeBilling,
      fee_rate: '0.0300',
    };

    expect(getWorkspaceBillingDetails(billing, null)).toEqual([
      { key: 'next_charge', label: 'Следующее списание', value: 'Подписка не активна' },
      { key: 'payment_method', label: 'Способ оплаты', value: 'Комиссия 0.03%' },
      { key: 'autopay', label: 'Автопродление', value: 'Выключено' },
    ]);
    expect(toBillingPlanView(freePlan, billing).features.at(-1)).toBe('Комиссия 0.03%');
  });

  it('builds paid-plan details with formatted expiry and card mask', () => {
    expect(getWorkspaceBillingDetails(proBilling, '4242')).toEqual([
      {
        key: 'next_charge',
        label: 'Следующее списание',
        value: 'formatted:2025-04-01T00:00:00Z',
      },
      { key: 'payment_method', label: 'Способ оплаты', value: '•••• 4242' },
      { key: 'autopay', label: 'Автопродление', value: 'Включено' },
    ]);
  });
});

describe('getWorkspaceBillingHistory', () => {
  it('formats payment history for UI', () => {
    const payments: WorkspaceBillingPayment[] = [
      {
        id: 'pay_1',
        amount: '2490.00',
        currency: 'RUB',
        status: 'paid',
        paid_at: '2025-03-01T00:00:00Z',
        payment_method_last4: '4242',
        description: 'Pro — ежемесячно',
        created_at: '2025-03-01T00:00:00Z',
      },
      {
        id: 'pay_2',
        amount: 10,
        currency: 'USD',
        status: 'paid',
        paid_at: null,
        payment_method_last4: null,
        description: 'Business — annual',
        created_at: '2025-02-01T00:00:00Z',
      },
    ];

    expect(getWorkspaceBillingHistory(payments)).toEqual([
      {
        id: 'pay_1',
        date: 'formatted:2025-03-01T00:00:00Z',
        title: 'Pro',
        subtitle: 'Pro — ежемесячно',
        amount: '2 490 ₽',
      },
      {
        id: 'pay_2',
        date: 'formatted:2025-02-01T00:00:00Z',
        title: 'Business',
        subtitle: 'Business — annual',
        amount: '$10',
      },
    ]);
  });
});
