import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

/**
 * The not-in-telegram page is a public route rendered when the app detects
 * it is opened outside of Telegram. In tests the TMA SDK mock always returns
 * isInTelegram: true, so we navigate to the route directly instead of relying
 * on the automatic redirect.
 */
test('renders the "open in Telegram" screen', async ({ page, navigate }) => {
  await navigate('/not-in-telegram');

  await expect(page.getByText('Откройте в Telegram')).toBeVisible();
  await expect(page.getByText('Это приложение работает только внутри Telegram.')).toBeVisible();

  await saveScreenshot(page, '01-not-in-telegram');
});
