import { SiteShell } from "@/components/layout/site-shell"

/**
 * Loading state for a vehicle detail page (/vehiculos/[id]). Mirrors the
 * two-column gallery + spec layout of VehicleDetailView.
 */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Galería */}
          <div>
            <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-gradient-to-br from-secondary via-accent/30 to-secondary" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-xl bg-secondary"
                />
              ))}
            </div>
          </div>
          {/* Especificaciones */}
          <div className="flex flex-col gap-5">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-10 w-56 animate-pulse rounded bg-secondary" />
            <div className="h-7 w-40 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-32 animate-pulse rounded bg-secondary" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-secondary"
                />
              ))}
            </div>
            <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-secondary" />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
