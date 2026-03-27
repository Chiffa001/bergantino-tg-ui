<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';
  import type { Snippet } from 'svelte';

  type Variant = 'default' | 'destructive' | 'secondary';

  type Props = {
    variant?: Variant;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: string;
    rel?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  };

  let {
    variant = 'default',
    disabled = false,
    loading = false,
    type = 'button',
    href,
    target,
    rel,
    onclick,
    children,
  }: Props = $props();

  const textColor = $derived(variant === 'secondary' ? '#374151' : '#ffffff');
  const isDisabled = $derived(disabled || loading);
</script>

{#if href}
  <a
    {href}
    {target}
    rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
    class="btn btn--{variant}"
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
      <Typography
        variant="body"
        color={textColor}
      >
        {@render children?.()}
      </Typography>
    </span>
  </a>
{:else}
  <button
    {type}
    disabled={isDisabled}
    class="btn btn--{variant}"
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
      <Typography
        variant="body"
        color={textColor}
      >
        {@render children?.()}
      </Typography>
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

  .btn :global(p) {
    font-weight: 700;
    margin: 0;
  }

  .btn:active:not(:disabled) {
    opacity: 0.85;
  }

  .btn:disabled:not(.btn--loading) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn[aria-disabled='true']:not(.btn--loading) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
