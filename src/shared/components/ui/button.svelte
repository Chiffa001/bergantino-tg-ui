<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import type { Snippet } from 'svelte';

  type Variant = 'default' | 'destructive' | 'secondary' | 'success' | 'ghost';

  type Props = {
    variant?: Variant;
    class?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: string;
    rel?: string;
    onclick?: (e: MouseEvent) => void;
    leading?: Snippet;
    children?: Snippet;
  };

  let {
    variant = 'default',
    class: className = '',
    disabled = false,
    loading = false,
    type = 'button',
    href,
    target,
    rel,
    onclick,
    leading,
    children,
  }: Props = $props();

  const textColor = $derived(
    variant === 'secondary' ? '#374151' : variant === 'ghost' ? '#737373' : '#ffffff',
  );
  const isDisabled = $derived(disabled || loading);
</script>

{#if href}
  <a
    {href}
    {target}
    rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
    class={`btn btn--${variant} ${className}`.trim()}
    class:btn--loading={loading}
    aria-disabled={isDisabled}
    tabindex={isDisabled ? -1 : undefined}
    onclick={(e) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      onclick?.(e);
    }}
  >
    {#if loading}
      <span
        class="spinner"
        aria-hidden="true"
      ></span>
    {/if}

    <span class:content-hidden={loading}>
      <span class={`content ${leading ? 'content--with-leading' : ''}`.trim()}>
        {#if leading}
          <span
            class="leading"
            aria-hidden="true"
          >
            {@render leading()}
          </span>
        {/if}

        <Typography
          variant="body"
          color={textColor}
        >
          {@render children?.()}
        </Typography>
      </span>
    </span>
  </a>
{:else}
  <button
    {type}
    disabled={isDisabled}
    class={`btn btn--${variant} ${className}`.trim()}
    class:btn--loading={loading}
    {onclick}
  >
    {#if loading}
      <span
        class="spinner"
        aria-hidden="true"
      ></span>
    {/if}

    <span class:content-hidden={loading}>
      <span class={`content ${leading ? 'content--with-leading' : ''}`.trim()}>
        {#if leading}
          <span
            class="leading"
            aria-hidden="true"
          >
            {@render leading()}
          </span>
        {/if}

        <Typography
          variant="body"
          color={textColor}
        >
          {@render children?.()}
        </Typography>
      </span>
    </span>
  </button>
{/if}

<style>
  .btn {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 14px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s ease;
    box-sizing: border-box;
    text-decoration: none;
  }

  .content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .content--with-leading {
    position: relative;
    width: 100%;
    gap: 0;
  }

  .leading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .content--with-leading .leading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(calc(-100% - 4px), -50%);
  }

  .btn :global(p) {
    font-weight: 700;
    margin: 0;
  }

  .btn:hover:not(:disabled):not(.btn--loading) {
    filter: brightness(0.97);
  }

  .btn:active:not(:disabled) {
    opacity: 0.85;
  }

  .btn:disabled:not(.btn--loading) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--success:disabled:not(.btn--loading) {
    opacity: 1;
  }

  .btn[aria-disabled='true']:not(.btn--loading) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn--success[aria-disabled='true']:not(.btn--loading) {
    opacity: 1;
  }

  .btn--loading {
    transition: none;
    opacity: 1;
    pointer-events: none;
    cursor: progress;
  }

  .spinner {
    position: absolute;
    width: 18px;
    height: 18px;
    color: #ffffff;
    border: 2px solid rgb(255 255 255 / 0.35);
    border-top-color: currentColor;
    border-radius: 999px;
    animation: spin 0.7s linear infinite;
  }

  .content-hidden {
    visibility: hidden;
  }

  .btn--default {
    background-color: #4f46e5;
  }

  .btn--destructive {
    background-color: #dc2626;
  }

  .btn--secondary {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
  }

  .btn--success {
    background-color: #16a34a;
  }

  .btn--ghost {
    padding: 0;
    background-color: transparent;
  }

  .btn--ghost:hover:not(:disabled):not(.btn--loading) {
    filter: none;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
