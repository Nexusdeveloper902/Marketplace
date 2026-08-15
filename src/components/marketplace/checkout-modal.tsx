"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  CreditCard,
  User,
  Mail,
  Phone,
  Loader2,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { formatearPrecio } from "@/lib/format"
import type { Vehicle } from "@/types/vehicle"
import { SmartImage } from "@/components/ui/smart-image"
import { useAuth } from "@/lib/auth/auth-context"
import { useTienda } from "@/store/use-store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CheckoutModalProps {
  abierto: boolean
  onClose: () => void
  cantidad: number
  total: number
  /** Vehículos comprados (para mostrar en la pantalla de éxito). */
  vehiculos: Vehicle[]
  /** Vehicle slugs in the cart (sent to the server to create the order). */
  itemSlugs: string[]
  /** Borrador restaurado tras iniciar sesión (solo datos de contacto; el
   * pago se vuelve a pedir por seguridad: nunca persistimos datos de tarjeta). */
  borradorDatos?: { nombre: string; email: string; telefono: string }
}

type Paso = "datos" | "pago" | "procesando" | "exito" | "error"

const easeLux = [0.22, 1, 0.36, 1] as const

// Clave de sessionStorage para conservar el borrador del checkout entre el
// redirect a /login y el regreso a /carrito. Sesión/local, no persiste entre
// dispositivos ni tras cerrar la pestaña. SOLO se guardan datos de contacto:
// nunca almacenamos número de tarjeta ni CVV (ni siquiera en una demo).
const CLAVE_BORRADOR = "luxicar-checkout-draft"

export function guardarBorradorCheckout(datos: {
  datos: { nombre: string; email: string; telefono: string }
}) {
  try {
    sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos))
  } catch {
    /* sessionStorage puede estar bloqueado (modo privado); se ignora. */
  }
}

export function leerBorradorCheckout():
  | {
      datos: { nombre: string; email: string; telefono: string }
    }
  | null {
  try {
    const raw = sessionStorage.getItem(CLAVE_BORRADOR)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function borrarBorradorCheckout() {
  try {
    sessionStorage.removeItem(CLAVE_BORRADOR)
  } catch {
    /* no-op */
  }
}

export function CheckoutModal({
  abierto,
  onClose,
  cantidad,
  total,
  vehiculos,
  itemSlugs,
  borradorDatos,
}: CheckoutModalProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const vaciarCarrito = useTienda((s) => s.vaciarCarrito)
  const [paso, setPaso] = useState<Paso>("datos")
  const [numeroPedido, setNumeroPedido] = useState("")
  const [mensajeError, setMensajeError] = useState("")
  const [datos, setDatos] = useState({
    nombre: borradorDatos?.nombre ?? "",
    email: borradorDatos?.email ?? "",
    telefono: borradorDatos?.telefono ?? "",
  })
  const [pago, setPago] = useState({
    // El pago NO se restaura del borrador: se solicita de nuevo tras el login
    // para no persistir datos sensibles de tarjeta en el navegador.
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    nombreTarjeta: "",
  })

  // Bloquea el scroll del body cuando el modal está abierto.
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [abierto])

  // Reset al paso inicial cuando se cierra
  useEffect(() => {
    if (!abierto) {
      const t = setTimeout(() => {
        setPaso("datos")
        setMensajeError("")
        setDatos({ nombre: "", email: "", telefono: "" })
        setPago({ tarjeta: "", vencimiento: "", cvv: "", nombreTarjeta: "" })
      }, 300)
      return () => clearTimeout(t)
    }
  }, [abierto])

  const handlePagar = async () => {
    // Require an authenticated session; the server never trusts client identity.
    if (!isAuthenticated) {
      // Conserva solo los datos de contacto para restaurarlos tras iniciar
      // sesión. El pago se vuelve a pedir: nunca persistimos datos de tarjeta.
      guardarBorradorCheckout({ datos })
      onClose()
      router.replace("/login?redirect=/carrito")
      return
    }
    setPaso("procesando")
    setMensajeError("")
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemSlugs.map((slug) => ({ vehicleSlug: slug, quantity: 1 })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMensajeError(data.error ?? "No se pudo completar la compra.")
        setPaso("error")
        return
      }
      // Real order created server-side (stock decremented transactionally).
      setNumeroPedido(data.orderNumber ?? "—")
      vaciarCarrito()
      borrarBorradorCheckout()
      setPaso("exito")
    } catch {
      setMensajeError("Error de conexión. Inténtalo de nuevo.")
      setPaso("error")
    }
  }

  const datosValidos =
    datos.nombre.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(datos.email) &&
    datos.telefono.trim().length >= 7

  const pagoValido =
    pago.tarjeta.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(pago.vencimiento) &&
    pago.cvv.length >= 3 &&
    pago.nombreTarjeta.trim().length > 2

  // Validaciones individuales para mostrar errores en vivo
  const errores = {
    tarjeta: pago.tarjeta.length > 0 && pago.tarjeta.replace(/\s/g, "").length !== 16,
    vencimiento:
      pago.vencimiento.length > 0 &&
      (!/^\d{2}\/\d{2}$/.test(pago.vencimiento) ||
        Number(pago.vencimiento.slice(0, 2)) > 12 ||
        Number(pago.vencimiento.slice(0, 2)) < 1),
    cvv: pago.cvv.length > 0 && pago.cvv.length < 3,
    nombreTarjeta:
      pago.nombreTarjeta.trim().length > 0 && pago.nombreTarjeta.trim().length < 3,
  }

  // Validación de datos personales
  const erroresDatos = {
    nombre: datos.nombre.length > 0 && datos.nombre.trim().length < 3,
    email: datos.email.length > 0 && !/\S+@\S+\.\S+/.test(datos.email),
    telefono: datos.telefono.length > 0 && datos.telefono.trim().length < 7,
  }

  // Formateadores para los inputs
  const formatearTarjeta = (v: string) => {
    const limpio = v.replace(/\D/g, "").slice(0, 16)
    return limpio.replace(/(.{4})/g, "$1 ").trim()
  }
  const formatearVencimiento = (v: string) => {
    const limpio = v.replace(/\D/g, "").slice(0, 4)
    return limpio.length > 2 ? limpio.slice(0, 2) + "/" + limpio.slice(2) : limpio
  }
  const formatearCVV = (v: string) => v.replace(/\D/g, "").slice(0, 4)
  const formatearTelefono = (v: string) =>
    v.replace(/[^\d\s+-]/g, "").slice(0, 20)

  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="overflow-hidden border-border/70 bg-card p-0 sm:max-w-md"
        // Evita que el diálogo se cierre al hacer clic fuera durante el flujo.
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        // Evita cerrar con Escape durante el procesamiento del pago.
        onEscapeKeyDown={(e) => {
          if (paso === "procesando") e.preventDefault()
        }}
      >
        <AnimatePresence mode="wait">
          {/* === PASO 1: DATOS DE CONTACTO === */}
          {paso === "datos" && (
            <motion.div
              key="datos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: easeLux }}
            >
              <DialogHeader className="px-6 pb-3 pt-6">
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Finalizar compra
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Datos de contacto para la tramitación del pedido.
                </DialogDescription>
              </DialogHeader>

              {/* Indicador de pasos */}
              <IndicadorPasos paso={1} />

              <div className="space-y-4 px-6 py-5">
                <Campo
                  icono={User}
                  label="Nombre completo"
                  placeholder="Juan Pérez"
                  value={datos.nombre}
                  onChange={(v) => setDatos((d) => ({ ...d, nombre: v }))}
                  error={erroresDatos.nombre}
                  mensajeError="El nombre debe tener al menos 3 caracteres"
                />
                <Campo
                  icono={Mail}
                  label="Correo electrónico"
                  placeholder="juan@ejemplo.com"
                  tipo="email"
                  value={datos.email}
                  onChange={(v) => setDatos((d) => ({ ...d, email: v }))}
                  error={erroresDatos.email}
                  mensajeError="Correo electrónico inválido"
                />
                <Campo
                  icono={Phone}
                  label="Teléfono"
                  placeholder="+34 600 123 456"
                  value={datos.telefono}
                  onChange={(v) =>
                    setDatos((d) => ({ ...d, telefono: formatearTelefono(v) }))
                  }
                  error={erroresDatos.telefono}
                  mensajeError="Número de teléfono inválido"
                />
              </div>

              {/* Resumen */}
              <ResumenCompra cantidad={cantidad} total={total} />

              {/* Acciones */}
              <div className="flex gap-3 px-6 pb-6 pt-4">
                <button type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Cancelar
                </button>
                <button type="button"
                  onClick={() => setPaso("pago")}
                  disabled={!datosValidos}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar al pago
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* === PASO 2: PAGO === */}
          {paso === "pago" && (
            <motion.div
              key="pago"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: easeLux }}
            >
              <DialogHeader className="px-6 pb-3 pt-6">
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Datos de pago
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  Pago simulado · No se realiza ningún cargo real
                </DialogDescription>
              </DialogHeader>

              <IndicadorPasos paso={2} />

              <div className="space-y-4 px-6 py-5">
                {/* Tarjeta visual */}
                <div className="relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-secondary to-accent/40 p-5">
                  <div className="flex items-start justify-between">
                    <div className="h-8 w-11 rounded-md bg-primary/80" />
                    <CreditCard className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-mono text-base tracking-wider text-foreground">
                    {pago.tarjeta || "•••• •••• •••• ••••"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      {pago.nombreTarjeta || "NOMBRE DEL TITULAR"}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {pago.vencimiento || "MM/AA"}
                    </p>
                  </div>
                </div>

                <Campo
                  icono={CreditCard}
                  label="Número de tarjeta"
                  placeholder="4242 4242 4242 4242"
                  value={pago.tarjeta}
                  onChange={(v) =>
                    setPago((p) => ({ ...p, tarjeta: formatearTarjeta(v) }))
                  }
                  error={errores.tarjeta}
                  mensajeError="La tarjeta debe tener 16 dígitos"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Campo
                    icono={Calendar}
                    label="Vencimiento"
                    placeholder="MM/AA"
                    value={pago.vencimiento}
                    onChange={(v) =>
                      setPago((p) => ({
                        ...p,
                        vencimiento: formatearVencimiento(v),
                      }))
                    }
                    error={errores.vencimiento}
                    mensajeError="Formato inválido (MM/AA)"
                  />
                  <Campo
                    icono={Lock}
                    label="CVV"
                    placeholder="123"
                    value={pago.cvv}
                    onChange={(v) => setPago((p) => ({ ...p, cvv: formatearCVV(v) }))}
                    error={errores.cvv}
                    mensajeError="Mínimo 3 dígitos"
                  />
                </div>
                <Campo
                  icono={User}
                  label="Titular de la tarjeta"
                  placeholder="Juan Pérez"
                  value={pago.nombreTarjeta}
                  onChange={(v) =>
                    setPago((p) => ({ ...p, nombreTarjeta: v }))
                  }
                  error={errores.nombreTarjeta}
                  mensajeError="Nombre demasiado corto"
                />
              </div>

              <ResumenCompra cantidad={cantidad} total={total} />

              {/* Acciones */}
              <div className="flex gap-3 px-6 pb-6 pt-4">
                <button type="button"
                  onClick={() => setPaso("datos")}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
                <button type="button"
                  onClick={handlePagar}
                  disabled={!pagoValido}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Lock className="h-4 w-4" strokeWidth={2.2} />
                  Pagar {formatearPrecio(total)}
                </button>
              </div>
            </motion.div>
          )}

          {/* === PASO 3: PROCESANDO === */}
          {paso === "procesando" && (
            <motion.div
              key="procesando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center px-6 py-20 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-[var(--signature)]" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                Procesando pago…
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Estamos verificando tu transacción de forma segura.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2} />
                Conexión cifrada de 256 bits
              </div>
            </motion.div>
          )}

          {/* === PASO 4: ÉXITO PREMIUM === */}
          {paso === "exito" && (
            <motion.div
              key="exito"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeLux }}
            >
              {/* Imagen grande del vehículo comprado */}
              {vehiculos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: easeLux }}
                  className="relative aspect-[16/9] w-full overflow-hidden"
                >
                  <SmartImage
                    src={vehiculos[0].imagenes[0]}
                    alt={`${vehiculos[0].marca} ${vehiculos[0].modelo}`}
                    containerClassName="h-full w-full"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  {/* Badge de confirmación flotante */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
                    className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success)] text-primary-foreground shadow-lg"
                  >
                    <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
                  </motion.div>
                  {/* Nombre del vehículo sobre la imagen */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-eyebrow text-[10px] text-[var(--signature)]">
                      {vehiculos[0].marca}
                    </p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                      {vehiculos[0].modelo}
                    </p>
                    {vehiculos.length > 1 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        +{vehiculos.length - 1} vehículo(s) más
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Mensaje de felicitación personalizado */}
              <div className="px-6 pt-6 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.2} />
                  Pago confirmado
                </span>
                <h2 className="text-display mt-4 text-2xl text-foreground sm:text-3xl">
                  ¡Felicidades!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {vehiculos.length === 1
                    ? `Tu ${vehiculos[0].marca} ${vehiculos[0].modelo} te está esperando en tu garaje privado.`
                    : `Tus ${vehiculos.length} vehículos te están esperando en tu garaje privado.`}
                </p>
              </div>

              {/* Recibo del pedido */}
              <div className="mx-6 mt-6 space-y-2.5 rounded-xl border border-border/70 bg-secondary/40 p-4">
                <FilaRecibo etiqueta="Nº de pedido" valor={numeroPedido} mono />
                <FilaRecibo etiqueta="Fecha de entrega" valor="Inmediata" />
                <FilaRecibo etiqueta="Vehículos" valor={String(cantidad)} />
                <FilaRecibo
                  etiqueta="Método de pago"
                  valor={`•••• ${pago.tarjeta.slice(-4) || "****"}`}
                />
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total pagado
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    {formatearPrecio(total)}
                  </span>
                </div>
              </div>

              {/* Mensaje de agradecimiento */}
              <p className="mx-6 mt-4 text-center text-xs italic leading-relaxed text-muted-foreground">
                Gracias por confiar en Digital Marketplace.
              </p>

              {/* Acciones diferenciadas */}
              <div className="flex flex-col gap-2.5 px-6 pb-6 pt-5">
                <Link
                  href="/gracias"
                  onClick={onClose}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:opacity-90 active:scale-[0.99]"
                >
                  Ver resumen del pedido
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/garaje"
                  onClick={onClose}
                  className="w-full rounded-xl border border-border bg-card px-6 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Ver en mi garaje
                </Link>
                <Link
                  href="/marketplace"
                  onClick={onClose}
                  className="w-full rounded-xl border border-border bg-card px-6 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Seguir explorando vehículos
                </Link>
              </div>
            </motion.div>
          )}

          {/* === PASO ERROR === */}
          {paso === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center px-6 py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--destructive)]/15 text-[var(--destructive)]">
                <AlertCircle className="h-7 w-7" strokeWidth={2} />
              </div>
              <p className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                No se pudo completar la compra
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {mensajeError || "Ocurrió un error inesperado. Inténtalo de nuevo."}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaso("pago")}
                  className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Reintentar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// --- Subcomponentes ---

function IndicadorPasos({ paso }: { paso: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      <PasoIndicador numero={1} activo={paso >= 1} etiqueta="Datos" />
      <div className={cn("h-px flex-1", paso >= 2 ? "bg-[var(--signature)]" : "bg-border")} />
      <PasoIndicador numero={2} activo={paso >= 2} etiqueta="Pago" />
      <div className="h-px flex-1 bg-border" />
      <PasoIndicador numero={3} activo={false} etiqueta="Confirmar" />
    </div>
  )
}

function PasoIndicador({
  numero,
  activo,
  etiqueta,
}: {
  numero: number
  activo: boolean
  etiqueta: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
          activo
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {numero}
      </span>
      <span
        className={cn(
          "text-[11px] font-medium transition-colors",
          activo ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {etiqueta}
      </span>
    </div>
  )
}

function Campo({
  icono: Icono,
  label,
  placeholder,
  value,
  onChange,
  tipo = "text",
  error,
  mensajeError,
}: {
  icono: typeof User
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  tipo?: string
  error?: boolean
  mensajeError?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Icono
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
            error ? "text-[var(--destructive)]" : "text-muted-foreground"
          )}
          strokeWidth={2}
        />
        <input
          type={tipo}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:ring-2",
            error
              ? "border-[var(--destructive)]/50 focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20"
              : "border-border focus:border-foreground/30 focus:ring-ring/30"
          )}
        />
      </div>
      {error && mensajeError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--destructive)]"
        >
          <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
          {mensajeError}
        </motion.p>
      )}
    </div>
  )
}

function ResumenCompra({ cantidad, total }: { cantidad: number; total: number }) {
  return (
    <div className="mx-6 mb-2 rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{cantidad} vehículo(s)</span>
        <span className="font-semibold text-foreground">{formatearPrecio(total)}</span>
      </div>
    </div>
  )
}

function FilaRecibo({
  etiqueta,
  valor,
  mono,
}: {
  etiqueta: string
  valor: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{etiqueta}</span>
      <span
        className={cn(
          "font-semibold text-foreground",
          mono && "font-mono text-xs"
        )}
      >
        {valor}
      </span>
    </div>
  )
}
