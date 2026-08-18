"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Loader2,
  AlertCircle,
  MessageSquare,
  PenLine,
  LogIn,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const easeLux = [0.22, 1, 0.36, 1] as const

interface ReviewDTO {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string | null }
}

// Matches the shape returned by listReviews() / GET /api/reviews:
//   { reviews: ReviewDetail[], average: number, count: number }
interface ReviewsResponse {
  reviews: ReviewDTO[]
  average: number
  count: number
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            cls,
            n <= rating
              ? "fill-[var(--signature)] text-[var(--signature)]"
              : "text-muted-foreground/30"
          )}
          strokeWidth={2}
        />
      ))}
    </div>
  )
}

export function ReviewsSection({ vehicleSlug }: { vehicleSlug: string }) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<ReviewsResponse | null>(null)
  const [cargando, setCargando] = useState(true)
  const [escribiendo, setEscribiendo] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?vehicleSlug=${encodeURIComponent(vehicleSlug)}`, {
        cache: "no-store",
      })
      if (!res.ok) return
      const d = (await res.json()) as ReviewsResponse
      setData(d)
    } catch {
      // ignore
    } finally {
      setCargando(false)
    }
  }, [vehicleSlug])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleSlug, rating, comment }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(d.error ?? "No se pudo publicar la reseña.")
        return
      }
      toast({
        title: "Reseña publicada",
        description: "Gracias por compartir tu experiencia.",
      })
      setEscribiendo(false)
      setComment("")
      setRating(5)
      void cargar()
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const promedio = data?.average
  const total = data?.count ?? 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: easeLux }}
      className="mt-10 rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-8"
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[var(--signature)]" strokeWidth={2} />
        <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
          Opiniones
        </h2>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          Reseñas de clientes
        </p>
        {promedio !== null && promedio !== undefined && total > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(promedio)} size="lg" />
            <span className="text-sm font-medium text-foreground">
              {promedio.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({total} {total === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        )}
      </div>

      {/* Formulario / CTA */}
      <div className="mt-5">
        {!isAuthenticated ? (
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/20 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Inicia sesión para escribir una reseña.
            </p>
            <Link
              href={`/login?redirect=/vehiculos/${vehicleSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--signature)] hover:underline"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
          </div>
        ) : escribiendo ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/40 bg-secondary/20 p-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Tu valoración
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} estrellas`}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        n <= rating
                          ? "fill-[var(--signature)] text-[var(--signature)]"
                          : "text-muted-foreground/40 hover:text-muted-foreground"
                      )}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Comentario (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Cuéntanos tu experiencia con este vehículo…"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/30"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEscribiendo(false)
                  setError(null)
                }}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publicando…
                  </>
                ) : (
                  "Publicar reseña"
                )}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setEscribiendo(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <PenLine className="h-4 w-4" />
            Escribir una reseña
          </button>
        )}
        {isAuthenticated && (
          <p className="mt-2 text-xs text-muted-foreground">
            Solo puedes reseñar vehículos que has comprado.
          </p>
        )}
      </div>

      {/* Lista de reseñas */}
      <div className="mt-6">
        {cargando ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : total === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aún no hay reseñas. ¡Sé el primero en opinar!
          </p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {data?.reviews.map((r, i) => (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-xl border border-border/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase text-muted-foreground">
                        {(r.user.name ?? "?").charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {r.user.name ?? "Cliente"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {r.comment}
                    </p>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.section>
  )
}
