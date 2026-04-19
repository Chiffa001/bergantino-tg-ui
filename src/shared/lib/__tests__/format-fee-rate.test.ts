import { describe, expect, it } from 'vitest';

import { formatFeeRate } from '../format-fee-rate';

describe('formatFeeRate', () => {
  it('adds percent sign to numeric string', () => {
    expect(formatFeeRate('12')).toBe('12%');
  });

  it('normalizes decimal numeric string', () => {
    expect(formatFeeRate('1.50')).toBe('1.5%');
  });

  it('returns source value when string is not numeric', () => {
    expect(formatFeeRate('free')).toBe('free');
  });
});
