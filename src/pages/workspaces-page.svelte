<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspacesQuery } from '@/api/workspaces/queries';
  import { type WorkspaceStatus } from '@/api/workspaces/types';
  import Button from '@/components/ui/button.svelte';
  import WorkspaceCard from '@/components/workspaces/workspace-card.svelte';
  import { router } from '@/lib/router';

  type Filter = 'all' | WorkspaceStatus;

  const query = createWorkspacesQuery();

  let activeFilter = $state<Filter>('all');

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'suspended', label: 'Приост.' },
    { value: 'archived', label: 'Архив' },
  ];

  const filteredWorkspaces = $derived(
    (query.data ?? []).filter(
      (ws) => activeFilter === 'all' || ws.status === activeFilter,
    ),
  );

  const handleCreate = () => router.navigate('/workspaces/new');
  const handleCard = (id: string) => router.navigate(`/workspaces/${id}`);
</script>

<section class="workspaces-page">
  <header class="page-header">
    <div class="page-title-wrap">
      <Typography
        variant="h2"
        color="#172033"
      >
        Рабочие пространства
      </Typography>
    </div>

    <div class="header-action">
      <Button
        class="header-button"
        onclick={handleCreate}
      >
        Создать
      </Button>
    </div>
  </header>

  <div class="filters">
    {#each filters as filter (filter.value)}
      <Button
        variant={activeFilter === filter.value ? 'default' : 'secondary'}
        class={`filter-chip ${activeFilter === filter.value ? 'filter-chip--active' : ''}`.trim()}
        onclick={() => (activeFilter = filter.value)}
      >
        {filter.label}
      </Button>
    {/each}
  </div>

  {#if query.isPending}
    <div class="skeleton-list">
      {#each [0, 1, 2] as index (index)}
        <div class="skeleton-card"></div>
      {/each}
    </div>
  {:else if query.isError}
    <div class="error-state">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        Не удалось загрузить пространства
      </Typography>

      <div class="state-action">
        <Button
          variant="secondary"
          class="state-button"
          onclick={() => query.refetch()}
        >
          Повторить
        </Button>
      </div>
    </div>
  {:else}
    <Typography
      variant="caption"
      color="#8e9ab3"
    >
      {filteredWorkspaces.length} пространств
    </Typography>

    {#if filteredWorkspaces.length === 0}
      <div class="empty-state">
        <Typography
          variant="title"
          color="#5f6b85"
        >
          Нет рабочих пространств
        </Typography>

        <div class="state-action">
          <Button
            class="state-button"
            onclick={handleCreate}
          >
            Создать первое
          </Button>
        </div>
      </div>
    {:else}
      <ul class="workspace-list">
        {#each filteredWorkspaces as ws (ws.id)}
          <li>
            <WorkspaceCard
              workspace={ws}
              onclick={() => handleCard(ws.id)}
            />
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</section>

<style>
  .workspaces-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 16px;
    padding: 20px 16px;
    background:
      radial-gradient(circle at top left, rgb(255 255 255 / 0.72), transparent 38%),
      linear-gradient(180deg, #f7f8fc 0%, #eef1f8 100%);
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .page-title-wrap :global(h2) {
    margin: 0;
  }

  .header-action,
  .state-action {
    width: fit-content;
    flex-shrink: 0;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filters :global(.filter-chip) {
    width: auto;
    min-width: 0;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.75);
    border: 1px solid #dbe1ee;
    box-shadow: 0 6px 18px rgb(23 32 51 / 0.05);
  }

  .filters :global(.filter-chip) :global(p) {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
  }

  .filters :global(.filter-chip.btn--secondary) {
    color: #5f6b85;
  }

  .filters :global(.filter-chip--active) {
    background: #172033;
    border-color: #172033;
    box-shadow: none;
  }

  .filters :global(.filter-chip--active) :global(p) {
    color: #ffffff;
  }

  .workspace-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-card {
    height: 96px;
    border-radius: 18px;
    background: linear-gradient(90deg, #e5e9f2 25%, #f6f8fc 50%, #e5e9f2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  .empty-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 48px 0;
    text-align: center;
  }

  .empty-state :global(p),
  .error-state :global(p) {
    margin: 0;
  }

  .header-action :global(.header-button),
  .state-action :global(.state-button) {
    width: auto;
    min-width: 0;
    padding-inline: 18px;
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
