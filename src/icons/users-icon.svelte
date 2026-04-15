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
    d="M4.08331 5.24998C5.04981 5.24998 5.83331 4.46648 5.83331 3.49998C5.83331 2.53348 5.04981 1.74998 4.08331 1.74998C3.11681 1.74998 2.33331 2.53348 2.33331 3.49998C2.33331 4.46648 3.11681 5.24998 4.08331 5.24998Z"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M9.91669 5.83335C10.7211 5.83335 11.3734 5.1811 11.3734 4.37669C11.3734 3.57227 10.7211 2.92002 9.91669 2.92002C9.11228 2.92002 8.46002 3.57227 8.46002 4.37669C8.46002 5.1811 9.11228 5.83335 9.91669 5.83335Z"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M1.45831 11.0833C1.45831 9.39148 2.82977 8.02002 4.52165 8.02002H4.81331C6.50518 8.02002 7.87665 9.39148 7.87665 11.0833"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M8.16669 10.5C8.38546 9.31925 9.41989 8.45835 10.6459 8.45835H10.7917C12.1791 8.45835 13.3041 9.5833 13.3041 10.9707"
    stroke={color}
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
