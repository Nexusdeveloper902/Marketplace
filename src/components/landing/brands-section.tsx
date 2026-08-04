"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { marcas } from "@/data/vehicles"

const easeLux = [0.22, 1, 0.36, 1] as const

export function BrandsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-eyebrow text-[11px] text-[var(--signature)]"
        >
          Las casas más prestigiosas
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: easeLux }}
          className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl"
        >
          Marcas que
          <br />
          <span className="text-gradient">definen épocas</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
        >
          Trabajamos con los fabricantes más legendarios del mundo para
          ofrecerte lo mejor de cada casa.
        </motion.p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {marcas.map((marca, i) => (
          <motion.div
            key={marca}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.4,
              delay: Math.min(i * 0.04, 0.4),
              ease: easeLux,
            }}
            className="group flex aspect-[3/2] items-center justify-center rounded-2xl border border-border/50 bg-card/50 px-4 transition-all duration-500 hover:border-border hover:bg-card"
          >
            <span className="text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors duration-500 group-hover:text-foreground sm:text-base">
              {marca}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-14">
        <Link
          href="/marketplace"
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]"
        >
          Explorar todos los vehículos
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
