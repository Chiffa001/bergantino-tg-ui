<script lang="ts">
  import { Route, Switch } from '@chiffa001/tg-svelte-ui/router';

  import HomePage from '@/pages/home-page.svelte';
  import NotFoundPage from '@/pages/not-found-page.svelte';
  import NotInTelegramPage from '@/pages/not-in-telegram-page.svelte';
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
    <HomePage />
  </Route>

  <Route path="*">
    <NotFoundPage />
  </Route>
</Switch>
