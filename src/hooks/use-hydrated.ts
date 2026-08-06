"use client"

import { useSyncExternalStore } from "react"

// Snapshots cacheados para evitar el warning de React 19
// "getSnapshot should be cached to avoid an infinite loop".
const CLIENT_SNAPSHOT = true
const SERVER_SNAPSHOT = false

const emptySubscribe = () => () => {}

/**
 * Devuelve `false` durante el render del servidor y la hidratación inicial
 * del cliente, y `true` una vez hidratado. Útil para evitar desajustes de
 * hidratación al leer estado persistido en localStorage.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => CLIENT_SNAPSHOT,
    () => SERVER_SNAPSHOT
  )
}
