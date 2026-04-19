<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { authStore } from '@/core/auth/store/store';
  import {
    createWorkspaceBillingPlansQuery,
    createWorkspaceBillingQuery,
  } from '@/core/workspace/api/queries';
  import PlanCard from '@/modules/billing/components/plan-card.svelte';
  import {
    getBillingStatusLabel,
    getCurrentBillingPlan,
    getWorkspaceBillingDetails,
    getWorkspaceBillingHistory,
    toBillingPlanView,
  } from '@/modules/billing/domain';
  import QueryErrorState from '@/shared/components/error/query-error-state.svelte';
  import Button from '@/shared/components/ui/button.svelte';
  import PageHeader from '@/shared/components/ui/page-header.svelte';
  import { router } from '@/shared/lib/router';

  type Props = {
    id: string;
  };

  const props: Props = $props();
  const billingQuery = createWorkspaceBillingQuery(() => props.id);
  const plansQuery = createWorkspaceBillingPlansQuery(() => props.id);
  const currentUser = authStore.getUser();
  const canChangePlan = currentUser?.is_super_admin ?? false;

  const billing = $derived(billingQuery.data);
  const currentPlan = $derived(
    billing && plansQuery.data ? getCurrentBillingPlan(plansQuery.data, billing.plan) : null,
  );
  const planView = $derived(currentPlan && billing ? toBillingPlanView(currentPlan, billing) : null);
  const latestPaymentMethodLast4 = $derived(
    billing?.recent_payments.find((payment) => payment.payment_method_last4)?.payment_method_last4 ?? null,
  );
  const billingRows = $derived(
    billing ? getWorkspaceBillingDetails(billing, latestPaymentMethodLast4) : [],
  );
  const historyItems = $derived(billing?.recent_payments ? getWorkspaceBillingHistory(billing.recent_payments) : []);
  const isPending = $derived(billingQuery.isPending || plansQuery.isPending);
  const isError = $derived(billingQuery.isError || plansQuery.isError);

  function handleBack() {
    router.navigate(`/workspaces/${props.id}`);
  }

  function handleRetry() {
    billingQuery.refetch();
    plansQuery.refetch();
  }

  function handleChangePlan() {
    router.navigate(`/workspaces/${props.id}/billing/change-plan`);
  }
</script>

<section class="billing-page">
  <PageHeader
    title="Оплата и тариф"
    onback={handleBack}
  />

  {#if isPending}
    <div class="stack">
      <div class="skeleton-card skeleton-card--hero"></div>
      <div class="section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card skeleton-card--details"></div>
      </div>
      <div class="section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card skeleton-card--history"></div>
      </div>
    </div>
  {:else if isError}
    <QueryErrorState
      title="Не удалось загрузить биллинг"
      backLabel="Назад"
      onback={handleBack}
      onretry={handleRetry}
    />
  {:else if billing && planView}
    <div class="stack">
      <PlanCard
        plan={planView}
        highlighted
        eyebrowText="Текущий тариф"
        badgeText={billing.subscription ? getBillingStatusLabel(billing.subscription.status) : 'Free'}
        badgeAlign="start"
        headingLevel="h1"
        showUsage
      />

      <section class="section">
        <Typography
          variant="title"
          color="#171717"
        >
          Детали оплаты
        </Typography>

        <div class="info-card">
          {#each billingRows as row, index (row.key)}
            <div class={`info-row ${index < billingRows.length - 1 ? 'info-row--bordered' : ''}`.trim()}>
              <Typography
                variant="caption"
                color="#737373"
              >
                {row.label}
              </Typography>

              {#if row.key === 'autopay'}
                <div class="autopay-value">
                  <span
                    class={`switch ${row.value === 'Включено' ? 'switch--on' : ''} switch--disabled`.trim()}
                    aria-label={`${row.value}. Скоро`}
                    aria-disabled="true"
                  >
                    <span class="switch-thumb"></span>
                  </span>

                  <Typography
                    variant="caption"
                    color="#a3a3a3"
                  >
                    Скоро
                  </Typography>
                </div>
              {:else}
                <Typography
                  variant="caption"
                  color="#171717"
                >
                  {row.value}
                </Typography>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <section class="section">
        <Typography
          variant="title"
          color="#171717"
        >
          История платежей
        </Typography>

        <div class="history-card">
          {#if historyItems.length === 0}
            <div class="history-empty">
              <div class="history-empty-copy">
                <Typography
                  variant="body"
                  color="#171717"
                >
                  Платежей пока нет
                </Typography>

                <Typography
                  variant="caption"
                  color="#737373"
                >
                  Когда появятся первые списания, они отобразятся здесь.
                </Typography>
              </div>
            </div>
          {:else}
            {#each historyItems as item, index (item.id)}
              <div class={`history-row ${index < historyItems.length - 1 ? 'history-row--bordered' : ''}`.trim()}>
                <div class="history-copy">
                  <Typography
                    variant="body"
                    color="#171717"
                  >
                    {item.date}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="#737373"
                  >
                    {item.title} — {item.subtitle}
                  </Typography>
                </div>

                <Typography
                  variant="body"
                  color="#171717"
                >
                  {item.amount}
                </Typography>
              </div>
            {/each}
          {/if}
        </div>
      </section>

      <div class="spacer"></div>

      <Button
        variant="secondary"
        class="change-plan-button"
        disabled={!canChangePlan}
        onclick={handleChangePlan}
      >
        {canChangePlan ? 'Сменить тариф' : 'Смена тарифа скоро'}
      </Button>
    </div>
  {/if}
</section>

<style>
  .billing-page {
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
    gap: 16px;
    overflow: auto;
    padding: 0 8px 8px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section :global(p),
  .stack :global(p) {
    margin: 0;
  }

  .info-row,
  .history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .info-card,
  .history-card {
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fafafa;
    overflow: hidden;
  }

  .info-row,
  .history-row {
    min-height: 48px;
    padding: 0 14px;
  }

  .autopay-value {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .switch--disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .info-row--bordered,
  .history-row--bordered {
    border-bottom: 1px solid #f0f0f0;
  }

  .history-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .history-empty {
    display: flex;
    min-height: 72px;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    text-align: center;
    background: linear-gradient(180deg, #fcfcfd 0%, #f7f7f8 100%);
  }

  .history-empty-copy {
    display: flex;
    max-width: 220px;
    flex-direction: column;
    gap: 4px;
  }

  .switch {
    display: inline-flex;
    width: 40px;
    height: 24px;
    flex-shrink: 0;
    align-items: center;
    padding: 2px;
    border-radius: 999px;
    background: #d4d4d8;
    transition: background 0.15s ease;
  }

  .switch--on {
    justify-content: flex-end;
    background: #171717;
  }

  .switch-thumb {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #ffffff;
  }

  .spacer {
    min-height: 12px;
    flex: 1;
  }

  .change-plan-button {
    background: #f5f5f5;
    border-color: transparent;
  }

  .skeleton-card,
  .skeleton-heading {
    position: relative;
    overflow: hidden;
    background: #f1f5f9;
  }

  .skeleton-card::after,
  .skeleton-heading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.75), transparent);
    transform: translateX(-100%);
    animation: shimmer 1.2s infinite;
  }

  .skeleton-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .skeleton-card--hero {
    height: 154px;
  }

  .skeleton-card--details {
    height: 145px;
  }

  .skeleton-card--history {
    height: 168px;
  }

  .skeleton-heading {
    width: 140px;
    height: 20px;
    border-radius: 8px;
  }

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
