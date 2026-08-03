"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { marcas } from "@/data/vehicles"

export function BrandsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Las mejores marcas
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Marcas disponibles
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          Trabajamos con los fabricantes más prestigiosos del mundo para
          ofrecerte lo mejor de cada casa.
        </motion.p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {marcas.map((marca, i) => (
          <motion.div
            key={marca}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.4,
              delay: Math.min(i * 0.05, 0.4),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group flex aspect-[3/2] items-center justify-center rounded-2xl border border-border/70 bg-card px-4 transition-all duration-300 hover:border-border hover:bg-secondary"
          >
            <span className="text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-base">
              {marca}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/marketplace"
          className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Explorar todos los vehículos
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
