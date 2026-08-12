"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap, BadgeCheck, Award } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useToast } from "@/hooks/use-toast"
import { CheckoutModal, leerBorradorCheckout, borrarBorradorCheckout } from "./checkout-modal"
import { EmptyState } from "./empty-state"
import { SmartImage } from "@/components/ui/smart-image"
import { estaDisponible, type Vehicle } from "@/types/vehicle"

/**
 * Revalida el carrito contra el inventario real del servidor (vía la API
 * pública de vehículos) en lugar de fiarse de los IDs aceptados por
 * agregarAlCarrito, que pueden quedar obsoletos en el localStorage tras un
 * cambio de stock. Devuelve los vehículos del carrito que siguen
 * disponibles con su precio/stock actualizados; lanza si la API falla.
 */
export async function revalidarCarrito(slugs: string[]): Promise<Map<string, Vehicle>> {
  const res = await fetch("/api/vehicles?all=1", { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudo verificar el inventario")
  const data = (await res.json()) as { items: Vehicle[] }
  const disponibles = new Map<string, Vehicle>()
  for (const v of data.items) {
    if (slugs.includes(v.id) && estaDisponible(v)) disponibles.set(v.id, v)
  }
  return disponibles
}

export function CartView() {
  const carrito = useTienda((s) => s.carrito)
  const quitarDelCarrito = useTienda((s) => s.quitarDelCarrito)
  const { toast } = useToast()

  // Borrador del checkout restaurado tras un redirect a /login. Se lee una sola
  // vez (lazy init) para que el modal lo reciba en sus useState iniciales.
  // Solo datos de contacto: el pago nunca se persiste (seguridad).
  const [borrador] = useState<
    | { datos: { nombre: string; email: string; telefono: string } }
    | null
  >(() => (typeof window !== "undefined" ? leerBorradorCheckout() : null))

  const [modalAbierto, setModalAbierto] = useState(false)
  const [resumen, setResumen] = useState({ cantidad: 0, total: 0, vehiculos: [] as typeof items, slugs: [] as string[] })

  // Si volvemos de /login con un borrador guardado, reabre el checkout relleno.
  // El setState va dentro de setTimeout para evitar render en cascada en effects.
  useEffect(() => {
    if (!borrador) return
    borrarBorradorCheckout()
    if (carrito.length === 0) return
    const slugsCarrito = carrito
    let cancelled = false
    const t = setTimeout(async () => {
      // Revalida disponibilidad contra el servidor antes de reabrir el modal,
      // igual que handleFinalizar: el carrito en localStorage puede estar obsoleto.
      let validos = slugsCarrito
        .map((id) => vehiculos.find((v) => v.id === id))
        .filter((v): v is NonNullable<typeof v> => Boolean(v))
      try {
        const disponibles = await revalidarCarrito(slugsCarrito)
        validos = validos.filter((v) => disponibles.has(v.id))
        const agotados = slugsCarrito.filter((id) => !disponibles.has(id))
        for (const id of agotados) quitarDelCarrito(id)
        if (agotados.length > 0) {
          toast({
            title: "Algunos vehículos ya no están disponibles",
            description: "Se quitaron del carrito los agotados.",
          })
        }
      } catch {
        /* red/servidor caído: el POST /api/orders valida de forma autoritativa */
      }
      if (cancelled || validos.length === 0) return
      setResumen({
        cantidad: validos.length,
        total: validos.reduce((sum, v) => sum + v.precio, 0),
        vehiculos: validos,
        slugs: validos.map((v) => v.id),
      })
      setModalAbierto(true)
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

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

  const handleFinalizar = async () => {
    // Revalida el carrito contra el inventario actual del servidor antes de
    // abrir el checkout: un vehículo persistido en localStorage puede haberse
    // agotado desde que se añadió. El servidor vuelve a rechazar en el POST
    // /api/orders, pero aquí damos feedback temprano y limpiamos el carrito.
    let validos: Vehicle[] = items
    try {
      const disponibles = await revalidarCarrito(items.map((v) => v.id))
      validos = items
        .filter((v) => disponibles.has(v.id))
        // Usa precio/stock actualizados del servidor, no del catálogo estático.
        .map((v) => disponibles.get(v.id) ?? v)
      const agotados = items.filter((v) => !disponibles.has(v.id))
      if (agotados.length > 0) {
        for (const v of agotados) quitarDelCarrito(v.id)
        toast({
          title:
            agotados.length === 1
              ? "Vehículo ya no disponible"
              : "Algunos vehículos ya no están disponibles",
          description: `${agotados.map((v) => `${v.marca} ${v.modelo}`).join(", ")} se quitó del carrito.`,
        })
        if (validos.length === 0) return
      }
    } catch {
      // Si la verificación falla (red/servidor caído), dejamos pasar: el
      // POST /api/orders es la validación autoritativa y rechazará igual.
    }
    setResumen({
      cantidad: validos.length,
      total: validos.reduce((sum, v) => sum + v.precio, 0),
      vehiculos: validos,
      slugs: validos.map((v) => v.id),
    })
    setModalAbierto(true)
  }

  // Cálculo estimado de financiación (60 cuotas, 6.5% anual, 20% inicial)
  const cuotaInicial = Math.round(total * 0.2)
  const montoFinanciar = total - cuotaInicial
  const tasaMensual = 0.065 / 12
  const cuotaMensual =
    montoFinanciar > 0
      ? (montoFinanciar * tasaMensual * Math.pow(1 + tasaMensual, 60)) /
        (Math.pow(1 + tasaMensual, 60) - 1)
      : 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Tu selección
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
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
                      <SmartImage
                        src={vehiculo.imagenes[0]}
                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                        containerClassName="h-full w-full"
                        hoverScale={1.05}
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
              <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
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
                <motion.span
                  key={total}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-2xl font-semibold tracking-tight text-foreground"
                >
                  {formatearPrecio(total)}
                </motion.span>
              </div>

              {/* Estimación de financiación */}
              {cuotaMensual > 0 && (
                <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Financiación estimada
                  </p>
                  <div className="mt-1.5 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-foreground">
                        {formatearPrecio(cuotaMensual)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">/ mes · 60 cuotas</p>
                    </div>
                    <p className="text-right text-[10px] text-muted-foreground">
                      Cuota inicial: {formatearPrecio(cuotaInicial)}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleFinalizar}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.99]"
              >
                Finalizar compra
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Indicadores de confianza */}
              <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.2} />
                  Pago seguro
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.2} />
                  Compra protegida
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-[var(--signature)]" strokeWidth={2.2} />
                  Garantía oficial
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
        <EmptyState
          icon={ShoppingBag}
          titulo="Todavía no has agregado ningún vehículo"
          descripcion="Explora el marketplace y añade los automóviles que más te gusten. Aparecerán aquí listos para finalizar tu compra."
          ctaLabel="Comenzar a explorar"
          ctaHref="/marketplace"
        />
      )}

      <CheckoutModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cantidad={resumen.cantidad}
        total={resumen.total}
        vehiculos={resumen.vehiculos}
        itemSlugs={resumen.slugs}
        borradorDatos={borrador?.datos}
      />
    </div>
  )
}
