import { SiteShell } from "@/components/layout/site-shell"
import { VehicleGridSkeleton } from "@/components/ui/skeletons"

/**
 * Loading state for a brand detail page (/marcas/[marca]).
 */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-3 h-3 w-20 animate-pulse rounded bg-secondary" />
          <div className="h-10 w-64 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />
        </div>
        <VehicleGridSkeleton cantidad={6} />
      </div>
    </SiteShell>
  )
}
