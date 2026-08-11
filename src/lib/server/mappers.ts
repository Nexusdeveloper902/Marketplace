import type { Vehicle as VehicleRecord } from "@prisma/client"
import type { Vehicle } from "@/types/vehicle"

/**
 * Slug helper that mirrors the existing brand-slug logic in
 * /marcas/[marca]/page.ts so seeded slugs match the URL expectations.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/**
 * Convert a Prisma Vehicle row into the frontend Vehicle shape, decoding the
 * JSON-encoded images array. The frontend `Vehicle.id` is the stable slug so
 * existing routes (/vehiculos/[id]) keep working unchanged.
 */
export function toVehicleDTO(v: VehicleRecord): Vehicle {
  let imagenes: string[] = []
  try {
    imagenes = JSON.parse(v.images) as string[]
    if (!Array.isArray(imagenes)) imagenes = []
  } catch {
    imagenes = []
  }
  return {
    id: v.slug,
    marca: v.marca,
    modelo: v.modelo,
    año: v.año,
    precio: v.precio,
    motor: v.motor,
    potencia: v.potencia,
    torque: v.torque,
    transmision: v.transmision,
    combustible: v.combustible,
    traccion: v.traccion,
    velocidadMaxima: v.velocidadMaxima,
    aceleracion0a100: v.aceleracion0a100,
    categoria: v.categoria as Vehicle["categoria"],
    descripcion: v.descripcion,
    imagenes,
  }
}

/** Inventory status label shown in the UI. */
export type InventarioEstado = "disponible" | "ultima" | "agotado"

export function estadoInventario(stock: number, available: boolean): InventarioEstado {
  if (!available || stock <= 0) return "agotado"
  if (stock === 1) return "ultima"
  return "disponible"
}
