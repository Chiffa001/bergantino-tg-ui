import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWorkspaceGroupsPage } from '@/core/groups/hooks/use-workspace-groups-page.svelte';
import type { WorkspaceGroup } from '@/core/groups/model/types';
import { ApiStatusError } from '@/shared/api/fetch';

const mocks = vi.hoisted(() => ({
  favoriteMutation: {
    mutateAsync: vi.fn(),
  },
  groupsQuery: {
    data: [] as WorkspaceGroup[],
    isError: false,
    isPending: false,
    refetch: vi.fn(),
  },
  invalidateQueries: vi.fn(),
  navigate: vi.fn(),
  unfavoriteMutation: {
    mutateAsync: vi.fn(),
  },
}));

vi.mock('@/core/groups/api/queries', () => ({
  createFavoriteGroupMutation: vi.fn(() => mocks.favoriteMutation),
  createUnfavoriteGroupMutation: vi.fn(() => mocks.unfavoriteMutation),
  createWorkspaceGroupsQuery: vi.fn(() => mocks.groupsQuery),
  workspaceGroupsQueryKey: vi.fn((id: string) => ['workspaces', id, 'groups']),
}));

vi.mock('@/shared/lib/query-client', () => ({
  queryClient: {
    invalidateQueries: mocks.invalidateQueries,
  },
}));

vi.mock('@/shared/lib/router', () => ({
  router: {
    navigate: mocks.navigate,
  },
}));

describe('useWorkspaceGroupsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mocks.groupsQuery.data = [];
    mocks.groupsQuery.isError = false;
    mocks.groupsQuery.isPending = false;
    mocks.groupsQuery.refetch = vi.fn();
    mocks.favoriteMutation.mutateAsync = vi.fn();
    mocks.unfavoriteMutation.mutateAsync = vi.fn();
  });

  function createGroup(overrides: Partial<WorkspaceGroup> = {}): WorkspaceGroup {
    return {
      id: 'group-1',
      workspace_id: 'workspace-1',
      title: 'Антон и Настя',
      description: 'Описание',
      status: 'active',
      is_favorite: false,
      created_by_user_id: 'user-1',
      created_at: '2026-01-10T11:00:00Z',
      ...overrides,
    };
  }

  it('filters and sorts groups by favorite and created_at', () => {
    mocks.groupsQuery.data = [
      createGroup({ id: 'group-2', title: 'Бета', created_at: '2026-01-09T11:00:00Z' }),
      createGroup({
        id: 'group-1',
        title: 'Альфа',
        is_favorite: true,
        created_at: '2026-01-08T11:00:00Z',
      }),
      createGroup({ id: 'group-3', title: 'VIP-комната', created_at: '2026-01-11T11:00:00Z' }),
    ];

    const model = useWorkspaceGroupsPage(() => 'workspace-1');

    expect(model.groups.map((group) => group.id)).toEqual(['group-1', 'group-3', 'group-2']);
    expect(model.searchTitle).toBe('3 группы');
  });

  it('applies debounced search', () => {
    mocks.groupsQuery.data = [
      createGroup({ id: 'group-1', title: 'Антон и Настя' }),
      createGroup({ id: 'group-2', title: 'VIP-комната' }),
    ];

    const model = useWorkspaceGroupsPage(() => 'workspace-1');

    model.handleSearchInput({ target: { value: 'VIP' } } as unknown as Event);
    expect(model.debouncedSearch).toBe('');

    vi.advanceTimersByTime(300);

    expect(model.debouncedSearch).toBe('VIP');
    expect(model.groups.map((group) => group.id)).toEqual(['group-2']);
    expect(model.searchTitle).toBe('Найдено 1');
  });

  it('opens and closes search and create modal states', () => {
    const model = useWorkspaceGroupsPage(() => 'workspace-1');
    const input = {
      blur: vi.fn(),
      focus: vi.fn(),
    } as unknown as HTMLInputElement;

    model.openSearch(input);
    vi.runAllTimers();

    expect(model.isSearchOpen).toBe(true);
    expect(input.focus).toHaveBeenCalledOnce();

    model.handleSearchInput({ target: { value: 'query' } } as unknown as Event);
    vi.advanceTimersByTime(300);
    model.closeSearch(input);

    expect(model.isSearchOpen).toBe(false);
    expect(model.searchValue).toBe('');
    expect(model.debouncedSearch).toBe('');
    expect(input.blur).toHaveBeenCalledOnce();

    model.openCreateGroup();
    expect(model.isCreateModalOpen).toBe(true);
    model.closeCreateGroup();
    expect(model.isCreateModalOpen).toBe(false);
  });

  it('optimistically favorites a group and invalidates query on success', async () => {
    mocks.groupsQuery.data = [createGroup({ id: 'group-1', is_favorite: false })];
    mocks.favoriteMutation.mutateAsync = vi.fn().mockResolvedValue({ is_favorite: true });

    const model = useWorkspaceGroupsPage(() => 'workspace-1');

    const promise = model.handleFavoriteToggle(model.groups[0]);
    expect(model.groups[0].is_favorite).toBe(true);

    await promise;

    expect(mocks.favoriteMutation.mutateAsync).toHaveBeenCalledWith('group-1');
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['workspaces', 'workspace-1', 'groups'],
    });
    expect(model.groups[0].is_favorite).toBe(false);
  });

  it('rolls back optimistic favorite on forbidden error', async () => {
    mocks.groupsQuery.data = [createGroup({ id: 'group-1', is_favorite: false })];
    mocks.favoriteMutation.mutateAsync = vi.fn().mockRejectedValue(
      new ApiStatusError(403, 'client_error'),
    );
    const alertSpy = vi.fn();
    vi.stubGlobal('window', { alert: alertSpy });

    const model = useWorkspaceGroupsPage(() => 'workspace-1');

    await model.handleFavoriteToggle(model.groups[0]);

    expect(alertSpy).toHaveBeenCalledWith('Недостаточно прав для работы с этой группой.');
    expect(model.groups[0].is_favorite).toBe(false);
  });
});
