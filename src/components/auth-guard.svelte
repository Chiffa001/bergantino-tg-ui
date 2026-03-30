<script lang="ts">
  import { LoaderContainer } from '@chiffa001/tg-svelte-ui';
  import type { Snippet } from 'svelte';

  import { createAuthQuery } from '@/api/auth/queries';
  import { authStore } from '@/lib/auth';
  import { router } from '@/lib/router';

  type Props = {
    children: Snippet;
    isInTelegram: boolean;
  };

  const PUBLIC_ROUTES = new Set(['/internal-server-error', '/not-in-telegram', '/forbidden']);

  let { children, isInTelegram }: Props = $props();

  const query = createAuthQuery(() => isInTelegram && !PUBLIC_ROUTES.has(router.currentPath));

  $effect(() => {
    if (PUBLIC_ROUTES.has(router.currentPath)) {
      return;
    }

    if (query.isSuccess) {
      authStore.setToken(query.data.access_token);

      if (!query.data.user.is_super_admin) {
        router.navigate('/forbidden', { replace: true });
      }

      return;
    }

    if (query.isError) {
      authStore.clear();

      const isClientError = query.error.message === 'client_error';

      router.navigate(isClientError ? '/not-in-telegram' : '/internal-server-error', {
        replace: true,
      });
    }
  });
</script>

{#if PUBLIC_ROUTES.has(router.currentPath) || query.isSuccess}
  {@render children()}
{:else}
  <section class="auth-guard-loader">
    <LoaderContainer />
  </section>
{/if}

<style>
  .auth-guard-loader {
    display: flex;
    height: 100%;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #f0f0f7;
  }
</style>
