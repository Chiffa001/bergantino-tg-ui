import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatDate } from '../format-date';

describe('formatDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats date via Intl.DateTimeFormat with russian locale', () => {
    const format = vi.fn().mockReturnValue('15 янв. 2025 г.');
    const supportedLocalesOf = vi.fn();
    const constructorCalls: unknown[][] = [];

    class MockDateTimeFormat {
      static supportedLocalesOf = supportedLocalesOf;

      constructor(...args: unknown[]) {
        constructorCalls.push(args);
      }

      format = format;
    }

    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      MockDateTimeFormat as unknown as typeof Intl.DateTimeFormat,
    );

    const result = formatDate('2025-01-15T12:00:00.000Z');

    expect(result).toBe('15 янв. 2025 г.');
    expect(constructorCalls).toEqual([[
      'ru',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    ]]);
    expect(supportedLocalesOf).not.toHaveBeenCalled();
    expect(format).toHaveBeenCalledOnce();
    expect(format).toHaveBeenCalledWith(new Date('2025-01-15T12:00:00.000Z'));
  });
});
