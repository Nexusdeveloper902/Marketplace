import { describe, expect, it } from "bun:test"
import {
  listBrands,
  getBrandBySlug,
  getBrandNameBySlug,
  slugToMarcaSync,
  brandDescription,
  BRAND_DESCRIPTIONS,
} from "./brands"

describe("brands data layer (DB-backed)", () => {
  it("listBrands devuelve marcas con resumen coherente", async () => {
    const brands = await listBrands()
    expect(brands.length).toBeGreaterThan(0)
    for (const b of brands) {
      expect(b.name.length).toBeGreaterThan(0)
      expect(b.slug.length).toBeGreaterThan(0)
      expect(b.description.length).toBeGreaterThan(0)
      expect(b.cantidad).toBeGreaterThanOrEqual(0)
      expect(b.precioMin).toBeGreaterThanOrEqual(0)
      expect(b.precioMax).toBeGreaterThanOrEqual(b.precioMin)
    }
  })

  it("listBrands está ordenado por nombre asc", async () => {
    const brands = await listBrands()
    for (let i = 1; i < brands.length; i++) {
      expect(brands[i].name >= brands[i - 1].name).toBe(true)
    }
  })

  it("getBrandBySlug devuelve la marca por su slug", async () => {
    const [first] = await listBrands()
    const brand = await getBrandBySlug(first.slug)
    expect(brand).not.toBeNull()
    expect(brand!.name).toBe(first.name)
  })

  it("getBrandBySlug devuelve null para un slug inexistente", async () => {
    expect(await getBrandBySlug("slug-que-no-existe")).toBeNull()
  })

  it("getBrandNameBySlug devuelve el nombre o null", async () => {
    const [first] = await listBrands()
    expect(await getBrandNameBySlug(first.slug)).toBe(first.name)
    expect(await getBrandNameBySlug("no-existe")).toBeNull()
  })

  it("slugToMarcaSync resuelve el nombre desde un array en memoria", () => {
    const rows = [
      { name: "Porsche", slug: "porsche" },
      { name: "Aston Martin", slug: "aston-martin" },
    ]
    expect(slugToMarcaSync(rows, "aston-martin")).toBe("Aston Martin")
    expect(slugToMarcaSync(rows, "no-existe")).toBeNull()
  })
})

describe("brandDescription", () => {
  it("devuelve la descripción estática conocida", () => {
    expect(BRAND_DESCRIPTIONS["Porsche"].length).toBeGreaterThan(0)
    expect(brandDescription("Porsche")).toBe(BRAND_DESCRIPTIONS["Porsche"])
  })

  it("usa la descripción por defecto para marcas desconocidas", () => {
    expect(brandDescription("Marca Inventada").length).toBeGreaterThan(0)
    expect(brandDescription("Marca Inventada")).not.toBe(BRAND_DESCRIPTIONS["Porsche"])
  })
})
