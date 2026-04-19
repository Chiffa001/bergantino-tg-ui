import { init, miniApp, retrieveRawInitData, themeParams, viewport } from '@tma.js/sdk-svelte';

type TelegramHapticFeedback = {
  impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged?: () => void;
};

type TelegramWebApp = {
  HapticFeedback?: TelegramHapticFeedback;
};

type TelegramGlobal = typeof globalThis & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

function getTelegramWebApp(): TelegramWebApp | undefined {
  return (globalThis as TelegramGlobal).Telegram?.WebApp;
}

export function getTelegramHash(): string {
  return retrieveRawInitData() ?? '';
}

export function triggerSelectionHaptic(): void {
  getTelegramWebApp()?.HapticFeedback?.selectionChanged?.();
}

export function triggerImpactHaptic(
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred?.(style);
}

export function setupTelegramSdk(): { cleanup: VoidFunction; isInTelegram: boolean } {
  try {
    const cleanup = init();
    const unsubs: VoidFunction[] = [];

    themeParams.mount();
    unsubs.push(themeParams.bindCssVars());

    miniApp.mount();
    unsubs.push(miniApp.bindCssVars());

    void viewport.mount();
    unsubs.push(viewport.bindCssVars());

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

    return {
      cleanup: () => {
        for (const unsub of unsubs.reverse()) {
          unsub();
        }

        miniApp.unmount();
        themeParams.unmount();
        cleanup();
      },
      isInTelegram: true,
    };
  } catch {
    return {
      cleanup: () => {},
      isInTelegram: false,
    };
  }
}
