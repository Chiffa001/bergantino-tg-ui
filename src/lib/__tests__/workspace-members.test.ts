import { describe, expect, it } from 'vitest';

import { WORKSPACE_ROLE } from '@/api/workspaces/types';

import {
  getWorkspaceMemberInitials,
  isWorkspaceMemberFilter,
  WORKSPACE_MEMBER_AVATAR_COLORS,
  WORKSPACE_MEMBER_BADGE_COLORS,
  WORKSPACE_MEMBER_BADGE_LABELS,
  WORKSPACE_MEMBER_FILTER_LABELS,
  WORKSPACE_MEMBER_FILTERS,
} from '../workspace-members';

describe('workspace-members', () => {
  it('returns initials from first and last name', () => {
    expect(getWorkspaceMemberInitials('Алексей Иванов')).toBe('АИ');
  });

  it('ignores repeated spaces when building initials', () => {
    expect(getWorkspaceMemberInitials('  Мария   Смирнова  ')).toBe('МС');
  });

  it('returns one initial for single-word names', () => {
    expect(getWorkspaceMemberInitials('Платон')).toBe('П');
  });

  it('recognizes valid workspace member filters', () => {
    expect(isWorkspaceMemberFilter('all')).toBe(true);
    expect(isWorkspaceMemberFilter(WORKSPACE_ROLE.WORKSPACE_ADMIN)).toBe(true);
    expect(isWorkspaceMemberFilter(WORKSPACE_ROLE.ASSISTANT)).toBe(true);
    expect(isWorkspaceMemberFilter(WORKSPACE_ROLE.CLIENT)).toBe(true);
  });

  it('rejects invalid workspace member filters', () => {
    expect(isWorkspaceMemberFilter('admin')).toBe(false);
    expect(isWorkspaceMemberFilter('')).toBe(false);
    expect(isWorkspaceMemberFilter(null)).toBe(false);
    expect(isWorkspaceMemberFilter(undefined)).toBe(false);
  });

  it('contains expected role labels and colors', () => {
    expect(WORKSPACE_MEMBER_FILTERS).toEqual([
      'all',
      WORKSPACE_ROLE.WORKSPACE_ADMIN,
      WORKSPACE_ROLE.ASSISTANT,
      WORKSPACE_ROLE.CLIENT,
    ]);
    expect(WORKSPACE_MEMBER_FILTER_LABELS.workspace_admin).toBe('Админ');
    expect(WORKSPACE_MEMBER_BADGE_LABELS.workspace_admin).toBe('Admin');
    expect(WORKSPACE_MEMBER_AVATAR_COLORS.assistant).toBe('#f59e0b');
    expect(WORKSPACE_MEMBER_BADGE_COLORS.client).toEqual({
      background: '#f5f5f5',
      color: '#737373',
    });
  });
});
