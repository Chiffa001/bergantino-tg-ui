import { describe, expect, it } from 'vitest';

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
    expect(isWorkspaceMemberFilter('workspace_admin')).toBe(true);
    expect(isWorkspaceMemberFilter('assistant')).toBe(true);
    expect(isWorkspaceMemberFilter('client')).toBe(true);
  });

  it('rejects invalid workspace member filters', () => {
    expect(isWorkspaceMemberFilter('admin')).toBe(false);
    expect(isWorkspaceMemberFilter('')).toBe(false);
    expect(isWorkspaceMemberFilter(null)).toBe(false);
    expect(isWorkspaceMemberFilter(undefined)).toBe(false);
  });

  it('contains expected role labels and colors', () => {
    expect(WORKSPACE_MEMBER_FILTERS).toEqual(['all', 'workspace_admin', 'assistant', 'client']);
    expect(WORKSPACE_MEMBER_FILTER_LABELS.workspace_admin).toBe('Админ');
    expect(WORKSPACE_MEMBER_BADGE_LABELS.workspace_admin).toBe('Admin');
    expect(WORKSPACE_MEMBER_AVATAR_COLORS.assistant).toBe('#f59e0b');
    expect(WORKSPACE_MEMBER_BADGE_COLORS.client).toEqual({
      background: '#f5f5f5',
      color: '#737373',
    });
  });
});
