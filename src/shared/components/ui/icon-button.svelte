<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    ariaLabel: string;
    class?: string;
    disabled?: boolean;
    loading?: boolean;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  };

  let {
    ariaLabel,
    class: className = '',
    disabled = false,
    loading = false,
    title,
    type = 'button',
    onclick,
    children,
  }: Props = $props();

  const isDisabled = $derived(disabled || loading);
</script>

<button
  {type}
  aria-label={ariaLabel}
  disabled={isDisabled}
  {title}
  class={`icon-button ${className}`.trim()}
  class:icon-button--loading={loading}
  {onclick}
>
  {#if loading}
    <span
      class="spinner"
      aria-hidden="true"
    ></span>
  {/if}

  <span class:content-hidden={loading}>
    <span class="icon-button-content">
      {@render children?.()}
    </span>
  </span>
</button>

<style>
  .icon-button {
    position: relative;
    display: inline-flex;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    box-sizing: border-box;
  }

  .icon-button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .icon-button:disabled:not(.icon-button--loading) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button--loading {
    pointer-events: none;
    cursor: progress;
  }

  .spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid rgb(23 23 23 / 0.18);
    border-top-color: #171717;
    border-radius: 999px;
    animation: spin 0.7s linear infinite;
  }

  .content-hidden {
    visibility: hidden;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
