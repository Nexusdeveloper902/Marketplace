"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { useTienda } from "@/store/use-store"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

/**
 * Sticky bottom call-to-action bar, visible only on mobile (below lg).
 * Appears after the visitor scrolls past the first viewport on pages that
 * benefit from a persistent conversion nudge. Links to the marketplace by
 * default, or to the cart when it has items.
 */
export function StickyMobileCta() {
  const pathname = usePathname()
  const hidratado = useHydrated()
  const cantCarrito = useTienda((s) => s.carrito.length)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => {
      setVisible(window.scrollY > 320)
    }
    alScroll()
    window.addEventListener("scroll", alScroll, { passive: true })
    return () => window.removeEventListener("scroll", alScroll)
  }, [])

  // Hide on auth/legal pages where a CTA is noise.
  const rutasSinCta = ["/login", "/registro", "/admin", "/privacidad", "/terminos", "/gracias"]
  if (rutasSinCta.some((r) => pathname.startsWith(r))) return null

  // Cart takes priority when it has items.
  const hayCarrito = hidratado && cantCarrito > 0
  const href = hayCarrito ? "/carrito" : "/marketplace"
  const etiqueta = hayCarrito ? "Ir al carrito" : "Explorar vehículos"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          // Only on mobile; the desktop header/nav already has persistent CTAs.
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        >
          {/* Padding bottom for safe-area on notched devices */}
          <div className="border-t border-border/70 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
            <Link
              href={href}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
              )}
              aria-label={etiqueta}
            >
              {hayCarrito && <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />}
              {etiqueta}
              {!hayCarrito && (
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              )}
              {hayCarrito && cantCarrito > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[11px] font-bold">
                  {cantCarrito}
                </span>
              )}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
