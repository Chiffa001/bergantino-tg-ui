<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspaceBillingQuery, createWorkspaceDetailQuery } from '@/api/workspaces/queries';
  import {
    WORKSPACE_PLAN_LABELS,
    WORKSPACE_ROLE,
    WORKSPACE_STATUS_LABELS,
    type WorkspaceDetail,
  } from '@/api/workspaces/types';
  import PageHeader from '@/components/ui/page-header.svelte';
  import QueryErrorState from '@/components/ui/query-error-state.svelte';
  import RelatedList from '@/components/ui/related-list.svelte';
  import ChevronRightIcon from '@/icons/chevron-right-icon.svelte';
  import InviteUserIcon from '@/icons/invite-user-icon.svelte';
  import PaymentCardIcon from '@/icons/payment-card-icon.svelte';
  import SettingsGearIcon from '@/icons/settings-gear-icon.svelte';
  import { authStore } from '@/lib/auth';
  import { formatDate } from '@/lib/format-date';
  import { formatFeeRate } from '@/lib/format-fee-rate';
  import { router } from '@/lib/router';
  import { setStoredWorkspaceSlug } from '@/lib/workspace-context';
  import { hasReachedMembersLimit } from '@/lib/workspace-invite-limits';

  type Props = {
    id: string;
  };

  const props: Props = $props();
  const query = createWorkspaceDetailQuery(() => props.id);
  const billingQuery = createWorkspaceBillingQuery(() => props.id);
  const currentUser = authStore.getUser();
  const canManageWorkspace = currentUser?.is_super_admin ?? false;
  const inviteLimitReached = $derived(
    hasReachedMembersLimit(billingQuery.data?.limits_usage.members),
  );

  const roleCards = $derived.by(() => {
    const data = query.data;

    if (!data) {
      return [];
    }

    const cards = [];

    if (currentUser?.is_super_admin) {
      cards.push({
        color: '#4f46e5',
        count: data.members_count.workspace_admin,
        initials: 'AD',
        label: 'Администраторы',
        key: WORKSPACE_ROLE.WORKSPACE_ADMIN,
      });
    }

    cards.push(
      {
        color: '#f59e0b',
        count: data.members_count.assistant,
        initials: 'AS',
        label: 'Ассистенты',
        key: WORKSPACE_ROLE.ASSISTANT,
      },
      {
        color: '#16a34a',
        count: data.members_count.client,
        initials: 'CL',
        label: 'Клиенты',
        key: WORKSPACE_ROLE.CLIENT,
      },
    );

    return cards;
  });

  const infoRows = $derived.by(() => {
    const data = query.data;

    if (!data) {
      return [];
    }

    return [
      {
        key: 'slug',
        label: 'Статус',
        value: WORKSPACE_STATUS_LABELS[data.status],
        valueClassName: `status-badge status-badge--${data.status}`,
        valueVariant: 'status' as const,
      },
      {
        key: 'plan',
        label: 'Тариф',
        value: WORKSPACE_PLAN_LABELS[data.plan],
        valueVariant: 'text' as const,
      },
      {
        key: 'fee_rate',
        label: 'Комиссия',
        value: formatFeeRate(data.fee_rate),
        valueVariant: 'text' as const,
      },
      {
        key: 'created_at',
        label: 'Создано',
        value: formatDate(data.created_at),
        valueVariant: 'text' as const,
      },
    ];
  });

  function handleBack() {
    router.navigate('/');
  }

  function handleRetry() {
    query.refetch();
  }

  function navigateToUsers(role?: string) {
    const suffix = role ? `?role=${role}` : '';
    router.navigate(`/workspaces/${props.id}/users${suffix}`);
  }

  const actionItems = $derived.by<
    { label: string; icon: 'settings' | 'payment' | 'invite'; onclick: () => void; disabled?: boolean; description?: string }[]
  >(() => {
    if (!canManageWorkspace) {
      return [];
    }

    return [
      { label: 'Настройки пространства', icon: 'settings', onclick: () => router.navigate(`/workspaces/${props.id}/settings`) },
      { label: 'Оплата и тариф', icon: 'payment', onclick: () => router.navigate(`/workspaces/${props.id}/billing`) },
      {
        label: 'Пригласить участника',
        icon: 'invite',
        onclick: () => {
          if (inviteLimitReached) {
            return;
          }

          router.navigate(`/workspaces/${props.id}/users`);
        },
        disabled: inviteLimitReached,
        description: inviteLimitReached ? 'Достигнут лимит участников' : undefined,
      },
    ];
  });

  const data = $derived(query.data as WorkspaceDetail | undefined);

  $effect(() => {
    if (!data?.slug) {
      return;
    }

    setStoredWorkspaceSlug(data.slug);
  });
</script>

<section class="workspace-detail-page">
  <PageHeader
    title={data?.title ?? 'Рабочее пространство'}
    onback={handleBack}
  />

  {#if query.isPending}
    <div class="stack">
      <div class="skeleton-card skeleton-card--info"></div>
      <div class="section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card skeleton-card--list"></div>
      </div>
      <div class="section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card skeleton-card--list"></div>
      </div>
    </div>
  {:else if query.isError}
    <QueryErrorState
      title="Не удалось загрузить карточку"
      backLabel="К списку"
      onback={handleBack}
      onretry={handleRetry}
    />
  {:else if data}
    <div class="stack">
      <RelatedList
        class="info-card"
        items={infoRows}
        getKey={(row) => row.key}
        itemClass="info-row"
      >
        {#snippet children(row)}
          <Typography
            variant="caption"
            color="#737373"
          >
            {row.label}
          </Typography>

          <div class="info-row-value">
            {#if row.valueVariant === 'status'}
              <span class={row.valueClassName}>
                <Typography
                  variant="overline"
                  color="currentColor"
                >
                  {row.value}
                </Typography>
              </span>
            {:else}
              <Typography
                variant="caption"
                color="#171717"
              >
                {row.value}
              </Typography>
            {/if}
          </div>
        {/snippet}
      </RelatedList>

      <section class="section">
        <div class="section-header">
          <Typography
            variant="title"
            color="#171717"
          >
            Пользователи
          </Typography>
        </div>

        <RelatedList
          items={roleCards}
          itemAs="button"
          itemClass="user-role-row"
          getKey={(role) => role.key}
          onitemclick={(role) => navigateToUsers(role.key)}
        >
          {#snippet children(role)}
            <div class="list-row-content">
              <div
                class="avatar"
                style={`background:${role.color};`}
                aria-hidden="true"
              >
                <Typography
                  variant="overline"
                  color="#ffffff"
                >
                  {role.initials}
                </Typography>
              </div>

              <div class="row-copy">
                <Typography
                  variant="body"
                  color="#171717"
                >
                  {role.label}
                </Typography>
              </div>

              <Typography
                variant="caption"
                color="#171717"
              >
                {role.count ?? ''}
              </Typography>
            </div>
          {/snippet}
        </RelatedList>

        <button
          class="inline-link"
          type="button"
          onclick={() => navigateToUsers()}
        >
          <Typography
            variant="caption"
            color="#4f46e5"
          >
            Показать всех →
          </Typography>
        </button>
      </section>

      {#if actionItems.length > 0}
        <section class="section">
          <Typography
            variant="title"
            color="#171717"
          >
            Действия
          </Typography>

          <RelatedList
            items={actionItems}
            itemAs="button"
            itemClass="action-row"
            getKey={(item) => item.label}
            onitemclick={(item) => item.onclick()}
          >
            {#snippet children(item)}
              <div class={`action-row-content ${item.disabled ? 'action-row-content--disabled' : ''}`.trim()}>
                <div class="action-left">
                  <span
                    class="action-icon"
                    aria-hidden="true"
                  >
                    {#if item.icon === 'settings'}
                      <SettingsGearIcon />
                    {:else if item.icon === 'payment'}
                      <PaymentCardIcon />
                    {:else}
                      <InviteUserIcon />
                    {/if}
                  </span>

                  <div class="action-copy">
                    <Typography
                      variant="body"
                      color="#171717"
                    >
                      {item.label}
                    </Typography>

                    {#if item.description}
                      <Typography
                        variant="caption"
                        color="#737373"
                      >
                        {item.description}
                      </Typography>
                    {/if}
                  </div>
                </div>

                {#if !item.disabled}
                  <span
                    class="action-arrow"
                    aria-hidden="true"
                  >
                    <ChevronRightIcon />
                  </span>
                {/if}
              </div>
            {/snippet}
          </RelatedList>
        </section>
      {/if}
    </div>
  {/if}
</section>

<style>
  .workspace-detail-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 10px;
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

  .info-card {
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fafafa;
    overflow: hidden;
  }

  .info-card {
    display: flex;
    flex-direction: column;
    padding: 0 14px;
  }

  .info-row {
    display: flex;
    min-height: 38px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .info-row-value {
    display: flex;
    margin-left: auto;
    justify-content: flex-end;
    text-align: right;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-header :global(p),
  .section :global(p) {
    margin: 0;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 53px;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-badge--active {
    background: #dcfce7;
    color: #22c55e;
  }

  .status-badge--suspended {
    background: #fef3c7;
    color: #d97706;
  }

  .status-badge--archived {
    background: #f3f4f6;
    color: #6b7280;
  }

  .list-row-content,
  .action-row {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .action-row-content {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .avatar {
    display: flex;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .avatar :global(p) {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .row-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 1px;
  }

  .row-copy :global(p:first-child) {
    font-size: 14px;
  }

  .inline-link {
    width: fit-content;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .inline-link :global(p) {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
  }

  .action-row {
    padding: 0;
  }

  .user-role-row {
    padding: 0;
  }

  .action-left {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 10px;
  }

  .action-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .action-copy :global(p) {
    margin: 0;
  }

  .action-row-content--disabled {
    opacity: 0.6;
  }

  .action-icon,
  .action-arrow {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
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
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .skeleton-card--info {
    height: 154px;
  }

  .skeleton-card--list {
    height: 154px;
  }

  .skeleton-heading {
    width: 132px;
    height: 20px;
    border-radius: 8px;
  }

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
</style>
