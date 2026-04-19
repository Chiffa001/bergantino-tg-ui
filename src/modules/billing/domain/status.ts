import type { WorkspaceSubscription } from '@/core/workspace/model/types';

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
