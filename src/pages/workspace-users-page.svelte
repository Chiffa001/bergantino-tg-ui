<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import { onDestroy } from 'svelte';

  import { createWorkspaceUsersQuery } from '@/api/workspaces/queries';
  import type { WorkspaceUser, WorkspaceUsersFilters } from '@/api/workspaces/types';
  import Button from '@/components/ui/button.svelte';
  import RelatedList from '@/components/ui/related-list.svelte';
  import ChevronLeftIcon from '@/icons/chevron-left-icon.svelte';
  import SearchIcon from '@/icons/search-icon.svelte';
  import UserPlusIcon from '@/icons/user-plus-icon.svelte';
  import UsersEmptyIcon from '@/icons/users-empty-icon.svelte';
  import { router } from '@/lib/router';
  import {
    getWorkspaceMemberInitials,
    isWorkspaceMemberFilter,
    WORKSPACE_MEMBER_AVATAR_COLORS,
    WORKSPACE_MEMBER_BADGE_COLORS,
    WORKSPACE_MEMBER_FILTER_LABELS,
    WORKSPACE_MEMBER_FILTERS,
    type WorkspaceMemberFilter,
  } from '@/lib/workspace-members';

  type Props = {
    id: string;
    role: string | null;
    search: string | null;
  };

  const props: Props = $props();
  let searchInputElement = $state<HTMLInputElement | undefined>(undefined);
  let searchDebounce: ReturnType<typeof setTimeout> | undefined;

  const activeFilter = $derived(
    isWorkspaceMemberFilter(props.role) && props.role !== 'all' ? props.role : 'all',
  );

  const normalizedSearch = $derived(props.search?.trim() ?? '');
  const filters = $derived.by<WorkspaceUsersFilters>(() => {
    const nextFilters: WorkspaceUsersFilters = {};

    if (activeFilter !== 'all') {
      nextFilters.role = activeFilter;
    }

    if (normalizedSearch) {
      nextFilters.search = normalizedSearch;
    }

    return nextFilters;
  });

  const query = createWorkspaceUsersQuery(
    () => props.id,
    () => filters,
  );
  const members = $derived(query.data ?? []);

  onDestroy(() => {
    clearTimeout(searchDebounce);
  });

  function buildUsersRoute(filter: WorkspaceMemberFilter, search: string): string {
    const params: string[] = [];

    if (filter !== 'all') {
      params.push(`role=${encodeURIComponent(filter)}`);
    }

    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    return `/workspaces/${props.id}/users${params.length > 0 ? `?${params.join('&')}` : ''}`;
  }

  function handleBack() {
    router.navigate(`/workspaces/${props.id}`);
  }

  function handleRetry() {
    query.refetch();
  }

  function handleSearchInput(event: Event) {
    const nextSearch = (event.target as HTMLInputElement).value.trim();

    if (nextSearch === normalizedSearch) {
      return;
    }

    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      router.navigate(buildUsersRoute(activeFilter, nextSearch), { replace: true });
    }, 300);
  }

  function handleFilterChange(filter: WorkspaceMemberFilter) {
    const search = searchInputElement?.value.trim() ?? normalizedSearch;
    router.navigate(buildUsersRoute(filter, search));
  }

  const emptyStateCopy = $derived.by(() => {
    if (activeFilter !== 'all' || normalizedSearch) {
      return {
        description: 'Попробуйте изменить поиск или сбросить фильтры.',
        title: 'Ничего не найдено',
      };
    }

    return {
      description: 'Пригласите участников в рабочее пространство, чтобы начать совместную работу.',
      title: 'Нет пользователей',
    };
  });
</script>

<section class="workspace-users-page">
  <header class="page-header">
    <button
      class="back-button"
      onclick={handleBack}
      aria-label="Назад"
    >
      <ChevronLeftIcon />
    </button>

    <div class="header-copy">
      <Typography
        variant="h2"
        color="#0a0a0a"
      >
        Пользователи
      </Typography>
    </div>

    <button
      class="add-button"
      type="button"
      aria-label="Добавить пользователя"
    >
      <UserPlusIcon />
    </button>
  </header>

  {#if query.isPending}
    <div class="stack">
      <div class="search-skeleton"></div>
      <div class="filters-skeleton">
        {#each [0, 1, 2, 3] as index (index)}
          <div class="filter-skeleton"></div>
        {/each}
      </div>
      <div class="counter-skeleton"></div>
      <div class="list-skeleton"></div>
    </div>
  {:else if query.isError}
    <div class="error-state">
      <Typography
        variant="title"
        color="#0a0a0a"
      >
        Не удалось загрузить пользователей
      </Typography>

      <Typography
        variant="body"
        color="#737373"
      >
        Проверьте соединение и повторите попытку.
      </Typography>

      <div class="error-actions">
        <Button
          variant="secondary"
          onclick={handleBack}
        >
          Назад
        </Button>

        <Button onclick={handleRetry}>
          Повторить
        </Button>
      </div>
    </div>
  {:else}
    <div class="stack">
      <div class="search-box">
        <label
          class="search-input-wrap"
          for="users-search"
        >
          <span
            class="search-icon"
            aria-hidden="true"
          >
            <SearchIcon />
          </span>

          <input
            bind:this={searchInputElement}
            id="users-search"
            class="search-input"
            type="search"
            placeholder="Поиск по имени или роли..."
            value={props.search ?? ''}
            oninput={handleSearchInput}
            autocomplete="off"
          />
        </label>
      </div>

      <div class="filters">
        {#each WORKSPACE_MEMBER_FILTERS as filter (filter)}
          <button
            class={`filter-chip ${activeFilter === filter ? 'filter-chip--active' : ''}`.trim()}
            type="button"
            onclick={() => handleFilterChange(filter)}
          >
            <Typography
              variant="caption"
              color={activeFilter === filter ? '#ffffff' : '#171717'}
            >
              {WORKSPACE_MEMBER_FILTER_LABELS[filter]}
            </Typography>
          </button>
        {/each}
      </div>

      <Typography
        variant="caption"
        color="#737373"
      >
        {members.length} пользователей
      </Typography>

      {#if members.length === 0}
        <div class="empty-state">
          <div class="empty-state-icon">
            <UsersEmptyIcon size={32} />
          </div>

          <Typography
            variant="title"
            color="#171717"
          >
            {emptyStateCopy.title}
          </Typography>

          <Typography
            variant="body"
            color="#737373"
          >
            {emptyStateCopy.description}
          </Typography>
        </div>
      {:else}
        <RelatedList
          items={members}
          getKey={(member) => member.id}
          class="members-list"
        >
          {#snippet children(member: WorkspaceUser)}
            <div class="member-row">
              <div
                class="member-avatar"
                style={`background:${WORKSPACE_MEMBER_AVATAR_COLORS[member.role]};`}
                aria-hidden="true"
              >
                <Typography
                  variant="overline"
                  color="#ffffff"
                >
                  {getWorkspaceMemberInitials(member.full_name)}
                </Typography>
              </div>

              <div class="member-copy">
                <Typography
                  variant="body"
                  color="#171717"
                >
                  {member.full_name}
                </Typography>

                <Typography
                  variant="caption"
                  color="#737373"
                >
                  {member.username ?? 'Без username'}
                </Typography>
              </div>

              <span
                class="member-badge"
                style={`background:${WORKSPACE_MEMBER_BADGE_COLORS[member.role].background};color:${WORKSPACE_MEMBER_BADGE_COLORS[member.role].color};`}
              >
                <Typography
                  variant="overline"
                  color="currentColor"
                >
                  {WORKSPACE_MEMBER_FILTER_LABELS[member.role]}
                </Typography>
              </span>
            </div>
          {/snippet}
        </RelatedList>
      {/if}
    </div>
  {/if}
</section>

<style>
  .workspace-users-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 10px;
    padding: 14px 8px 20px;
    background: #fafafa;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
  }

  .header-copy {
    min-width: 0;
    flex: 1;
  }

  .header-copy :global(h2) {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .back-button,
  .add-button {
    display: flex;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .stack {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 14px;
    overflow: auto;
    padding: 0 8px 8px;
  }

  .search-box {
    display: flex;
  }

  .search-input-wrap {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    background: #fafafa;
    padding: 10px 12px;
  }

  .search-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }

  .search-input {
    width: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    color: #171717;
    font: inherit;
    font-size: 14px;
    outline: none;
  }

  .search-input::placeholder {
    color: #737373;
  }

  .filters {
    display: flex;
    gap: 8px;
    overflow: auto;
    padding-bottom: 2px;
  }

  .filter-chip {
    display: inline-flex;
    width: fit-content;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: #f5f5f5;
    padding: 6px 12px;
    cursor: pointer;
  }

  .filter-chip--active {
    background: #171717;
  }

  .filter-chip :global(p) {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
  }

  .members-list {
    min-height: 0;
  }

  .member-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 12px;
  }

  .member-avatar {
    display: flex;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .member-avatar :global(p) {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
  }

  .member-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .member-copy :global(p) {
    margin: 0;
  }

  .member-copy :global(p:first-child) {
    font-size: 14px;
  }

  .member-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 999px;
    padding: 3px 8px;
    text-align: center;
  }

  .empty-state {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px 16px;
    text-align: center;
  }

  .empty-state :global(p) {
    margin: 0;
  }

  .empty-state-icon {
    display: flex;
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #eef2ff;
    margin-bottom: 6px;
  }

  .empty-state :global(p:first-of-type) {
    font-size: 16px;
    font-weight: 600;
  }

  .empty-state :global(p:last-of-type) {
    max-width: 230px;
    line-height: 1.35;
  }

  .search-skeleton,
  .filter-skeleton,
  .counter-skeleton,
  .list-skeleton {
    position: relative;
    overflow: hidden;
    background: #f1f5f9;
  }

  .search-skeleton::after,
  .filter-skeleton::after,
  .counter-skeleton::after,
  .list-skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.75), transparent);
    transform: translateX(-100%);
    animation: shimmer 1.2s infinite;
  }

  .search-skeleton {
    height: 42px;
    border-radius: 10px;
  }

  .filters-skeleton {
    display: flex;
    gap: 8px;
  }

  .filter-skeleton {
    width: 74px;
    height: 28px;
    border-radius: 999px;
  }

  .counter-skeleton {
    width: 118px;
    height: 16px;
    border-radius: 8px;
  }

  .list-skeleton {
    height: 332px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .error-state {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 24px 20px;
  }

  .error-state :global(p) {
    margin: 0;
  }

  .error-actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
  }

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
