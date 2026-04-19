import type { WorkspaceBillingPayment } from '@/core/workspace/model/types';

export function formatFeeRateValue(value: string) {
  const normalized = value.trim();

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return value;
  }

  return normalized.replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1');
}

export function formatPrice(
  amount: number,
  currency: WorkspaceBillingPayment['currency'] = 'RUB',
) {
  if (currency === 'USD') {
    return `$${amount}`;
  }

  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}
