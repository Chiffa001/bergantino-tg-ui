import { describe, expect, it } from 'vitest';

import { pluralize } from '../pluralize';

describe('pluralize', () => {
  const groupForms = ['группа', 'группы', 'групп'] as const;

  it('returns singular form', () => {
    expect(pluralize(1, groupForms)).toBe('группа');
    expect(pluralize(21, groupForms)).toBe('группа');
    expect(pluralize(101, groupForms)).toBe('группа');
  });

  it('returns few form', () => {
    expect(pluralize(2, groupForms)).toBe('группы');
    expect(pluralize(4, groupForms)).toBe('группы');
    expect(pluralize(22, groupForms)).toBe('группы');
    expect(pluralize(104, groupForms)).toBe('группы');
  });

  it('returns many form', () => {
    expect(pluralize(0, groupForms)).toBe('групп');
    expect(pluralize(5, groupForms)).toBe('групп');
    expect(pluralize(10, groupForms)).toBe('групп');
    expect(pluralize(11, groupForms)).toBe('групп');
    expect(pluralize(14, groupForms)).toBe('групп');
    expect(pluralize(15, groupForms)).toBe('групп');
    expect(pluralize(20, groupForms)).toBe('групп');
    expect(pluralize(25, groupForms)).toBe('групп');
    expect(pluralize(111, groupForms)).toBe('групп');
    expect(pluralize(114, groupForms)).toBe('групп');
  });

  it('handles negative numbers by absolute value', () => {
    expect(pluralize(-1, groupForms)).toBe('группа');
    expect(pluralize(-2, groupForms)).toBe('группы');
    expect(pluralize(-5, groupForms)).toBe('групп');
  });
});
