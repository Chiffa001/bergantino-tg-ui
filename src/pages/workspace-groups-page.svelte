<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import PageHeader from '@/components/ui/page-header.svelte';
  import { router } from '@/lib/router';

  type Props = {
    id: string;
  };

  const props: Props = $props();

  function handleBack() {
    void props.id;
    router.navigate('/');
  }
</script>

<section class="workspace-groups-page">
  <PageHeader
    title="Группы"
    onback={handleBack}
  />

  <div class="workspace-groups-page__body">
    <Typography
      variant="caption"
      color="#737373"
    >
      Экран групп пока пустой.
    </Typography>
  </div>
</section>

<style>
  .workspace-groups-page {
    --workspace-bottom-nav-space: calc(96px + env(safe-area-inset-bottom, 0px));
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 10px;
    padding: 14px 8px 10px;
    background: #fafafa;
  }

  .workspace-groups-page__body {
    display: flex;
    min-height: 0;
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    padding: 12px 16px var(--workspace-bottom-nav-space);
  }

  .workspace-groups-page__body :global(span) {
    margin: 0;
  }
</style>
