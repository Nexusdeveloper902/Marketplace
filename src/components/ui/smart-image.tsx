"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  /** Prioridad para imágenes above-the-fold (hero, primeros vehículos). */
  priority?: boolean
  /** Aspect ratio fijo para evitar layout shift. */
  aspectRatio?: string
}

/**
 * Imagen con carga progresiva premium:
 * - Skeleton shimmer mientras carga
 * - Fade-in suave + ligero desenfoque al cargar
 * - Lazy loading por defecto (priority lo desactiva)
 * - Aspect ratio reservado para evitar layout shift
 *
 * Usa `key={src}` en el contenedor interno para resetear el estado
 * de carga automáticamente cuando cambia la src, sin efectos.
 */
export function SmartImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio,
}: SmartImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary",
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <SmartImageInner
        key={src}
        src={src}
        alt={alt}
        priority={priority}
        className={className}
      />
    </div>
  )
}

function SmartImageInner({
  src,
  alt,
  priority,
  className,
}: {
  src: string
  alt: string
  priority: boolean
  className?: string
}) {
  const [cargada, setCargada] = useState(false)
  const [error, setError] = useState(false)

  return (
    <>
      {/* Skeleton shimmer */}
      {!cargada && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-accent/30 to-secondary" />
      )}

      {/* Imagen */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setCargada(true)}
          onError={() => setError(true)}
          ref={(el) => {
            // Si la imagen ya está en caché, onLoad puede no dispararse.
            if (el && el.complete && el.naturalWidth > 0 && !cargada) {
              setCargada(true)
            }
          }}
          className={cn(
            "h-full w-full object-cover transition-all duration-700 ease-out",
            cargada
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-md scale-105",
            className
          )}
        />
      )}

      {/* Fallback si hay error */}
      {error && (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <span className="text-xs text-muted-foreground">Sin imagen</span>
        </div>
      )}
    </>
  )
}
