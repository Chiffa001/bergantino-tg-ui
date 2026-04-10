import { WORKSPACE_ROLE, type WorkspaceRole } from '@/api/workspaces/types';

export type WorkspaceMemberFilter = 'all' | WorkspaceRole;

export const WORKSPACE_MEMBER_AVATAR_COLORS: Record<WorkspaceRole, string> = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: '#4f46e5',
  [WORKSPACE_ROLE.ASSISTANT]: '#f59e0b',
  [WORKSPACE_ROLE.CLIENT]: '#16a34a',
};

export const WORKSPACE_MEMBER_BADGE_COLORS: Record<WorkspaceRole, { background: string; color: string }> = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: { background: '#dcfce7', color: '#16a34a' },
  [WORKSPACE_ROLE.ASSISTANT]: { background: '#fef3c7', color: '#d97706' },
  [WORKSPACE_ROLE.CLIENT]: { background: '#f5f5f5', color: '#737373' },
};

export const WORKSPACE_MEMBER_BADGE_LABELS: Record<WorkspaceRole, string> = {
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: 'Admin',
  [WORKSPACE_ROLE.ASSISTANT]: 'Ассистент',
  [WORKSPACE_ROLE.CLIENT]: 'Клиент',
};

export const WORKSPACE_MEMBER_FILTER_LABELS: Record<WorkspaceMemberFilter, string> = {
  all: 'Все',
  [WORKSPACE_ROLE.WORKSPACE_ADMIN]: 'Админ',
  [WORKSPACE_ROLE.ASSISTANT]: 'Ассистент',
  [WORKSPACE_ROLE.CLIENT]: 'Клиент',
};

export const WORKSPACE_MEMBER_FILTERS: WorkspaceMemberFilter[] = [
  'all',
  WORKSPACE_ROLE.WORKSPACE_ADMIN,
  WORKSPACE_ROLE.ASSISTANT,
  WORKSPACE_ROLE.CLIENT,
];

export function getWorkspaceMemberInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function isWorkspaceMemberFilter(value: string | null | undefined): value is WorkspaceMemberFilter {
  return value != null && WORKSPACE_MEMBER_FILTERS.includes(value as WorkspaceMemberFilter);
}
