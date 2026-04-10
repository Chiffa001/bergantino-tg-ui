<script lang="ts">
  import { LoaderContainer } from '@chiffa001/tg-svelte-ui';
  import { matchRoute } from '@chiffa001/tg-svelte-ui/router';
  import type { Snippet } from 'svelte';

  import { createAuthQuery } from '@/api/auth/queries';
  import { authStore } from '@/lib/auth';
  import { isInviteRoute } from '@/lib/invite';
  import { router } from '@/lib/router';

  type Props = {
    children: Snippet;
    isInTelegram: boolean;
  };

  const PUBLIC_ROUTES = new Set(['/internal-server-error', '/not-in-telegram', '/forbidden']);

  let { children, isInTelegram }: Props = $props();

  function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.has(path) || isInviteRoute(path);
  }

  function canAccessAsInvitedMember(path: string): boolean {
    const match = matchRoute('/workspaces/:id', path, true);

    if (!match) {
      return false;
    }

    return authStore.getInviteWorkspaceAccess() === match.params.id;
  }

  const query = createAuthQuery(() => isInTelegram && !isPublicRoute(router.currentPath));

  $effect(() => {
    if (isPublicRoute(router.currentPath)) {
      return;
    }

    if (query.isSuccess) {
      authStore.setToken(query.data.access_token);
      authStore.setUser(query.data.user);

      if (!query.data.user.is_super_admin && !canAccessAsInvitedMember(router.currentPath)) {
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

{#if isPublicRoute(router.currentPath) || query.isSuccess}
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
