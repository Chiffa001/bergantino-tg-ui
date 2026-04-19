<script lang="ts">
  const {
    size = 56,
    color = 'currentColor'
  }: { size?: number; color?: string } = $props();
</script>

<svg
  {...{ width: size, height: size }}
  viewBox="0 0 56 56"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M6 28L50 10L36 50L26 34L6 28Z"
    stroke={color}
    stroke-width="2.5"
    stroke-linejoin="round"
  />
  <path
    d="M26 34L35 25"
    stroke={color}
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
