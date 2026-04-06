<script lang="ts">
  import Button from '@/components/ui/button.svelte';
  import ErrorScreen from '@/components/ui/error-screen.svelte';
  import ForbiddenIcon from '@/icons/forbidden-icon.svelte';
  import { router } from '@/lib/router';

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
