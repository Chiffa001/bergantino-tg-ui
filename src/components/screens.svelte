<script lang="ts">
  import { Route, Switch } from '@chiffa001/tg-svelte-ui/router';

  import CreateWorkspacePage from '@/pages/create-workspace-page.svelte';
  import ForbiddenPage from '@/pages/forbidden-page.svelte';
  import InternalServerErrorPage from '@/pages/internal-server-error-page.svelte';
  import NotFoundPage from '@/pages/not-found-page.svelte';
  import NotInTelegramPage from '@/pages/not-in-telegram-page.svelte';
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
    path="/workspaces/new"
    exact
  >
    <CreateWorkspacePage />
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
