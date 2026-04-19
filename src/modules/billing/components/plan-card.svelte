<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import type { BillingPlanView } from '@/modules/billing/domain';
  import Button from '@/shared/components/ui/button.svelte';

  type Props = {
    plan: BillingPlanView;
    highlighted?: boolean;
    eyebrowText?: string;
    badgeText?: string;
    badgeAlign?: 'start' | 'center';
    headingLevel?: 'h1' | 'h2';
    pricePosition?: 'below-title' | 'top-right';
    showFeatures?: boolean;
    showUsage?: boolean;
    actionLabel?: string;
    actionLoading?: boolean;
    actionDisabled?: boolean;
    onaction?: () => void;
  };

  let {
    plan,
    highlighted = false,
    eyebrowText = '',
    badgeText = '',
    badgeAlign = 'center',
    headingLevel = 'h2',
    pricePosition = 'below-title',
    showFeatures = false,
    showUsage = false,
    actionLabel = '',
    actionLoading = false,
    actionDisabled = false,
    onaction,
  }: Props = $props();

  const titleColor = $derived(highlighted ? '#ffffff' : '#171717');
  const mutedColor = $derived(highlighted ? '#c7d2fe' : '#737373');
  const usageTrackColor = $derived(highlighted ? 'rgb(255 255 255 / 0.24)' : '#e5e7eb');
  const usageFillColor = $derived(highlighted ? '#ffffff' : '#4f46e5');
</script>

<section class={`plan-card ${highlighted ? 'plan-card--highlighted' : ''}`.trim()}>
  <div class="plan-card-top">
    <div class="plan-card-copy">
      {#if eyebrowText}
        <Typography
          variant="caption"
          color={mutedColor}
        >
          {eyebrowText}
        </Typography>
      {/if}

      <div class="plan-card-title">
        <Typography
          variant={headingLevel === 'h1' ? 'h1' : 'h2'}
          color={titleColor}
        >
          {plan.label}
        </Typography>
      </div>
    </div>

    {#if badgeText}
      <span class={`plan-card-badge plan-card-badge--${badgeAlign}`.trim()}>
        <Typography
          variant="overline"
          color="#ffffff"
        >
          {badgeText}
        </Typography>
      </span>
    {:else if pricePosition === 'top-right'}
      <div class="plan-card-price-top">
        <Typography
          variant="caption"
          color={mutedColor}
        >
          {plan.priceLabel}
        </Typography>
      </div>
    {/if}
  </div>

  {#if pricePosition === 'below-title'}
    <Typography
      variant="body"
      color={mutedColor}
    >
      {plan.priceLabel}
    </Typography>
  {/if}

  {#if showFeatures}
    <ul class="feature-list">
      {#each plan.features as feature (`${plan.value}-${feature}`)}
        <li class="feature-item">
          <span
            class={`feature-check ${highlighted ? 'feature-check--highlighted' : ''}`.trim()}
            aria-hidden="true"
          >
            ✓
          </span>

          <Typography
            variant="caption"
            color={highlighted ? '#e0e7ff' : '#737373'}
          >
            {feature}
          </Typography>
        </li>
      {/each}
    </ul>
  {/if}

  {#if showUsage}
    <div class="usage-block">
      <div class="usage-copy">
        <Typography
          variant="caption"
          color={mutedColor}
        >
          Участники
        </Typography>

        <Typography
          variant="caption"
          color={highlighted ? '#ffffff' : '#171717'}
        >
          {plan.usageLabel}
        </Typography>
      </div>

      <div
        class="progress-track"
        style={`background:${usageTrackColor}`}
        aria-hidden="true"
      >
        <div
          class="progress-fill"
          style={`width:${Math.max(plan.ratio * 100, 10)}%;background:${usageFillColor}`}
        ></div>
      </div>
    </div>
  {/if}

  {#if actionLabel}
    <Button
      class={`plan-action ${plan.accent === 'solid' ? 'plan-action--solid' : ''}`.trim()}
      variant={plan.accent === 'solid' ? 'default' : 'secondary'}
      loading={actionLoading}
      disabled={actionDisabled}
      onclick={() => onaction?.()}
    >
      {actionLabel}
    </Button>
  {/if}
</section>

<style>
  .plan-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fafafa;
  }

  .plan-card--highlighted {
    border-color: transparent;
    background: linear-gradient(135deg, #5d52f0 0%, #4f46e5 100%);
  }

  .plan-card-top,
  .usage-copy {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .plan-card-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 6px;
  }

  .plan-card :global(p),
  .plan-card-title {
    margin: 0;
  }

  .plan-card-title :global(h1) {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 700;
  }

  .plan-card-title :global(h2) {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 700;
  }

  .plan-card-badge {
    display: inline-flex;
    min-width: 60px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.18);
  }

  .plan-card-badge--start {
    align-self: flex-start;
  }

  .plan-card-badge--center {
    align-self: center;
  }

  .plan-card-price-top {
    padding-top: 4px;
  }

  .plan-card-badge :global(p) {
    font-size: 10px;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .feature-check {
    display: inline-flex;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: #16a34a;
    font-size: 13px;
    line-height: 1;
  }

  .feature-check--highlighted {
    color: #dbeafe;
  }

  .usage-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .progress-track {
    overflow: hidden;
    width: 100%;
    height: 6px;
    border-radius: 999px;
  }

  .progress-fill {
    height: 100%;
    border-radius: inherit;
  }

  .plan-action {
    margin-top: 2px;
  }

  .plan-action--solid {
    border-color: transparent;
  }
</style>
