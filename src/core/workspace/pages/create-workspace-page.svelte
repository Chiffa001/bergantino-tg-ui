<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import { createWorkspaceMutation } from '@/core/workspace/api/queries';
  import { WORKSPACE_PLAN, WORKSPACE_PLAN_OPTIONS, type WorkspacePlan } from '@/core/workspace/model/types';
  import Button from '@/shared/components/ui/button.svelte';
  import ChevronLeftIcon from '@/shared/icons/chevron-left-icon.svelte';
  import { router } from '@/shared/lib/router';
  import { toSlug } from '@/shared/lib/slug';

  const mutation = createWorkspaceMutation();

  let title = $state('');
  let slug = $state('');
  let plan = $state<WorkspacePlan>(WORKSPACE_PLAN.FREE);
  let slugTouched = $state(false);
  let errorMessage = $state('');

  function handleTitleInput(e: Event) {
    title = (e.target as HTMLInputElement).value;
    if (!slugTouched || !slug.trim()) {
      slug = toSlug(title);
    }
  }

  function handleSlugInput(e: Event) {
    const nextSlug = toSlug((e.target as HTMLInputElement).value);

    slugTouched = nextSlug.length > 0;
    slug = nextSlug;
  }

  async function handleSubmit() {
    if (mutation.isPending) return;

    errorMessage = '';

    const normalizedTitle = title.trim();
    const normalizedSlug = toSlug(slug);

    slug = normalizedSlug;

    if (!normalizedTitle || !normalizedSlug) {
      errorMessage = 'Заполните название и корректный slug.';
      return;
    }

    try {
      await mutation.mutateAsync({ title: normalizedTitle, slug: normalizedSlug, plan });
      router.navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'server_error') {
        router.navigate('/internal-server-error');
      } else {
        errorMessage = 'Не удалось создать пространство. Проверьте данные и попробуйте снова.';
      }
    }
  }

  const normalizedSlug = $derived(toSlug(slug));
  const canSubmit = $derived(title.trim().length > 0 && normalizedSlug.length > 0 && !mutation.isPending);
</script>

<section class="create-workspace-page">
  <header class="page-header">
    <button
      class="back-button"
      onclick={() => router.navigate('/')}
      aria-label="Назад"
    >
      <ChevronLeftIcon color="#172033" />
    </button>

    <Typography
      variant="h2"
      color="#172033"
    >
      Новое пространство
    </Typography>
  </header>

  <form
    class="form"
    onsubmit={async (e) => {
      e.preventDefault();
      await handleSubmit();
    }}
  >
    <div class="field">
      <label
        class="field-label"
        for="ws-title"
      >
        <Typography
          variant="caption"
          color="#5f6b85"
        >
          Название
        </Typography>
      </label>

      <input
        id="ws-title"
        class="field-input"
        type="text"
        placeholder="Моё пространство"
        value={title}
        oninput={handleTitleInput}
        autocomplete="off"
        maxlength={100}
      />
    </div>

    <div class="field">
      <label
        class="field-label"
        for="ws-slug"
      >
        <Typography
          variant="caption"
          color="#5f6b85"
        >
          Slug
        </Typography>
      </label>

      <input
        id="ws-slug"
        class="field-input"
        type="text"
        placeholder="my-workspace"
        value={slug}
        oninput={handleSlugInput}
        autocomplete="off"
        maxlength={64}
      />
    </div>

    <div class="field">
      <Typography
        variant="caption"
        color="#5f6b85"
      >
        Тарифный план
      </Typography>

      <div class="plan-options">
        {#each WORKSPACE_PLAN_OPTIONS as p (p.value)}
          <button
            type="button"
            class="plan-chip {plan === p.value ? 'plan-chip--active' : ''}"
            aria-pressed={plan === p.value}
            onclick={() => (plan = p.value)}
          >
            <Typography
              variant="overline"
              color={plan === p.value ? '#ffffff' : '#5f6b85'}
            >
              {p.label}
            </Typography>
          </button>
        {/each}
      </div>
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

    <div class="submit-wrap">
      <Button
        type="submit"
        loading={mutation.isPending}
        disabled={!canSubmit}
      >
        Создать
      </Button>
    </div>
  </form>
</section>

<style>
  .create-workspace-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    gap: 24px;
    padding: 20px 16px;
    background:
      radial-gradient(circle at top left, rgb(255 255 255 / 0.72), transparent 38%),
      linear-gradient(180deg, #f7f8fc 0%, #eef1f8 100%);
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-header :global(h2) {
    margin: 0;
  }

  .back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    padding: 0;
    border: 1px solid #dbe1ee;
    border-radius: 12px;
    background: rgb(255 255 255 / 0.9);
    cursor: pointer;
    box-shadow: 0 2px 8px rgb(23 32 51 / 0.05);
    transition: opacity 0.15s ease;
  }

  .back-button:active {
    opacity: 0.7;
  }

  .form {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 20px;
    min-height: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label :global(p) {
    margin: 0;
  }

  .field :global(p) {
    margin: 0;
  }

  .field-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1px solid #dbe1ee;
    border-radius: 14px;
    background: rgb(255 255 255 / 0.9);
    font-size: 15px;
    font-weight: 500;
    color: #172033;
    outline: none;
    transition: border-color 0.15s ease;
    box-shadow: 0 2px 8px rgb(23 32 51 / 0.04);
  }

  .field-input::placeholder {
    color: #b4bccf;
    font-weight: 400;
  }

  .field-input:focus {
    border-color: #4f46e5;
  }

  .plan-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .plan-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: 1px solid #dbe1ee;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.75);
    cursor: pointer;
    box-shadow: 0 6px 18px rgb(23 32 51 / 0.05);
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }

  .plan-chip :global(span) {
    line-height: 1;
  }

  .plan-chip--active {
    background: #172033;
    border-color: #172033;
    box-shadow: none;
  }

  .error-banner {
    padding: 12px 14px;
    border-radius: 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .error-banner :global(p) {
    margin: 0;
  }

  .submit-wrap {
    margin-top: auto;
    padding-top: 4px;
  }
</style>
