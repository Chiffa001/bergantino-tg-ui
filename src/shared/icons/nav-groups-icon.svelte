<script lang="ts">
  type Props = {
    size?: number;
    color?: string;
  };

  let { size = 18, color = 'currentColor' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 18 18"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M5.25 7.125C6.49264 7.125 7.5 6.11764 7.5 4.875C7.5 3.63236 6.49264 2.625 5.25 2.625C4.00736 2.625 3 3.63236 3 4.875C3 6.11764 4.00736 7.125 5.25 7.125Z"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M12.75 7.875C13.7855 7.875 14.625 7.03553 14.625 6C14.625 4.96447 13.7855 4.125 12.75 4.125C11.7145 4.125 10.875 4.96447 10.875 6C10.875 7.03553 11.7145 7.875 12.75 7.875Z"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M1.875 14.4375C1.875 12.2624 3.63744 10.5 5.8125 10.5H6.1875C8.36256 10.5 10.125 12.2624 10.125 14.4375"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M10.5 13.6875C10.7812 12.1694 12.1112 11.0625 13.6875 11.0625H13.875C15.6589 11.0625 17.1049 12.5086 17.1049 14.2924"
    stroke={color}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
