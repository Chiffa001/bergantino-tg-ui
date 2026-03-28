<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/components/ui/button.svelte';
  import ForbiddenIcon from '@/icons/forbidden-icon.svelte';
  import { router } from '@/lib/router';

  const handleHome = () => {
    router.navigate('/');
  };
</script>

<section class="forbidden-page">
  <div class="content">
    <ForbiddenIcon
      size={56}
      color="#b0bac8"
    />

    <div class="title-wrapper">
      <Typography
        variant="h1"
        color="#172033"
      >
        Нет доступа
      </Typography>
    </div>

    <div class="description-wrapper">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        У вас недостаточно прав для просмотра этой страницы.
      </Typography>
    </div>

    <div class="action-wrapper">
      <Button onclick={handleHome}>
        На главную
      </Button>
    </div>
  </div>
</section>

<style>
  .forbidden-page {
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
