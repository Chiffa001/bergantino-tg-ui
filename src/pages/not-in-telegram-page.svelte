<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/components/ui/button.svelte';
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

<section class="not-in-telegram-page">
  <div class="content">
    <TgIcon
      size={56}
      color="#b0bac8"
    />

    <div class="title-wrapper">
      <Typography
        variant="h1"
        color="#172033"
      >
        Откройте в Telegram
      </Typography>
    </div>

    <div class="description-wrapper">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        Это приложение работает только внутри Telegram.
      </Typography>
    </div>

    {#if botUrl}
      <div class="action-wrapper">
        <Button
          href={botUrl}
          loading={isRedirecting}
          onclick={handleTelegramRedirect}
        >
          Открыть Telegram
        </Button>
      </div>
    {/if}
  </div>
</section>

<style>
  .not-in-telegram-page {
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

  .action-wrapper {
    margin-top: 20px;
    width: 100%;
  }
</style>
