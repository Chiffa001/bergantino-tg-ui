export function formatFeeRate(value: string): string {
  const normalized = Number(value);

  if (Number.isNaN(normalized)) {
    return value;
  }

  return `${normalized}%`;
}
