<script lang="ts">
  import {
    Typography,
  } from '@chiffa001/tg-svelte-ui';
  import { onDestroy } from 'svelte';

  import CreateGroupModal from '@/core/groups/components/create-group-modal.svelte';
  import { useWorkspaceGroupsPage } from '@/core/groups/hooks/use-workspace-groups-page.svelte';
  import {
    WORKSPACE_GROUP_STATUS_LABELS,
    type WorkspaceGroup,
  } from '@/core/groups/model/types';
  import QueryErrorState from '@/shared/components/error/query-error-state.svelte';
  import Button from '@/shared/components/ui/button.svelte';
  import IconButton from '@/shared/components/ui/icon-button.svelte';
  import PageHeader from '@/shared/components/ui/page-header.svelte';
  import PlusIcon from '@/shared/icons/plus-icon.svelte';
  import SearchIcon from '@/shared/icons/search-icon.svelte';

  type Props = {
    id: string;
  };

  const props: Props = $props();
  let searchInputElement = $state<HTMLInputElement | undefined>(undefined);
  const model = useWorkspaceGroupsPage(() => props.id);

  onDestroy(() => {
    model.cleanup();
  });

  function getStatusClassName(status: WorkspaceGroup['status']) {
    return `group-status-badge group-status-badge--${status}`;
  }

  function getStatusLabel(status: WorkspaceGroup['status']) {
    return WORKSPACE_GROUP_STATUS_LABELS[status];
  }
</script>

<section class="workspace-groups-page">
  {#if model.isSearchOpen}
    <header class="groups-search-header">
      <button
        class="back-button"
        type="button"
        onclick={() => model.closeSearch(searchInputElement)}
        aria-label="Закрыть поиск"
      >
        Отмена
      </button>

      <label
        class="search-input-wrap"
        for="groups-search"
      >
        <span
          class="search-icon"
          aria-hidden="true"
        >
          <SearchIcon />
        </span>

        <input
          bind:this={searchInputElement}
          id="groups-search"
          class="search-input"
          type="search"
          placeholder="Поиск по названию группы"
          value={model.searchValue}
          oninput={model.handleSearchInput}
          autocomplete="off"
        />
      </label>
    </header>
  {:else}
    <PageHeader
      title="Группы"
      onback={model.handleBack}
    >
      {#snippet actions()}
        <div class="header-actions">
          <IconButton
            ariaLabel="Поиск групп"
            onclick={() => model.openSearch(searchInputElement)}
          >
            <SearchIcon
              size={20}
              color="#737373"
            />
          </IconButton>

          <IconButton
            ariaLabel="Создать группу"
            onclick={model.openCreateGroup}
          >
            <PlusIcon />
          </IconButton>
        </div>
      {/snippet}
    </PageHeader>
  {/if}

  {#if model.query.isPending}
    <div class="stack">
      {#if model.isSearchOpen}
        <div class="counter-placeholder"></div>
      {/if}

      {#each [0, 1, 2, 3] as index (index)}
        <div class="group-card-skeleton"></div>
      {/each}
    </div>
  {:else if model.query.isError}
    <QueryErrorState
      title="Не удалось загрузить группы"
      onback={model.handleBack}
      onretry={model.handleRetry}
    />
  {:else}
    <div class="stack">
      <div class="groups-meta">
        <Typography
          variant="caption"
          color="#737373"
        >
          {model.searchTitle}
        </Typography>
      </div>

      {#if model.groups.length === 0}
        <div class="empty-state">
          <Typography
            variant="title"
            color="#171717"
          >
            {model.debouncedSearch ? 'Ничего не найдено' : 'Нет групп'}
          </Typography>

          <Typography
            variant="body"
            color="#737373"
          >
            {model.debouncedSearch
              ? 'Попробуйте изменить запрос или сбросить поиск.'
              : 'Создайте первую группу, чтобы вести события и заметки в одном месте.'}
          </Typography>

          <Button
            class="empty-state__button"
            onclick={model.openCreateGroup}
          >
            Создать группу
          </Button>
        </div>
      {:else}
        <div class="groups-list">
          {#each model.groups as group (group.id)}
            <article class="group-card">
              <div class="group-card__header">
                <div class="group-card__title-wrap">
                  <button
                    class={`group-card__star ${group.is_favorite ? 'group-card__star--favorite' : ''}`.trim()}
                    type="button"
                    aria-label={group.is_favorite ? `Убрать ${group.title} из избранного` : `Добавить ${group.title} в избранное`}
                    onclick={() => void model.handleFavoriteToggle(group)}
                  >
                    {group.is_favorite ? '★' : '☆'}
                  </button>

                  <Typography
                    variant="body"
                    color="#171717"
                  >
                    {group.title}
                  </Typography>
                </div>

                <span class={getStatusClassName(group.status)}>
                  <Typography
                    variant="overline"
                    color="currentColor"
                  >
                    {getStatusLabel(group.status)}
                  </Typography>
                </span>
              </div>

              {#if group.description}
                <Typography
                  variant="caption"
                  color="#737373"
                >
                  {group.description}
                </Typography>
              {/if}
            </article>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <CreateGroupModal
    isOpen={model.isCreateModalOpen}
    workspaceId={props.id}
    onClose={model.closeCreateGroup}
  />
</section>

<style>
  .workspace-groups-page {
    --workspace-bottom-nav-space: calc(96px + env(safe-area-inset-bottom, 0px));
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 10px;
    padding: 14px 8px 10px;
    background: #fafafa;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .groups-search-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 8px;
  }

  .back-button {
    border: 0;
    padding: 0;
    background: transparent;
    color: #737373;
    cursor: pointer;
    font: inherit;
  }

  .search-input-wrap {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 12px 14px;
    background: #fff;
  }

  .search-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .search-input {
    width: 100%;
    min-width: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: #171717;
    font: inherit;
    outline: none;
  }

  .search-input::placeholder {
    color: #a3a3a3;
  }

  .stack {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    overflow: auto;
    padding: 0 8px var(--workspace-bottom-nav-space);
  }

  .groups-meta {
    padding: 4px 8px 0;
  }

  .stack :global(p) {
    margin: 0;
  }

  .groups-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .group-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 16px;
    background: #fff;
  }

  .group-card__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .group-card__title-wrap {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 10px;
  }

  .group-card__title-wrap :global(p) {
    font-weight: 600;
  }

  .group-card__star {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    background: transparent;
    color: #737373;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
  }

  .group-card__star:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
    border-radius: 6px;
  }

  .group-card__star--favorite {
    color: #f59e0b;
    text-shadow: 0 1px 2px rgb(180 83 9 / 0.25);
  }

  .group-status-badge {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 4px 8px;
  }

  .group-status-badge :global(p) {
    margin: 0;
  }

  .group-status-badge--active {
    background: #dcfce7;
    color: #15803d;
  }

  .group-status-badge--pending {
    background: #fef3c7;
    color: #b45309;
  }

  .group-status-badge--archived {
    background: #e5e7eb;
    color: #4b5563;
  }

  .empty-state {
    display: flex;
    min-height: 320px;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px 18px;
    text-align: center;
  }

  .empty-state__button {
    max-width: 240px;
    margin-top: 4px;
  }

  .counter-placeholder,
  .group-card-skeleton {
    border-radius: 12px;
    background: linear-gradient(90deg, #efefef 25%, #f7f7f7 50%, #efefef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
  }

  .counter-placeholder {
    width: 92px;
    height: 18px;
    margin-left: 8px;
  }

  .group-card-skeleton {
    height: 110px;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }
</style>
