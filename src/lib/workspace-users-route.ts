import type { WorkspaceMemberFilter } from '@/lib/workspace-members';

export function buildWorkspaceUsersRoute(
  workspaceId: string,
  filter: WorkspaceMemberFilter,
  search: string,
): string {
  const params = new URLSearchParams();

  if (filter !== 'all') {
    params.set('role', filter);
  }

  if (search) {
    params.set('search', search);
  }

  const query = params.toString();

  return `/workspaces/${workspaceId}/users${query ? `?${query}` : ''}`;
}
