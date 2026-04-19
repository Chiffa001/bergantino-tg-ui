import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearStoredWorkspaceSlug,
  getStoredWorkspaceSlug,
  parseWorkspaceSlugFromStartParam,
  setStoredWorkspaceSlug,
} from '../lib';

describe('parseWorkspaceSlugFromStartParam', () => {
  it('parses prefixed workspace start params', () => {
    expect(parseWorkspaceSlugFromStartParam('workspace_demo-clinic')).toBe('demo-clinic');
    expect(parseWorkspaceSlugFromStartParam('workspace_slug:demo_clinic')).toBe('demo_clinic');
    expect(parseWorkspaceSlugFromStartParam('ws_demo')).toBe('demo');
  });

  it('accepts a plain slug-like start param', () => {
    expect(parseWorkspaceSlugFromStartParam('Demo-Clinic')).toBe('demo-clinic');
  });

  it('ignores invite tokens and invalid values', () => {
    expect(parseWorkspaceSlugFromStartParam('invite_abc123')).toBeNull();
    expect(parseWorkspaceSlugFromStartParam('workspace_')).toBeNull();
    expect(parseWorkspaceSlugFromStartParam('workspace:demo clinic')).toBeNull();
    expect(parseWorkspaceSlugFromStartParam(null)).toBeNull();
  });
});

describe('workspace slug storage', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        clear: () => storage.clear(),
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and returns the normalized workspace slug', () => {
    setStoredWorkspaceSlug(' Demo-Clinic ');

    expect(getStoredWorkspaceSlug()).toBe('demo-clinic');
  });

  it('clears the stored workspace slug', () => {
    setStoredWorkspaceSlug('demo-clinic');
    clearStoredWorkspaceSlug();

    expect(getStoredWorkspaceSlug()).toBeNull();
  });
});
