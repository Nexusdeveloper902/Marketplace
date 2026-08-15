import { test, expect } from "@playwright/test"

/**
 * Checkout E2E — the full purchase funnel against the live full stack:
 * register → add vehicle to cart → open checkout → fill contact + card →
 * pay (POST /api/orders, real DB transaction) → success step → /gracias.
 *
 * Because checkout requires an authenticated session, each test registers a
 * fresh account so it never depends on prior run state.
 */

const RUN_ID = (process.env.GITHUB_RUN_ID ?? "local") + "-" + Date.now().toString(36)
const EMAIL = `checkout+${RUN_ID}@luxicar.test`
const PASSWORD = "E2eTest1234!"
const NAME = "Checkout E2E"

async function registrar(context: import("@playwright/test").BrowserContext, page: import("@playwright/test").Page) {
  await page.goto("/registro")
  await page.getByPlaceholder("Juan Pérez").fill(NAME)
  await page.getByPlaceholder("tu@ejemplo.com").fill(EMAIL)
  await page.getByPlaceholder("Mínimo 6 caracteres").fill(PASSWORD)
  await page.getByRole("button", { name: /Crear cuenta/ }).click()
  await expect(page).toHaveURL(/\/perfil$/, { timeout: 15_000 })
}

test.describe("Flujo de compra", () => {
  test("agregar al carrito muestra el enlace al checkout", async ({ page, context }) => {
    await registrar(context, page)

    // Ir al marketplace y abrir el primer detalle de vehículo (la imagen es
    // un enlace con aria-label "Ver detalles del {marca} {modelo}").
    await page.goto("/marketplace")
    await page
      .getByRole("link", { name: /Ver detalles del .+/i })
      .first()
      .click()
    await expect(page.locator("h1").first()).toBeVisible()

    // Añadir al carrito (botón "Agregar al carrito", no el de "agotado"/"comprado").
    // La página de detalle incluye además una sección de "vehículos
    // relacionados" con botones homónimos, así que apuntamos al primero (el
    // CTA principal del vehículo en cuestión).
    const addBtn = page.getByRole("button", { name: /Agregar al carrito/ }).first()
    await addBtn.click()
    await expect(page.getByText(/En el carrito/).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /Ver carrito y finalizar compra/ })).toBeVisible()
  })

  test("checkout completo lleva a la página de gracias", async ({ page, context }) => {
    await registrar(context, page)

    // Abrir un detalle y añadir al carrito.
    await page.goto("/marketplace")
    await page
      .getByRole("link", { name: /Ver detalles del .+/i })
      .first()
      .click()
    await expect(page.locator("h1").first()).toBeVisible()
    await page.getByRole("button", { name: /Agregar al carrito/ }).first().click()
    await expect(page.getByRole("link", { name: /Ver carrito y finalizar compra/ })).toBeVisible()
    await page.getByRole("link", { name: /Ver carrito y finalizar compra/ }).click()
    await expect(page).toHaveURL(/\/carrito$/)

    // Abrir el modal de checkout.
    await page.getByRole("button", { name: /Finalizar compra/ }).click()
    await expect(page.getByText(/Datos de contacto/i).first()).toBeVisible({
      timeout: 10_000,
    })

    // Datos de contacto.
    await page.getByPlaceholder("Juan Pérez").first().fill(NAME)
    await page.getByPlaceholder("juan@ejemplo.com").fill(EMAIL)
    await page.getByPlaceholder("+34 600 123 456").fill("+34 600 000 000")

    // Ir al paso de pago.
    await page.getByRole("button", { name: /Continuar|Siguiente|Pago/i }).click()

    // Datos de tarjeta (mock UI; el servidor solo valida el pedido real).
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242 4242 4242 4242")
    await page.getByPlaceholder("MM/AA").fill("12/30")
    await page.getByPlaceholder("123").fill("123")
    await page.getByPlaceholder("Juan Pérez").fill(NAME)

    // Pagar → éxito server-side (transacción real en la BD).
    await page.getByRole("button", { name: /Pagar/ }).click()

    // El paso de éxito muestra el mensaje de agradecimiento.
    await expect(page.getByText(/Gracias por confiar en Digital Marketplace/)).toBeVisible({
      timeout: 20_000,
    })

    // El enlace a /gracias existe y navega a la página dedicada.
    await page.getByRole("link", { name: /Ver resumen del pedido/i }).click()
    await expect(page).toHaveURL(/\/gracias$/, { timeout: 15_000 })
  })
})
