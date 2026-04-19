<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/shared/components/ui/button.svelte';

  type Props = {
    title: string;
    onback: () => void;
    onretry: () => void;
    backLabel?: string;
  };

  const { title, onback, onretry, backLabel = 'Назад' }: Props = $props();
</script>

<div class="error-state">
  <Typography
    variant="title"
    color="#0a0a0a"
  >
    {title}
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
      onclick={onback}
    >
      {backLabel}
    </Button>

    <Button onclick={onretry}>
      Повторить
    </Button>
  </div>
</div>

<style>
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
</style>
