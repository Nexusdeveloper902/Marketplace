"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useTienda } from "@/store/use-store"
import { useToggleFavorito } from "@/lib/auth/use-favorites-sync"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  vehiculoId: string
  vehiculoNombre: string
  className?: string
  variant?: "overlay" | "solid"
}

export function FavoriteButton({
  vehiculoId,
  vehiculoNombre,
  className,
  variant = "overlay",
}: FavoriteButtonProps) {
  const esFavorito = useTienda((s) => s.esFavorito(vehiculoId))
  const toggleFavorito = useToggleFavorito()
  const { toast } = useToast()

  const handleToggle = () => {
    void toggleFavorito(vehiculoId)
    toast({
      title: esFavorito ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: esFavorito
        ? `${vehiculoNombre} se ha quitado de tus favoritos.`
        : `${vehiculoNombre} se ha añadido a tus favoritos.`,
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
          ? "h-8 w-8 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 sm:h-9 sm:w-9"
          : "h-10 w-10 border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
      aria-label={
        esFavorito
          ? `Quitar ${vehiculoNombre} de favoritos`
          : `Añadir ${vehiculoNombre} a favoritos`
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {esFavorito ? (
          <motion.span
            key="fav"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Heart
              className="h-3.5 w-3.5 fill-[var(--signature)] text-[var(--signature)] sm:h-4 sm:w-4"
              strokeWidth={2}
            />
          </motion.span>
        ) : (
          <motion.span
            key="nofav"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
