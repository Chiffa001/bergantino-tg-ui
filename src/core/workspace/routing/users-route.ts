import type { WorkspaceMemberFilter } from '@/core/workspace/members/lib';

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
