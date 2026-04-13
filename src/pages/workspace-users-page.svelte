<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import { onDestroy } from 'svelte';

  import { createWorkspaceBillingQuery, createWorkspaceUsersQuery } from '@/api/workspaces/queries';
  import type { WorkspaceUser, WorkspaceUsersFilters } from '@/api/workspaces/types';
  import IconButton from '@/components/ui/icon-button.svelte';
  import PageHeader from '@/components/ui/page-header.svelte';
  import QueryErrorState from '@/components/ui/query-error-state.svelte';
  import RelatedList from '@/components/ui/related-list.svelte';
  import InviteUserModal from '@/components/workspaces/invite-user-modal.svelte';
  import WorkspaceMemberRow from '@/components/workspaces/workspace-member-row.svelte';
  import SearchIcon from '@/icons/search-icon.svelte';
  import UserPlusIcon from '@/icons/user-plus-icon.svelte';
  import UsersEmptyIcon from '@/icons/users-empty-icon.svelte';
  import { authStore } from '@/lib/auth';
  import { router } from '@/lib/router';
  import { hasReachedMembersLimit } from '@/lib/workspace-invite-limits';
  import { canInviteUsers, getAllowedInviteRoles } from '@/lib/workspace-invites';
  import {
    isWorkspaceMemberFilter,
    WORKSPACE_MEMBER_FILTER_LABELS,
    WORKSPACE_MEMBER_FILTERS,
    type WorkspaceMemberFilter,
  } from '@/lib/workspace-members';
  import { buildWorkspaceUsersRoute } from '@/lib/workspace-users-route';

  type Props = {
    id: string;
    role: string | null;
    search: string | null;
  };

  const props: Props = $props();
  let searchInputElement = $state<HTMLInputElement | undefined>(undefined);
  let searchDebounce: ReturnType<typeof setTimeout> | undefined;
  let isInviteModalOpen = $state(false);

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
  const billingQuery = createWorkspaceBillingQuery(() => props.id);
  const members = $derived(query.data ?? []);
  const currentUser = authStore.getUser();
  const currentWorkspaceRole = $derived(
    currentUser ? members.find((member) => member.id === currentUser.id)?.role ?? null : null,
  );
  const allowedInviteRoles = $derived(getAllowedInviteRoles(currentUser, currentWorkspaceRole));
  const showInviteButton = $derived(canInviteUsers(currentUser, currentWorkspaceRole));
  const inviteLimitReached = $derived(
    hasReachedMembersLimit(billingQuery.data?.limits_usage.members),
  );

  onDestroy(() => {
    clearTimeout(searchDebounce);
  });

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
      router.navigate(buildWorkspaceUsersRoute(props.id, activeFilter, nextSearch), { replace: true });
    }, 300);
  }

  function handleFilterChange(filter: WorkspaceMemberFilter) {
    const search = searchInputElement?.value.trim() ?? normalizedSearch;
    router.navigate(buildWorkspaceUsersRoute(props.id, filter, search));
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
  <PageHeader
    title="Пользователи"
    onback={handleBack}
  >
    {#snippet actions()}
      {#if showInviteButton}
        <IconButton
          ariaLabel={inviteLimitReached ? 'Достигнут лимит участников' : 'Пригласить пользователя'}
          class="add-button"
          disabled={inviteLimitReached}
          title={inviteLimitReached ? 'Достигнут лимит участников' : undefined}
          onclick={() => {
            isInviteModalOpen = true;
          }}
        >
          <UserPlusIcon />
        </IconButton>
      {/if}
    {/snippet}
  </PageHeader>

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
    <QueryErrorState
      title="Не удалось загрузить пользователей"
      onback={handleBack}
      onretry={handleRetry}
    />
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
            <WorkspaceMemberRow {member} />
          {/snippet}
        </RelatedList>
      {/if}
    </div>
  {/if}

  <InviteUserModal
    allowedRoles={allowedInviteRoles}
    isOpen={isInviteModalOpen}
    workspaceId={props.id}
    onClose={() => {
      isInviteModalOpen = false;
    }}
  />
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

  .add-button {
    color: inherit;
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

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
