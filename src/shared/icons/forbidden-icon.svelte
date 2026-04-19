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
  <path
    d="M12 10 L44 10 L44 28 C44 38 36 44 28 48 C20 44 12 38 12 28 Z"
    stroke={color}
    stroke-width="3.5"
    fill="none"
    stroke-linejoin="round"
  />
  <line
    x1="10"
    y1="46"
    x2="48"
    y2="7"
    stroke={color}
    stroke-width="3.5"
    stroke-linecap="round"
  />
</svg>
