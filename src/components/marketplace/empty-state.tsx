"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, type LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  titulo: string
  descripcion: string
  ctaLabel: string
  ctaHref: string
}

const easeLux = [0.22, 1, 0.36, 1] as const

export function EmptyState({
  icon: Icon,
  titulo,
  descripcion,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5, ease: easeLux }}
      className="hero-glow relative mt-12 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border/40 py-24 text-center sm:py-32"
    >
      {/* Icono con composición visual */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: easeLux }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[var(--signature)]/10 blur-2xl" />
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card text-muted-foreground shadow-card">
          <Icon className="h-9 w-9" strokeWidth={1.5} />
        </span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: easeLux }}
        className="text-display mt-7 text-2xl text-foreground sm:text-3xl"
      >
        {titulo}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.32, ease: easeLux }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
      >
        {descripcion}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: easeLux }}
      >
        <Link
          href={ctaHref}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </motion.section>
  )
}
