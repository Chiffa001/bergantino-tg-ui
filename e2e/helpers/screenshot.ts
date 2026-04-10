import * as fs from 'node:fs';
import * as path from 'node:path';

import type { Page } from '@playwright/test';

const SCREENSHOTS_DIR = path.join(import.meta.dirname, '../screenshots');

/**
 * Save a full-page screenshot to e2e/screenshots/<name>.png.
 *
 * This is a no-op unless SAVE_SCREENSHOTS=1 is set in the environment.
 * Run `npm run e2e:screenshots` locally to capture/update screenshots.
 * In CI `npm run e2e` is used — screenshots are never written.
 */
export async function saveScreenshot(page: Page, name: string): Promise<void> {
  if (!process.env.SAVE_SCREENSHOTS) return;

  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: true,
  });
}
