import { SiteShell } from "@/components/layout/site-shell"
import { VehicleGridSkeleton } from "@/components/ui/skeletons"

/**
 * Loading state for /marketplace. Renders a branded shell + grid of
 * card skeletons so there is no layout shift while the catalog loads.
 */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 h-3 w-28 animate-pulse rounded bg-secondary" />
            <div className="h-9 w-56 animate-pulse rounded bg-secondary" />
          </div>
          <div className="hidden h-11 w-40 animate-pulse rounded-xl bg-secondary sm:block" />
        </div>
        <VehicleGridSkeleton cantidad={9} />
      </div>
    </SiteShell>
  )
}
