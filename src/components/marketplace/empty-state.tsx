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
      transition={{ delay: 0.1 }}
      className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center sm:py-28"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </span>
      <p className="mt-5 text-lg font-medium text-foreground">{titulo}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{descripcion}</p>
      <Link
        href={ctaHref}
        className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </motion.section>
  )
}
