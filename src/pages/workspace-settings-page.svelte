<script lang="ts">
  import { Modal, Typography } from '@chiffa001/tg-svelte-ui';

  import { createUpdateWorkspaceMutation, createWorkspaceDetailQuery } from '@/api/workspaces/queries';
  import Button from '@/components/ui/button.svelte';
  import PageHeader from '@/components/ui/page-header.svelte';
  import QueryErrorState from '@/components/ui/query-error-state.svelte';
  import RelatedList from '@/components/ui/related-list.svelte';
  import { router } from '@/lib/router';
  import { buildWorkspaceMiniAppUrl, normalizeBotUsername } from '@/lib/workspace-bot';

  type Props = {
    id: string;
  };

  const props: Props = $props();
  const query = createWorkspaceDetailQuery(() => props.id);
  const mutation = createUpdateWorkspaceMutation(() => props.id);

  let botFormOpen = $state(false);
  let disconnectOpen = $state(false);
  let tokenField = $state('');
  let usernameField = $state('');
  let tokenError = $state<string | null>(null);
  let saveSuccess = $state(false);

  const normalizedUsername = $derived(normalizeBotUsername(usernameField));
  const miniAppUrl = $derived(
    normalizedUsername.length > 0 ? buildWorkspaceMiniAppUrl(normalizedUsername) : '',
  );
  const formValid = $derived(tokenField.trim().length > 0 && normalizedUsername.length > 0);

  const data = $derived(query.data);
  const hasBot = $derived(data?.has_bot ?? false);

  const infoRows = $derived(
    data
      ? [
        { key: 'title', label: 'Название', value: data.title },
        { key: 'slug', label: 'Slug', value: data.slug },
      ]
      : [],
  );

  function handleBack() {
    router.navigate(`/workspaces/${props.id}`);
  }

  function handleRetry() {
    query.refetch();
  }

  function openForm() {
    botFormOpen = true;
    tokenField = '';
    usernameField = data?.bot_username ?? '';
    tokenError = null;
    saveSuccess = false;
  }

  function cancelForm() {
    botFormOpen = false;
    tokenField = '';
    usernameField = '';
    tokenError = null;
  }

  async function handleSave() {
    if (!formValid) return;

    tokenError = null;

    try {
      await mutation.mutateAsync({
        bot_token: tokenField.trim(),
        bot_username: normalizedUsername,
      });

      botFormOpen = false;
      saveSuccess = true;
      tokenField = '';
      usernameField = '';
    } catch (err) {
      const error = err as Error;

      if (error.message === 'client_error') {
        tokenError = 'Неверный токен. Проверьте значение из BotFather';
      } else {
        router.navigate('/internal-server-error', { replace: true });
      }
    }
  }

  async function handleDisconnect() {
    disconnectOpen = false;

    try {
      await mutation.mutateAsync({
        bot_token: null,
        bot_username: null,
      });
    } catch {
      router.navigate('/internal-server-error', { replace: true });
    }
  }
</script>

<section class="settings-page">
  <PageHeader
    title="Настройки"
    onback={handleBack}
  />

  {#if query.isPending}
    <div class="stack">
      <div class="skeleton-section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card"></div>
      </div>
      <div class="skeleton-section">
        <div class="skeleton-heading"></div>
        <div class="skeleton-card skeleton-card--tall"></div>
      </div>
    </div>
  {:else if query.isError}
    <QueryErrorState
      title="Не удалось загрузить настройки"
      backLabel="Назад"
      onback={handleBack}
      onretry={handleRetry}
    />
  {:else if data}
    <div class="stack">
      <!-- Основное -->
      <section class="section">
        <Typography
          variant="title"
          color="#171717"
        >
          Основное
        </Typography>

        <RelatedList
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

            <Typography
              variant="caption"
              color="#171717"
            >
              {row.value}
            </Typography>
          {/snippet}
        </RelatedList>
      </section>

      <!-- Telegram-бот -->
      <section class="section">
        <div class="section-header">
          <Typography
            variant="title"
            color="#171717"
          >
            Telegram-бот
          </Typography>

          {#if hasBot && !botFormOpen}
            <span class="connected-badge">
              <span
                class="connected-dot"
                aria-hidden="true"
              ></span>
              <Typography
                variant="caption"
                color="#16a34a"
              >
                Подключён
              </Typography>
            </span>
          {/if}
        </div>

        {#if !hasBot && !botFormOpen}
          <!-- Бот не подключён -->
          <div class="bot-card">
            <Typography
              variant="body"
              color="#737373"
            >
              Сейчас используется системный бот по умолчанию. Подключите собственного бота, чтобы
              пользователи открывали приложение через него.
            </Typography>

            <Button
              variant="secondary"
              onclick={openForm}
            >
              Подключить бота
            </Button>
          </div>
        {:else if botFormOpen}
          <!-- Форма подключения -->
          <div class="bot-form">
            <div class="field">
              <label class="field-label">
                <Typography
                  variant="caption"
                  color="#737373"
                >
                  Токен бота
                </Typography>
              </label>

              <input
                class="input"
                class:input--error={tokenError}
                type="password"
                placeholder="123456:ABC-DEF..."
                autocomplete="off"
                bind:value={tokenField}
              />

              {#if tokenError}
                <Typography
                  variant="caption"
                  color="#dc2626"
                >
                  {tokenError}
                </Typography>
              {:else}
                <Typography
                  variant="caption"
                  color="#a3a3a3"
                >
                  Токен можно получить у @BotFather командой /newbot
                </Typography>
              {/if}
            </div>

            <div class="field">
              <label class="field-label">
                <Typography
                  variant="caption"
                  color="#737373"
                >
                  Username бота
                </Typography>
              </label>

              <input
                class="input"
                type="text"
                placeholder="ClinicBot"
                bind:value={usernameField}
              />

              <Typography
                variant="caption"
                color="#a3a3a3"
              >
                Mini App URL строится автоматически: {miniAppUrl || 'https://t.me/<bot_username>'}
              </Typography>
            </div>

            <Button
              disabled={!formValid}
              loading={mutation.isPending}
              onclick={() => void handleSave()}
            >
              Сохранить
            </Button>

            <Button
              variant="ghost"
              onclick={cancelForm}
            >
              Отмена
            </Button>
          </div>
        {:else}
          <!-- Бот подключён -->
          {#if saveSuccess}
            <div class="success-banner">
              <Typography
                variant="caption"
                color="#16a34a"
              >
                ✓ Бот подключён
              </Typography>
            </div>
          {/if}

          <div class="bot-card">
            <div class="bot-info">
              <Typography
                variant="body"
                color="#171717"
              >
                @{data.bot_username}
              </Typography>

              <Typography
                variant="caption"
                color="#737373"
              >
                {data.bot_username ? buildWorkspaceMiniAppUrl(data.bot_username) : ''}
              </Typography>
            </div>

            <div class="bot-actions">
              <Button
                variant="secondary"
                onclick={openForm}
              >
                Изменить токен
              </Button>

              <Button
                variant="destructive"
                onclick={() => (disconnectOpen = true)}
              >
                Отключить бота
              </Button>
            </div>
          </div>
        {/if}
      </section>
    </div>
  {/if}
</section>

<!-- Подтверждение отключения -->
<Modal
  isOpen={disconnectOpen}
  onClose={() => (disconnectOpen = false)}
  withoutAnimation={true}
>
  <div class="disconnect-sheet">
    <div
      class="disconnect-icon"
      aria-hidden="true"
    >
      🤖
    </div>

    <div class="disconnect-copy">
      <Typography
        variant="h2"
        color="#0a0a0a"
      >
        Отключить бота?
      </Typography>

      <Typography
        variant="body"
        color="#737373"
      >
        Пользователи вернутся к системному боту. Старые invite-ссылки перестанут вести на этого
        бота.
      </Typography>
    </div>

    <div class="disconnect-actions">
      <Button
        variant="destructive"
        loading={mutation.isPending}
        onclick={() => void handleDisconnect()}
      >
        Отключить
      </Button>

      <Button
        variant="ghost"
        onclick={() => (disconnectOpen = false)}
      >
        Отмена
      </Button>
    </div>
  </div>
</Modal>

<style>
  .settings-page {
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

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section :global(p) {
    margin: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  /* Info rows */
  :global(.info-row) {
    display: flex;
    min-height: 38px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 14px;
  }

  /* Connected badge */
  .connected-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .connected-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #16a34a;
    flex-shrink: 0;
  }

  .connected-badge :global(p) {
    margin: 0;
  }

  /* Bot card (not connected + connected info) */
  .bot-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #ffffff;
  }

  .bot-card :global(p) {
    margin: 0;
  }

  .bot-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bot-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Form */
  .bot-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #ffffff;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label :global(p) {
    margin: 0;
  }

  .field :global(p) {
    margin: 0;
  }

  .input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
    font-size: 14px;
    color: #171717;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease;
    appearance: none;
    -webkit-appearance: none;
  }

  .input:focus {
    border-color: #4f46e5;
    background: #ffffff;
  }

  .input--error {
    border-color: #dc2626;
  }

  .input::placeholder {
    color: #9ca3af;
  }

  /* Success banner */
  .success-banner {
    padding: 10px 14px;
    border-radius: 10px;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
  }

  .success-banner :global(p) {
    margin: 0;
    font-weight: 500;
  }

  /* Disconnect modal */
  .disconnect-sheet {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .disconnect-icon {
    font-size: 40px;
    line-height: 1;
  }

  .disconnect-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    text-align: center;
  }

  .disconnect-copy :global(h2) {
    margin: 0;
    font-size: 20px;
    line-height: 1.25;
  }

  .disconnect-copy :global(p) {
    margin: 0;
    font-size: 15px;
    line-height: 1.4;
  }

  .disconnect-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  /* Skeletons */
  .skeleton-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    height: 80px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .skeleton-card--tall {
    height: 160px;
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
