import type { WorkspaceBillingPayment } from '@/core/workspace/model/types';
import { formatDate } from '@/shared/lib/format-date';

import { formatPrice } from './formatting';

type BillingHistoryItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  amount: string;
};

export function getWorkspaceBillingHistory(
  payments: WorkspaceBillingPayment[],
): BillingHistoryItem[] {
  return payments.map((payment) => ({
    id: payment.id,
    date: formatDate(payment.paid_at ?? payment.created_at),
    title: payment.description.split('—')[0]?.trim() || 'Платёж',
    subtitle: payment.description,
    amount: formatPrice(Number(payment.amount), payment.currency),
  }));
}
