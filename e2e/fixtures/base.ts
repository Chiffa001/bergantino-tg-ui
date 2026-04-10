import { expect,test as base } from '@playwright/test';

import { API_DATA } from './api-data';
import { setupApiMocks } from './mock-server';

type ApiDataOverrides = Parameters<typeof setupApiMocks>[1];

type Fixtures = {
  /** Navigate within the SPA via hash change (doesn't trigger a full page reload). */
  navigate: (path: string) => Promise<void>;
  /** Override API mock responses for a specific test. Applied before page.goto(). */
  apiOverrides: ApiDataOverrides;
};

export const test = base.extend<Fixtures>({
  apiOverrides: [undefined, { option: true }],

  page: async ({ page, apiOverrides }, use) => {
    await setupApiMocks(page, apiOverrides);
    await page.goto('/');

    // Wait for the auth guard to complete: it sets access_token in localStorage
    // once POST /auth/telegram succeeds. Public routes (error pages, invites)
    // skip auth entirely, but waiting here is still safe — the mock replies
    // instantly so this resolves in < 1 s.
    await page.waitForFunction(
      () => !!window.localStorage.getItem('access_token'),
      { timeout: 10_000 },
    );

    await use(page);
  },

  navigate: async ({ page }, use) => {
    const go = async (path: string) => {
      await page.evaluate((p: string) => {
        window.location.hash = `#${p}`;
      }, path);
      // Wait for the hash to actually change so subsequent assertions are stable
      await page.waitForFunction(
        (p: string) => window.location.hash === `#${p}`,
        path,
        { timeout: 5_000 },
      );
    };

    await use(go);
  },
});

export { expect };
export { API_DATA };
