import type { WorkspaceBilling } from '@/core/workspace/model/types';
import { formatDate } from '@/shared/lib/format-date';

import { formatFeeRateValue } from './formatting';

type BillingDetailRow = {
  key: string;
  label: string;
  value: string;
};

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
