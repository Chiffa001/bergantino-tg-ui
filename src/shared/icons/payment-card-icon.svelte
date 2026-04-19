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
  <rect
    x="2.25"
    y="3"
    width="11.5"
    height="10"
    rx="2"
    stroke={color}
    stroke-width="1.2"
  />
  <path
    d="M2.75 6.5H13.25"
    stroke={color}
    stroke-width="1.2"
  />
</svg>
