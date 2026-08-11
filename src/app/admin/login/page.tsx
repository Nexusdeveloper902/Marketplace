"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Gauge, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useHydrated } from "@/hooks/use-hydrated"
import { vehiculos } from "@/data/vehicles"
import { SmartImage } from "@/components/ui/smart-image"

const easeLux = [0.22, 1, 0.36, 1] as const

export default function AdminLoginPage() {
  const router = useRouter()
  const hidratado = useHydrated()
  const { user, login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mostrarContraseña, setMostrarContraseña] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  // Si ya hay sesión de admin, redirigir al dashboard.
  useEffect(() => {
    if (hidratado && isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin")
    }
  }, [hidratado, isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error ?? "Credenciales incorrectas")
      setCargando(false)
      return
    }
    // Reload to pick up the server-side session + role for the admin route.
    router.replace("/admin")
    router.refresh()
  }

  // Imagen para el lado izquierdo
  const vehiculoHero = vehiculos.find((v) => v.id === "lamborghini-revuelto") ?? vehiculos[0]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Lado izquierdo — imagen + mensaje corporativo */}
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
              Panel administrativo
            </p>
            <h1 className="text-display mt-5 text-4xl text-foreground xl:text-5xl">
              Gestiona el rendimiento de tu concesionaria
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Métricas en tiempo real, análisis de ventas y visión completa de
              tu marketplace de alta gama.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lado derecho — formulario de login */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeLux }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="group mb-10 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Gauge className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-base font-semibold tracking-tight text-foreground">
                Digital <span className="text-gradient">Marketplace</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </span>
            </span>
          </Link>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-display text-3xl text-foreground">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Inicia sesión para acceder al panel administrativo.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  placeholder="admin@luxicar.com"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                <input
                  type={mostrarContraseña ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarContraseña((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={mostrarContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarContraseña ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
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

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando || !email || !password}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando…
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              Admin demo: <span className="font-medium text-foreground">admin@luxicar.com</span> / admin123
            </p>
          </form>

          {/* Volver al marketplace */}
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
