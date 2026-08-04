/**
 * Skeleton loader que replica exactamente la estructura de una VehicleCard.
 * Evita el layout shift mientras cargan los datos/imágenes.
 */
export function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
      {/* Imagen placeholder */}
      <div className="relative aspect-[16/10] w-full animate-pulse bg-gradient-to-br from-secondary via-accent/30 to-secondary" />

      {/* Cuerpo placeholder */}
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 h-2.5 w-12 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
          </div>
          <div className="flex-1 text-right">
            <div className="mb-2 ml-auto h-2.5 w-16 animate-pulse rounded bg-secondary" />
            <div className="ml-auto h-4 w-12 animate-pulse rounded bg-secondary" />
          </div>
        </div>
        <div className="mt-auto flex gap-2.5">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-secondary" />
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid de skeletons para el marketplace y similares.
 */
export function VehicleGridSkeleton({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
      {Array.from({ length: cantidad }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
