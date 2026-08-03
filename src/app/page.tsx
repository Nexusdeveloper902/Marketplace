"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTienda } from "@/store/use-store"
import { useHydrated } from "@/hooks/use-hydrated"
import { Header } from "@/components/marketplace/header"
import { Footer } from "@/components/marketplace/footer"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { VehicleDetailView } from "@/components/marketplace/vehicle-detail-view"
import { GarageView } from "@/components/marketplace/garage-view"

export default function Home() {
  const vista = useTienda((s) => s.vista)
  const montado = useHydrated()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {!montado ? (
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-border/60 bg-card"
                />
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={vista}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {vista === "marketplace" && <MarketplaceView />}
              {vista === "detalle" && <VehicleDetailView />}
              {vista === "garaje" && <GarageView />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  )
}
