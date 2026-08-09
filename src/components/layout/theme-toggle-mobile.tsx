"use client"

import { useTema, temas, aplicarTema, type TemaId } from "@/store/use-tema"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

/**
 * Versión móvil del selector de temas — grid horizontal compacto
 * de muestras de color, pensado para el menú hamburguesa.
 */
export function ThemeToggleMobile() {
  const temaActivo = useTema((s) => s.temaActivo)
  const setTema = useTema((s) => s.setTema)
  const hidratado = useHydrated()

  const handleSeleccionar = (id: TemaId) => {
    setTema(id)
    aplicarTema(id)
  }

  if (!hidratado) return null

  return (
    <div className="grid grid-cols-3 gap-2">
      {temas.map((tema) => (
        <button
          key={tema.id}
          onClick={() => handleSeleccionar(tema.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all",
            temaActivo === tema.id
              ? "border-foreground/40 bg-secondary"
              : "border-border/50 hover:bg-secondary/50"
          )}
          aria-label={tema.nombre}
        >
          <span
            className="h-6 w-6 rounded-lg border border-border/50"
            style={{ backgroundColor: tema.muestra }}
          />
          <span className="text-[10px] font-medium text-muted-foreground">
            {tema.nombre}
          </span>
        </button>
      ))}
    </div>
  )
}
