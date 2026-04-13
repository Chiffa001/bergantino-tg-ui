import { describe, expect, it } from 'vitest';

import { ApiStatusError } from '../fetch';
import {
  getPlanLimitExceededDetail,
  getPlanLimitExceededMessage,
  hasReachedMembersLimit,
} from '../workspace-invite-limits';

describe('hasReachedMembersLimit', () => {
  it('returns false for unlimited plans', () => {
    expect(hasReachedMembersLimit({ current: 5, max: null })).toBe(false);
  });

  it('returns false when limit is not reached', () => {
    expect(hasReachedMembersLimit({ current: 4, max: 5 })).toBe(false);
  });

  it('returns true when limit is reached', () => {
    expect(hasReachedMembersLimit({ current: 5, max: 5 })).toBe(true);
  });
});

describe('getPlanLimitExceededDetail', () => {
  it('extracts plan limit detail from 403 payload', () => {
    expect(
      getPlanLimitExceededDetail(
        new ApiStatusError(403, 'client_error', {
          detail: { current: 5, limit: 5, plan: 'free' },
          error: 'plan_limit_exceeded',
        }),
      ),
    ).toEqual({ current: 5, limit: 5, plan: 'free' });
  });

  it('returns null for unrelated errors', () => {
    expect(getPlanLimitExceededDetail(new ApiStatusError(400, 'client_error'))).toBeNull();
    expect(getPlanLimitExceededDetail(new Error('boom'))).toBeNull();
  });
});

describe('getPlanLimitExceededMessage', () => {
  it('formats user-facing text', () => {
    expect(getPlanLimitExceededMessage({ current: 5, limit: 5, plan: 'free' })).toBe(
      'В вашем тарифе «Free» максимум 5 участников, все слоты заняты.',
    );
  });
});
