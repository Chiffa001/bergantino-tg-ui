<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 20, color = '#0a0a0a' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 20 20"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M12.5 15L7.5 10L12.5 5"
    stroke={color}
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
