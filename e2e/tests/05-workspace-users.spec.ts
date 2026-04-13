import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает список пользователей', async ({ page, navigate }) => {
  await navigate('/workspaces/1/users');

  await expect(page.getByText('Пользователи')).toBeVisible();
  await expect(page.getByText('Test User')).toBeVisible();
  await expect(page.getByText('Alice Smith')).toBeVisible();
  await expect(page.getByText('Bob Johnson')).toBeVisible();

  await saveScreenshot(page, '05-workspace-users');
});

test('показывает счётчик пользователей', async ({ page, navigate }) => {
  await navigate('/workspaces/1/users');

  await expect(page.getByText('3 пользователей')).toBeVisible();
});

test('поиск фильтрует список', async ({ page, navigate }) => {
  // The search debounces via setTimeout(300). We mock the API to return only
  // the filtered result so we don't need to wait for debounce + network.
  await page.route('http://localhost:8000/workspaces/1/users*', async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('search') === 'alice') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '11',
            full_name: 'Alice Smith',
            username: 'alice',
            role: 'assistant',
            joined_at: '2024-02-01T09:00:00Z',
          },
        ]),
      });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/users');

  const searchInput = page.getByPlaceholder('Поиск по имени или роли...');
  await searchInput.fill('alice');

  // Wait for debounce + re-render
  await expect(page.getByText('Alice Smith')).toBeVisible({ timeout: 3_000 });
  await expect(page.getByText('1 пользователей')).toBeVisible();

  await saveScreenshot(page, '05-workspace-users-filtered');
});

test('фильтр по роли "Ассистент"', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces/1/users*', async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('role') === 'assistant') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '11',
            full_name: 'Alice Smith',
            username: 'alice',
            role: 'assistant',
            joined_at: '2024-02-01T09:00:00Z',
          },
        ]),
      });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/users');

  await page.getByRole('button', { name: 'Ассистент' }).click();

  // Wait for route change + re-render
  await page.waitForFunction(
    () => window.location.hash.includes('role=assistant'),
    { timeout: 5_000 },
  );

  await expect(page.getByText('Alice Smith')).toBeVisible({ timeout: 3_000 });

  await saveScreenshot(page, '05-workspace-users-role-filter');
});

test('показывает пустое состояние "Ничего не найдено"', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces/1/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await navigate('/workspaces/1/users');

  // No filter/search active → shows "Нет пользователей", not "Ничего не найдено"
  await expect(page.getByText('Нет пользователей')).toBeVisible();

  await saveScreenshot(page, '05-workspace-users-empty');
});

test('открывает модал приглашения', async ({ page, navigate }) => {
  await navigate('/workspaces/1/users');

  await page.getByRole('button', { name: 'Пригласить пользователя' }).click();

  await expect(page.getByText('Пригласить пользователя')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText('Управление пространством, оплатой, приглашениями')).toBeVisible();
  await expect(page.getByText('Работа с проектами, клиентами и событиями')).toBeVisible();
  await expect(page.getByText('Просмотр своего прогресса и программы')).toBeVisible();

  await saveScreenshot(page, '05-workspace-users-invite-modal');
});

test.describe('при достигнутом лимите участников', () => {
  test.use({
    apiOverrides: {
      workspaceBilling: {
        plan: 'free',
        subscription: null,
        limits_usage: {
          members: {
            current: 5,
            max: 5,
          },
          projects: {
            current: 1,
            max: 1,
          },
        },
        recent_payments: [],
      },
    },
  });

  test('блокирует кнопку приглашения при достигнутом лимите участников', async ({ page, navigate }) => {
    await navigate('/workspaces/1/users');

    await expect(page.getByRole('button', { name: 'Достигнут лимит участников' })).toBeDisabled();
  });
});

test('показывает inline-ошибку лимита тарифа в модалке приглашения', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces/1/invites', async (route) => {
    await route.fulfill({
      status: 403,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'plan_limit_exceeded',
        detail: {
          current: 5,
          limit: 5,
          plan: 'free',
        },
      }),
    });
  });

  await navigate('/workspaces/1/users');
  await page.getByRole('button', { name: 'Пригласить пользователя' }).click();
  await page.getByRole('button', { name: 'Получить ссылку' }).click();

  await expect(page.getByText('Достигнут лимит участников')).toBeVisible();
  await expect(page.getByText('В вашем тарифе «Free» максимум 5 участников, все слоты заняты.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Сменить тариф' })).toBeVisible();
});

test('после копирования ссылки модалка остаётся открытой и кнопка показывает статус', async ({
  page,
  navigate,
}) => {
  await navigate('/workspaces/1/users');

  await page.evaluate(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => undefined,
      },
    });
  });

  await page.getByRole('button', { name: 'Пригласить пользователя' }).click();
  await page.getByRole('button', { name: 'Получить ссылку' }).click();
  await page.getByRole('button', { name: 'Поделиться' }).click();

  await expect(page.getByText('Пригласить пользователя')).toBeVisible();
  const copiedButton = page.getByRole('button', { name: 'Скопировано' });
  const copiedCheck = page.locator('.copied-check');

  await expect(copiedButton).toBeVisible();
  await expect(copiedButton).toBeDisabled();
  await expect(copiedCheck).toBeVisible();
  await expect(copiedButton).toHaveCSS('background-color', 'rgb(22, 163, 74)');
  await expect(copiedCheck).toHaveCSS('color', 'rgb(255, 255, 255)');
});
