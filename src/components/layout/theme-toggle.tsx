"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, Check } from "lucide-react"
import { useTema, temas, aplicarTema, type TemaId } from "@/store/use-tema"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

const easeLux = [0.22, 1, 0.36, 1] as const

export function ThemeToggle() {
  const [abierto, setAbierto] = useState(false)
  const temaActivo = useTema((s) => s.temaActivo)
  const setTema = useTema((s) => s.setTema)
  const hidratado = useHydrated()

  // Aplica el tema al cargar y cuando cambia
  useEffect(() => {
    aplicarTema(temaActivo)
  }, [temaActivo])

  const handleSeleccionar = (id: TemaId) => {
    setTema(id)
    aplicarTema(id)
    setTimeout(() => setAbierto(false), 200)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all duration-300 hover:text-foreground",
          abierto && "border-border bg-secondary text-foreground"
        )}
        aria-label="Cambiar tema"
        aria-expanded={abierto}
      >
        <Palette className="h-4 w-4" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {abierto && (
          <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setAbierto(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: easeLux }}
              className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-card-hover"
            >
              <p className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Tema visual
              </p>
              <div className="space-y-0.5">
                {hidratado && temas.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => handleSeleccionar(tema.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      temaActivo === tema.id
                        ? "bg-secondary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    {/* Muestra de color */}
                    <span
                      className="h-6 w-6 shrink-0 rounded-lg border border-border/50"
                      style={{ backgroundColor: tema.muestra }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {tema.nombre}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {tema.descripcion}
                      </p>
                    </div>
                    {temaActivo === tema.id && (
                      <Check className="h-4 w-4 shrink-0 text-[var(--signature)]" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
