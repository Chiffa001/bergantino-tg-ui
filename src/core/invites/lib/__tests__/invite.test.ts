import { describe, expect, it } from 'vitest';

import { ApiStatusError } from '@/shared/api/fetch';

import {
  isInviteRoute,
  mapAcceptInviteError,
  mapInviteDetailError,
  parseInviteTokenFromStartParam,
} from '../invite';

describe('invite helpers', () => {
  it('parses invite token from start_param', () => {
    expect(parseInviteTokenFromStartParam('invite_abc123')).toBe('abc123');
    expect(parseInviteTokenFromStartParam(' invite_token ')).toBe('token');
  });

  it('returns null for invalid start_param values', () => {
    expect(parseInviteTokenFromStartParam('')).toBeNull();
    expect(parseInviteTokenFromStartParam('invite_')).toBeNull();
    expect(parseInviteTokenFromStartParam('workspace_abc123')).toBeNull();
    expect(parseInviteTokenFromStartParam(null)).toBeNull();
  });

  it('matches invite routes', () => {
    expect(isInviteRoute('/invites/abc123')).toBe(true);
    expect(isInviteRoute('/invites/abc123/extra')).toBe(false);
    expect(isInviteRoute('/workspaces/123')).toBe(false);
  });

  it('maps invite detail HTTP errors to UI states', () => {
    expect(mapInviteDetailError(new ApiStatusError(404, 'client_error'))).toBe('not_found');
    expect(mapInviteDetailError(new ApiStatusError(409, 'client_error'))).toBe('used');
    expect(mapInviteDetailError(new ApiStatusError(410, 'client_error'))).toBe('expired');
    expect(mapInviteDetailError(new ApiStatusError(500, 'server_error'))).toBe('error');
  });

  it('maps accept HTTP errors to UI states', () => {
    expect(mapAcceptInviteError(new ApiStatusError(409, 'client_error'))).toBe('already_member');
    expect(mapAcceptInviteError(new ApiStatusError(404, 'client_error'))).toBe('error');
    expect(mapAcceptInviteError(new Error('server_error'))).toBe('error');
  });
});
