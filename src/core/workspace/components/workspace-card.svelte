<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { type Workspace,WORKSPACE_PLAN_LABELS, WORKSPACE_STATUS_LABELS } from '@/core/workspace/model/types';
  import { formatDate } from '@/shared/lib/format-date';

  type Props = {
    workspace: Workspace;
    onclick: () => void;
  };

  const { workspace, onclick }: Props = $props();
</script>

<button
  class="workspace-card"
  {onclick}
>
  <div class="card-row card-row--title">
    <Typography
      variant="title"
      color="#172033"
      className="ws-name"
    >
      {workspace.title}
    </Typography>

    <span class="status-badge status-badge--{workspace.status}">
      <Typography
        variant="overline"
        color="currentColor"
      >
        {WORKSPACE_STATUS_LABELS[workspace.status]}
      </Typography>
    </span>
  </div>

  <div class="slug-row">
    <Typography
      variant="caption"
      color="#8e9ab3"
      className="ws-meta"
    >
      slug: {workspace.slug}
    </Typography>

    {#if workspace.has_bot}
      <span class="bot-badge">🤖</span>
    {/if}
  </div>

  <div class="card-row card-row--footer">
    <span class="plan-badge plan-badge--{workspace.plan}">
      <Typography
        variant="overline"
        color="currentColor"
      >
        {WORKSPACE_PLAN_LABELS[workspace.plan]}
      </Typography>
    </span>

    <Typography
      variant="caption"
      color="#8e9ab3"
      className="ws-meta"
    >
      {formatDate(workspace.created_at)}
    </Typography>
  </div>
</button>

<style>
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

  .workspace-card :global(.ws-name),
  .workspace-card :global(.ws-meta) {
    margin: 0;
  }

  .slug-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bot-badge {
    font-size: 13px;
    line-height: 1;
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
</style>
