"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatearPrecio } from "@/lib/format"

interface CheckoutModalProps {
  abierto: boolean
  onClose: () => void
  cantidad: number
  total: number
}

export function CheckoutModal({
  abierto,
  onClose,
  cantidad,
  total,
}: CheckoutModalProps) {
  // Bloquea el scroll del body cuando el modal está abierto.
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [abierto])

  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="overflow-hidden border-border/70 bg-card p-0 sm:max-w-md">
        {/* Cabecera con animación de éxito */}
        <div className="relative flex flex-col items-center px-6 pb-2 pt-10 text-center">
          <div className="hero-glow pointer-events-none absolute inset-0" />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]"
          >
            <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
          </motion.div>
          <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.2} />
            Compra confirmada
          </span>
        </div>

        <DialogHeader className="px-6 pb-2 pt-4 text-center">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
            ¡Felicidades por tu adquisición!
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {cantidad === 1
              ? "Tu vehículo ha sido añadido a tu garaje privado."
              : `Has adquirido ${cantidad} vehículos. Todos se han añadido a tu garaje privado.`}
          </DialogDescription>
        </DialogHeader>

        {/* Resumen */}
        <div className="mx-6 mt-4 rounded-xl border border-border/70 bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vehículos adquiridos</span>
            <span className="font-semibold text-foreground">{cantidad}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total de la compra
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {formatearPrecio(total)}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2.5 px-6 pb-6 pt-5">
          <Link
            href="/garaje"
            onClick={onClose}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ver mi garaje
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Seguir explorando
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
