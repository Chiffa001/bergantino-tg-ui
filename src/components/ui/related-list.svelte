<script
  lang="ts"
  generics="T"
>
  import type { Snippet } from 'svelte';

  type Props = {
    items: T[];
    class?: string;
    itemAs?: 'button' | 'div';
    itemClass?: string;
    getKey?: (item: T, index: number) => string | number;
    onitemclick?: (item: T, index: number) => void;
    children: Snippet<[T, number]>;
  };

  let {
    items,
    class: className = '',
    itemAs = 'div',
    itemClass = '',
    getKey,
    onitemclick,
    children,
  }: Props = $props();
</script>

<div class={`related-list ${className}`.trim()}>
  {#each items as item, index (getKey ? getKey(item, index) : index)}
    {#if itemAs === 'button'}
      <button
        type="button"
        class={`related-list__item ${index < items.length - 1 ? 'related-list__item--bordered' : ''} ${itemClass}`.trim()}
        onclick={() => onitemclick?.(item, index)}
      >
        {@render children(item, index)}
      </button>
    {:else}
      <div class={`related-list__item ${index < items.length - 1 ? 'related-list__item--bordered' : ''} ${itemClass}`.trim()}>
        {@render children(item, index)}
      </div>
    {/if}
  {/each}
</div>

<style>
  .related-list {
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fafafa;
    overflow: hidden;
  }

  .related-list__item {
    display: flex;
    min-height: 50px;
    align-items: center;
    gap: 12px;
    padding: 0 10px;
    background: transparent;
  }

  .related-list__item--bordered {
    border-bottom: 1px solid #f0f0f0;
  }

  button.related-list__item {
    width: 100%;
    border: none;
    border-bottom: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
  }
</style>
