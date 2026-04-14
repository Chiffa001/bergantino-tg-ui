<script lang="ts">
  import { Route, Switch } from '@chiffa001/tg-svelte-ui/router';

  import WorkspaceBottomNavHost from '@/components/workspaces/workspace-bottom-nav-host.svelte';
  import CreateWorkspacePage from '@/pages/create-workspace-page.svelte';
  import ForbiddenPage from '@/pages/forbidden-page.svelte';
  import InternalServerErrorPage from '@/pages/internal-server-error-page.svelte';
  import InvitePage from '@/pages/invite-page.svelte';
  import NotFoundPage from '@/pages/not-found-page.svelte';
  import NotInTelegramPage from '@/pages/not-in-telegram-page.svelte';
  import WorkspaceBillingPage from '@/pages/workspace-billing-page.svelte';
  import WorkspaceChangePlanPage from '@/pages/workspace-change-plan-page.svelte';
  import WorkspaceDetailPage from '@/pages/workspace-detail-page.svelte';
  import WorkspaceGroupsPage from '@/pages/workspace-groups-page.svelte';
  import WorkspaceSettingsPage from '@/pages/workspace-settings-page.svelte';
  import WorkspaceUsersPage from '@/pages/workspace-users-page.svelte';
  import WorkspacesPage from '@/pages/workspaces-page.svelte';
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
