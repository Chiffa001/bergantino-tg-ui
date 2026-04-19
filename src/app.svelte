<script lang="ts">
  import { PhoneMask } from '@chiffa001/tg-svelte-ui';
  import { Router } from '@chiffa001/tg-svelte-ui/router';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { retrieveLaunchParams } from '@tma.js/sdk-svelte';
  import type { LaunchParams } from '@tma.js/types';
  import { onMount } from 'svelte';

  import AuthGuard from '@/core/auth/components/auth-guard.svelte';
  import { parseInviteTokenFromStartParam } from '@/core/invites/lib/invite';
  import { queryClient } from '@/shared/lib/query-client';
  import { router } from '@/shared/lib/router';
  import { setupTelegramSdk } from '@/shared/lib/tma';

  import Screens from './screens.svelte';

  const { cleanup, isInTelegram } = setupTelegramSdk();

  function getInviteStartParam(): string | null {
    try {
      const params = retrieveLaunchParams() as LaunchParams;
      return params.tgWebAppStartParam ?? params.tgWebAppData?.start_param ?? null;
    } catch {
      return null;
    }
  }

  if (!isInTelegram) {
    router.navigate('/not-in-telegram', { replace: true });
  } else {
    const inviteToken = parseInviteTokenFromStartParam(getInviteStartParam());

    if (inviteToken) {
      router.navigate(`/invites/${inviteToken}`, { replace: true });
    } else {
      // TMA opens with Telegram params in the hash (#tgWebAppData=...),
      // which the hash-mode router would misread as a non-matching path.
      // Navigate to / so the router ignores the Telegram hash on start.
      router.navigate('/', { replace: true });
    }
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
        <AuthGuard {isInTelegram}>
          <Screens />
        </AuthGuard>
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
