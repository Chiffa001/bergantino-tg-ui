<script lang="ts">
  import { LoaderContainer, Typography } from '@chiffa001/tg-svelte-ui';

  import Button from '@/components/ui/button.svelte';
  import { useInvitePage } from '@/hooks/use-invite-page.svelte';
  import ForbiddenIcon from '@/icons/forbidden-icon.svelte';
  import InviteUserIcon from '@/icons/invite-user-icon.svelte';
  import NotFoundIcon from '@/icons/not-found-icon.svelte';
  import { InviteScreenState } from '@/lib/invite';

  type Props = {
    token: string;
  };

  const props: Props = $props();
  const model = useInvitePage(() => props.token);
</script>

<section class="invite-page">
  {#if model.screenState === InviteScreenState.Loading || model.screenState === InviteScreenState.Submitting}
    <div class="center-state">
      <div class="loader-ring">
        <LoaderContainer />
      </div>

      <Typography
        variant="body"
        color="#7b8190"
      >
        {model.screenState === InviteScreenState.Submitting
          ? 'Принимаем приглашение...'
          : 'Проверка приглашения...'}
      </Typography>
    </div>
  {:else if model.screenState === InviteScreenState.Confirm && model.detailQuery.data}
    <div class="invite-card">
      <div class="invite-icon invite-icon--primary">
        <InviteUserIcon
          size={22}
          color="#5a4ff3"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        {model.detailQuery.data.workspace_title}
      </Typography>

      <span class="role-badge">
        <Typography
          variant="caption"
          color="#5a4ff3"
        >
          {model.roleLabel}
        </Typography>
      </span>

      <Typography
        variant="caption"
        color="#8b91a1"
      >
        Срок действия: до {model.expiresAtLabel}
      </Typography>

      <div class="invite-actions">
        <Button
          onclick={() => {
            void model.handleAccept();
          }}
          loading={model.acceptMutation.isPending}
        >
          Принять приглашение
        </Button>

        <button
          class="skip-button"
          type="button"
          onclick={model.navigateHome}
        >
          <Typography
            variant="body"
            color="#676d7d"
          >
            Не сейчас
          </Typography>
        </button>
      </div>

      {#if model.acceptErrorMessage}
        <Typography
          variant="caption"
          color="#dc2626"
        >
          {model.acceptErrorMessage}
        </Typography>
      {/if}
    </div>
  {:else if model.screenState === InviteScreenState.AlreadyMember && model.detailQuery.data}
    <div class="center-state center-state--narrow">
      <div class="invite-icon invite-icon--primary">
        <InviteUserIcon
          size={22}
          color="#5a4ff3"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        Вы уже участник этого workspace
      </Typography>

      <Typography
        variant="body"
        color="#7b8190"
      >
        Вы уже состоите в рабочем пространстве «{model.detailQuery.data.workspace_title}». Можете перейти к нему прямо сейчас.
      </Typography>

      <Button onclick={model.navigateToWorkspace}>
        Перейти в workspace
      </Button>
    </div>
  {:else if model.screenState === InviteScreenState.Expired}
    <div class="center-state center-state--narrow">
      <div class="invite-icon invite-icon--danger">
        <ForbiddenIcon
          size={24}
          color="#ff5a55"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        Ссылка больше не действительна
      </Typography>

      <Typography
        variant="body"
        color="#7b8190"
      >
        Срок действия приглашения истёк. Попросите администратора отправить новую ссылку.
      </Typography>
    </div>
  {:else if model.screenState === InviteScreenState.Used}
    <div class="center-state center-state--narrow">
      <div class="invite-icon invite-icon--primary">
        <InviteUserIcon
          size={22}
          color="#5a4ff3"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        Приглашение уже было принято
      </Typography>

      <Typography
        variant="body"
        color="#7b8190"
      >
        Эта ссылка уже использована. Если доступ всё ещё нужен, попросите администратора отправить новое приглашение.
      </Typography>
    </div>
  {:else if model.screenState === InviteScreenState.NotFound}
    <div class="center-state center-state--narrow">
      <div class="invite-icon invite-icon--muted">
        <NotFoundIcon
          size={24}
          color="#7b8190"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        Приглашение не найдено
      </Typography>

      <Typography
        variant="body"
        color="#7b8190"
      >
        Проверьте ссылку или попросите администратора создать новое приглашение.
      </Typography>
    </div>
  {:else}
    <div class="center-state center-state--narrow">
      <div class="invite-icon invite-icon--muted">
        <NotFoundIcon
          size={24}
          color="#7b8190"
        />
      </div>

      <Typography
        variant="h2"
        color="#151515"
      >
        Не удалось загрузить приглашение
      </Typography>

      <Typography
        variant="body"
        color="#7b8190"
      >
        Проверьте соединение и повторите попытку.
      </Typography>

      <div class="error-actions">
        <Button
          variant="secondary"
          onclick={model.navigateHome}
        >
          Назад
        </Button>

        <Button onclick={model.retryDetail}>
          Повторить
        </Button>
      </div>
    </div>
  {/if}
</section>

<style>
  .invite-page {
    display: flex;
    width: 100%;
    min-height: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 24px 16px;
    background:
      radial-gradient(circle at top, rgb(90 79 243 / 0.08), transparent 30%),
      linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%);
  }

  .center-state {
    display: flex;
    width: min(100%, 340px);
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }

  .center-state--narrow {
    width: min(100%, 320px);
  }

  .center-state :global(h2),
  .center-state :global(p),
  .invite-card :global(h2),
  .invite-card :global(p) {
    margin: 0;
  }

  .invite-card {
    display: flex;
    width: min(100%, 340px);
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border: 1px solid #e8e8ef;
    border-radius: 20px;
    background: rgb(255 255 255 / 0.92);
    box-shadow: 0 18px 50px rgb(28 35 64 / 0.05);
    padding: 28px 16px 18px;
    text-align: center;
    backdrop-filter: blur(8px);
  }

  .invite-icon {
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .invite-icon--primary {
    background: #eef0ff;
  }

  .invite-icon--danger {
    background: #fff1f1;
  }

  .invite-icon--muted {
    background: #f3f4f8;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: #eef0ff;
  }

  .invite-actions,
  .error-actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .invite-actions {
    margin-top: 6px;
  }

  .skip-button {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .loader-ring {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(1.1);
  }
</style>
