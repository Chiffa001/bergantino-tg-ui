import { API_DATA, expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('переходит на экран оплаты и тарифа из карточки workspace', async ({ page, navigate }) => {
  await navigate('/workspaces/1');

  await page.getByText('Оплата и тариф').click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/billing',
    { timeout: 5_000 },
  );
});

test('показывает экран информации о тарифе', async ({ page, navigate }) => {
  await navigate('/workspaces/1/billing');

  await expect(page.getByText('Оплата и тариф')).toBeVisible();
  await expect(page.getByText('Текущий тариф')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
  await expect(page.getByText('История платежей')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Сменить тариф' })).toBeVisible();

  await saveScreenshot(page, '09-workspace-billing');
});

test('переходит на экран смены тарифа', async ({ page, navigate }) => {
  await navigate('/workspaces/1/billing');

  await page.getByRole('button', { name: 'Сменить тариф' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/billing/change-plan',
    { timeout: 5_000 },
  );
});

test('показывает доступные тарифы и текущий план', async ({ page, navigate }) => {
  await navigate('/workspaces/1/billing/change-plan');

  await expect(page.getByText('Сменить тариф')).toBeVisible();
  await expect(page.getByText('Выберите подходящий тариф для вашего пространства')).toBeVisible();
  await expect(page.getByText('Текущий')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Перейти на Free' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Перейти на Business' })).toBeVisible();

  await saveScreenshot(page, '09-workspace-change-plan');
});

test('обновляет тариф и возвращает на billing-экран', async ({ page, navigate }) => {
  await navigate('/workspaces/1/billing/change-plan');

  await page.getByRole('button', { name: 'Перейти на Business' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1/billing',
    { timeout: 5_000 },
  );

  await expect(page.getByRole('heading', { name: 'Business' })).toBeVisible();
  await expect(page.getByText('7 490 ₽ / мес')).toBeVisible();
});

test.describe('пустая история оплат', () => {
  test.use({
    apiOverrides: {
      workspaceBilling: {
        ...API_DATA.workspaceBilling,
        recent_payments: [],
      },
    },
  });

  test('показывает пустое состояние истории оплат', async ({ page, navigate }) => {
    await navigate('/workspaces/1/billing');

    await expect(page.getByText('История платежей')).toBeVisible();
    await expect(page.getByText('Платежей пока нет')).toBeVisible();
  });
});
