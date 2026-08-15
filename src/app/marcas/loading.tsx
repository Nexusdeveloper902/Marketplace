import { SiteShell } from "@/components/layout/site-shell"

/**
 * Loading state for /marcas. A grid of brand card skeletons matching the
 * shape of BrandsView to avoid layout shift.
 */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-3 h-3 w-24 animate-pulse rounded bg-secondary" />
          <div className="h-9 w-48 animate-pulse rounded bg-secondary" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div className="relative aspect-[16/10] w-full animate-pulse bg-gradient-to-br from-secondary via-accent/30 to-secondary" />
              <div className="flex flex-col gap-3 p-5">
                <div className="h-5 w-32 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-48 animate-pulse rounded bg-secondary" />
                <div className="mt-auto h-9 w-full animate-pulse rounded-xl bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
