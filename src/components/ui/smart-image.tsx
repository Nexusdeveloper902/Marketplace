"use client"

import { useState, useRef, useEffect } from "react"
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

// Tiempo mínimo que se muestra el skeleton (ms). Garantiza que la carga
// progresiva sea perceptible incluso con imágenes en caché local.
const MIN_SKELETON_MS = 350

/**
 * Imagen con carga progresiva premium:
 * - Skeleton shimmer mientras carga (mínimo MIN_SKELETON_MS)
 * - Fade-in suave + ligero desenfoque al cargar (blur-up)
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
  const [imagenCargada, setImagenCargada] = useState(false)
  const [error, setError] = useState(false)
  const [mostrarSkeleton, setMostrarSkeleton] = useState(true)
  const inicioRef = useRef<number>(performance.now())

  // Oculta el skeleton después del mínimo de tiempo, asegurando que
  // la carga progresiva siempre sea perceptible.
  useEffect(() => {
    const transcurrido = performance.now() - inicioRef.current
    const restante = Math.max(0, MIN_SKELETON_MS - transcurrido)
    const timer = setTimeout(() => setMostrarSkeleton(false), restante)
    return () => clearTimeout(timer)
  }, [])

  // "cargada" solo es true cuando la imagen terminó Y pasó el mínimo de skeleton
  const cargada = imagenCargada && !mostrarSkeleton

  return (
    <>
      {/* Skeleton shimmer */}
      {mostrarSkeleton && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-accent/40 to-secondary" />
      )}

      {/* Imagen */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImagenCargada(true)}
          onError={() => setError(true)}
          ref={(el) => {
            // Si la imagen ya está en caché, onLoad puede no dispararse.
            if (el && el.complete && el.naturalWidth > 0 && !imagenCargada) {
              setImagenCargada(true)
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
