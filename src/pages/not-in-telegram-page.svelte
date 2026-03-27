<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import TgIcon from '@/icons/tg-icon.svelte';

  const botUrl = import.meta.env.VITE_BOT_URL?.trim();
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
      <a
        class="action"
        href={botUrl}
      >
        Открыть Telegram
      </a>
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

  .action {
    display: inline-flex;
    min-height: 52px;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 28px;
    border-radius: 14px;
    background: linear-gradient(135deg, #63eaf3 0%, #6c4efe 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    transition:
      transform 160ms ease,
      opacity 160ms ease;
  }

  .action:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  .action:active {
    transform: translateY(0);
    opacity: 0.8;
  }
</style>
