import { init, miniApp, themeParams, viewport } from '@tma.js/sdk-svelte';

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
