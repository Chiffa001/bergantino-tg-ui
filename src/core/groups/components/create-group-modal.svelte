<script lang="ts">
  import { Modal, Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspaceGroupMutation } from '@/core/groups/api/queries';
  import Button from '@/shared/components/ui/button.svelte';
  import PlusIcon from '@/shared/icons/plus-icon.svelte';
  import { router } from '@/shared/lib/router';

  type Props = {
    isOpen: boolean;
    workspaceId: string;
    onClose: () => void;
  };

  const { isOpen, workspaceId, onClose }: Props = $props();
  const mutation = createWorkspaceGroupMutation(() => workspaceId);

  let titleInputElement = $state<HTMLInputElement | undefined>(undefined);
  let title = $state('');
  let description = $state('');
  let errorMessage = $state('');
  let titleError = $state('');
  let wasOpen = $state(false);

  $effect(() => {
    if (!isOpen) {
      wasOpen = false;
      title = '';
      description = '';
      errorMessage = '';
      titleError = '';
      mutation.reset();
      return;
    }

    if (!wasOpen) {
      title = '';
      description = '';
      errorMessage = '';
      titleError = '';
      mutation.reset();
      wasOpen = true;

      setTimeout(() => {
        titleInputElement?.focus();
      }, 0);
    }
  });

  const canSubmit = $derived(title.trim().length > 0 && !mutation.isPending);

  async function handleSubmit() {
    titleError = '';
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      titleError = 'Введите название группы.';
      titleInputElement?.focus();
      return;
    }

    if (mutation.isPending) {
      return;
    }

    errorMessage = '';

    try {
      await mutation.mutateAsync({
        title: normalizedTitle,
        description: normalizedDescription || null,
      });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (message === 'server_error') {
        router.navigate('/internal-server-error');
        return;
      }

      errorMessage = 'Не удалось создать группу. Проверьте данные и попробуйте снова.';
    }
  }
</script>

<Modal
  {isOpen}
  onClose={onClose}
  withoutAnimation={true}
>
  <div class="create-group-modal">
    <div class="modal-header">
      <Typography
        variant="h2"
        color="#0a0a0a"
      >
        Создание группы
      </Typography>

      <Typography
        variant="body"
        color="#737373"
      >
        Заполните данные для новой группы
      </Typography>
    </div>

    <form
      class="modal-form"
      onsubmit={async (event) => {
        event.preventDefault();
        await handleSubmit();
      }}
    >
      <div class="field">
        <label
          class="field-label"
          for="group-title"
        >
          <Typography
            variant="caption"
            color="#171717"
          >
            Название
          </Typography>
        </label>

        <input
          bind:this={titleInputElement}
          id="group-title"
          class={`field-input ${titleError ? 'field-input--error' : ''}`.trim()}
          type="text"
          placeholder="Например, Антон и Настя"
          bind:value={title}
          autocomplete="off"
          maxlength={120}
          aria-invalid={titleError ? 'true' : undefined}
          aria-describedby={titleError ? 'group-title-error' : undefined}
        />

        {#if titleError}
          <div
            id="group-title-error"
            class="field-error"
          >
            <Typography
              variant="caption"
              color="#dc2626"
            >
              {titleError}
            </Typography>
          </div>
        {/if}
      </div>

      <div class="field">
        <label
          class="field-label"
          for="group-description"
        >
          <Typography
            variant="caption"
            color="#171717"
          >
            Описание
          </Typography>
        </label>

        <textarea
          id="group-description"
          class="field-textarea"
          placeholder="Кратко опишите задачу группы"
          bind:value={description}
          maxlength={400}
          rows="4"
        ></textarea>
      </div>

      {#if errorMessage}
        <div
          class="error-banner"
          role="alert"
          aria-live="polite"
        >
          <Typography
            variant="caption"
            color="#dc2626"
          >
            {errorMessage}
          </Typography>
        </div>
      {/if}

      <div class="modal-actions">
        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={!canSubmit}
        >
          <span class="create-content">
            <span class="create-label">Создать группу</span>
            <span
              class="create-icon"
              aria-hidden="true"
            >
              <PlusIcon
                size={18}
                color="#ffffff"
              />
            </span>
          </span>
        </Button>

        <Button
          variant="ghost"
          type="button"
          onclick={onClose}
        >
          Закрыть
        </Button>
      </div>
    </form>
  </div>
</Modal>

<style>
  .create-group-modal {
    display: flex;
    width: 100%;
    flex-direction: column;
    box-sizing: border-box;
  }

  .create-group-modal :global(h2),
  .create-group-modal :global(p) {
    margin: 0;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 4px;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-input,
  .field-textarea {
    width: 100%;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 10px 12px;
    background: #fafafa;
    box-sizing: border-box;
    color: #171717;
    font: inherit;
    outline: none;
    resize: none;
  }

  .field-input:focus,
  .field-textarea:focus {
    border-color: #6366f1;
  }

  .field-input--error {
    border-color: #dc2626;
    background: #fef2f2;
  }

  .field-input::placeholder,
  .field-textarea::placeholder {
    color: #a3a3a3;
  }

  .field-error :global(p) {
    margin: 0;
  }

  .error-banner {
    border-radius: 10px;
    padding: 10px 12px;
    background: #fef2f2;
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 4px;
  }

  .create-content {
    position: relative;
    display: inline-block;
    color: #ffffff;
    line-height: 1;
  }

  .create-label {
    display: inline-block;
  }

  .create-icon {
    position: absolute;
    right: calc(100% + 8px);
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transform: translateY(-50%);
  }
</style>
