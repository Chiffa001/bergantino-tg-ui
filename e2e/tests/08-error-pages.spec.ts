import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает страницу 403 "Нет доступа"', async ({ page, navigate }) => {
  await navigate('/forbidden');

  await expect(page.getByText('Нет доступа')).toBeVisible();
  await expect(
    page.getByText('У вас недостаточно прав для просмотра этой страницы.'),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'На главную' })).toBeVisible();

  await saveScreenshot(page, '08-forbidden');
});

test('"На главную" со страницы 403 ведёт на /', async ({ page, navigate }) => {
  await navigate('/forbidden');

  await page.getByRole('button', { name: 'На главную' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});

test('показывает страницу 500 "Что-то пошло не так"', async ({ page, navigate }) => {
  await navigate('/internal-server-error');

  await expect(page.getByText('Что-то пошло не так')).toBeVisible();
  await expect(
    page.getByText('Мы уже в курсе проблемы. Попробуйте через несколько минут.'),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Повторить' })).toBeVisible();

  await saveScreenshot(page, '08-internal-server-error');
});

test('показывает страницу 404 "Не найдено"', async ({ page, navigate }) => {
  await navigate('/this-route-does-not-exist');

  await expect(page.getByText('Не найдено')).toBeVisible();
  await expect(page.getByText('Запрашиваемый раздел не существует или был удалён.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'На главную' })).toBeVisible();

  await saveScreenshot(page, '08-not-found');
});

test('"На главную" со страницы 404 ведёт на /', async ({ page, navigate }) => {
  await navigate('/this-route-does-not-exist');

  await page.getByRole('button', { name: 'На главную' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});
