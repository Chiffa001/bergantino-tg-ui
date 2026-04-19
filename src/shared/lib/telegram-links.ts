type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: {
      openTelegramLink?: (url: string) => void;
    };
  };
};

export function openTelegramLink(url: string): void {
  try {
    const webApp = (window as TelegramWindow).Telegram?.WebApp;

    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(url);
      return;
    }
  } catch {
    // Fall back to a regular browser open below.
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
