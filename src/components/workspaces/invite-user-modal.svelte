<script lang="ts">
  import { Modal, Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspaceInviteMutation } from '@/api/workspaces/queries';
  import type { WorkspaceInvite } from '@/api/workspaces/types';
  import Button from '@/components/ui/button.svelte';
  import { copyTextToClipboard } from '@/lib/copy-to-clipboard';
  import { formatDate } from '@/lib/format-date';
  import { formatInviteExpirationDays } from '@/lib/invite-expiration';

  type Props = {
    isOpen: boolean;
    workspaceId: string;
    onClose: () => void;
  };

  const { isOpen, workspaceId, onClose }: Props = $props();

  const mutation = createWorkspaceInviteMutation(() => workspaceId);

  let invite = $state<WorkspaceInvite | null>(null);
  let errorMessage = $state('');
  let isCopied = $state(false);
  let wasOpened = $state(false);

  $effect(() => {
    if (!isOpen) {
      wasOpened = false;
      invite = null;
      errorMessage = '';
      isCopied = false;
      mutation.reset();
      return;
    }

    if (wasOpened) {
      return;
    }

    wasOpened = true;
    invite = null;
    errorMessage = '';
    isCopied = false;
    mutation.reset();
    void createInvite();
  });

  async function createInvite() {
    if (mutation.isPending) {
      return;
    }

    errorMessage = '';
    isCopied = false;

    try {
      invite = await mutation.mutateAsync({ role: 'assistant' });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      errorMessage =
        message === 'server_error'
          ? 'Сервис временно недоступен. Попробуйте снова чуть позже.'
          : 'Не удалось создать ссылку-приглашение. Попробуйте снова.';
    }
  }

  async function copyInviteLink() {
    if (!invite) {
      return;
    }

    try {
      await copyTextToClipboard(invite.invite_url);
      isCopied = true;
    } catch {
      errorMessage = 'Не удалось скопировать ссылку. Попробуйте снова.';
    }
  }

  const expiresLabel = $derived(invite ? formatDate(invite.expires_at) : '');
  const daysUntilExpirationLabel = $derived(invite ? formatInviteExpirationDays(invite.expires_at) : '');
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
        Добавить пользователя
      </Typography>

      {#if mutation.isPending}
        <Typography
          variant="body"
          color="#737373"
        >
          Создание ссылки...
        </Typography>
      {:else if errorMessage}
        <Typography
          variant="body"
          color="#dc2626"
        >
          {errorMessage}
        </Typography>
      {:else if invite}
        <Typography
          variant="body"
          color="#737373"
        >
          Ссылка действительна {daysUntilExpirationLabel}, до {expiresLabel}
        </Typography>
      {/if}
    </div>

    {#if mutation.isPending}
      <div class="loading-area">
        <span
          class="spinner"
          aria-hidden="true"
        ></span>
      </div>
    {/if}

    {#if invite}
      <button
        class="invite-card"
        type="button"
        onclick={() => {
          void copyInviteLink();
        }}
      >
        <Typography
          variant="caption"
          size={14}
          color="#737373"
        >
          🔗 {invite.invite_url}
        </Typography>
      </button>
    {/if}

    <div class="invite-actions">
      {#if errorMessage}
        <Button
          onclick={() => {
            void createInvite();
          }}
        >
          Попробовать снова
        </Button>
      {:else if invite}
        <Button
          variant={isCopied ? 'success' : 'default'}
          onclick={() => {
            void copyInviteLink();
          }}
          disabled={isCopied}
        >
          {#if isCopied}
            <span class="success-button-label">
              <span class="success-button-text">Скопировано</span>
              <span class="success-icon-check">✓</span>
            </span>
          {:else}
            Поделиться
          {/if}
        </Button>
      {:else}
        <Button
          variant="secondary"
          disabled={true}
        >
          Поделиться
        </Button>
      {/if}

      <Button
        variant="ghost"
        onclick={onClose}
        disabled={mutation.isPending && !invite}
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
    gap: 16px;
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

  .loading-area {
    display: flex;
    width: 100%;
    min-height: 120px;
    align-items: center;
    justify-content: center;
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
    border: 0;
    border-radius: 10px;
    background: #f5f5f5;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .invite-card :global(span) {
    line-height: 1.45;
  }

  .invite-card:hover {
    background: #e5e5e5;
  }

  .invite-card:active {
    background: #d4d4d4;
  }

  .invite-actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 14px;
  }

  .success-button-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .success-button-text {
    display: inline-block;
  }

  .success-icon-check {
    position: absolute;
    right: 100%;
    top: 50%;
    color: #ffffff;
    margin-right: 4px;
    font-size: 14px;
    line-height: 1;
    font-weight: 700;
    transform: translateY(-50%);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
