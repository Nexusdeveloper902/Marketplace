import { db } from "@/lib/db"

export const EventType = {
  VEHICLE_VIEWED: "VEHICLE_VIEWED",
  VEHICLE_FAVORITED: "VEHICLE_FAVORITED",
  VEHICLE_UNFAVORITED: "VEHICLE_UNFAVORITED",
  CART_ADDED: "CART_ADDED",
  CHECKOUT_STARTED: "CHECKOUT_STARTED",
  PURCHASE_COMPLETED: "PURCHASE_COMPLETED",
} as const

export type EventTypeValue = (typeof EventType)[keyof typeof EventType]

interface TrackInput {
  type: EventTypeValue
  userId?: string | null
  vehicleId?: string | null
  orderId?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Lightweight, best-effort event tracking. Failures are swallowed so that
 * analytics never break a user-facing flow.
 */
export async function trackEvent(input: TrackInput): Promise<void> {
  try {
    await db.event.create({
      data: {
        type: input.type,
        userId: input.userId ?? null,
        vehicleId: input.vehicleId ?? null,
        orderId: input.orderId ?? null,
        metadata: JSON.stringify(input.metadata ?? {}),
      },
    })
  } catch {
    // best-effort: ignore
  }
}
