<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 22, color = '#4f46e5' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 22 22"
  fill="none"
  aria-hidden="true"
>
  <circle
    cx="8.25"
    cy="7.25"
    r="3.5"
    stroke={color}
    stroke-width="1.4"
  />
  <path
    d="M2.75 17.5C3.49 15.18 5.63 13.6 8.14 13.6H8.36C10.87 13.6 13.01 15.18 13.75 17.5"
    stroke={color}
    stroke-width="1.4"
    stroke-linecap="round"
  />
  <path
    d="M16.5 7V15"
    stroke={color}
    stroke-width="1.4"
    stroke-linecap="round"
  />
  <path
    d="M12.5 11H20.5"
    stroke={color}
    stroke-width="1.4"
    stroke-linecap="round"
  />
</svg>
