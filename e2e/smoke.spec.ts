import { test, expect } from "@playwright/test"

/**
 * Smoke tests over public pages + SEO/infra endpoints. These run against the
 * full stack (dev server + real DB) and assert HTTP status, key content, and
 * SEO metadata for the routes added in the SEO/UX/legal work.
 */
test.describe("Páginas públicas y SEO", () => {
  test("la home carga y muestra el hero", async ({ page }) => {
    const res = await page.goto("/")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Digital Marketplace/)
    await expect(page.locator("h1").first()).toBeVisible()
    // Meta description presente
    const desc = await page
      .locator('meta[name="description"]')
      .getAttribute("content")
    expect(desc && desc.length > 0).toBeTruthy()
  })

  test("marketplace lista vehículos", async ({ page }) => {
    const res = await page.goto("/marketplace")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Marketplace de vehículos/)
    // Al menos una tarjeta de vehículo con precio
    await expect(page.locator("text=US$").first()).toBeVisible()
  })

  test("marcas lista marcas", async ({ page }) => {
    const res = await page.goto("/marcas")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Marcas/)
  })

  test("un detalle de vehículo carga con especificaciones", async ({ page }) => {
    // Navegar desde el marketplace hacia la primera tarjeta (la imagen es un
    // enlace con aria-label "Ver detalles del {marca} {modelo}").
    await page.goto("/marketplace")
    await page
      .getByRole("link", { name: /Ver detalles del .+/i })
      .first()
      .click()
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("comparar carga", async ({ page }) => {
    await page.goto("/comparar")
    await expect(page).toHaveTitle(/Comparar/)
  })

  test("política de privacidad carga", async ({ page }) => {
    const res = await page.goto("/privacidad")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Política de Privacidad/)
    await expect(page.getByText(/Política de Privacidad/).first()).toBeVisible()
    // La sección "Responsable del tratamiento" debe mencionar el sitio.
    await expect(page.getByText(/Responsable del tratamiento/)).toBeVisible()
  })

  test("términos y condiciones carga", async ({ page }) => {
    const res = await page.goto("/terminos")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Términos y Condiciones/)
  })

  test("página de agradecimiento carga y está noindex", async ({ page }) => {
    const res = await page.goto("/gracias")
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/Gracias por tu compra/)
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content")
    expect(robots).toContain("noindex")
  })

  test("404 personalizado para ruta inexistente", async ({ page }) => {
    const res = await page.goto("/ruta-que-no-existe-para-nada")
    expect(res?.status()).toBe(404)
    await expect(page.getByText(/Página no encontrada/)).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Volver al inicio/ })
    ).toBeVisible()
  })

  test("robots.txt sirve reglas y sitemap", async ({ page }) => {
    const res = await page.goto("/robots.txt")
    expect(res?.status()).toBe(200)
    const body = (await res?.text()) ?? ""
    expect(body).toContain("User-Agent:")
    expect(body).toContain("Disallow: /admin/")
    expect(body).toContain("Sitemap:")
  })

  test("sitemap.xml lista URLs del catálogo", async ({ page }) => {
    const res = await page.goto("/sitemap.xml")
    expect(res?.status()).toBe(200)
    const body = (await res?.text()) ?? ""
    expect(body).toContain("<urlset")
    expect(body).toContain("/marketplace")
    expect(body).toContain("/privacidad")
    expect(body).toContain("/terminos")
  })

  test("favicon y manifest están referenciados en el head", async ({ page }) => {
    await page.goto("/")
    // Next emite al menos un link[rel="icon"] (icon.svg + favicon.ico);
    // basta con que exista uno o más. Los <link> del <head> son "hidden"
    // para Playwright, así que se comprueba count, no visibilidad.
    expect(await page.locator('link[rel="icon"]').count()).toBeGreaterThanOrEqual(1)
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
  })

  test("Open Graph image meta presente", async ({ page }) => {
    await page.goto("/")
    const og = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content")
    expect(og && og.length > 0).toBeTruthy()
  })
})
