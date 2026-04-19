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
    cx="6"
    cy="5.5"
    r="2.75"
    stroke={color}
    stroke-width="1.2"
  />
  <path
    d="M1.75 12.75C2.31 10.96 3.92 9.75 5.83 9.75H6.17C8.08 9.75 9.69 10.96 10.25 12.75"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
  />
  <path
    d="M11.5 5V10"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
  />
  <path
    d="M9 7.5H14"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
  />
</svg>
