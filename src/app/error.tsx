"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, ArrowRight } from "lucide-react"

/**
 * Root error boundary. Renders when a route segment throws during render.
 * Must be a client component and include its own <html>/<body> is NOT
 * needed here because it replaces the nearest error boundary segment,
 * reusing the root layout shell.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error to the console for debugging without exposing it
    // to the visitor.
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, oklch(0.65 0.22 25 / 0.06), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card text-[var(--destructive)] shadow-card">
          <AlertTriangle className="h-9 w-9" strokeWidth={1.5} />
        </span>

        <p className="text-eyebrow mt-7 text-[11px] text-[var(--signature)]">
          Error 500
        </p>
        <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl">
          Algo salió mal
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Se produjo un error inesperado. Puedes intentar recargar la página
          o volver al inicio. Si el problema persiste, contáctanos.
        </p>

        {error.digest && (
          <p className="mt-4 text-[11px] text-muted-foreground">
            Código de referencia: <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Volver al inicio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
