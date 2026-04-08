export function normalizeBotUsername(value: string) {
  return value.trim().replace(/^@/, '');
}

export function buildWorkspaceMiniAppUrl(botUsername: string) {
  return `https://t.me/${normalizeBotUsername(botUsername)}`;
}
