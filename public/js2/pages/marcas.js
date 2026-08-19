/**
 * Brands page — port of brands-view.tsx. Grid of BrandSummary cards linking
 * to /marcas/<slug>, with an aggregated "all brands" card.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { icon } from "../icons.js"
import { formatearPrecio } from "../format.js"
import { escapeHtml, smartImageMarkup, hydrateSmartImages, hydrateReveals } from "../ui.js"

function brandCardMarkup(marca, index) {
  return `
  <a href="/marcas/${marca.slug}" class="reveal group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-500 hover:border-border hover:shadow-card-hover" style="--reveal-delay: ${Math.min(index * 0.04, 0.4)}s">
    <div class="relative aspect-[16/9] overflow-hidden bg-secondary">
      ${marca.imagen ? smartImageMarkup({ src: marca.imagen, alt: marca.name, hoverScale: 1.05 }) : `
        <span class="flex h-full w-full items-center justify-center text-4xl font-semibold text-muted-foreground/30">${escapeHtml(marca.name.charAt(0))}</span>`}
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent"></div>
      <p class="absolute left-4 top-4 rounded-lg bg-background/60 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground backdrop-blur-md">${escapeHtml(marca.name)}</p>
    </div>
    <div class="flex items-center justify-between gap-3 p-4">
      <div>
        <h3 class="text-base font-semibold tracking-tight text-foreground">${escapeHtml(marca.name)}</h3>
        <p class="mt-0.5 text-xs text-muted-foreground">${marca.cantidad} modelo${marca.cantidad !== 1 ? "s" : ""} · desde ${formatearPrecio(marca.precioMin)}</p>
      </div>
      ${icon("ArrowRight", "h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground")}
    </div>
  </a>`
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  const { brands } = await api.listarMarcas()
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="reveal is-visible max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Explora por marca</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Las mejor marcas</h1>
      <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Encuentra tu vehículo ideal filtrando por la marca que más te gusta. Cada fabricante tiene su propia página con todos sus modelos.
      </p>
    </div>
    <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
      ${brands.map((m, i) => brandCardMarkup(m, i)).join("")}
    </div>
  </section>`
  hydrateSmartImages(main)
  hydrateReveals(main)
}

iniciar()
