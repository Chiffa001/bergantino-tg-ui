<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { authStore } from '@/core/auth/store/store';
  import {
    createAdminOverrideWorkspaceBillingPlanMutation,
    createWorkspaceBillingPlansQuery,
    createWorkspaceBillingQuery,
  } from '@/core/workspace/api/queries';
  import type { WorkspacePlan } from '@/core/workspace/model/types';
  import PlanCard from '@/modules/billing/components/plan-card.svelte';
  import { toBillingPlanView } from '@/modules/billing/domain';
  import QueryErrorState from '@/shared/components/error/query-error-state.svelte';
  import PageHeader from '@/shared/components/ui/page-header.svelte';
  import { router } from '@/shared/lib/router';

  type Props = {
    id: string;
  };

  const props: Props = $props();
  const billingQuery = createWorkspaceBillingQuery(() => props.id);
  const plansQuery = createWorkspaceBillingPlansQuery(() => props.id);
  const mutation = createAdminOverrideWorkspaceBillingPlanMutation(() => props.id);
  const currentUser = authStore.getUser();
  const canChangePlan = currentUser?.is_super_admin ?? false;

  const currentPlan = $derived(billingQuery.data?.plan ?? null);
  const planViews = $derived(
    plansQuery.data && billingQuery.data
      ? plansQuery.data.map((plan) => toBillingPlanView(plan, billingQuery.data))
      : [],
  );
  const savingPlan = $derived(
    mutation.isPending && mutation.variables?.plan ? mutation.variables.plan : null,
  );
  const isPending = $derived(billingQuery.isPending || plansQuery.isPending);
  const isError = $derived(billingQuery.isError || plansQuery.isError);

  function handleBack() {
    router.navigate(`/workspaces/${props.id}/billing`);
  }

  function handleRetry() {
    billingQuery.refetch();
    plansQuery.refetch();
  }

  async function handleSelectPlan(plan: WorkspacePlan) {
    if (!canChangePlan || plan === currentPlan || mutation.isPending) {
      return;
    }

    try {
      await mutation.mutateAsync({ plan, billing_period: 'monthly' });
      router.navigate(`/workspaces/${props.id}/billing`);
    } catch {
      router.navigate('/internal-server-error', { replace: true });
    }
  }
</script>

<section class="change-plan-page">
  <PageHeader
    title="Сменить тариф"
    onback={handleBack}
  />

  {#if isPending}
    <div class="stack">
      <div class="skeleton-copy"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>
  {:else if isError}
    <QueryErrorState
      title="Не удалось загрузить тарифы"
      backLabel="Назад"
      onback={handleBack}
      onretry={handleRetry}
    />
  {:else}
    <div class="stack">
      {#if canChangePlan}
        <Typography
          variant="body"
          color="#737373"
        >
          Выберите подходящий тариф для вашего пространства
        </Typography>

        {#each planViews as plan (plan.value)}
          <PlanCard
            plan={plan}
            highlighted={plan.value === currentPlan}
            badgeText={plan.value === currentPlan ? 'Текущий' : ''}
            pricePosition={plan.value === currentPlan ? 'below-title' : 'top-right'}
            showFeatures
            actionLabel={plan.value === currentPlan ? '' : `Перейти на ${plan.label}`}
            actionLoading={savingPlan === plan.value}
            actionDisabled={mutation.isPending}
            onaction={() => handleSelectPlan(plan.value)}
          />
        {/each}
      {:else}
        <div class="coming-soon-card">
          <Typography
            variant="title"
            color="#171717"
          >
            Смена тарифа скоро
          </Typography>

          <Typography
            variant="body"
            color="#737373"
          >
            Для администраторов workspace этот экран станет доступен после появления отдельного
            endpoint-а `PATCH /workspaces/:id/billing/plan`.
          </Typography>
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .change-plan-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 14px 8px 20px;
    background: #fafafa;
  }

  .stack {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    overflow: auto;
    padding: 0 8px 8px;
  }

  .stack :global(p) {
    margin: 0;
  }

  .stack :global(h2) {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 700;
  }

  .skeleton-copy,
  .skeleton-card {
    position: relative;
    overflow: hidden;
    background: #f1f5f9;
  }

  .skeleton-copy::after,
  .skeleton-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.75), transparent);
    transform: translateX(-100%);
    animation: shimmer 1.2s infinite;
  }

  .skeleton-copy {
    height: 42px;
    border-radius: 8px;
  }

  .skeleton-card {
    height: 182px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .coming-soon-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
  }

  .coming-soon-card :global(p) {
    margin: 0;
  }

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
