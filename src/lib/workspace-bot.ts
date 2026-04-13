export function normalizeBotUsername(value: string) {
  return value.trim().replace(/^@/, '');
}

export function normalizeMiniAppUrl(value: string) {
  return value.trim();
}

export function buildWorkspaceMiniAppUrl(botUsername: string, miniAppPath?: string | null) {
  const normalizedUsername = normalizeBotUsername(botUsername);
  const normalizedMiniAppPath = normalizeMiniAppUrl(miniAppPath ?? '')
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!normalizedMiniAppPath) {
    return `https://t.me/${normalizedUsername}`;
  }

  if (normalizedMiniAppPath.startsWith(`${normalizedUsername}/`)) {
    return `https://t.me/${normalizedMiniAppPath}`;
  }

  return `https://t.me/${normalizedUsername}/${normalizedMiniAppPath}`;
}
