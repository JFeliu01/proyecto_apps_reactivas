import { test, expect } from "@playwright/test";

test("User can log in successfully", async ({ page, request }) => {
  const email = "test_user@example.com";
  const password = "Password123!";
  const name = "Test User";

  // 1. Crear usuario en el backend
  //    (si ya existe, simplemente ignoramos el error)
  await request.post("http://localhost:3001/auth/register", {
    data: { name, email, password },
  }).catch(() => {});

  // 2. Abrir frontend
  await page.goto("http://localhost:5173");

  // 3. Abrir modal de login
  const accountBtn = page.getByRole("button", { name: /account/i });
  await expect(accountBtn).toBeVisible();
  await accountBtn.click();

  // 4. título del modal (evita ambigüedad entre el título y el botón)
  const modalTitle = page.locator("div.font-semibold.text-lg", {
    hasText: "Login",
  });
  await expect(modalTitle).toBeVisible();

  // 5. Inputs del formulario
  const inputs = page.locator("input");
  await inputs.nth(0).fill(email);
  await inputs.nth(1).fill(password);

  // 6. Click en "Login"
  const loginBtn = page.getByRole("button", { name: /^login$/i }).first();
  await expect(loginBtn).toBeVisible();
  await loginBtn.click();

  // 7. Validar que realmente quedó logeado
  await expect(accountBtn).toHaveAttribute(
    "title",
    new RegExp(email, "i")
  );
});
