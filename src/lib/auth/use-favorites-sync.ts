"use client"

import { useAuth } from "./auth-context"
import { useTienda } from "@/store/use-store"
import { useCallback, useEffect, useRef } from "react"

/**
 * Bridges client favorite state with the backend.
 *
 * - When authenticated: the DB is the source of truth. We hydrate the
 *   Zustand `favoritos` array from the server on mount, and toggle calls
 *   go through the API (with optimistic Zustand updates).
 * - When anonymous: Zustand/localStorage remains the source of truth
 *   (guest favorites), and they are merged into the DB on login.
 */
export function useFavoritesSync() {
  const { user, isAuthenticated, mergeGuestFavorites } = useAuth()
  const favoritos = useTienda((s) => s.favoritos)
  const setFavoritos = useTienda((s) => s.setFavoritos)
  const mergedRef = useRef(false)

  // On login (or when a session is detected), pull server favorites and merge
  // any guest favorites once.
  useEffect(() => {
    if (!isAuthenticated || !user) {
      mergedRef.current = false
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/favorites", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { favoritos: string[] }
        if (cancelled) return
        const serverSet = new Set(data.favoritos)
        // Merge guest favorites (current Zustand) into the DB once per login.
        if (!mergedRef.current) {
          mergedRef.current = true
          const guestOnly = favoritos.filter((s) => !serverSet.has(s))
          if (guestOnly.length > 0) {
            await mergeGuestFavorites(guestOnly)
            setFavoritos([...data.favoritos, ...guestOnly])
            return
          }
        }
        setFavoritos(data.favoritos)
      } catch {
        // ignore — keep client state
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user?.id, favoritos, mergeGuestFavorites, setFavoritos])
}

/**
 * Returns a toggle function that updates the DB when authenticated and
 * always updates the optimistic Zustand state.
 */
export function useToggleFavorito() {
  const { isAuthenticated } = useAuth()
  const toggleFavorito = useTienda((s) => s.toggleFavorito)
  const esFavorito = useTienda((s) => s.esFavorito)

  return useCallback(
    async (vehicleSlug: string) => {
      const wasFav = esFavorito(vehicleSlug)
      // Optimistic update
      toggleFavorito(vehicleSlug)
      if (!isAuthenticated) return
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleSlug,
            action: wasFav ? "remove" : "add",
          }),
        })
        if (!res.ok) toggleFavorito(vehicleSlug) // revert
      } catch {
        toggleFavorito(vehicleSlug) // revert
      }
    },
    [isAuthenticated, toggleFavorito, esFavorito]
  )
}
