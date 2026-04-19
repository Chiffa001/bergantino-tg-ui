<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 24, color = '#4f46e5' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
>
  <circle
    cx="9"
    cy="9"
    r="2.75"
    stroke={color}
    stroke-width="1.5"
  />
  <path
    d="M4.75 17.25C5.34 15.4 7.05 14.15 9.04 14.15H9.36C11.35 14.15 13.06 15.4 13.65 17.25"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
  />
  <circle
    cx="15.5"
    cy="10"
    r="2.25"
    stroke={color}
    stroke-width="1.5"
    opacity="0.75"
  />
  <path
    d="M14.25 16.35C14.78 15.21 15.93 14.5 17.2 14.5H17.45C18.24 14.5 18.98 14.78 19.54 15.25"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    opacity="0.75"
  />
</svg>
