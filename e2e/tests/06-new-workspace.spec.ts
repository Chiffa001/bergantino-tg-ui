import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает форму создания воркспейса', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  await expect(page.getByText('Новое пространство')).toBeVisible();
  await expect(page.getByLabel('Название')).toBeVisible();
  await expect(page.getByLabel('Slug')).toBeVisible();

  await saveScreenshot(page, '06-new-workspace');
});

test('slug автоматически генерируется из названия', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  await page.getByLabel('Название').fill('My Cool Space');

  // toSlug converts to my-cool-space
  await expect(page.getByLabel('Slug')).toHaveValue('my-cool-space');
});

test('кнопка "Создать" задизейблена пока форма пустая', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  await expect(page.getByRole('button', { name: 'Создать' })).toBeDisabled();
});

test('успешно создаёт воркспейс и редиректит', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  await page.getByLabel('Название').fill('New Space');
  // Slug is auto-generated as "new-space"

  await page.getByRole('button', { name: 'Создать' }).click();

  // After success → navigate to /
  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});

test('показывает ошибку при client_error (400)', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    } else {
      await route.continue();
    }
  });

  await navigate('/workspaces/new');

  await page.getByLabel('Название').fill('Bad Workspace');
  await page.getByRole('button', { name: 'Создать' }).click();

  await expect(
    page.getByText('Не удалось создать пространство. Проверьте данные и попробуйте снова.'),
  ).toBeVisible();

  await saveScreenshot(page, '06-new-workspace-client-error');
});

test('выбор тарифного плана', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  // Default is Free
  await expect(page.getByRole('button', { name: 'Free' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByRole('button', { name: 'Pro' }).click();

  await expect(page.getByRole('button', { name: 'Pro' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Free' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  await saveScreenshot(page, '06-new-workspace-plan-selected');
});

test('кнопка "Назад" возвращает на главную', async ({ page, navigate }) => {
  await navigate('/workspaces/new');

  await page.getByLabel('Назад').click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});
