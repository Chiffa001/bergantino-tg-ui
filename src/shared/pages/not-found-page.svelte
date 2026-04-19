<script lang="ts">
  import ErrorScreen from '@/shared/components/error/error-screen.svelte';
  import Button from '@/shared/components/ui/button.svelte';
  import NotFoundIcon from '@/shared/icons/not-found-icon.svelte';
  import { router } from '@/shared/lib/router';

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.navigate('/');
  };
</script>

<ErrorScreen
  title="Не найдено"
  description="Запрашиваемый раздел не существует или был удалён."
>
  {#snippet icon()}
    <NotFoundIcon
      size={56}
      color="#b0bac8"
    />
  {/snippet}

  {#snippet actions()}
    <Button
      variant="secondary"
      onclick={handleBack}
    >
      Назад
    </Button>

    <Button onclick={handleHome}>
      На главную
    </Button>
  {/snippet}
</ErrorScreen>
