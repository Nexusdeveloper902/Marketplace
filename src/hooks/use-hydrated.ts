"use client"

import { useSyncExternalStore } from "react"

/**
 * Devuelve `false` durante el render del servidor y la hidratación inicial
 * del cliente, y `true` una vez hidratado. Útil para evitar desajustes de
 * hidratación al leer estado persistido en localStorage.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
