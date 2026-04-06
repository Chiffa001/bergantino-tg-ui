<script lang="ts">
  import Button from '@/components/ui/button.svelte';
  import ErrorScreen from '@/components/ui/error-screen.svelte';
  import ServerErrorIcon from '@/icons/server-error-icon.svelte';
  import { router } from '@/lib/router';

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
