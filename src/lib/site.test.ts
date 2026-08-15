import { describe, expect, it } from "bun:test"
import { siteConfig, absoluteUrl, pageTitle } from "./site"

describe("site config", () => {
  it("expone nombre, tagline y descripción", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0)
    expect(siteConfig.tagline.length).toBeGreaterThan(0)
    expect(siteConfig.description.length).toBeGreaterThan(0)
  })

  it("la URL base es una URL https válida", () => {
    expect(siteConfig.url.startsWith("https://")).toBe(true)
    expect(() => new URL(siteConfig.url)).not.toThrow()
  })

  it("keywords incluye términos del dominio", () => {
    expect(siteConfig.keywords.length).toBeGreaterThan(0)
    expect(siteConfig.keywords).toContain("vehículos")
  })
})

describe("absoluteUrl", () => {
  it("combina base + path con barra inicial", () => {
    expect(absoluteUrl("/marketplace")).toBe(
      `${siteConfig.url.replace(/\/$/, "")}/marketplace`
    )
  })

  it("añade la barra inicial si falta", () => {
    expect(absoluteUrl("marcas")).toBe(
      `${siteConfig.url.replace(/\/$/, "")}/marcas`
    )
  })

  it("usa '/' por defecto", () => {
    expect(absoluteUrl()).toBe(`${siteConfig.url.replace(/\/$/, "")}/`)
  })

  it("no duplica la barra final de la base", () => {
    // siteConfig.url no termina en '/' por defecto; aseguramos que el resultado tampoco
    expect(absoluteUrl("/gracias").endsWith("//gracias")).toBe(false)
  })
})

describe("pageTitle", () => {
  it("sufija el nombre del sitio", () => {
    expect(pageTitle("Marcas")).toBe(`Marcas · ${siteConfig.name}`)
  })
})
