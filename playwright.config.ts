import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  outputDir: './e2e/test-results',

  use: {
    baseURL: 'http://localhost:5173',
    // iPhone 14 dimensions — typical Telegram Mini App viewport
    viewport: { width: 390, height: 844 },
    // Fail fast on uncaught console errors to catch Svelte reactivity issues
    // screenshot: 'only-on-failure', // uncomment for local debugging
  },

  webServer: {
    // PLAYWRIGHT=true activates the Vite alias that replaces @tma.js/sdk-svelte
    // with e2e/mocks/tma-sdk.mock.ts, and disables mkcert (so the server is HTTP).
    // VITE_API_URL is set to HTTP so page.route() can intercept without SSL.
    // --mode playwright activates the TMA SDK alias in vite.config.ts and
    // disables mkcert (so the dev server is HTTP, not HTTPS).
    // --force ensures Vite re-optimizes deps — preventing stale cache from a
    // server started in a different mode.
    command: 'VITE_API_URL=http://localhost:8000 npm run dev -- --mode playwright --force',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  // Re-run failed tests once before marking them as failed
  retries: process.env.CI ? 1 : 0,
});
