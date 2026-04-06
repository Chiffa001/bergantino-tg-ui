<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    icon: Snippet;
    title: string;
    description: string;
    actions?: Snippet;
  };

  const { icon, title, description, actions }: Props = $props();
</script>

<section class="error-screen">
  <div class="content">
    {@render icon()}

    <div class="title-wrapper">
      <Typography
        variant="h1"
        color="#172033"
      >
        {title}
      </Typography>
    </div>

    <div class="description-wrapper">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        {description}
      </Typography>
    </div>

    {#if actions}
      <div class="actions-wrapper">
        {@render actions()}
      </div>
    {/if}
  </div>
</section>

<style>
  .error-screen {
    display: flex;
    height: 100%;
    overflow: hidden;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #f0f0f7;
    padding: 24px;
  }

  .content {
    display: flex;
    width: min(100%, 320px);
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .title-wrapper {
    margin: 0;
  }

  .description-wrapper {
    margin: 12px 0 0;
  }

  .actions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
    width: 100%;
  }
</style>
