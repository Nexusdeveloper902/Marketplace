import { describe, expect, it } from "bun:test"
import {
  listVehicles,
  listAllVehicles,
  listAllMarcas,
  getVehicleBySlug,
  getVehicleDTOBySlug,
  getRelatedVehicles,
  parseOrden,
  type OrdenVehiculo,
} from "./vehicles"

describe("vehicles data layer (DB-backed)", () => {
  it("listVehicles pagina y calcula totalPages", async () => {
    const res = await listVehicles({ page: 1, pageSize: 5 })
    expect(res.items.length).toBeLessThanOrEqual(5)
    expect(res.total).toBeGreaterThanOrEqual(5)
    expect(res.page).toBe(1)
    expect(res.pageSize).toBe(5)
    expect(res.totalPages).toBe(Math.ceil(res.total / 5))
  })

  it("listVehicles respeta page > 1 sin solapar la primera", async () => {
    const p1 = await listVehicles({ page: 1, pageSize: 5 })
    const p2 = await listVehicles({ page: 2, pageSize: 5 })
    if (p2.items.length === 0) return // catálogo pequeño
    const ids1 = new Set(p1.items.map((v) => v.id))
    expect(p2.items.every((v) => !ids1.has(v.id))).toBe(true)
  })

  it("listVehicles filtra por marca", async () => {
    const first = await getVehicleBySlug((await listAllVehicles())[0].id)
    const res = await listVehicles({ marca: first!.marca, pageSize: 100 })
    expect(res.items.length).toBeGreaterThan(0)
    expect(res.items.every((v) => v.marca === first!.marca)).toBe(true)
  })

  it("listVehicles filtra por rango de precio", async () => {
    const res = await listVehicles({ precioMin: 100000, precioMax: 300000, pageSize: 100 })
    expect(res.items.every((v) => v.precio >= 100000 && v.precio <= 300000)).toBe(true)
  })

  it("listVehicles excludeUnavailable por defecto y lo incluye si se pide", async () => {
    const all = await listVehicles({ pageSize: 200 })
    expect(all.items.every((v) => v.available === true)).toBe(true)
    const incl = await listVehicles({ pageSize: 200, includeUnavailable: true })
    expect(incl.total).toBeGreaterThanOrEqual(all.total)
  })

  it("listVehicles ordena por precio asc", async () => {
    const res = await listVehicles({ orden: "precio-asc", pageSize: 100 })
    for (let i = 1; i < res.items.length; i++) {
      expect(res.items[i].precio).toBeGreaterThanOrEqual(res.items[i - 1].precio)
    }
  })

  it("listAllVehicles devuelve el catálogo completo con id = slug", async () => {
    const all = await listAllVehicles()
    expect(all.length).toBeGreaterThan(0)
    expect(all.every((v) => typeof v.id === "string" && v.id.length > 0)).toBe(true)
  })

  it("listAllMarcas devuelve marcas únicas y ordenadas", async () => {
    const marcas = await listAllMarcas()
    expect(marcas.length).toBeGreaterThan(0)
    expect(new Set(marcas).size).toBe(marcas.length) // sin duplicados
    for (let i = 1; i < marcas.length; i++) {
      expect(marcas[i] >= marcas[i - 1]).toBe(true)
    }
  })

  it("getVehicleBySlug devuelve la fila cruda", async () => {
    const all = await listAllVehicles()
    const row = await getVehicleBySlug(all[0].id) // id === slug
    expect(row).not.toBeNull()
    expect(row!.slug).toBe(all[0].id)
  })

  it("getVehicleDTOBySlug mapea a DTO (id = slug) y decodifica imágenes", async () => {
    const all = await listAllVehicles()
    const dto = await getVehicleDTOBySlug(all[0].id)
    expect(dto).not.toBeNull()
    expect(dto!.id).toBe(all[0].id)
    expect(Array.isArray(dto!.imagenes)).toBe(true)
  })

  it("getVehicleDTOBySlug devuelve null para slug inexistente", async () => {
    expect(await getVehicleDTOBySlug("no-existe")).toBeNull()
  })

  it("getRelatedVehicles excluye el propio vehículo y respeta el límite", async () => {
    const all = await listAllVehicles()
    const base = all[0]
    const related = await getRelatedVehicles(base, 3)
    expect(related.length).toBeLessThanOrEqual(3)
    expect(related.every((v) => v.id !== base.id)).toBe(true)
  })
})

describe("parseOrden", () => {
  it("acepta los valores válidos", () => {
    expect(parseOrden("relevancia")).toBe("relevancia")
    expect(parseOrden("precio-asc")).toBe("precio-asc")
    expect(parseOrden("precio-desc")).toBe("precio-desc")
    expect(parseOrden("año-desc")).toBe("año-desc")
    expect(parseOrden("potencia-desc")).toBe("potencia-desc")
  })

  it("cae a 'relevancia' para valores inválidos", () => {
    expect(parseOrden("no-existe")).toBe("relevancia")
    expect(parseOrden(undefined)).toBe("relevancia")
    expect(parseOrden("")).toBe("relevancia")
  })

  it("los valores devueltos pertenecen al tipo OrdenVehiculo", () => {
    const v: OrdenVehiculo = parseOrden("precio-asc")
    expect(v).toBe("precio-asc")
  })
})
