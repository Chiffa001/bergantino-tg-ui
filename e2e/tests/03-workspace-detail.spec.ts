import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает детали воркспейса', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await expect(page.getByText('My Workspace')).toBeVisible();

  // Статус Active из WORKSPACE_STATUS_LABELS
  await expect(page.getByText('Active')).toBeVisible();
  // Тариф Pro из WORKSPACE_PLAN_LABELS
  await expect(page.getByText('Pro')).toBeVisible();

  await saveScreenshot(page, '03-workspace-detail');
});

test('показывает счётчики пользователей по ролям', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  // Секция "Пользователи" с ролевыми карточками
  await expect(page.getByText('Пользователи')).toBeVisible();
  await expect(page.getByText('Ассистенты')).toBeVisible();
  await expect(page.getByText('Клиенты')).toBeVisible();

  await saveScreenshot(page, '03-workspace-detail-users');
});

test('показывает действия для super admin', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await expect(page.getByText('Настройки пространства')).toBeVisible();

  await saveScreenshot(page, '03-workspace-detail-actions');
});

test.describe('при достигнутом лимите участников', () => {
  test.use({
    apiOverrides: {
      workspaceBilling: {
        plan: 'free',
        fee_rate: '0',
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

  test('показывает недоступность приглашения при достигнутом лимите участников', async ({ page, navigate }) => {
    await navigate('/workspaces/1');

    await expect(page.getByText('Пригласить участника')).toBeVisible();
    await expect(page.getByText('Достигнут лимит участников')).toBeVisible();
  });
});

test('переходит к настройкам по кнопке', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await page.getByText('Настройки пространства').click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/settings',
    { timeout: 5_000 },
  );
});

test('переходит к пользователям по кнопке "Показать всех"', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await page.getByText('Показать всех →').click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/users',
    { timeout: 5_000 },
  );
});

test('переходит к пользователям по роли', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await page.getByText('Ассистенты').click();

  await page.waitForFunction(
    () => window.location.hash.includes('/workspaces/1/users'),
    { timeout: 5_000 },
  );
});

test('кнопка назад ведёт на главную', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await page.getByRole('button', { name: 'Назад' }).first().click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});
