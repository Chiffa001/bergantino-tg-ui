import type { CurrentUser } from '@/core/auth/model/types';
import {
  WORKSPACE_ROLE,
  WORKSPACE_ROLE_LABELS,
  type WorkspaceInviteRole,
  type WorkspaceRole,
} from '@/core/workspace/model/types';

export const WORKSPACE_INVITE_ROLES: WorkspaceInviteRole[] = [
  WORKSPACE_ROLE.WORKSPACE_ADMIN,
  WORKSPACE_ROLE.ASSISTANT,
  WORKSPACE_ROLE.CLIENT,
];

export const WORKSPACE_INVITE_ROLE_DESCRIPTIONS: Record<WorkspaceInviteRole, string> = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: 'Управление пространством, оплатой, приглашениями',
  [WORKSPACE_ROLE.ASSISTANT]: 'Работа с проектами, клиентами и событиями',
  [WORKSPACE_ROLE.CLIENT]: 'Просмотр своего прогресса и программы',
};

export function getWorkspaceInviteRoleLabel(role: WorkspaceInviteRole): string {
  return WORKSPACE_ROLE_LABELS[role];
}

export function getAllowedInviteRoles(
  currentUser: CurrentUser | null,
  currentWorkspaceRole: WorkspaceRole | null | undefined,
): WorkspaceInviteRole[] {
  if (currentUser?.is_super_admin || currentWorkspaceRole === WORKSPACE_ROLE.WORKSPACE_ADMIN) {
    return WORKSPACE_INVITE_ROLES;
  }

  return [];
}

export function canInviteUsers(
  currentUser: CurrentUser | null,
  currentWorkspaceRole: WorkspaceRole | null | undefined,
): boolean {
  return getAllowedInviteRoles(currentUser, currentWorkspaceRole).length > 0;
}
