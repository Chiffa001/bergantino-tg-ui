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
    cx="24"
    cy="24"
    r="16"
    stroke={color}
    stroke-width="3.5"
    fill="none"
  />
  <line
    x1="35.5"
    y1="35.5"
    x2="48"
    y2="48"
    stroke={color}
    stroke-width="3.5"
    stroke-linecap="round"
  />
  <line
    x1="19"
    y1="19"
    x2="29"
    y2="29"
    stroke={color}
    stroke-width="3.5"
    stroke-linecap="round"
  />
  <line
    x1="29"
    y1="19"
    x2="19"
    y2="29"
    stroke={color}
    stroke-width="3.5"
    stroke-linecap="round"
  />
</svg>
