<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 14, color = '#737373' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 14 14"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M5.25 3.5L8.75 7L5.25 10.5"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
