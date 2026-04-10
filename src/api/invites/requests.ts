import { requestJsonWithStatus } from '@/lib/fetch';

import type { AcceptInviteResponse, InviteDetail } from './types';

export const getInvite = async (token: string): Promise<InviteDetail> => {
  return requestJsonWithStatus<InviteDetail>(`/invites/${token}`);
};

export const acceptInvite = async (token: string): Promise<AcceptInviteResponse> => {
  return requestJsonWithStatus<AcceptInviteResponse>(`/invites/${token}/accept`, {
    method: 'POST',
  });
};
