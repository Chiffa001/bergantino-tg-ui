import { API_DATA, expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает настройки воркспейса', async ({ page, navigate }) => {
  await navigate('/workspaces/1/settings');

  await expect(page.getByText('Настройки')).toBeVisible();
  await expect(page.getByText('Основное')).toBeVisible();
  await expect(page.getByText('My Workspace')).toBeVisible();
  await expect(page.getByText('my-workspace')).toBeVisible();
  await expect(page.getByText('Telegram-бот')).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings');
});

test('показывает блок "Бот не подключён"', async ({ page, navigate }) => {
  // workspaceDetail has has_bot: false by default
  await navigate('/workspaces/1/settings');

  await expect(
    page.getByText('Сейчас используется системный бот по умолчанию.'),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Подключить бота' })).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-no-bot');
});

test('открывает форму подключения бота', async ({ page, navigate }) => {
  await navigate('/workspaces/1/settings');

  await page.getByRole('button', { name: 'Подключить бота' }).click();

  await expect(page.getByPlaceholder('123456:ABC-DEF...')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'ClinicBot', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('https://t.me/ClinicBot/miniapp')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Сохранить' })).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-bot-form');
});

test('кнопка "Сохранить" задизейблена пока форма не заполнена', async ({ page, navigate }) => {
  await navigate('/workspaces/1/settings');
  await page.getByRole('button', { name: 'Подключить бота' }).click();

  await expect(page.getByRole('button', { name: 'Сохранить' })).toBeDisabled();
});

test('успешно подключает бота', async ({ page, navigate }) => {
  // After the PATCH succeeds, TanStack Query invalidates ['workspace', '1'] and
  // refetches via GET. The refetch response must also have has_bot: true so the
  // "✓ Бот подключён" success banner stays visible.
  let patchHandled = false;

  await page.route('http://localhost:8000/workspaces/1*', async (route) => {
    if (route.request().method() === 'PATCH') {
      patchHandled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...API_DATA.workspaceDetail,
          has_bot: true,
          bot_username: 'my_test_bot',
        }),
      });
    } else if (route.request().method() === 'GET' && patchHandled) {
      // Return updated data on the refetch triggered by mutation onSuccess
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...API_DATA.workspaceDetail,
          has_bot: true,
          bot_username: 'my_test_bot',
        }),
      });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/settings');
  await page.getByRole('button', { name: 'Подключить бота' }).click();

  await page.getByPlaceholder('123456:ABC-DEF...').fill('123456:MOCK_TOKEN');
  await page.getByRole('textbox', { name: 'ClinicBot', exact: true }).fill('my_test_bot');
  await page.getByPlaceholder('https://t.me/ClinicBot/miniapp').fill('https://t.me/my_test_bot/workspace');
  const patchRequest = page.waitForRequest((request) => {
    return request.method() === 'PATCH' && request.url().includes('/workspaces/1');
  });

  await page.getByRole('button', { name: 'Сохранить' }).click();

  await patchRequest;
  await expect(page.getByText('✓ Бот подключён')).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-bot-connected');
});

test('показывает ошибку при неверном токене (400)', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces/1', async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/settings');
  await page.getByRole('button', { name: 'Подключить бота' }).click();

  await page.getByPlaceholder('123456:ABC-DEF...').fill('bad_token');
  await page.getByRole('textbox', { name: 'ClinicBot', exact: true }).fill('some_bot');
  await page.getByPlaceholder('https://t.me/ClinicBot/miniapp').fill('https://t.me/some_bot/workspace');
  await page.getByRole('button', { name: 'Сохранить' }).click();

  await expect(page.getByText('Неверный токен. Проверьте значение из BotFather')).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-bot-error');
});

test('показывает состояние "бот подключён" когда has_bot: true', async ({ page, navigate }) => {
  // Override: workspaceDetail with bot connected
  await page.route('http://localhost:8000/workspaces/1', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...API_DATA.workspaceDetailWithBot,
          id: '1',
          title: 'My Workspace',
          slug: 'my-workspace',
        }),
      });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/settings');

  await expect(page.getByText('@team_alpha_bot')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Изменить токен' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Отключить бота' })).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-has-bot');
});

test('открывает модал отключения бота', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/workspaces/1', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...API_DATA.workspaceDetailWithBot,
          id: '1',
          title: 'My Workspace',
          slug: 'my-workspace',
        }),
      });
    } else {
      await route.fallback();
    }
  });

  await navigate('/workspaces/1/settings');
  await page.getByRole('button', { name: 'Отключить бота' }).click();

  await expect(page.getByText('Отключить бота?')).toBeVisible();

  await saveScreenshot(page, '04-workspace-settings-disconnect-modal');
});
