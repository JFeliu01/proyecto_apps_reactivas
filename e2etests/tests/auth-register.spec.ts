import { test, expect } from '@playwright/test';

test('User can register successfully', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 1. Abrir modal de auth
  await page.getByRole('button', { name: /account/i }).click();

  // 2. Cambiar a Register
  await page.getByRole('button', { name: /^register$/i }).click();

  // 3. Asegurar que estamos en modo register
  await expect(page.getByText('Register')).toBeVisible();

  // 4. Llenar inputs (usamos posiciones)
  const inputs = page.locator('input');

  // input[0] → Name
  await inputs.nth(0).fill('Test User');

  // input[1] → Email
  await inputs.nth(1).fill(`test_${Date.now()}@example.com`);

  // input[2] → Password
  await inputs.nth(2).fill('Password123!');

  // 5. Submit
  await page.getByRole('button', { name: /create account/i }).click();

  // 6. Verificación: modal se cerró → navbar debe mostrar el título con el email
  const accountBtn = page.getByRole('button', { name: /account/i });

  await expect(accountBtn).toHaveAttribute('title', /test_/i);
});
