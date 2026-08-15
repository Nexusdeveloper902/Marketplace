"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Sparkles, Mail } from "lucide-react"
import { siteConfig } from "@/lib/site"

/**
 * Client-rendered content for the /gracias (thank you) page. Kept as a
 * separate client component so the page itself stays a server component
 * and can export `metadata`.
 */
export function GraciasContent() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 40%, oklch(0.72 0.16 155 / 0.08), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]"
      >
        <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-eyebrow mt-8 text-[11px] text-[var(--success)]">
          <Sparkles className="mr-1 inline h-3 w-3" strokeWidth={2} />
          Pedido completado
        </p>
        <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl">
          ¡Gracias por tu compra!
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Tu pedido se ha completado correctamente. Ya puedes disfrutar de tu
          nuevo vehículo en tu garaje privado. Hemos guardado todo para que lo
          revises cuando quieras.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Mail className="h-3.5 w-3.5" strokeWidth={2} />
        ¿Necesitas ayuda? Escríbenos a{" "}
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="font-medium text-[var(--signature)] hover:underline"
        >
          {siteConfig.contact.email}
        </a>
      </motion.p>
    </section>
  )
}
