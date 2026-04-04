<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspacesQuery } from '@/api/workspaces/queries';
  import { WORKSPACE_PLAN_LABELS, WORKSPACE_STATUS_LABELS, type WorkspaceStatus } from '@/api/workspaces/types';
  import Button from '@/components/ui/button.svelte';
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

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(iso),
    );
  }

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
            <button
              class="workspace-card"
              onclick={() => handleCard(ws.id)}
            >
              <div class="card-row card-row--title">
                <Typography
                  variant="title"
                  color="#172033"
                  className="ws-name"
                >
                  {ws.title}
                </Typography>

                <span class="status-badge status-badge--{ws.status}">
                  <Typography
                    variant="overline"
                    color="currentColor"
                  >
                    {WORKSPACE_STATUS_LABELS[ws.status]}
                  </Typography>
                </span>
              </div>

              <Typography
                variant="caption"
                color="#8e9ab3"
                className="ws-meta"
              >
                slug: {ws.slug}
              </Typography>

              <div class="card-row card-row--footer">
                <span class="plan-badge plan-badge--{ws.plan}">
                  <Typography
                    variant="overline"
                    color="currentColor"
                  >
                    {WORKSPACE_PLAN_LABELS[ws.plan]}
                  </Typography>
                </span>

                <Typography
                  variant="caption"
                  color="#8e9ab3"
                  className="ws-meta"
                >
                  {formatDate(ws.created_at)}
                </Typography>
              </div>
            </button>
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

  .workspace-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    padding: 16px;
    box-sizing: border-box;
    text-align: left;
    cursor: pointer;
    border: 1px solid #dbe1ee;
    border-radius: 18px;
    background: rgb(255 255 255 / 0.9);
    box-shadow: 0 10px 24px rgb(23 32 51 / 0.05);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      opacity 0.15s ease;
  }

  .workspace-card:active {
    opacity: 0.92;
    transform: scale(0.99);
  }

  .card-row {
    display: flex;
    align-items: center;
  }

  .card-row--title,
  .card-row--footer {
    justify-content: space-between;
    gap: 12px;
  }

  .ws-name {
    margin: 0;
  }

  .ws-meta {
    margin: 0;
  }

  .status-badge,
  .plan-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 9px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .status-badge :global(span),
  .plan-badge :global(span) {
    line-height: 1;
  }

  .status-badge--active {
    background: #dcfce7;
    color: #16a34a;
  }

  .status-badge--suspended {
    background: #fef9c3;
    color: #a16207;
  }

  .status-badge--archived {
    background: #f3f4f6;
    color: #6b7280;
  }

  .plan-badge--free {
    background: #f3f4f6;
    color: #6b7280;
  }

  .plan-badge--basic {
    background: #eff6ff;
    color: #1d4ed8;
  }

  .plan-badge--pro {
    background: #f5f3ff;
    color: #7c3aed;
  }

  .plan-badge--business {
    background: #fdf4ff;
    color: #a21caf;
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
