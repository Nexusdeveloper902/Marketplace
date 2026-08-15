import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { db } from "@/lib/db"
import { hashPasswordSync } from "../password"
import { trackEvent, EventType } from "../events"

const SUFFIX = process.pid.toString(36) + Math.floor(Math.random() * 1e6).toString(36)
const TEST_EMAIL = `events+${SUFFIX}@luxicar.test`
let userId: string
let vehicleId: string

beforeAll(async () => {
  const user = await db.user.create({
    data: {
      email: TEST_EMAIL,
      name: "Eventos Test",
      passwordHash: hashPasswordSync("Test1234!"),
      role: "USER",
    },
  })
  userId = user.id
  const v = await db.vehicle.findFirst({ where: { available: true } })
  if (!v) throw new Error("No hay vehículos para el test de eventos")
  vehicleId = v.id
})

afterAll(async () => {
  await db.user.delete({ where: { id: userId } }).catch(() => {})
})

describe("events (trackEvent, DB-backed)", () => {
  it("persiste un evento de tipo VEHICLE_VIEWED", async () => {
    await trackEvent({ type: EventType.VEHICLE_VIEWED, userId, vehicleId })
    const found = await db.event.findFirst({
      where: { type: "VEHICLE_VIEWED", userId, vehicleId },
      orderBy: { createdAt: "desc" },
    })
    expect(found).not.toBeNull()
    expect(found!.metadata).toBe("{}")
  })

  it("serializa metadata como JSON string", async () => {
    await trackEvent({
      type: EventType.CART_ADDED,
      userId,
      vehicleId,
      metadata: { qty: 2 },
    })
    const found = await db.event.findFirst({
      where: { type: "CART_ADDED", userId, vehicleId },
      orderBy: { createdAt: "desc" },
    })
    expect(found).not.toBeNull()
    expect(JSON.parse(found!.metadata)).toEqual({ qty: 2 })
  })

  it("permite userId/vehicleId nulos (evento anónimo)", async () => {
    await trackEvent({ type: EventType.VEHICLE_VIEWED })
    const found = await db.event.findFirst({
      where: { type: "VEHICLE_VIEWED", userId: null },
      orderBy: { createdAt: "desc" },
    })
    expect(found).not.toBeNull()
    expect(found!.userId).toBeNull()
  })

  it("traga errores sin lanzar (best-effort)", async () => {
    // Un tipo inexistente en la columna `type` (String libre) no rompe;
    // forzamos un error pasando un vehicleId inexistente SIN la relación
    // opcional — trackEvent debe tragárselo y no lanzar.
    await expect(
      trackEvent({ type: EventType.PURCHASE_COMPLETED, orderId: "orden-falsa" })
    ).resolves.toBeUndefined()
  })
})
