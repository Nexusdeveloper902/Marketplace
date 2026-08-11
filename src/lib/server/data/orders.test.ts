import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { db } from "@/lib/db"
import { hashPasswordSync } from "../password"
import {
  checkout,
  listOrders,
  getOrderForUser,
  CheckoutError,
} from "./orders"
import {
  addFavorite,
  removeFavorite,
  isFavorited,
  listFavoriteSlugs,
} from "./favorites"
import {
  createReview,
  listReviews,
  hasUserReviewed,
  ReviewError,
} from "./reviews"
import { listVehicles, parseOrden } from "./vehicles"

// A unique-ish suffix so repeated test runs don't collide with prior rows.
const SUFFIX = process.pid.toString(36) + Math.floor(Math.random() * 1e6).toString(36)
const TEST_EMAIL = `test+${SUFFIX}@luxicar.test`
const PASSWORD = "Test1234!"

let userId: string
let vehicleSlug: string
let vehicleId: string
let vehiclePrice: number
let initialStock: number

beforeAll(async () => {
  const user = await db.user.create({
    data: {
      email: TEST_EMAIL,
      name: "Usuario Test",
      passwordHash: hashPasswordSync(PASSWORD),
      role: "USER",
    },
  })
  userId = user.id

  // Pick an available vehicle with stock >= 1.
  const v = await db.vehicle.findFirst({
    where: { available: true, stock: { gte: 1 } },
  })
  if (!v) throw new Error("No hay vehículos disponibles para el test")
  vehicleId = v.id
  vehicleSlug = v.slug
  vehiclePrice = v.precio
  initialStock = v.stock
})

afterAll(async () => {
  // Deleting the user cascades favorites/orders/reviews/events.
  await db.user.delete({ where: { id: userId } }).catch(() => {})
  // Restore stock on the test vehicle in case a test decremented it.
  await db.vehicle
    .update({ where: { id: vehicleId }, data: { stock: initialStock, available: true } })
    .catch(() => {})
})

describe("vehicles data layer", () => {
  it("lista vehículos con paginación y total", async () => {
    const res = await listVehicles({ page: 1, pageSize: 5 })
    expect(res.items.length).toBeLessThanOrEqual(5)
    expect(res.total).toBeGreaterThanOrEqual(5)
  })

  it("filtra por marca y respeta el formato de orden", () => {
    expect(parseOrden("precio-asc")).toBe("precio-asc")
    expect(parseOrden("no-existe")).toBe("relevancia")
  })

  it("filtra por marca correctamente", async () => {
    const v = await db.vehicle.findFirst({ where: { available: true } })
    if (!v) return
    const res = await listVehicles({ marca: v.marca, pageSize: 100 })
    expect(res.items.length).toBeGreaterThan(0)
    expect(res.items.every((x) => x.marca === v.marca)).toBe(true)
  })
})

describe("favorites", () => {
  it("añade un favorito y lo marca como tal", async () => {
    const added = await addFavorite(userId, vehicleSlug)
    expect(added).toBe(true)
    expect(await isFavorited(userId, vehicleSlug)).toBe(true)
  })

  it("no duplica el mismo favorito", async () => {
    await addFavorite(userId, vehicleSlug)
    await addFavorite(userId, vehicleSlug)
    const slugs = await listFavoriteSlugs(userId)
    expect(slugs.filter((s) => s === vehicleSlug).length).toBe(1)
  })

  it("elimina el favorito", async () => {
    await removeFavorite(userId, vehicleSlug)
    expect(await isFavorited(userId, vehicleSlug)).toBe(false)
  })

  it("no favorita un slug inexistente", async () => {
    expect(await addFavorite(userId, "slug-que-no-existe")).toBe(false)
  })
})

describe("checkout / inventory", () => {
  it("crea un pedido usando el precio del servidor y decrementa stock", async () => {
    const before = await db.vehicle.findUnique({ where: { id: vehicleId } })
    const stockBefore = before!.stock

    const result = await checkout(userId, [
      { vehicleSlug, quantity: 1 },
    ])

    expect(result.orderNumber).toMatch(/^LXC-\d{4}-/)
    expect(result.total).toBe(vehiclePrice) // precio del servidor, no del cliente
    expect(result.vehicles.length).toBe(1)

    const after = await db.vehicle.findUnique({ where: { id: vehicleId } })
    expect(after!.stock).toBe(stockBefore - 1)

    // El OrderItem guarda el precio de compra
    const order = await getOrderForUser(userId, result.orderId)
    expect(order).not.toBeNull()
    expect(order!.items[0].priceAtPurchase).toBe(vehiclePrice)
    expect(order!.status).toBe("COMPLETED")
  })

  it("lista los pedidos del usuario", async () => {
    const orders = await listOrders(userId)
    expect(orders.length).toBeGreaterThanOrEqual(1)
    expect(orders.every((o) => o.items.length >= 1)).toBe(true)
  })

  it("marca el vehículo como agotado cuando el stock llega a cero", async () => {
    // Reduce stock a 1 para forzar el agotamiento en la siguiente compra.
    await db.vehicle.update({ where: { id: vehicleId }, data: { stock: 1, available: true } })

    const r1 = await checkout(userId, [{ vehicleSlug, quantity: 1 }])
    expect(r1.orderId).toBeTruthy()

    const agotado = await db.vehicle.findUnique({ where: { id: vehicleId } })
    expect(agotado!.stock).toBe(0)
    expect(agotado!.available).toBe(false)

    // Un segundo intento debe fallar: no disponible.
    await expect(
      checkout(userId, [{ vehicleSlug, quantity: 1 }])
    ).rejects.toThrowError(CheckoutError)
  })

  it("rechaza comprar más stock del disponible", async () => {
    // Restaura stock a 2 para este caso.
    await db.vehicle.update({ where: { id: vehicleId }, data: { stock: 2, available: true } })
    await expect(
      checkout(userId, [{ vehicleSlug, quantity: 5 }])
    ).rejects.toThrowError(CheckoutError)
    // El stock no debe haber cambiado (transacción abortada)
    const v = await db.vehicle.findUnique({ where: { id: vehicleId } })
    expect(v!.stock).toBe(2)
  })

  it("rechaza un carrito vacío", async () => {
    await expect(checkout(userId, [])).rejects.toThrowError(CheckoutError)
  })
})

describe("order ownership", () => {
  it("no permite ver un pedido de otro usuario", async () => {
    // Crea otro usuario y verifica que no puede ver el pedido del primero.
    const other = await db.user.create({
      data: {
        email: `other+${SUFFIX}@luxicar.test`,
        name: "Otro",
        passwordHash: hashPasswordSync(PASSWORD),
      },
    })
    try {
      const orders = await listOrders(userId)
      const firstOrder = orders[0]
      const stolen = await getOrderForUser(other.id, firstOrder.id)
      expect(stolen).toBeNull() // getByUser filtra por userId
    } finally {
      await db.user.delete({ where: { id: other.id } })
    }
  })
})

describe("reviews", () => {
  it("permite reseñar un vehículo comprado", async () => {
    // Asegura stock para una compra nueva.
    await db.vehicle.update({ where: { id: vehicleId }, data: { stock: 1, available: true } })
    await checkout(userId, [{ vehicleSlug, quantity: 1 }])

    const review = await createReview(userId, vehicleSlug, 5, "Excelente")
    expect(review.rating).toBe(5)
    expect(review.comment).toBe("Excelente")
    expect(await hasUserReviewed(userId, vehicleSlug)).toBe(true)
  })

  it("rechaza una segunda reseña del mismo usuario para el mismo vehículo", async () => {
    await expect(
      createReview(userId, vehicleSlug, 4, "Otra reseña")
    ).rejects.toThrowError(ReviewError)
  })

  it("valida el rango de rating (1–5)", async () => {
    // Usa otro vehículo que el usuario haya comprado no es necesario aquí:
    // createReview valida rating antes de comprobar compra.
    await expect(
      createReview(userId, vehicleSlug, 0, "cero")
    ).rejects.toThrowError(ReviewError)
    await expect(
      createReview(userId, vehicleSlug, 6, "seis")
    ).rejects.toThrowError(ReviewError)
  })

  it("no permite reseñar un vehículo NO comprado", async () => {
    // Otro vehículo disponible que el usuario NO ha comprado.
    const v = await db.vehicle.findFirst({
      where: { available: true, slug: { not: vehicleSlug } },
    })
    if (!v) return
    await expect(
      createReview(userId, v.slug, 4, "no comprado")
    ).rejects.toThrowError(ReviewError)
  })

  it("lista reseñas y calcula el promedio", async () => {
    const { reviews, average, count } = await listReviews(vehicleSlug)
    expect(count).toBeGreaterThanOrEqual(1)
    expect(average).toBeGreaterThanOrEqual(1)
    expect(average).toBeLessThanOrEqual(5)
    expect(reviews.every((r) => r.rating >= 1 && r.rating <= 5)).toBe(true)
  })
})
