"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useToast } from "@/hooks/use-toast"
import { CheckoutModal } from "./checkout-modal"

export function CartView() {
  const carrito = useTienda((s) => s.carrito)
  const quitarDelCarrito = useTienda((s) => s.quitarDelCarrito)
  const finalizarCompra = useTienda((s) => s.finalizarCompra)
  const { toast } = useToast()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [resumen, setResumen] = useState({ cantidad: 0, total: 0 })

  const items = carrito
    .map((id) => vehiculos.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  const total = items.reduce((sum, v) => sum + v.precio, 0)

  const handleQuitar = (id: string, marca: string, modelo: string) => {
    quitarDelCarrito(id)
    toast({
      title: "Vehículo eliminado",
      description: `${marca} ${modelo} se ha quitado del carrito.`,
    })
  }

  const handleFinalizar = () => {
    setResumen({ cantidad: items.length, total })
    finalizarCompra()
    setModalAbierto(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/60 pb-8 pt-10 sm:pt-14"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Tu selección
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Carrito de compras
        </h1>
        {items.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {items.length}{" "}
            {items.length === 1 ? "vehículo listo" : "vehículos listos"} para
            finalizar la compra.
          </p>
        ) : (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Tu carrito está vacío. Explora el marketplace y añade los vehículos
            que más te gusten para comenzar tu colección.
          </p>
        )}
      </motion.section>

      {items.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-8 pb-4 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Lista de items */}
          <section>
            <ul className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {items.map((vehiculo, i) => (
                  <motion.li
                    key={vehiculo.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i * 0.04, 0.3),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-3 transition-colors hover:border-border sm:p-4"
                  >
                    {/* Imagen */}
                    <Link
                      href={`/vehiculos/${vehiculo.id}`}
                      className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-36"
                      aria-label={`Ver detalles del ${vehiculo.marca} ${vehiculo.modelo}`}
                    >
                      <img
                        src={vehiculo.imagenes[0]}
                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {vehiculo.marca}
                            </p>
                            <Link
                              href={`/vehiculos/${vehiculo.id}`}
                              className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground sm:text-lg"
                            >
                              {vehiculo.modelo}
                            </Link>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {vehiculo.año} · {vehiculo.combustible} ·{" "}
                              {formatearNumero(vehiculo.potencia)} HP
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleQuitar(
                                vehiculo.id,
                                vehiculo.marca,
                                vehiculo.modelo
                              )
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Quitar ${vehiculo.marca} ${vehiculo.modelo} del carrito`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Subtotal
                        </span>
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                          {formatearPrecio(vehiculo.precio)}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>

          {/* Resumen / Checkout */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border/70 bg-card p-6"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Resumen del pedido
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    Vehículos ({items.length})
                  </dt>
                  <dd className="font-medium text-foreground">
                    {formatearPrecio(
                      items.reduce((s, v) => s + v.precio, 0)
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Tramitación</dt>
                  <dd className="font-medium text-[var(--success)]">
                    Incluida
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatearPrecio(total)}
                </span>
              </div>

              <button
                onClick={handleFinalizar}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
              >
                Finalizar compra
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Garantías */}
              <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.2} />
                  Compra simulada, sin pagos reales
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-[var(--signature)]" strokeWidth={2.2} />
                  Entrega inmediata a tu garaje
                </li>
              </ul>
            </motion.div>
          </aside>
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center sm:py-28"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
          </span>
          <p className="mt-5 text-lg font-medium text-foreground">
            Tu carrito está vacío
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Añade vehículos desde el marketplace y aparecerán aquí listos para
            finalizar tu compra.
          </p>
          <Link
            href="/marketplace"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explorar marketplace
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.section>
      )}

      <CheckoutModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cantidad={resumen.cantidad}
        total={resumen.total}
      />
    </div>
  )
}
