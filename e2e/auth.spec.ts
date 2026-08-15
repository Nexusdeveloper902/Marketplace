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
    // Abrir el menú de cuenta desde el header y cerrar sesión.
    await page.getByRole("button", { name: /Menú de cuenta/ }).click()
    await page.getByRole("button", { name: /Cerrar sesión/i }).click()

    // Vuelve a la home sin sesión.
    await page.waitForURL(/\/$/, { timeout: 15_000 })
    await expect(page).toHaveURL(/\/$/)
  })

  test("login con la cuenta recién creadada", async ({ page }) => {
    // Primera pasada: crear la cuenta en una pestaña limpia.
    await page.goto("/registro")
    await page.getByPlaceholder("Juan Pérez").fill(NAME + " 2")
    await page.getByPlaceholder("tu@ejemplo.com").fill(EMAIL)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()
    await expect(page).toHaveURL(/\/perfil$/)

    // Cerrar sesión para luego probar login limpio.
    await page.getByRole("button", { name: /Menú de cuenta/ }).click()
    await page.getByRole("button", { name: /Cerrar sesión/i }).click()
    await page.waitForURL(/\/$/, { timeout: 15_000 })

    // --- Login ---
    await page.goto("/login")
    await page.getByPlaceholder("tu@ejemplo.com").fill(EMAIL)
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
    // El email ya existe del primer test → el servidor responde 409.
    await page.goto("/registro")
    await page.getByPlaceholder("Juan Pérez").fill("Duplicado")
    await page.getByPlaceholder("tu@ejemplo.com").fill(EMAIL)
    await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
    await page.getByRole("button", { name: /Crear cuenta/ }).click()

    await expect(page.getByText(/Ya existe una cuenta con este correo/i)).toBeVisible({
      timeout: 10_000,
    })
  })
})
