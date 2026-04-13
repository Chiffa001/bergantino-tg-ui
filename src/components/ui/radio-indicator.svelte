<script lang="ts">
  type Props = {
    checked?: boolean;
  };

  let { checked = false }: Props = $props();
</script>

<span class={`radio-indicator ${checked ? 'radio-indicator--checked' : ''}`.trim()}>
  <span class="radio-indicator-dot"></span>
</span>

<style>
  .radio-indicator {
    display: inline-flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border: 2px solid #d1d5db;
    border-radius: 999px;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .radio-indicator--checked {
    border-color: #4f46e5;
  }

  .radio-indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: transparent;
  }

  .radio-indicator--checked .radio-indicator-dot {
    background: #4f46e5;
  }
</style>
