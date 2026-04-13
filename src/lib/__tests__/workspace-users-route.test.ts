import { describe, expect, it } from 'vitest';

import { buildWorkspaceUsersRoute } from '../workspace-users-route';

describe('buildWorkspaceUsersRoute', () => {
  it('builds base users route without params', () => {
    expect(buildWorkspaceUsersRoute('workspace-1', 'all', '')).toBe('/workspaces/workspace-1/users');
  });

  it('adds role filter when it is not all', () => {
    expect(buildWorkspaceUsersRoute('workspace-1', 'assistant', '')).toBe(
      '/workspaces/workspace-1/users?role=assistant',
    );
  });

  it('adds search query when present', () => {
    expect(buildWorkspaceUsersRoute('workspace-1', 'all', 'alice')).toBe(
      '/workspaces/workspace-1/users?search=alice',
    );
  });

  it('adds both role and search query in a stable order', () => {
    expect(buildWorkspaceUsersRoute('workspace-1', 'client', 'alice smith')).toBe(
      '/workspaces/workspace-1/users?role=client&search=alice+smith',
    );
  });
});
