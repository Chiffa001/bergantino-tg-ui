import { describe, expect, it } from 'vitest';

import type { CurrentUser } from '@/core/auth/model/types';
import { WORKSPACE_ROLE } from '@/core/workspace/model/types';

import { canInviteUsers, getAllowedInviteRoles, WORKSPACE_INVITE_ROLES } from '../workspace-invites';

function createUser(overrides: Partial<CurrentUser> = {}): CurrentUser {
  return {
    full_name: 'Test User',
    id: 'user-1',
    is_super_admin: false,
    username: 'test',
    ...overrides,
  };
}

describe('getAllowedInviteRoles', () => {
  it('returns all invite roles for super admin', () => {
    expect(getAllowedInviteRoles(createUser({ is_super_admin: true }), null)).toEqual(
      WORKSPACE_INVITE_ROLES,
    );
  });

  it('returns all invite roles for workspace admin', () => {
    expect(getAllowedInviteRoles(createUser(), WORKSPACE_ROLE.WORKSPACE_ADMIN)).toEqual(
      WORKSPACE_INVITE_ROLES,
    );
  });

  it('returns no invite roles for assistant and client', () => {
    expect(getAllowedInviteRoles(createUser(), WORKSPACE_ROLE.ASSISTANT)).toEqual([]);
    expect(getAllowedInviteRoles(createUser(), WORKSPACE_ROLE.CLIENT)).toEqual([]);
  });
});

describe('canInviteUsers', () => {
  it('returns true when user can create invites', () => {
    expect(canInviteUsers(createUser({ is_super_admin: true }), WORKSPACE_ROLE.CLIENT)).toBe(true);
  });

  it('returns false when user cannot create invites', () => {
    expect(canInviteUsers(createUser(), WORKSPACE_ROLE.CLIENT)).toBe(false);
  });
});
