/**
 * Mock for @tma.js/sdk-svelte used during Playwright E2E tests.
 * Activated via Vite alias when PLAYWRIGHT=true.
 *
 * Replaces the real TMA SDK so setupTelegramSdk() returns isInTelegram: true
 * without requiring an actual Telegram WebApp environment.
 */

export const init = () => {
  // Returns a cleanup function
  return () => {};
};

export const miniApp = {
  mount: () => {},
  unmount: () => {},
  bindCssVars: () => () => {},
  ready: {
    isAvailable: () => false,
    call: () => {},
  },
};

export const themeParams = {
  mount: () => {},
  unmount: () => {},
  bindCssVars: () => () => {},
};

export const viewport = {
  mount: () => Promise.resolve(),
  unmount: () => {},
  bindCssVars: () => () => {},
};

export const retrieveRawInitData = () => 'mock_init_data=1&hash=mockhash';

export const retrieveLaunchParams = () => ({
  tgWebAppData: {
    user: {
      id: 123456,
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
    },
    authDate: new Date(1700000000000),
    hash: 'mockhash',
    queryId: 'mock_query_id',
    start_param: undefined,
  },
  tgWebAppVersion: '7.0',
  tgWebAppPlatform: 'web',
  tgWebAppStartParam: undefined,
});
