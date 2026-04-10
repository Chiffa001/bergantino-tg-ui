import type { WorkspaceInviteRole } from '@/api/workspaces/types';

export enum InviteStatus {
  Accepted = 'accepted',
  Expired = 'expired',
  Pending = 'pending',
}

export type InviteDetail = {
  workspace_id: string;
  workspace_title: string;
  role: WorkspaceInviteRole;
  expires_at: string;
  status?: InviteStatus;
};

export type AcceptInviteResponse = {
  workspace_id: string;
};
