import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает список воркспейсов', async ({ page, navigate }) => {
  await navigate('/');

  await expect(page.getByText('Рабочие пространства')).toBeVisible();
  await expect(page.getByText('My Workspace')).toBeVisible();
  await expect(page.getByText('Team Alpha')).toBeVisible();
  await expect(page.getByText('Archived Project')).toBeVisible();

  await saveScreenshot(page, '02-home-workspaces');
});

test('показывает счётчик пространств', async ({ page, navigate }) => {
  await navigate('/');

  // "3 пространств" — filter chip и счётчик
  await expect(page.getByText('3 пространств')).toBeVisible();
});

test('фильтрует по статусу "Активные"', async ({ page, navigate }) => {
  await navigate('/');

  await page.getByRole('button', { name: 'Активные' }).click();

  await expect(page.getByText('My Workspace')).toBeVisible();
  await expect(page.getByText('Team Alpha')).toBeVisible();
  await expect(page.getByText('Archived Project')).not.toBeVisible();

  await saveScreenshot(page, '02-home-workspaces-filtered');
});

test('показывает пустое состояние если нет пространств по фильтру', async ({ page, navigate }) => {
  await navigate('/');

  await page.getByRole('button', { name: 'Приост.' }).click();

  await expect(page.getByText('Нет рабочих пространств')).toBeVisible();

  await saveScreenshot(page, '02-home-workspaces-empty');
});

test('навигация к воркспейсу по клику', async ({ page, navigate }) => {
  await navigate('/');

  await page.getByText('My Workspace').click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/groups',
    { timeout: 5_000 },
  );
});

test('навигация к форме создания', async ({ page, navigate }) => {
  await navigate('/');

  await page.getByRole('button', { name: 'Создать' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/new',
    { timeout: 5_000 },
  );
});

// Empty list — override via page.route() registered after the base fixture mocks
test('пустой список при пустом ответе API', async ({ page }) => {
  // Register a more specific handler that takes priority over the base mock
  await page.route('http://localhost:8000/workspaces', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    } else {
      await route.fallback();
    }
  });

  // Reload clears the TanStack Query in-memory cache so the workspaces
  // query fires fresh and picks up the empty-list override above.
  await page.reload();
  await page.waitForFunction(() => !!window.localStorage.getItem('access_token'), {
    timeout: 10_000,
  });

  await expect(page.getByText('0 пространств')).toBeVisible();

  await saveScreenshot(page, '02-home-workspaces-api-empty');
});
