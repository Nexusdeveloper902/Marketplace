import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { toVehicleDTO } from "../mappers"
import type { Vehicle } from "@/types/vehicle"

export const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const
export type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus]

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
}

export interface CheckoutItem {
  vehicleSlug: string
  quantity: number
}

export interface CheckoutResult {
  orderId: string
  orderNumber: string
  total: number
  vehicles: Vehicle[]
}

export class CheckoutError extends Error {
  constructor(
    message: string,
    public code:
      | "EMPTY"
      | "INVALID_VEHICLE"
      | "UNAVAILABLE"
      | "INSUFFICIENT_STOCK"
      | "UNKNOWN",
    public statusCode = 400
  ) {
    super(message)
  }
}

/**
 * Generate the next human-friendly order number, e.g. "LXC-2026-00042".
 * Reads the current max number for the year and increments.
 */
async function nextOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `LXC-${year}-`
  const last = await db.order.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  })
  let seq = 1
  if (last) {
    const n = Number(last.number.slice(prefix.length))
    if (!Number.isNaN(n)) seq = n + 1
  }
  return `${prefix}${String(seq).padStart(5, "0")}`
}

export interface OrderDetail {
  id: string
  number: string
  status: string
  statusLabel: string
  total: number
  createdAt: Date
  items: {
    id: string
    quantity: number
    priceAtPurchase: number
    vehicle: Vehicle
  }[]
}

function toOrderDetail(
  order: Prisma.OrderGetPayload<{ include: { items: { include: { vehicle: true } } } }>
): OrderDetail {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status] ?? order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      priceAtPurchase: it.priceAtPurchase,
      vehicle: toVehicleDTO(it.vehicle),
    })),
  }
}

/**
 * Atomic checkout.
 *
 * Within a single Prisma transaction:
 *  - lock/validate each vehicle (exists, available, sufficient stock)
 *  - use the DB price (never the client price)
 *  - create the order + order items
 *  - decrement stock and mark unavailable when it hits zero
 *
 * Because SQLite/Prisma interactive transactions use serializable-ish
 * isolation per-transaction and the stock decrement uses a conditional
 * update, a concurrent transaction that already took the last unit will
 * cause this transaction to roll back via the thrown CheckoutError.
 */
export async function checkout(
  userId: string,
  items: CheckoutItem[]
): Promise<CheckoutResult> {
  if (items.length === 0) {
    throw new CheckoutError("El carrito está vacío", "EMPTY")
  }

  // Normalize: one entry per vehicle, quantity >= 1.
  const normalized = new Map<string, number>()
  for (const it of items) {
    const q = Math.max(1, Math.floor(it.quantity))
    normalized.set(it.vehicleSlug, (normalized.get(it.vehicleSlug) ?? 0) + q)
  }
  const slugs = [...normalized.keys()]

  return db.$transaction(async (tx) => {
    const vehicles = await tx.vehicle.findMany({
      where: { slug: { in: slugs } },
    })
    const bySlug = new Map(vehicles.map((v) => [v.slug, v]))
    if (vehicles.length !== slugs.length) {
      throw new CheckoutError(
        "Uno o más vehículos ya no están disponibles",
        "INVALID_VEHICLE"
      )
    }

    let total = 0
    const orderItems: {
      vehicleId: string
      priceAtPurchase: number
      quantity: number
    }[] = []

    for (const [slug, quantity] of normalized) {
      const v = bySlug.get(slug)!
      if (!v.available || v.stock <= 0) {
        throw new CheckoutError(
          `${v.marca} ${v.modelo} no está disponible`,
          "UNAVAILABLE",
          409
        )
      }
      if (v.stock < quantity) {
        throw new CheckoutError(
          `Stock insuficiente para ${v.marca} ${v.modelo} (disponible: ${v.stock})`,
          "INSUFFICIENT_STOCK",
          409
        )
      }
      // The server price is authoritative.
      total += v.precio * quantity
      orderItems.push({
        vehicleId: v.id,
        priceAtPurchase: v.precio,
        quantity,
      })
    }

    const number = await nextOrderNumber()
    const order = await tx.order.create({
      data: {
        number,
        userId,
        status: OrderStatus.COMPLETED,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { vehicle: true } } },
    })

    // Decrement stock atomically. The conditional WHERE guarantees that if a
    // concurrent transaction already reduced stock below the requested
    // quantity, the update matches zero rows and we abort.
    for (const [slug, quantity] of normalized) {
      const v = bySlug.get(slug)!
      const updated = await tx.vehicle.updateMany({
        where: { id: v.id, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      })
      if (updated.count !== 1) {
        throw new CheckoutError(
          `Stock insuficiente para ${v.marca} ${v.modelo}`,
          "INSUFFICIENT_STOCK",
          409
        )
      }
      // Mark unavailable when stock reaches zero.
      await tx.vehicle.updateMany({
        where: { id: v.id, stock: { lte: 0 } },
        data: { available: false },
      })
    }

    return {
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      vehicles: order.items.map((it) => toVehicleDTO(it.vehicle)),
    }
  })
}

export async function listOrders(userId: string): Promise<OrderDetail[]> {
  const orders = await db.order.findMany({
    where: { userId },
    include: { items: { include: { vehicle: true } } },
    orderBy: { createdAt: "desc" },
  })
  return orders.map(toOrderDetail)
}

export async function getOrderForUser(
  userId: string,
  orderId: string
): Promise<OrderDetail | null> {
  const order = await db.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { vehicle: true } } },
  })
  return order ? toOrderDetail(order) : null
}

export async function getOrderByNumberForUser(
  userId: string,
  number: string
): Promise<OrderDetail | null> {
  const order = await db.order.findFirst({
    where: { number, userId },
    include: { items: { include: { vehicle: true } } },
  })
  return order ? toOrderDetail(order) : null
}

/** Vehicles a user has purchased (from completed orders), deduplicated. */
export async function getPurchasedVehicles(userId: string): Promise<
  { vehicle: Vehicle; orderId: string; orderNumber: string; priceAtPurchase: number; purchasedAt: Date }[]
> {
  const orders = await db.order.findMany({
    where: { userId, status: OrderStatus.COMPLETED },
    include: { items: { include: { vehicle: true } } },
    orderBy: { createdAt: "desc" },
  })
  const seen = new Set<string>()
  const result: {
    vehicle: Vehicle
    orderId: string
    orderNumber: string
    priceAtPurchase: number
    purchasedAt: Date
  }[] = []
  for (const o of orders) {
    for (const it of o.items) {
      if (seen.has(it.vehicle.slug)) continue
      seen.add(it.vehicle.slug)
      result.push({
        vehicle: toVehicleDTO(it.vehicle),
        orderId: o.id,
        orderNumber: o.number,
        priceAtPurchase: it.priceAtPurchase,
        purchasedAt: o.createdAt,
      })
    }
  }
  return result
}
