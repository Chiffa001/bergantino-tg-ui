<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 18, color = '#737373' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 18 18"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M9 3.75C9.69 3.75 10.25 3.19 10.25 2.5C10.25 1.81 9.69 1.25 9 1.25C8.31 1.25 7.75 1.81 7.75 2.5C7.75 3.19 8.31 3.75 9 3.75Z"
    fill={color}
  />
  <path
    d="M9 9.75C9.69 9.75 10.25 9.19 10.25 8.5C10.25 7.81 9.69 7.25 9 7.25C8.31 7.25 7.75 7.81 7.75 8.5C7.75 9.19 8.31 9.75 9 9.75Z"
    fill={color}
  />
  <path
    d="M9 15.75C9.69 15.75 10.25 15.19 10.25 14.5C10.25 13.81 9.69 13.25 9 13.25C8.31 13.25 7.75 13.81 7.75 14.5C7.75 15.19 8.31 15.75 9 15.75Z"
    fill={color}
  />
</svg>
