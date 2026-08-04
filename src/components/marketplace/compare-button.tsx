"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GitCompareArrows, Check } from "lucide-react"
import { useTienda, MAX_COMPARAR } from "@/store/use-store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CompareButtonProps {
  vehiculoId: string
  vehiculoNombre: string
  className?: string
  variant?: "overlay" | "solid"
}

export function CompareButton({
  vehiculoId,
  vehiculoNombre,
  className,
  variant = "overlay",
}: CompareButtonProps) {
  const estaEnComparador = useTienda((s) => s.estaEnComparador(vehiculoId))
  const toggleComparar = useTienda((s) => s.toggleComparar)
  const cantidadComparar = useTienda((s) => s.comparar.length)
  const { toast } = useToast()

  const handleToggle = () => {
    if (!estaEnComparador && cantidadComparar >= MAX_COMPARAR) {
      toast({
        title: "Comparador lleno",
        description: `Solo puedes comparar hasta ${MAX_COMPARAR} vehículos a la vez.`,
      })
      return
    }
    toggleComparar(vehiculoId)
    toast({
      title: estaEnComparador ? "Quitado del comparador" : "Añadido al comparador",
      description: estaEnComparador
        ? `${vehiculoNombre} se ha quitado del comparador.`
        : `${vehiculoNombre} se ha añadido al comparador.`,
    })
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggle()
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        variant === "overlay"
          ? "h-9 w-9 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80"
          : "h-10 w-10 border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
      aria-label={
        estaEnComparador
          ? `Quitar ${vehiculoNombre} del comparador`
          : `Añadir ${vehiculoNombre} al comparador`
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {estaEnComparador ? (
          <motion.span
            key="comp"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Check className="h-4 w-4 text-[var(--success)]" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span
            key="nocomp"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
