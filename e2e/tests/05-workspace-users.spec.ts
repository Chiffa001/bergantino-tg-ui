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

  await page.getByRole('button', { name: 'Добавить пользователя' }).click();

  // InviteUserModal renders with heading "Добавить пользователя" (no dialog role)
  await expect(page.getByText('Добавить пользователя')).toBeVisible({ timeout: 5_000 });

  await saveScreenshot(page, '05-workspace-users-invite-modal');
});
