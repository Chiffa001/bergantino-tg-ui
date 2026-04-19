<script lang="ts">
  import ErrorScreen from '@/shared/components/error/error-screen.svelte';
  import Button from '@/shared/components/ui/button.svelte';
  import ServerErrorIcon from '@/shared/icons/server-error-icon.svelte';
  import { router } from '@/shared/lib/router';

  const handleRetry = () => {
    router.back();
  };
</script>

<ErrorScreen
  title="Что-то пошло не так"
  description="Мы уже в курсе проблемы. Попробуйте через несколько минут."
>
  {#snippet icon()}
    <ServerErrorIcon
      size={56}
      color="#b0bac8"
    />
  {/snippet}

  {#snippet actions()}
    <Button onclick={handleRetry}>
      Повторить
    </Button>
  {/snippet}
</ErrorScreen>
