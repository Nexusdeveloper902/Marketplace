/**
 * UI primitives: escapeHtml, progressive SmartImage, reveal-on-scroll and
 * scroll parallax helpers (replacing framer-motion).
 */

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Progressive image with skeleton shimmer + blur-up fade-in.
 * Replaces the SmartImage component. `el` receives the markup; the inner
 * image fades in once loaded (min 350ms skeleton, como el original).
 */
export function smartImageMarkup({ src, alt, className = "h-full w-full object-cover", containerClassName = "h-full w-full", priority = false, hoverScale }) {
  const zoomCls = hoverScale ? "group-hover/smartimg:scale-[var(--hover-scale)]" : ""
  return `
    <div class="relative overflow-hidden bg-secondary ${containerClassName}">
      <div class="smartimg-skeleton absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-accent/40 to-secondary"></div>
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}
           class="smartimg-img ${className} opacity-0 transition-[opacity,transform,filter] duration-700 ${hoverScale ? "group-hover/smartimg:scale-[--hover-scale]" : ""}"
           style="${hoverScale ? `--hover-scale: ${hoverScale}` : ""}" />
      <div class="smartimg-error hidden h-full w-full items-center justify-center bg-secondary">
        <span class="text-xs text-muted-foreground">Sin imagen</span>
      </div>
    </div>`
}

/** Wire a rendered smart-image container (call after innerHTML injection). */
export function hydrateSmartImages(root = document) {
  root.querySelectorAll("img.smartimg-img").forEach((img) => {
    if (img.dataset.hydrated) return
    img.dataset.hydrated = "1"
    const skeleton = img.closest(".relative")?.querySelector(".smartimg-skeleton")
    const done = () => {
      img.classList.remove("opacity-0")
      if (skeleton) skeleton.remove()
    }
    const fail = () => {
      const err = img.closest(".relative")?.querySelector(".smartimg-error")
      if (skeleton) skeleton.remove()
      img.remove()
      if (err) { err.classList.remove("hidden"); err.classList.add("flex") }
    }
    if (img.complete && img.naturalWidth > 0) { done(); return }
    img.addEventListener("load", () => setTimeout(done, 50))
    img.addEventListener("error", fail)
  })
}

// --- Reveal on scroll --------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible")
        revealObserver.unobserve(e.target)
      }
    })
  },
  { threshold: 0.15 }
)

export function hydrateReveals(root = document) {
  root.querySelectorAll(".reveal").forEach((el) => {
    if (el.dataset.revealed) return
    el.dataset.revealed = "1"
    revealObserver.observe(el)
  })
}

// --- Parallax (hero/showcase) -------------------------------------------------
/**
 * Simple parallax: elements with [data-parallax] move slower than the scroll.
 * data-parallax="40" means max ±40px translate.
 */
export function initParallax() {
  const els = [...document.querySelectorAll("[data-parallax]")]
  if (!els.length) return
  const onScroll = () => {
    for (const el of els) {
      const range = Number(el.dataset.parallax) || 80
      const rect = el.parentElement.getBoundingClientRect()
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const clamped = Math.min(1, Math.max(0, progress))
      el.style.transform = `translateY(${(clamped - 0.5) * 2 * range}px)`
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}
