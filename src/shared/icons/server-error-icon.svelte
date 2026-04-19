<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 56, color = '#b0bac8' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 56 56"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    cx="28"
    cy="28"
    r="20"
    stroke={color}
    stroke-width="3.5"
    fill="none"
  />
  <line
    x1="28"
    y1="18"
    x2="28"
    y2="30"
    stroke={color}
    stroke-width="3.5"
    stroke-linecap="round"
  />
  <circle
    cx="28"
    cy="37"
    r="2"
    fill={color}
  />
</svg>
