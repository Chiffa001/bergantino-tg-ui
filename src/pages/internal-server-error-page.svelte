<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/components/ui/button.svelte';
  import ServerErrorIcon from '@/icons/server-error-icon.svelte';
  import { router } from '@/lib/router';

  const handleRetry = () => {
    router.back();
  };
</script>

<section class="internal-server-error-page">
  <div class="content">
    <ServerErrorIcon
      size={56}
      color="#b0bac8"
    />

    <div class="title-wrapper">
      <Typography
        variant="h1"
        color="#172033"
      >
        Что-то пошло не так
      </Typography>
    </div>

    <div class="description-wrapper">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        Мы уже в курсе проблемы. Попробуйте через несколько минут.
      </Typography>
    </div>

    <div class="action-wrapper">
      <Button onclick={handleRetry}>
        Повторить
      </Button>
    </div>
  </div>
</section>

<style>
  .internal-server-error-page {
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
