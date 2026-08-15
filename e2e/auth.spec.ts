import { test, expect } from "@playwright/test"

/**
 * Authentication E2E. Exercises the real /api/auth route + session cookie
 * against the live dev server + DB. Uses a unique email per run to avoid
 * collisions with prior runs, then logs out.
 */

const RUN_ID = (process.env.GITHUB_RUN_ID ?? "local") + "-" + Date.now().toString(36)
const EMAIL = `e2e+${RUN_ID}@luxicar.test`
const PASSWORD = "E2eTest1234!"
const NAME = "E2E Usuario"

test.describe("Autenticación", () => {
  test("registro → perfil → logout", async ({ page }) => {
    // --- Registro ---
    await page.goto("/registro")
    await expect(page.getByText(/Crear cuenta/).first()).toBeVisible()

    await page.getByPlaceholder("Juan Pérez").fill(NAME)
    await page.getByPlaceholder("tu@ejemplo.com").fill(EMAIL)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()

    // Tras registrarse, se redirige a /perfil y la sesión está activa.
    await expect(page).toHaveURL(/\/perfil$/)
    await expect(page.getByText(NAME).first()).toBeVisible()

    // --- Logout ---
    // Abrir el menú de cuenta desde el header y cerrar sesión. El item
    // "Cerrar sesión" es un menuitem de Radix (no un button), y vive en un
    // portal que sólo aparece tras abrir el menú. Tras cerrar sesión, /perfil
    // (client component) redirige a /login.
    await page.getByRole("button", { name: /Menú de cuenta/ }).click()
    await page.getByRole("menuitem", { name: /Cerrar sesión/i }).click()

    // Ya sin sesión: el botón de cuenta desaparece y vuelve "Entrar".
    await expect(page.getByRole("button", { name: /Menú de cuenta/ })).toBeHidden({
      timeout: 15_000,
    })
    await expect(page.getByRole("link", { name: /Iniciar sesión/ })).toBeVisible({
      timeout: 15_000,
    })
  })

  test("login con la cuenta recién creadada", async ({ page }) => {
    // Crear una cuenta nueva (email único) para este test.
    const email = `login+${RUN_ID}@luxicar.test`
    await page.goto("/registro")
    await page.getByPlaceholder("Juan Pérez").fill(NAME + " Login")
    await page.getByPlaceholder("tu@ejemplo.com").fill(email)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()
    await expect(page).toHaveURL(/\/perfil$/)

    // Cerrar sesión para luego probar login limpio.
    await page.getByRole("button", { name: /Menú de cuenta/ }).click()
    await page.getByRole("menuitem", { name: /Cerrar sesión/i }).click()
    await expect(page.getByRole("link", { name: /Iniciar sesión/ })).toBeVisible({
      timeout: 15_000,
    })

    // --- Login ---
    await page.goto("/login")
    await page.getByPlaceholder("tu@ejemplo.com").fill(email)
    await page.getByPlaceholder("••••••••").fill(PASSWORD)
    await page.getByRole("button", { name: /^Iniciar sesión$/ }).click()

    await expect(page).toHaveURL(/\/perfil$/, { timeout: 15_000 })
    await expect(page.getByText(NAME).first()).toBeVisible()
  })

  test("login rechaza credenciales inválidas", async ({ page }) => {
    await page.goto("/login")
    await page.getByPlaceholder("tu@ejemplo.com").fill(`no-existe+${RUN_ID}@luxicar.test`)
    await page.getByPlaceholder("••••••••").fill("contraseña-mala")
    await page.getByRole("button", { name: /^Iniciar sesión$/ }).click()

    await expect(page.getByText(/Credenciales incorrectas/)).toBeVisible({ timeout: 10_000 })
    // Permanece en /login
    await expect(page).toHaveURL(/\/login$/)
  })

  test("registro rechaza email duplicado", async ({ page }) => {
    // Registrar una cuenta inicial con email único para este test.
    const email = `dup+${RUN_ID}@luxicar.test`
    await page.goto("/registro")
    await page.getByPlaceholder("Juan Pérez").fill("Original Dup")
    await page.getByPlaceholder("tu@ejemplo.com").fill(email)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()
    await expect(page).toHaveURL(/\/perfil$/, { timeout: 15_000 })

    // Cerrar sesión y volver a registro para intentar duplicar el email.
    await page.getByRole("button", { name: /Menú de cuenta/ }).click()
    await page.getByRole("menuitem", { name: /Cerrar sesión/i }).click()
    await expect(page.getByRole("link", { name: /Iniciar sesión/ })).toBeVisible({
      timeout: 15_000,
    })

    await page.goto("/registro")
    await page.getByPlaceholder("Juan Pérez").fill("Duplicado")
    await page.getByPlaceholder("tu@ejemplo.com").fill(email)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()

    await expect(page.getByText(/Ya existe una cuenta con este correo/i)).toBeVisible({
      timeout: 10_000,
    })
  })
})
