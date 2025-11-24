import { test, expect } from "@playwright/test";

test("User can add 3 favorite champions and see them in the profile", async ({ page, request }) => {
  const email = "fav_test_user@example.com";
  const password = "Password123!";
  const name = "Favorite Tester";

  // ---------------------------------------------
  // 1. Crear usuario en backend (o ignorar error)
  // ---------------------------------------------
  await request
    .post("http://localhost:3001/auth/register", {
      data: { name, email, password },
    })
    .catch(() => {});

  // ---------------------------------------------
  // 2. Abrir frontend
  // ---------------------------------------------
  await page.goto("http://localhost:5173");

  // ---------------------------------------------
  // 3. Abrir modal de login 
  // ---------------------------------------------
  const accountBtn = page.getByRole("button", { name: /account/i });
  await expect(accountBtn).toBeVisible();
  await accountBtn.click();

  // título del modal
  const modalTitle = page.locator("div.font-semibold.text-lg", {
    hasText: "Login",
  });
  await expect(modalTitle).toBeVisible();

  // inputs
  const inputs = page.locator("input");
  await inputs.nth(0).fill(email);
  await inputs.nth(1).fill(password);

  // botón Login
  const loginBtn = page.getByRole("button", { name: /^login$/i }).first();
  await expect(loginBtn).toBeVisible();
  await loginBtn.click();

  // verificar login
  await expect(accountBtn).toHaveAttribute("title", new RegExp(email, "i"));

  // ---------------------------------------------
  // 4. Ir al GRID
  // ---------------------------------------------
  await expect(page.getByRole('button', { name: /explore champions/i })).toBeVisible();
  await page.getByRole('button', { name: /explore champions/i }).click();

  // esperar a que cargue la grid
  await page.waitForURL("**/grid");

  // ---------------------------------------------
  // 5. Seleccionar 3 campeones para favoritos
  //    Usa 3 nombres REALES tal como aparecen en tu grid
  // ---------------------------------------------
  const champsToFavorite = ["Ahri", "Garen", "Lux"];

  for (const champ of champsToFavorite) {
    // Abrir modal del campeón haciendo click en su tile
    const tile = page.getByRole("button", { name: champ });
    await expect(tile).toBeVisible();
    await tile.click();

    // Click en botón Favorite/Favorito
    const favoriteBtn = page.getByRole("button", { name: /favorite|favorito/i });
    await expect(favoriteBtn).toBeVisible();
    await favoriteBtn.click();

    //Cerrar modal del campeón
    const closeBtn = page.getByRole("button", { name: /^close$/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
  }

  // ---------------------------------------------
  // 6. Abrir perfil
  // ---------------------------------------------

  // Botón del header
  const accountBtn2 = page.getByRole("button", { name: "Account" });
  // Validar que esté visible
  await expect(accountBtn2).toBeVisible();
  // Validar que sea el usuario correcto
  await expect(accountBtn2).toHaveAttribute("title", new RegExp(email, "i"));
  //  abrir modal del perfil
  await accountBtn2.click();

  //Esperar a que el modal se abra (lo confirma el botón "View Profile")
  const viewProfileBtn = page.getByRole("button", { name: /view profile/i });
  await expect(viewProfileBtn).toBeVisible();
  // Ir al perfil
  await viewProfileBtn.click();

  // Confirmar que estamos en /profile
  await expect(page).toHaveURL(/\/profile$/);

  // Confirmar que apareció el título de la sección
  await expect(page.getByRole("heading", { name: /favorite champions/i })).toBeVisible();

  //Confirmamos que estan los campeones añaditos a favorito
  await expect(page.getByText("Ahri")).toBeVisible();
  await expect(page.getByText("Garen")).toBeVisible();
  await expect(page.getByText("Lux")).toBeVisible();

// ---------------------------------------------------------
// 7. Volver a la lista de campeones desde el perfil (para eliminar favoritos)
// ---------------------------------------------------------
const backBtn = page.getByRole("button", { name: /back to champion list/i });
await expect(backBtn).toBeVisible();
await backBtn.click();

// ---------------------------------------------------------
// 2. Eliminar de favoritos los campeones seleccionados
//    (mismo proceso que al agregarlos)
// ---------------------------------------------------------

for (const champ of champsToFavorite) {
  // Abrir modal del campeón
  const tile = page.getByRole("button", { name: champ });
  await expect(tile).toBeVisible();
  await tile.click();

  // Click en botón Favorite/Favorito (esto alterna el estado)
  const favoriteBtn = page.getByRole("button", { name: /favorite|favorito/i });
  await expect(favoriteBtn).toBeVisible();
  await favoriteBtn.click();

  // Cerrar modal
  const closeBtn = page.getByRole("button", { name: /^close$/i });
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
}

// ---------------------------------------------------------
// 3. Volver al perfil del usuario para confirmar
// ---------------------------------------------------------
const profileBtn = page.getByRole("button", { name: "Account" });
await expect(profileBtn).toBeVisible();
await profileBtn.click();
//Esperar a que el modal se abra (lo confirma el botón "View Profile")
const viewProfileBtn2 = page.getByRole("button", { name: /view profile/i });
await expect(viewProfileBtn2).toBeVisible();
// Ir al perfil
await viewProfileBtn2.click();
// Confirmar que estamos en /profile
await expect(page).toHaveURL(/\/profile$/);
// Confirmar que apareció el título de la sección
await expect(page.getByRole("heading", { name: /favorite champions/i })).toBeVisible();

// ---------------------------------------------------------
// 4. Verificar que NO hay campeones favoritos
// ---------------------------------------------------------

await expect(page.getByText(/no favorites yet/i)).toBeVisible();
    
});

