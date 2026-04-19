import { describe, expect, it } from 'vitest';

import { toSlug } from '../slug';

describe('toSlug', () => {
  it('converts text to lowercase kebab-case', () => {
    expect(toSlug('My Workspace Name')).toBe('my-workspace-name');
  });

  it('removes unsupported characters', () => {
    expect(toSlug('Team! @ Workspace #1')).toBe('team-workspace-1');
  });

  it('collapses repeated spaces and hyphens', () => {
    expect(toSlug('team   ---   workspace')).toBe('team-workspace');
  });

  it('trims hyphens from both ends', () => {
    expect(toSlug('---team-workspace---')).toBe('team-workspace');
  });

  it('returns empty string when nothing valid remains', () => {
    expect(toSlug('Привет мир')).toBe('');
  });
});
