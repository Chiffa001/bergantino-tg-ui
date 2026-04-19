import { describe, expect, it } from 'vitest';

import { formatInviteExpirationDays, getDaysUntilExpiration } from '../invite-expiration';

describe('invite-expiration', () => {
  const now = new Date('2026-04-06T12:00:00.000Z').getTime();

  it('counts full remaining days with ceil', () => {
    expect(getDaysUntilExpiration('2026-04-13T12:00:00.000Z', now)).toBe(7);
    expect(getDaysUntilExpiration('2026-04-07T00:00:01.000Z', now)).toBe(1);
  });

  it('returns zero for expired dates', () => {
    expect(getDaysUntilExpiration('2026-04-06T12:00:00.000Z', now)).toBe(0);
    expect(getDaysUntilExpiration('2026-04-05T12:00:00.000Z', now)).toBe(0);
  });

  it('returns zero for invalid dates', () => {
    expect(getDaysUntilExpiration('not-a-date', now)).toBe(0);
  });

  it('formats russian day labels', () => {
    expect(formatInviteExpirationDays('2026-04-07T12:00:00.000Z', now)).toBe('1 день');
    expect(formatInviteExpirationDays('2026-04-08T12:00:00.000Z', now)).toBe('2 дня');
    expect(formatInviteExpirationDays('2026-04-11T12:00:00.000Z', now)).toBe('5 дней');
    expect(formatInviteExpirationDays('2026-04-13T12:00:00.000Z', now)).toBe('7 дней');
  });
});
