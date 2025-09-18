import { test, expect } from '@playwright/test';

test.setTimeout(120_000);

test('registration -> login -> CRUD pet', async ({ page }) => {
  await page.goto('/'); // працює за наявності baseURL у playwright.config.ts

  await page.waitForLoadState('domcontentloaded');

  // Якщо є бургер-меню, розкриємо (не обов’язково)
  const burger = page.getByRole('button', { name: /меню|menu|nav|☰/i });
  if (await burger.isVisible().catch(() => false)) {
    await burger.click();
  }

  // Перейти на реєстрацію (link/button/text — на випадок різної розмітки)
  const register = page.getByRole('link', { name: /реєстрац|register|sign ?up/i })
    .or(page.getByRole('button', { name: /реєстрац|register|sign ?up/i }))
    .or(page.getByText(/реєстрац|register|sign ?up/i).first());
  await expect(register).toBeVisible();
  await register.click();

  // Дочекатися маршруту і появи інпутів
  await expect(page).toHaveURL(/register|signup|auth/i, { timeout: 15000 });

  const email = `user${Date.now()}@test.com`;
  const emailInput = page.locator('input[formcontrolname="email"], input[type="email"]');
  const passInput  = page.locator('input[formcontrolname="password"], input[type="password"]');

  await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  await emailInput.fill(email);
  await passInput.fill('password123');

  // Сабміт
  const createBtn = page.getByRole('button', { name: /створити акаунт|зареєструватись|create account|sign ?up/i });
  await createBtn.click();

  // Перехід на форму додавання
  const addLink = page.getByRole('link', { name: /додати|add/i })
    .or(page.getByRole('button', { name: /додати|add/i }));
  await expect(addLink).toBeVisible({ timeout: 15000 });
  await addLink.click();

  // Створення улюбленця
  const nameInput = page.locator('input[formcontrolname="name"], input[name="name"]')
    .or(page.getByLabel(/ім.?я|name/i));
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill('Бублик');

  await page.getByRole('button', { name: /зберегти|save/i }).click();

  await expect(page.getByText('Бублик')).toBeVisible();

  // Деталі → редагування
  const detailsLink = page.getByRole('link', { name: /детал/i }).first()
    .or(page.getByRole('button', { name: /детал/i }).first());
  await detailsLink.click();

  const editLink = page.getByRole('link', { name: /редаг/i })
    .or(page.getByRole('button', { name: /редаг/i }));
  await editLink.click();

  const editName = page.locator('input[formcontrolname="name"], input[name="name"]')
    .or(page.getByLabel(/ім.?я|name/i));
  await editName.fill('Бублик 2');

  await page.getByRole('button', { name: /оновити|update/i }).click();

  await expect(page.getByText('Бублик 2')).toBeVisible();
});
