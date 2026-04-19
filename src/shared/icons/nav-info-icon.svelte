<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 18, color = 'currentColor' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 18 18"
  fill="none"
  aria-hidden="true"
>
  <circle
    cx="9"
    cy="9"
    r="6.75"
    stroke={color}
    stroke-width="1.5"
  />
  <path
    d="M9 7.5V11.25"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
  />
  <circle
    cx="9"
    cy="5.25"
    r="0.75"
    fill={color}
  />
</svg>
