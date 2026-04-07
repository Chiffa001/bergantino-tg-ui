const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getDaysUntilExpiration(expiresAt: string, now = Date.now()): number {
  const expiresAtMs = new Date(expiresAt).getTime();

  if (Number.isNaN(expiresAtMs)) {
    return 0;
  }

  const diffMs = expiresAtMs - now;

  if (diffMs <= 0) {
    return 0;
  }

  return Math.ceil(diffMs / DAY_IN_MS);
}

export function formatInviteExpirationDays(expiresAt: string, now = Date.now()): string {
  const days = getDaysUntilExpiration(expiresAt, now);
  const mod10 = days % 10;
  const mod100 = days % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${days} день`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${days} дня`;
  }

  return `${days} дней`;
}
