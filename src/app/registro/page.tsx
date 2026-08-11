"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Gauge, Lock, Mail, User, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { vehiculos } from "@/data/vehicles"
import { SmartImage } from "@/components/ui/smart-image"
import { cn } from "@/lib/utils"

const easeLux = [0.22, 1, 0.36, 1] as const

export default function RegistroPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mostrar, setMostrar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    const result = await register(name, email, password)
    if (!result.ok) {
      setError(result.error ?? "No se pudo registrar")
      setCargando(false)
      return
    }
    router.replace("/perfil")
    router.refresh()
  }

  const vehiculoHero = vehiculos.find((v) => v.id === "ferrari-sf90-stradale") ?? vehiculos[0]

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0">
          <SmartImage
            src={vehiculoHero.imagenes[0]}
            alt={vehiculoHero.marca + " " + vehiculoHero.modelo}
            containerClassName="h-full w-full"
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeLux }}
          >
            <p className="text-eyebrow text-[11px] text-[var(--signature)]">
              Únete a LUXICAR
            </p>
            <h1 className="text-display mt-5 text-4xl text-foreground xl:text-5xl">
              Crea tu cuenta premium
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Conserva tus favoritos, historial de pedidos y garaje privado en
              todos tus dispositivos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeLux }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="group mb-10 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Gauge className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-base font-semibold tracking-tight text-foreground">
                Digital <span className="text-gradient">Marketplace</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Alta Gama
              </span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-display text-3xl text-foreground">Crear cuenta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-medium text-[var(--signature)] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Nombre completo
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                <input
                  type={mostrar ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm text-[var(--destructive)]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={cargando || !name || !email || !password}
              className={cn(
                "group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {cargando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta…
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Volver al marketplace
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
