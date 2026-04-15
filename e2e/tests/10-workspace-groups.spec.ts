import { expect, test } from '../fixtures/base';
import { saveScreenshot } from '../helpers/screenshot';

test('открывает список групп c navbar', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await expect(page.getByRole('heading', { name: 'Группы' })).toBeVisible();
  await expect(page.getByText('Антон и Настя')).toBeVisible();
  await expect(page.getByText('Переговорная А')).toBeVisible();
  await expect(page.getByText('4 группы')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Убрать Антон и Настя из избранного' })).toBeVisible();

  const navBar = page.getByLabel('Навигация по workspace');
  const groupsTab = page.getByRole('tab', { name: 'Группы workspace' });
  const aboutTab = page.getByRole('tab', { name: 'Информация о workspace' });

  await expect(navBar).toBeVisible();
  await expect(groupsTab).toHaveAttribute('aria-selected', 'true');
  await expect(aboutTab).toHaveAttribute('aria-selected', 'false');

  await saveScreenshot(page, '10-workspace-groups');
});

test('поиск фильтрует список групп', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await page.getByRole('button', { name: 'Поиск групп' }).click();
  await page.getByPlaceholder('Поиск по названию группы').fill('VIP');

  await page.waitForTimeout(350);
  await expect(page.getByText('VIP-комната')).toBeVisible();
  await expect(page.getByText('Антон и Настя')).toHaveCount(0);
  await expect(page.getByText('Найдено 1')).toBeVisible();

  await saveScreenshot(page, '10-workspace-groups-filtered');
});

test('открывает modal создания группы и добавляет новую группу', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  await page.getByRole('button', { name: 'Создать группу' }).click();

  await expect(page.getByRole('heading', { name: 'Создание группы' })).toBeVisible();
  await saveScreenshot(page, '10-workspace-groups-create-modal');

  await page.getByLabel('Название').fill('Семья Петровых');
  await page.getByLabel('Описание').fill('Новая сделка сопровождения');
  await page.getByRole('button', { name: 'Создать группу' }).last().click();

  await expect(page.getByRole('heading', { name: 'Создание группы' })).toHaveCount(0);
  await expect(page.locator('.groups-list .group-card').nth(1)).toContainText('Семья Петровых');
  await expect(page.getByText('5 групп')).toBeVisible();

  await saveScreenshot(page, '10-workspace-groups-created');
});

test('переключает избранное у группы и поднимает её вверх', async ({ page, navigate }) => {
  await navigate('/workspaces/1/groups');

  const vipFavoriteButton = page.getByRole('button', { name: 'Добавить VIP-комната в избранное' });
  await vipFavoriteButton.click();

  await expect(page.getByRole('button', { name: 'Убрать VIP-комната из избранного' })).toBeVisible();
  await expect(page.locator('.groups-list .group-card').nth(1)).toContainText('VIP-комната');
  await expect(page.locator('.groups-list .group-card').nth(2)).toContainText('Переговорная А');

  await saveScreenshot(page, '10-workspace-groups-favorites');
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
