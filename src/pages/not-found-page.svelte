<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/components/ui/button.svelte';
  import NotFoundIcon from '@/icons/not-found-icon.svelte';
  import { router } from '@/lib/router';

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.navigate('/');
  };
</script>

<section class="not-found-page">
  <div class="content">
    <NotFoundIcon
      size={56}
      color="#b0bac8"
    />

    <div class="title-wrapper">
      <Typography
        variant="h1"
        color="#172033"
      >
        Не найдено
      </Typography>
    </div>

    <div class="description-wrapper">
      <Typography
        variant="body"
        color="#5f6b85"
      >
        Запрашиваемый раздел не существует или был удалён.
      </Typography>
    </div>

    <div class="actions-wrapper">
      <Button
        variant="secondary"
        onclick={handleBack}
      >
        Назад
      </Button>

      <Button onclick={handleHome}>
        На главную
      </Button>
    </div>
  </div>
</section>

<style>
  .not-found-page {
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
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
