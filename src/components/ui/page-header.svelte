<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import type { Snippet } from 'svelte';

  import ChevronLeftIcon from '@/icons/chevron-left-icon.svelte';

  type Props = {
    title: string;
    onback: () => void;
    actions?: Snippet;
  };

  const { title, onback, actions }: Props = $props();
</script>

<header class="page-header">
  <button
    class="back-button"
    onclick={onback}
    aria-label="Назад"
  >
    <ChevronLeftIcon />
  </button>

  <div class="header-copy">
    <Typography
      variant="h2"
      color="#0a0a0a"
    >
      {title}
    </Typography>
  </div>

  {#if actions}
    {@render actions()}
  {/if}
</header>

<style>
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .back-button {
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
</style>
