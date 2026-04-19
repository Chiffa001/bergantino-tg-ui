<script lang="ts">
  import ErrorScreen from '@/shared/components/error/error-screen.svelte';
  import Button from '@/shared/components/ui/button.svelte';
  import ForbiddenIcon from '@/shared/icons/forbidden-icon.svelte';
  import { router } from '@/shared/lib/router';

  const handleHome = () => {
    router.navigate('/');
  };
</script>

<ErrorScreen
  title="Нет доступа"
  description="У вас недостаточно прав для просмотра этой страницы."
>
  {#snippet icon()}
    <ForbiddenIcon
      size={56}
      color="#b0bac8"
    />
  {/snippet}

  {#snippet actions()}
    <Button onclick={handleHome}>
      На главную
    </Button>
  {/snippet}
</ErrorScreen>
