<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import RadioIndicator from '@/shared/components/ui/radio-indicator.svelte';

  type Props = {
    checked?: boolean;
    description?: string;
    onclick?: () => void;
    title: string;
  };

  let {
    checked = false,
    description = '',
    onclick,
    title,
  }: Props = $props();
</script>

<button
  class={`radio-card-option ${checked ? 'radio-card-option--checked' : ''}`.trim()}
  type="button"
  {onclick}
>
  <RadioIndicator checked={checked} />

  <span class="radio-card-meta">
    <Typography
      variant="body"
      color="#171717"
    >
      {title}
    </Typography>

    {#if description}
      <Typography
        variant="caption"
        color="#737373"
      >
        {description}
      </Typography>
    {/if}
  </span>
</button>

<style>
  .radio-card-option {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
  }

  .radio-card-option--checked {
    border-color: #4f46e5;
    background: #f5f3ff;
    box-shadow: inset 0 0 0 1px #4f46e5;
  }

  .radio-card-meta {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .radio-card-meta :global(p) {
    margin: 0;
  }
</style>
