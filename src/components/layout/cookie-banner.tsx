"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import { cn } from "@/lib/utils"

// localStorage key for the saved consent choice.
const CONSENT_KEY = "dm-cookie-consent"

type Consent = "accepted" | "rejected"

/**
 * Cookie consent banner. Shown once until the visitor makes a choice
 * (accept / reject). The choice is persisted in localStorage so the
 * banner doesn't reappear on every visit. Respects the saved preference:
 * analytics scripts can read the stored value via the exported
 * `hasAnalyticsConsent()` helper.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted"
  } catch {
    return false
  }
}

// Read the saved consent client-side without triggering the
// "setState in effect" lint rule: useSyncExternalStore reads localStorage
// lazily during render (after hydration) and never re-subscribes.
function readConsent(): Consent | null {
  try {
    return localStorage.getItem(CONSENT_KEY) as Consent | null
  } catch {
    return null
  }
}
const emptySubscribe = () => () => {}

export function CookieBanner() {
  // `null` until hydrated (server snapshot), then the stored choice (or null
  // if none yet). useSyncExternalStore avoids both hydration mismatches and
  // the set-state-in-effect anti-pattern.
  const estado = useSyncExternalStore(emptySubscribe, readConsent, () => null)
  const [dismissed, setDismissed] = useState(false)

  const guardar = (eleccion: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, eleccion)
    } catch {
      /* localStorage puede estar bloqueado (modo privado); se ignora. */
    }
    setDismissed(true)
  }

  // Show after hydration only when there is no saved choice and the user
  // hasn't just dismissed it this session.
  const mostrar = estado === null && !dismissed

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:bottom-4 sm:left-4 sm:right-auto sm:px-0 sm:pb-0"
          role="region"
          aria-label="Banner de consentimiento de cookies"
        >
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border/70 bg-card/95 p-4 shadow-card backdrop-blur-xl sm:max-w-md sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Cookie className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Cookies y privacidad
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Usamos cookies propias para el funcionamiento del sitio y de
                  análisis anónimo para entender cómo se usa. Puedes aceptar o
                  rechazar el análisis en cualquier momento. Lee nuestra{" "}
                  <Link
                    href="/privacidad"
                    className="font-medium text-[var(--signature)] hover:underline"
                  >
                    política de privacidad
                  </Link>
                  .
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => guardar("accepted")}
                    className={cn(
                      "flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                    )}
                  >
                    Aceptar todo
                  </button>
                  <button
                    onClick={() => guardar("rejected")}
                    className={cn(
                      "flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent active:scale-[0.98]"
                    )}
                  >
                    Solo necesarias
                  </button>
                </div>
              </div>
              <button
                onClick={() => guardar("rejected")}
                aria-label="Cerrar banner de cookies"
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
