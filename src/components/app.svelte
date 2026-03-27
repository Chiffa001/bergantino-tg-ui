<script lang="ts">
  import { PhoneMask } from '@chiffa001/tg-svelte-ui';
  import { Router } from '@chiffa001/tg-svelte-ui/router';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';

  import { queryClient } from '@/lib/query-client';
  import { router } from '@/lib/router';
  import { setupTelegramSdk } from '@/lib/tma';

  import Screens from './screens.svelte';

  const { cleanup, isInTelegram } = setupTelegramSdk();

  if (!isInTelegram) {
    router.navigate('/not-in-telegram', { replace: true });
  }

  onMount(() => {
    return cleanup;
  });
</script>

<QueryClientProvider client={queryClient}>
  <PhoneMask
    theme="light"
    withContentPadding={false}
  >
    <Router {router}>
      <main class="app-layout">
        <Screens />
      </main>
    </Router>
  </PhoneMask>
</QueryClientProvider>

<style>
  .app-layout {
    display: flex;
    height: 100%;
    width: 100%;
    flex: 1;
    flex-direction: column;
  }
</style>
