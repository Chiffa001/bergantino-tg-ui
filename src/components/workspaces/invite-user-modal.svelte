<script lang="ts">
  import { Modal, Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspaceInviteMutation } from '@/api/workspaces/queries';
  import type { WorkspaceInvite, WorkspaceInviteRole } from '@/api/workspaces/types';
  import Button from '@/components/ui/button.svelte';
  import RadioCardOption from '@/components/ui/radio-card-option.svelte';
  import { copyTextToClipboard } from '@/lib/copy-to-clipboard';
  import { formatInviteExpirationDays } from '@/lib/invite-expiration';
  import { router } from '@/lib/router';
  import {
    getPlanLimitExceededDetail,
    getPlanLimitExceededMessage,
    type PlanLimitExceededDetail,
  } from '@/lib/workspace-invite-limits';
  import {
    getWorkspaceInviteRoleLabel,
    WORKSPACE_INVITE_ROLE_DESCRIPTIONS,
  } from '@/lib/workspace-invites';

  type Props = {
    allowedRoles: WorkspaceInviteRole[];
    isOpen: boolean;
    workspaceId: string;
    onClose: () => void;
  };

  const { allowedRoles, isOpen, workspaceId, onClose }: Props = $props();

  const mutation = createWorkspaceInviteMutation(() => workspaceId);

  let invite = $state<WorkspaceInvite | null>(null);
  let isCopied = $state(false);
  let errorMessage = $state('');
  let planLimitExceeded = $state<PlanLimitExceededDetail | null>(null);
  let selectedRole = $state<WorkspaceInviteRole | null>(null);
  let wasOpen = $state(false);

  $effect(() => {
    if (!isOpen) {
      wasOpen = false;
      invite = null;
      isCopied = false;
      errorMessage = '';
      planLimitExceeded = null;
      mutation.reset();
      return;
    }

    if (!wasOpen) {
      invite = null;
      isCopied = false;
      errorMessage = '';
      planLimitExceeded = null;
      mutation.reset();
      wasOpen = true;
    }

    if (!selectedRole || !allowedRoles.includes(selectedRole)) {
      selectedRole = allowedRoles[0] ?? null;
    }
  });

  async function createInvite() {
    if (mutation.isPending || !selectedRole) {
      return;
    }

    errorMessage = '';
    invite = null;
    isCopied = false;
    planLimitExceeded = null;

    try {
      invite = await mutation.mutateAsync({ role: selectedRole });
    } catch (err) {
      const limitDetail = getPlanLimitExceededDetail(err);

      if (limitDetail) {
        planLimitExceeded = limitDetail;
        return;
      }

      const message = err instanceof Error ? err.message : '';
      errorMessage =
        message === 'client_error'
          ? 'Не удалось создать ссылку для выбранной роли. Попробуйте ещё раз.'
          : 'Сервис временно недоступен. Попробуйте снова чуть позже.';
    }
  }

  function handleRoleSelect(role: WorkspaceInviteRole) {
    if (!allowedRoles.includes(role) || mutation.isPending) {
      return;
    }

    selectedRole = role;
    errorMessage = '';
    invite = null;
    isCopied = false;
    planLimitExceeded = null;
  }

  async function shareInviteLink() {
    if (!invite) {
      return;
    }

    try {
      await copyTextToClipboard(invite.invite_url);
      isCopied = true;
      errorMessage = '';
    } catch {
      errorMessage = 'Не удалось скопировать ссылку. Попробуйте снова.';
    }
  }

  const daysUntilExpirationLabel = $derived(
    invite ? formatInviteExpirationDays(invite.expires_at) : '',
  );
  const selectedRoleLabel = $derived(
    selectedRole ? getWorkspaceInviteRoleLabel(selectedRole) : '',
  );
  const planLimitExceededMessage = $derived(
    planLimitExceeded ? getPlanLimitExceededMessage(planLimitExceeded) : '',
  );
</script>

<Modal
  {isOpen}
  onClose={onClose}
  withoutAnimation={true}
>
  <div class="invite-modal">
    <div class="invite-copy">
      <Typography
        variant="h2"
        color="#0a0a0a"
      >
        Пригласить пользователя
      </Typography>

      {#if mutation.isPending || invite}
        <span class="role-badge">
          <Typography
            variant="caption"
            color="#4f46e5"
          >
            Роль: {selectedRoleLabel}
          </Typography>
        </span>
      {:else if !planLimitExceeded}
        <Typography
          variant="body"
          color={errorMessage ? '#dc2626' : '#737373'}
        >
          {errorMessage || 'Выберите роль для нового участника'}
        </Typography>
      {/if}
    </div>

    {#if mutation.isPending}
      <div class="loading-area">
        <span
          class="spinner"
          aria-hidden="true"
        ></span>

        <Typography
          variant="body"
          color="#737373"
        >
          Создание ссылки...
        </Typography>
      </div>
    {:else if invite}
      <div class="invite-ready">
        <div class="invite-card">
          <Typography
            variant="caption"
            color="#171717"
          >
            🔗 {invite.invite_url}
          </Typography>
        </div>

        <Typography
          variant="caption"
          color="#737373"
        >
          Ссылка действительна {daysUntilExpirationLabel}
        </Typography>
      </div>
    {:else if planLimitExceeded}
      <div class="limit-block">
        <Typography
          variant="body"
          color="#dc2626"
        >
          Достигнут лимит участников
        </Typography>

        <Typography
          variant="caption"
          color="#7f1d1d"
        >
          {planLimitExceededMessage}
        </Typography>
      </div>
    {:else}
      <div class="role-list">
        {#each allowedRoles as role (role)}
          <RadioCardOption
            checked={selectedRole === role}
            title={getWorkspaceInviteRoleLabel(role)}
            description={WORKSPACE_INVITE_ROLE_DESCRIPTIONS[role]}
            onclick={() => handleRoleSelect(role)}
          />
        {/each}
      </div>
    {/if}

    <div class="invite-actions">
      {#if mutation.isPending}
        <Button
          variant="secondary"
          disabled={true}
        >
          Поделиться
        </Button>
      {:else if invite}
        {#if isCopied}
          <Button
            variant="success"
            disabled={true}
          >
            <span class="copied-content">
              <span
                class="copied-check"
                aria-hidden="true"
              >✓</span>
              <span>Скопировано</span>
            </span>
          </Button>
        {:else}
          <Button onclick={() => void shareInviteLink()}>
            Поделиться
          </Button>
        {/if}
      {:else if planLimitExceeded}
        <Button
          onclick={() => {
            router.navigate(`/workspaces/${workspaceId}/billing/change-plan`);
          }}
        >
          Сменить тариф
        </Button>
      {:else}
        <Button
          disabled={!selectedRole}
          onclick={() => {
            void createInvite();
          }}
        >
          Получить ссылку
        </Button>
      {/if}

      <Button
        variant="ghost"
        onclick={onClose}
      >
        Закрыть
      </Button>
    </div>
  </div>
</Modal>

<style>
  .invite-modal {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-sizing: border-box;
  }

  .invite-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    text-align: center;
  }

  .invite-copy :global(h2),
  .invite-copy :global(p),
  .invite-card :global(p) {
    margin: 0;
  }

  .invite-copy :global(h2) {
    font-size: 20px;
    line-height: 1.25;
  }

  .invite-copy :global(p) {
    font-size: 15px;
    line-height: 1.4;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: #eef2ff;
  }

  .role-list,
  .invite-ready {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .limit-block {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px solid #fecaca;
    border-radius: 12px;
    background: #fef2f2;
    box-sizing: border-box;
  }

  .limit-block :global(p) {
    margin: 0;
  }

  .loading-area {
    display: flex;
    width: 100%;
    min-height: 120px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 3px solid rgb(79 70 229 / 0.12);
    border-top-color: #4f46e5;
    animation: spin 0.8s linear infinite;
  }

  .invite-card {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 14px;
    border-radius: 10px;
    background: #f5f5f5;
    overflow: hidden;
  }

  .invite-actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 14px;
  }

  .copied-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
  }

  .copied-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #ffffff;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
