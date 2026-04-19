<script lang="ts">
  import { matchRoute } from '@chiffa001/tg-svelte-ui/router';

  import WorkspaceBottomNav from '@/core/workspace/components/workspace-bottom-nav.svelte';
  import { WORKSPACE_BOTTOM_NAV_SECTION } from '@/shared/constants/bottom-nav';
  import { router } from '@/shared/lib/router';

  const navState = $derived.by(() => {
    if (router.currentPath === '/workspaces/new') {
      return null;
    }

    const groupsMatch = matchRoute('/workspaces/:id/groups', router.currentPath, true);

    if (groupsMatch) {
      return {
        activeSection: WORKSPACE_BOTTOM_NAV_SECTION.GROUPS,
        workspaceId: groupsMatch.params.id,
      };
    }

    if (
      matchRoute('/workspaces/:id/users', router.currentPath, true) ||
      matchRoute('/workspaces/:id/settings', router.currentPath, true) ||
      matchRoute('/workspaces/:id/billing', router.currentPath, true) ||
      matchRoute('/workspaces/:id/billing/change-plan', router.currentPath, true)
    ) {
      return null;
    }

    const detailMatch = matchRoute('/workspaces/:id', router.currentPath, true);

    if (detailMatch) {
      return {
        activeSection: WORKSPACE_BOTTOM_NAV_SECTION.ABOUT,
        workspaceId: detailMatch.params.id,
      };
    }

    return null;
  });
</script>

{#if navState}
  <WorkspaceBottomNav
    workspaceId={navState.workspaceId}
    activeSection={navState.activeSection}
  />
{/if}
