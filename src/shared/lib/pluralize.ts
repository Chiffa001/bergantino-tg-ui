export function pluralize(
  count: number,
  [one, few, many]: readonly [string, string, string],
): string {
  const absoluteCount = Math.abs(count);
  const remainder10 = absoluteCount % 10;
  const remainder100 = absoluteCount % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return one;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return few;
  }

  return many;
}
