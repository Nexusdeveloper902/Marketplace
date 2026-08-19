/**
 * Landing page — ports the five landing sections:
 * hero (parallax), featured vehicles, cinematic showcase, why-choose-us
 * and the brands grid.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { icon } from "../icons.js"
import { formatearNumero } from "../format.js"
import { escapeHtml, hydrateReveals, hydrateSmartImages, initParallax } from "../ui.js"
import { vehicleCardMarkup, hydrateVehicleCards } from "../vehicle-card.js"

function heroMarkup(v) {
  return `
  <section class="relative flex min-h-[100svh] items-end overflow-hidden" id="hero">
    <div class="absolute inset-0 z-0 will-parallax" data-parallax="80" id="hero-img-wrap">
      <img src="${escapeHtml(v.imagenes[0])}" alt="${escapeHtml(v.marca)} ${escapeHtml(v.modelo)}" class="h-full w-full object-cover" fetchpriority="high" id="hero-img" />
      <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent"></div>
    </div>
    <div class="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32" id="hero-text">
      <div class="max-w-2xl">
        <p class="reveal is-visible text-eyebrow text-[11px] text-[var(--signature)]" style="--reveal-duration: 0.8s">Digital Marketplace · Alta Gama</p>
        <h1 class="reveal is-visible text-display mt-6 text-5xl text-foreground sm:text-7xl lg:text-8xl xl:text-[7.5rem]" style="--reveal-delay: 0.15s">Pura<br /><span class="text-gradient">adrenalina</span></h1>
        <p class="reveal is-visible mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg" style="--reveal-delay: 0.3s">
          Los automóviles más extraordinarios del mundo, reunidos en una sola colección.
        </p>
        <div class="reveal is-visible mt-10" style="--reveal-delay: 0.45s">
          <a href="/marketplace" class="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]">
            Explorar vehículos ${icon("ArrowRight", "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1")}
          </a>
        </div>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block" id="hero-scroll">
      <div class="animate-soft-bounce">${icon("ChevronDown", "h-5 w-5 text-muted-foreground/60", 1.5)}</div>
    </div>
  </section>`
}

function heroParallax() {
  const img = document.getElementById("hero-img-wrap")
  const text = document.getElementById("hero-text")
  const scroll = document.getElementById("hero-scroll")
  if (!img || !text) return
  const onScroll = () => {
    const hero = document.getElementById("hero")
    const rect = hero.getBoundingClientRect()
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)))
    img.style.transform = `translateY(${progress * 80}px) scale(${1 + progress * 0.08})`
    text.style.transform = `translateY(${progress * -30}px)`
    const opacity = 1 - Math.min(1, progress / 0.6)
    text.style.opacity = opacity
    if (scroll) scroll.style.opacity = opacity
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}

const DESTACADOS_IDS = [
  "mclaren-750s",
  "rolls-royce-ghost",
  "lamborghini-revuelto",
  "porsche-taycan-turbos",
  "rivian-r1t",
  "dodge-demon-170",
]

function featuredMarkup(catalogo) {
  const destacados = DESTACADOS_IDS.map((id) => catalogo.find((v) => v.id === id)).filter(Boolean)
  return `
  <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
    <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div class="max-w-2xl">
        <p class="reveal text-eyebrow text-[11px] text-[var(--signature)]">Nuestra Selección</p>
        <h2 class="reveal text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl" style="--reveal-delay: 0.05s">Potencia sin<br /><span class="text-gradient">compromisos</span></h2>
      </div>
      <div class="reveal" style="--reveal-delay: 0.1s">
        <a href="/marketplace" class="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground">
          Ver todo el catálogo ${icon("ArrowRight", "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5")}
        </a>
      </div>
    </div>
    <div class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8" id="featured-grid">
      ${destacados.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Explorar vehículo", index: i })).join("")}
    </div>
  </section>`
}

function showcaseMarkup(v) {
  const specs = [
    { valor: formatearNumero(v.potencia), etiqueta: "Caballos" },
    { valor: `${v.aceleracion0a100}s`, etiqueta: "0—100 km/h" },
    { valor: `${formatearNumero(v.velocidadMaxima)}`, etiqueta: "Vel. máxima km/h" },
  ]
  return `
  <section class="relative flex min-h-[90svh] items-center overflow-hidden border-y border-border/40" id="showcase">
    <div class="absolute inset-0 z-0" data-parallax="60" id="showcase-img">
      <img src="${escapeHtml(v.imagenes[1] ?? v.imagenes[0])}" alt="${escapeHtml(v.marca)} ${escapeHtml(v.modelo)}" class="h-full w-full object-cover" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30"></div>
    </div>
    <div class="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-xl">
        <p class="reveal text-eyebrow text-[11px] text-[var(--signature)]">${escapeHtml(v.marca)}</p>
        <h2 class="reveal text-display mt-5 text-4xl text-foreground sm:text-6xl lg:text-7xl" style="--reveal-delay: 0.1s">${escapeHtml(v.modelo)}</h2>
        <p class="reveal mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg" style="--reveal-delay: 0.2s">
          Ingeniería que redefine los límites. Una síntesis perfecta entre tradición y futuro.
        </p>
        <div class="reveal mt-10 flex items-center gap-8 sm:gap-10" style="--reveal-delay: 0.3s">
          ${specs.map((spec, i) => `
            ${i > 0 ? '<div class="h-10 w-px bg-border/60"></div>' : ""}
            <div>
              <p class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">${spec.valor}</p>
              <p class="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">${spec.etiqueta}</p>
            </div>`).join("")}
        </div>
        <div class="reveal mt-10" style="--reveal-delay: 0.4s">
          <a href="/vehiculos/${v.id}" class="group inline-flex items-center gap-3 rounded-xl border border-border/70 bg-background/40 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:bg-background/60 hover:gap-4 active:scale-[0.98]">
            Descubrir el vehículo ${icon("ArrowUpRight", "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5")}
          </a>
        </div>
      </div>
    </div>
  </section>`
}

const VENTAJAS = [
  { icono: "ShieldCheck", titulo: "Autenticidad garantizada", descripcion: "Especificaciones verificadas de fábrica en cada modelo del catálogo." },
  { icono: "Gauge", titulo: "Rendimiento comprobado", descripcion: "Datos técnicos precisos de los motores más extraordinarios del mundo." },
  { icono: "Sparkles", titulo: "Selección curada", descripcion: "Una colección cuidadosamente elegida entre las marcas más prestigiosas." },
  { icono: "Headset", titulo: "Experiencia premium", descripcion: "Cada detalle diseñado para que explorar sea tan emocionante como conducir." },
]

function whyMarkup() {
  return `
  <section class="border-y border-border/40 bg-secondary/20">
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div class="max-w-2xl">
        <p class="reveal text-eyebrow text-[11px] text-[var(--signature)]">El lujo en movimiento</p>
        <h2 class="reveal text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl" style="--reveal-delay: 0.05s">Diseñado para los<br /><span class="text-gradient">amantes del detalle</span></h2>
      </div>
      <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        ${VENTAJAS.map((ventaja, i) => `
          <div class="reveal group rounded-2xl border border-border/50 bg-card/50 p-7 shadow-card transition-all duration-500 hover:border-border hover:bg-card hover:shadow-card-hover" style="--reveal-delay: ${Math.min(i * 0.08, 0.4)}s">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
              ${icon(ventaja.icono, "h-5 w-5", 1.8)}
            </span>
            <h3 class="mt-6 text-base font-semibold tracking-tight text-foreground">${ventaja.titulo}</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">${ventaja.descripcion}</p>
          </div>`).join("")}
      </div>
    </div>
  </section>`
}

function brandsMarkup(marcas) {
  return `
  <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
    <div class="max-w-2xl">
      <p class="reveal text-eyebrow text-[11px] text-[var(--signature)]">Las casas más prestigiosas</p>
      <h2 class="reveal text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl" style="--reveal-delay: 0.05s">Marcas que<br /><span class="text-gradient">definen épocas</span></h2>
      <p class="reveal mt-6 max-w-md text-base leading-relaxed text-muted-foreground" style="--reveal-delay: 0.1s">
        Trabajamos con los fabricantes más legendarios del mundo para ofrecerte lo mejor de cada casa.
      </p>
    </div>
    <div class="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      ${marcas.map((marca, i) => `
        <div class="reveal group flex aspect-[3/2] items-center justify-center rounded-2xl border border-border/50 bg-card/50 px-4 shadow-card transition-all duration-500 hover:border-border hover:bg-card hover:shadow-card-hover" style="--reveal-delay: ${Math.min(i * 0.03, 0.3)}s">
          <span class="text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors duration-500 group-hover:text-foreground sm:text-base">${escapeHtml(marca)}</span>
        </div>`).join("")}
    </div>
    <div class="mt-14">
      <a href="/marketplace" class="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]">
        Explorar todos los vehículos ${icon("ArrowRight", "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1")}
      </a>
    </div>
  </section>`
}

async function iniciar() {
  renderShell()
  const { items: catalogo } = await api.catalogo()
  const heroVehiculo = catalogo.find((v) => v.id === "porsche-911-carrera") ?? catalogo[0]
  const showcaseVehiculo = catalogo.find((v) => v.id === "lamborghini-revuelto") ?? catalogo[0]
  const marcas = [...new Set(catalogo.map((v) => v.marca))].sort()

  const main = document.getElementById("main")
  main.innerHTML = heroMarkup(heroVehiculo) + featuredMarkup(catalogo) + showcaseMarkup(showcaseVehiculo) + whyMarkup() + brandsMarkup(marcas)

  heroParallax()
  initParallax()
  hydrateSmartImages(main)
  hydrateVehicleCards(main)
  hydrateReveals(main)
}

iniciar()
