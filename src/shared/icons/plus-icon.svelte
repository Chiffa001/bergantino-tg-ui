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
    d="M10 4.16666V15.8333M4.16666 10H15.8333"
    stroke={color}
    stroke-width="1.6"
    stroke-linecap="round"
  />
</svg>
