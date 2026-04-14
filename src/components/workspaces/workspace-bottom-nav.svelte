<script lang="ts">
  import { NavBar, type NavBarTab } from '@chiffa001/tg-svelte-ui';
  import { onDestroy } from 'svelte';

  import {
    WORKSPACE_BOTTOM_NAV_SECTION,
    type WorkspaceBottomNavSection,
  } from '@/constants/bottom-nav';
  import NavGroupsIcon from '@/icons/nav-groups-icon.svelte';
  import NavInfoIcon from '@/icons/nav-info-icon.svelte';
  import { router } from '@/lib/router';

  type Props = {
    workspaceId: string;
    activeSection: WorkspaceBottomNavSection;
  };

  const { workspaceId, activeSection }: Props = $props();
  let optimisticSection = $derived(activeSection);
  let navigationTimeout: ReturnType<typeof setTimeout> | undefined;

  const tabs: NavBarTab[] = [
    {
      id: WORKSPACE_BOTTOM_NAV_SECTION.GROUPS,
      label: 'Группы',
      icon: NavGroupsIcon,
      ariaLabel: 'Группы workspace',
    },
    {
      id: WORKSPACE_BOTTOM_NAV_SECTION.ABOUT,
      label: 'О пространстве',
      icon: NavInfoIcon,
      ariaLabel: 'Информация о workspace',
    },
  ];

  onDestroy(() => {
    clearTimeout(navigationTimeout);
  });

  function handleChange(id: string) {
    if (id === activeSection) {
      return;
    }

    optimisticSection = id as WorkspaceBottomNavSection;
    clearTimeout(navigationTimeout);
    navigationTimeout = setTimeout(() => {
      navigateToSection(id as WorkspaceBottomNavSection);
    }, 135);
  }

  function navigateToSection(id: WorkspaceBottomNavSection) {
    if (id === WORKSPACE_BOTTOM_NAV_SECTION.GROUPS) {
      router.navigate(`/workspaces/${workspaceId}/groups`);
      return;
    }

    router.navigate(`/workspaces/${workspaceId}`);
  }
</script>

<div class="workspace-bottom-nav">
  <NavBar
    tabs={tabs}
    activeId={optimisticSection}
    setActiveItemId={handleChange}
    ariaLabel="Навигация по workspace"
  />
</div>

<style>
  .workspace-bottom-nav {
    position: fixed;
    left: 50%;
    bottom: 0;
    z-index: 20;
    width: min(calc(100vw - 36px), 486px);
    transform: translateX(-50%);
    padding: 0 0 calc(18px + env(safe-area-inset-bottom, 0px));
    background:
      linear-gradient(180deg, rgb(250 250 250 / 0) 0%, rgb(250 250 250 / 0.78) 14px, #fafafa 38px);
    backdrop-filter: blur(10px);
    box-sizing: border-box;
    pointer-events: none;
  }

  .workspace-bottom-nav :global(.nav-bar) {
    pointer-events: auto;
    max-width: none;
  }
</style>
