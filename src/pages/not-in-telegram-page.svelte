<script lang="ts">
  import Button from '@/components/ui/button.svelte';
  import ErrorScreen from '@/components/ui/error-screen.svelte';
  import TgIcon from '@/icons/tg-icon.svelte';

  let isRedirecting = false;
  const botUrl = import.meta.env.VITE_BOT_URL?.trim();

  const handleTelegramRedirect = (e: MouseEvent) => {
    if (isRedirecting) {
      e.preventDefault();
      return;
    }

    isRedirecting = true;
  };
</script>

<ErrorScreen
  title="Откройте в Telegram"
  description="Это приложение работает только внутри Telegram."
>
  {#snippet icon()}
    <TgIcon
      size={56}
      color="#b0bac8"
    />
  {/snippet}

  {#snippet actions()}
    {#if botUrl}
      <Button
        href={botUrl}
        loading={isRedirecting}
        onclick={handleTelegramRedirect}
      >
        Открыть Telegram
      </Button>
    {/if}
  {/snippet}
</ErrorScreen>
