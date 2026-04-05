import type { WorkspaceRole } from '@/api/workspaces/types';

export type WorkspaceMemberFilter = 'all' | WorkspaceRole;

export const WORKSPACE_MEMBER_AVATAR_COLORS: Record<WorkspaceRole, string> = {
  workspace_admin: '#4f46e5',
  assistant: '#f59e0b',
  client: '#16a34a',
};

export const WORKSPACE_MEMBER_BADGE_COLORS: Record<WorkspaceRole, { background: string; color: string }> = {
  workspace_admin: { background: '#dcfce7', color: '#16a34a' },
  assistant: { background: '#fef3c7', color: '#d97706' },
  client: { background: '#f5f5f5', color: '#737373' },
};

export const WORKSPACE_MEMBER_BADGE_LABELS: Record<WorkspaceRole, string> = {
  workspace_admin: 'Admin',
  assistant: 'Ассистент',
  client: 'Клиент',
};

export const WORKSPACE_MEMBER_FILTER_LABELS: Record<WorkspaceMemberFilter, string> = {
  all: 'Все',
  workspace_admin: 'Админ',
  assistant: 'Ассистент',
  client: 'Клиент',
};

export const WORKSPACE_MEMBER_FILTERS: WorkspaceMemberFilter[] = [
  'all',
  'workspace_admin',
  'assistant',
  'client',
];

export function getWorkspaceMemberInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function isWorkspaceMemberFilter(value: string | null | undefined): value is WorkspaceMemberFilter {
  return value === 'all' || value === 'workspace_admin' || value === 'assistant' || value === 'client';
}
