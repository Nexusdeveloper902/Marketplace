/**
 * Vehicles data layer — SQLite port of src/lib/server/data/vehicles.ts.
 */
const { db } = require("../database/database")
const { toVehicleDTO } = require("../lib/mappers")

const DEFAULT_PAGE_SIZE = 24
const ORDENES = ["relevancia", "precio-asc", "precio-desc", "año-desc", "potencia-desc"]

function parseOrden(orden) {
  return ORDENES.includes(orden) ? orden : "relevancia"
}

function buildWhere(q) {
  const where = []
  const params = {}
  if (!q.includeUnavailable) where.push("available = 1")
  const search = q.search?.trim()
  if (search) {
    where.push("(marca LIKE @search OR modelo LIKE @search)")
    params.search = `%${search}%`
  }
  if (q.marca) {
    where.push("marca = @marca")
    params.marca = q.marca
  }
  if (q.categorias?.length) {
    where.push(`categoria IN (${q.categorias.map((_, i) => `@cat${i}`).join(",")})`)
    q.categorias.forEach((c, i) => (params[`cat${i}`] = c))
  }
  if (q.combustibles?.length) {
    where.push(`combustible IN (${q.combustibles.map((_, i) => `@comb${i}`).join(",")})`)
    q.combustibles.forEach((c, i) => (params[`comb${i}`] = c))
  }
  if (q.tracciones?.length) {
    where.push(`traccion IN (${q.tracciones.map((_, i) => `@trac${i}`).join(",")})`)
    q.tracciones.forEach((c, i) => (params[`trac${i}`] = c))
  }
  if (typeof q.precioMin === "number") {
    where.push("precio >= @precioMin")
    params.precioMin = q.precioMin
  }
  if (typeof q.precioMax === "number") {
    where.push("precio <= @precioMax")
    params.precioMax = q.precioMax
  }
  if (typeof q.añoMin === "number") {
    where.push('"año" >= @añoMin')
    params.añoMin = q.añoMin
  }
  if (typeof q.añoMax === "number") {
    where.push('"año" <= @añoMax')
    params.añoMax = q.añoMax
  }
  if (typeof q.potenciaMin === "number") {
    where.push("potencia >= @potenciaMin")
    params.potenciaMin = q.potenciaMin
  }
  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", params }
}

function buildOrderBy(orden) {
  switch (orden) {
    case "precio-asc":
      return "ORDER BY precio ASC"
    case "precio-desc":
      return "ORDER BY precio DESC"
    case "año-desc":
      return 'ORDER BY "año" DESC'
    case "potencia-desc":
      return "ORDER BY potencia DESC"
    case "relevancia":
    default:
      return "ORDER BY featured DESC, createdAt DESC"
  }
}

function listVehicles(q = {}) {
  const page = Math.max(1, q.page ?? 1)
  const pageSize = Math.max(1, q.pageSize ?? DEFAULT_PAGE_SIZE)
  const { clause, params } = buildWhere(q)
  const orden = parseOrden(q.orden)

  const total = db.prepare(`SELECT COUNT(*) AS c FROM vehicles ${clause}`).get(params).c
  const rows = db
    .prepare(`SELECT * FROM vehicles ${clause} ${buildOrderBy(orden)} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: pageSize, offset: (page - 1) * pageSize })

  return {
    items: rows.map(toVehicleDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** Return the full catalog (used to keep the existing client filtering UX). */
function listAllVehicles() {
  const rows = db
    .prepare("SELECT * FROM vehicles ORDER BY featured DESC, marca ASC, modelo ASC")
    .all()
  return rows.map(toVehicleDTO)
}

function getVehicleBySlug(slug) {
  return db.prepare("SELECT * FROM vehicles WHERE slug = ?").get(slug) ?? null
}

function getVehicleDTOBySlug(slug) {
  const row = getVehicleBySlug(slug)
  return row ? toVehicleDTO(row) : null
}

function listAllMarcas() {
  return db
    .prepare("SELECT DISTINCT marca FROM vehicles WHERE available = 1 ORDER BY marca ASC")
    .all()
    .map((r) => r.marca)
}

/** Score-based related vehicles (same algorithm as the original). */
function getRelatedVehicles(actual, cantidad = 3) {
  const all = listAllVehicles()
  return all
    .filter((v) => v.id !== actual.id)
    .map((v) => {
      let score = 0
      if (v.marca === actual.marca) score += 3
      if (v.categoria === actual.categoria) score += 2
      if (v.combustible === actual.combustible) score += 1
      const diff = Math.abs(v.precio - actual.precio) / actual.precio
      if (diff < 0.3) score += 2
      else if (diff < 0.6) score += 1
      return { v, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, cantidad)
    .map((r) => r.v)
}

module.exports = {
  parseOrden,
  listVehicles,
  listAllVehicles,
  getVehicleBySlug,
  getVehicleDTOBySlug,
  listAllMarcas,
  getRelatedVehicles,
}
