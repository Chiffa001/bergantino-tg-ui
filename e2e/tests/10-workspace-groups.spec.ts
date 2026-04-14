import { expect, test } from '../fixtures/base';

test('открывает пустую страницу групп c navbar', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await expect(page.getByRole('heading', { name: 'Группы' })).toBeVisible();
  await expect(page.getByText('Экран групп пока пустой.')).toBeVisible();

  const navBar = page.getByLabel('Навигация по workspace');
  const groupsTab = page.getByRole('tab', { name: 'Группы workspace' });
  const aboutTab = page.getByRole('tab', { name: 'Информация о workspace' });

  await expect(navBar).toBeVisible();
  await expect(groupsTab).toHaveAttribute('aria-selected', 'true');
  await expect(aboutTab).toHaveAttribute('aria-selected', 'false');
});

test('переходит к карточке workspace из страницы групп по navbar', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await page.getByRole('tab', { name: 'Информация о workspace' }).click();

  await page.waitForFunction(
    () => window.location.hash === '#/workspaces/1',
    { timeout: 5_000 },
  );
});

test('кнопка назад ведёт к списку workspaces', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await page.getByRole('button', { name: 'Назад' }).first().click();

  await page.waitForFunction(
    () => window.location.hash === '#/',
    { timeout: 5_000 },
  );
});
