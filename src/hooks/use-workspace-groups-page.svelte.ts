import {
  createFavoriteGroupMutation,
  createUnfavoriteGroupMutation,
  createWorkspaceGroupsQuery,
  workspaceGroupsQueryKey,
} from '@/api/workspaces/queries';
import type { WorkspaceGroup } from '@/api/workspaces/types';
import { ApiStatusError } from '@/lib/fetch';
import { pluralize } from '@/lib/pluralize';
import { queryClient } from '@/lib/query-client';
import { router } from '@/lib/router';

type WorkspaceIdAccessor = () => string;

export function useWorkspaceGroupsPage(workspaceId: WorkspaceIdAccessor) {
  let searchDebounce: ReturnType<typeof setTimeout> | undefined;
  let isSearchOpen = $state(false);
  let isCreateModalOpen = $state(false);
  let searchValue = $state('');
  let debouncedSearch = $state('');
  let optimisticFavorites = $state<Record<string, boolean>>({});

  const query = createWorkspaceGroupsQuery(workspaceId);
  const favoriteMutation = createFavoriteGroupMutation();
  const unfavoriteMutation = createUnfavoriteGroupMutation();

  const groups = $derived.by(() => {
    const baseGroups = query.data ?? [];
    const normalizedSearch = debouncedSearch.trim().toLocaleLowerCase('ru');
    const groupsWithFavoriteState = baseGroups.map((group) => ({
      ...group,
      is_favorite: optimisticFavorites[group.id] ?? group.is_favorite,
    }));
    const filteredGroups = normalizedSearch
      ? groupsWithFavoriteState.filter((group) =>
        group.title.toLocaleLowerCase('ru').includes(normalizedSearch),
      )
      : groupsWithFavoriteState;

    return [...filteredGroups].sort((left, right) => {
      if (left.is_favorite !== right.is_favorite) {
        return left.is_favorite ? -1 : 1;
      }

      const leftDate = Date.parse(left.created_at);
      const rightDate = Date.parse(right.created_at);

      if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate) && leftDate !== rightDate) {
        return rightDate - leftDate;
      }

      return left.title.localeCompare(right.title, 'ru');
    });
  });

  const searchTitle = $derived(
    debouncedSearch
      ? `Найдено ${groups.length}`
      : `${groups.length} ${pluralize(groups.length, ['группа', 'группы', 'групп'])}`,
  );

  function cleanup() {
    clearTimeout(searchDebounce);
  }

  function handleBack() {
    router.navigate('/');
  }

  function handleRetry() {
    query.refetch();
  }

  function handleSearchInput(event: Event) {
    searchValue = (event.target as HTMLInputElement).value;

    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      debouncedSearch = searchValue.trim();
    }, 300);
  }

  function openSearch(input?: HTMLInputElement) {
    isSearchOpen = true;

    setTimeout(() => {
      input?.focus();
    }, 0);
  }

  function closeSearch(input?: HTMLInputElement) {
    isSearchOpen = false;
    input?.blur();
    searchValue = '';
    debouncedSearch = '';
  }

  function openCreateGroup() {
    isCreateModalOpen = true;
  }

  function closeCreateGroup() {
    isCreateModalOpen = false;
  }

  async function handleFavoriteToggle(group: WorkspaceGroup) {
    const nextIsFavorite = !group.is_favorite;

    optimisticFavorites = {
      ...optimisticFavorites,
      [group.id]: nextIsFavorite,
    };

    try {
      if (nextIsFavorite) {
        await favoriteMutation.mutateAsync(group.id);
      } else {
        await unfavoriteMutation.mutateAsync(group.id);
      }

      await queryClient.invalidateQueries({ queryKey: workspaceGroupsQueryKey(workspaceId()) });

      const nextOptimisticFavorites = { ...optimisticFavorites };
      delete nextOptimisticFavorites[group.id];
      optimisticFavorites = nextOptimisticFavorites;
    } catch (error) {
      const nextOptimisticFavorites = { ...optimisticFavorites };
      delete nextOptimisticFavorites[group.id];
      optimisticFavorites = nextOptimisticFavorites;

      if (error instanceof ApiStatusError && error.status === 403) {
        window.alert('Недостаточно прав для работы с этой группой.');
        return;
      }

      window.alert('Не удалось обновить избранное. Попробуйте ещё раз.');
    }
  }

  return {
    cleanup,
    closeCreateGroup,
    closeSearch,
    favoriteMutation,
    handleBack,
    handleFavoriteToggle,
    handleRetry,
    handleSearchInput,
    openCreateGroup,
    openSearch,
    query,
    unfavoriteMutation,
    get debouncedSearch() {
      return debouncedSearch;
    },
    get groups() {
      return groups;
    },
    get isCreateModalOpen() {
      return isCreateModalOpen;
    },
    get isSearchOpen() {
      return isSearchOpen;
    },
    get searchTitle() {
      return searchTitle;
    },
    get searchValue() {
      return searchValue;
    },
  };
}
