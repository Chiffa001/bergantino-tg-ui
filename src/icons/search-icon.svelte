<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 16, color = '#737373' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 16 16"
  fill="none"
  aria-hidden="true"
>
  <circle
    cx="7.33333"
    cy="7.33333"
    r="4.66667"
    stroke={color}
    stroke-width="1.2"
  />
  <path
    d="M11.333 11.333L13.9997 13.9997"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
  />
</svg>
