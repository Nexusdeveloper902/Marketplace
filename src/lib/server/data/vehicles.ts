import { db } from "@/lib/db"
import { toVehicleDTO } from "../mappers"
import type { Prisma } from "@prisma/client"
import type { Vehicle } from "@/types/vehicle"

export interface VehicleQuery {
  search?: string
  marca?: string
  categorias?: string[]
  combustibles?: string[]
  tracciones?: string[]
  precioMin?: number
  precioMax?: number
  añoMin?: number
  añoMax?: number
  potenciaMin?: number
  orden?: string
  page?: number
  pageSize?: number
  includeUnavailable?: boolean
}

export type OrdenVehiculo =
  | "relevancia"
  | "precio-asc"
  | "precio-desc"
  | "año-desc"
  | "potencia-desc"

const DEFAULT_PAGE_SIZE = 24

export function parseOrden(orden?: string): OrdenVehiculo {
  const valid: OrdenVehiculo[] = [
    "relevancia",
    "precio-asc",
    "precio-desc",
    "año-desc",
    "potencia-desc",
  ]
  return (valid as string[]).includes(orden ?? "") ? (orden as OrdenVehiculo) : "relevancia"
}

function buildWhere(q: VehicleQuery): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {}
  if (!q.includeUnavailable) where.available = true

  const search = q.search?.trim()
  if (search) {
    where.OR = [
      { marca: { contains: search } },
      { modelo: { contains: search } },
    ]
  }
  if (q.marca) where.marca = q.marca
  if (q.categorias?.length) where.categoria = { in: q.categorias }
  if (q.combustibles?.length) where.combustible = { in: q.combustibles }
  if (q.tracciones?.length) where.traccion = { in: q.tracciones }
  if (typeof q.precioMin === "number") where.precio = { ...where.precio as object, gte: q.precioMin }
  if (typeof q.precioMax === "number") where.precio = { ...where.precio as object, lte: q.precioMax }
  if (typeof q.añoMin === "number") where.año = { gte: q.añoMin }
  if (typeof q.añoMax === "number") where.año = { lte: q.añoMax }
  if (typeof q.potenciaMin === "number") where.potencia = { gte: q.potenciaMin }
  return where
}

function buildOrderBy(orden: OrdenVehiculo): Prisma.VehicleOrderByWithRelationInput[] {
  switch (orden) {
    case "precio-asc":
      return [{ precio: "asc" }]
    case "precio-desc":
      return [{ precio: "desc" }]
    case "año-desc":
      return [{ año: "desc" }]
    case "potencia-desc":
      return [{ potencia: "desc" }]
    case "relevancia":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }]
  }
}

export interface VehicleListResult {
  items: Vehicle[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function listVehicles(q: VehicleQuery = {}): Promise<VehicleListResult> {
  const page = Math.max(1, q.page ?? 1)
  const pageSize = Math.max(1, q.pageSize ?? DEFAULT_PAGE_SIZE)
  const where = buildWhere(q)
  const orden = parseOrden(q.orden)

  const [rows, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      orderBy: buildOrderBy(orden),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.vehicle.count({ where }),
  ])

  return {
    items: rows.map(toVehicleDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** Return the full catalog (used to keep existing client filtering UX). */
export async function listAllVehicles(): Promise<Vehicle[]> {
  const rows = await db.vehicle.findMany({
    orderBy: [{ featured: "desc" }, { marca: "asc" }, { modelo: "asc" }],
  })
  return rows.map(toVehicleDTO)
}

export async function getVehicleBySlug(slug: string) {
  const row = await db.vehicle.findUnique({ where: { slug } })
  return row
}

export async function getVehicleDTOBySlug(slug: string): Promise<Vehicle | null> {
  const row = await getVehicleBySlug(slug)
  return row ? toVehicleDTO(row) : null
}

export async function listAllMarcas(): Promise<string[]> {
  const rows = await db.vehicle.findMany({
    where: { available: true },
    select: { marca: true },
    distinct: ["marca"],
    orderBy: { marca: "asc" },
  })
  return rows.map((r) => r.marca)
}

export interface RelatedVehicle extends Vehicle {
  score: number
}

/** Score-based related vehicles (same algorithm as the old client logic). */
export async function getRelatedVehicles(
  actual: Vehicle,
  cantidad = 3
): Promise<Vehicle[]> {
  const all = await listAllVehicles()
  const scored = all
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
  return scored
}
