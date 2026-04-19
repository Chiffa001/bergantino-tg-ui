<script lang="ts">
  import { Route, Switch } from '@chiffa001/tg-svelte-ui/router';

  import WorkspaceGroupsPage from '@/core/groups/pages/workspace-groups-page.svelte';
  import InvitePage from '@/core/invites/pages/invite-page.svelte';
  import WorkspaceBottomNavHost from '@/core/workspace/components/workspace-bottom-nav-host.svelte';
  import CreateWorkspacePage from '@/core/workspace/pages/create-workspace-page.svelte';
  import WorkspaceDetailPage from '@/core/workspace/pages/workspace-detail-page.svelte';
  import WorkspaceSettingsPage from '@/core/workspace/pages/workspace-settings-page.svelte';
  import WorkspaceUsersPage from '@/core/workspace/pages/workspace-users-page.svelte';
  import WorkspacesPage from '@/core/workspace/pages/workspaces-page.svelte';
  import WorkspaceBillingPage from '@/modules/billing/pages/workspace-billing-page.svelte';
  import WorkspaceChangePlanPage from '@/modules/billing/pages/workspace-change-plan-page.svelte';
  import ForbiddenPage from '@/shared/pages/forbidden-page.svelte';
  import InternalServerErrorPage from '@/shared/pages/internal-server-error-page.svelte';
  import NotFoundPage from '@/shared/pages/not-found-page.svelte';
  import NotInTelegramPage from '@/shared/pages/not-in-telegram-page.svelte';
</script>

<Switch>
  <Route
    path="/not-in-telegram"
    exact
  >
    <NotInTelegramPage />
  </Route>

  <Route
    path="/"
    exact
  >
    <WorkspacesPage />
  </Route>

  <Route
    path="/invites/:token"
    exact
  >
    {#snippet children({ params })}
      <InvitePage token={params.token} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/new"
    exact
  >
    <CreateWorkspacePage />
  </Route>

  <Route
    path="/workspaces/:id"
    exact
  >
    {#snippet children({ params })}
      <WorkspaceDetailPage id={params.id} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/:id/groups"
    exact
  >
    {#snippet children({ params })}
      <WorkspaceGroupsPage id={params.id} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/:id/settings"
    exact
  >
    {#snippet children({ params })}
      <WorkspaceSettingsPage id={params.id} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/:id/billing"
    exact
  >
    {#snippet children({ params })}
      <WorkspaceBillingPage id={params.id} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/:id/billing/change-plan"
    exact
  >
    {#snippet children({ params })}
      <WorkspaceChangePlanPage id={params.id} />
    {/snippet}
  </Route>

  <Route
    path="/workspaces/:id/users"
    exact
  >
    {#snippet children({ params, query })}
      <WorkspaceUsersPage
        id={params.id}
        role={query.get('role')}
        search={query.get('search')}
      />
    {/snippet}
  </Route>

  <Route
    path="/forbidden"
    exact
  >
    <ForbiddenPage />
  </Route>

  <Route
    path="/internal-server-error"
    exact
  >
    <InternalServerErrorPage />
  </Route>

  <Route path="*">
    <NotFoundPage />
  </Route>
</Switch>

<WorkspaceBottomNavHost />
