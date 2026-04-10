import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('показывает страницу приглашения', async ({ page, navigate }) => {
  await navigate('/invites/test-token');

  await expect(page.getByText('Partner Space')).toBeVisible();
  await expect(page.getByText('Принять приглашение')).toBeVisible();
  await expect(page.getByText('Не сейчас')).toBeVisible();

  await saveScreenshot(page, '07-invite');
});

test('показывает роль в бейдже', async ({ page, navigate }) => {
  await navigate('/invites/test-token');

  // role: 'assistant' → WORKSPACE_ROLE_LABELS['assistant'] = 'Помощник'
  await expect(page.getByText('Помощник')).toBeVisible();
});

test('показывает срок действия', async ({ page, navigate }) => {
  await navigate('/invites/test-token');

  // expires_at: '2026-12-31T00:00:00Z' — rendered by formatDate
  await expect(page.getByText(/Срок действия/)).toBeVisible();
});

test('принимает приглашение и редиректит на воркспейс', async ({ page, navigate }) => {
  await navigate('/invites/test-token');

  await page.getByRole('button', { name: 'Принять приглашение' }).click();

  // acceptInvite → workspace_id: '3' → navigate to /workspaces/3
  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/3',
    { timeout: 5_000 },
  );
});

test('"Не сейчас" ведёт на главную', async ({ page, navigate }) => {
  await navigate('/invites/test-token');

  await page.getByRole('button', { name: 'Не сейчас' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});

test('показывает "Приглашение не найдено" при 404', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/invites/not-found-token', async (route) => {
    await route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
  });

  await navigate('/invites/not-found-token');

  await expect(page.getByText('Приглашение не найдено')).toBeVisible();

  await saveScreenshot(page, '07-invite-not-found');
});

test('показывает "Ссылка больше не действительна" при 410 (истёкший)', async ({
  page,
  navigate,
}) => {
  await page.route('http://localhost:8000/invites/expired-token', async (route) => {
    await route.fulfill({ status: 410, contentType: 'application/json', body: '{}' });
  });

  await navigate('/invites/expired-token');

  await expect(page.getByText('Ссылка больше не действительна')).toBeVisible();

  await saveScreenshot(page, '07-invite-expired');
});

test('показывает "Приглашение уже было принято" при status: accepted', async ({
  page,
  navigate,
}) => {
  await page.route('http://localhost:8000/invites/used-token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        workspace_id: '3',
        workspace_title: 'Partner Space',
        role: 'assistant',
        expires_at: '2026-12-31T00:00:00Z',
        status: 'accepted',
      }),
    });
  });

  await navigate('/invites/used-token');

  await expect(page.getByText('Приглашение уже было принято')).toBeVisible();

  await saveScreenshot(page, '07-invite-used');
});

test('показывает "Вы уже участник" при 409 при принятии', async ({ page, navigate }) => {
  await page.route('http://localhost:8000/invites/test-token/accept', async (route) => {
    await route.fulfill({ status: 409, contentType: 'application/json', body: '{}' });
  });

  // Also mock the invite detail route for this token
  await page.route('http://localhost:8000/invites/test-token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        workspace_id: '3',
        workspace_title: 'Partner Space',
        role: 'assistant',
        expires_at: '2026-12-31T00:00:00Z',
        status: 'pending',
      }),
    });
  });

  await navigate('/invites/test-token');
  await page.getByRole('button', { name: 'Принять приглашение' }).click();

  await expect(page.getByText('Вы уже участник этого workspace')).toBeVisible();

  await saveScreenshot(page, '07-invite-already-member');
});
