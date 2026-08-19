/**
 * Compare page — port of compare-view.tsx. Tabla comparativa de hasta 3
 * vehículos (precio, potencia, torque, velocidad, aceleración resaltados).
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { tienda } from "../store.js"
import { icon } from "../icons.js"
import { formatearPrecio, formatearNumero } from "../format.js"
import { escapeHtml, hydrateReveals } from "../ui.js"
import { emptyStateMarkup } from "../vehicle-card.js"

const CAMPOS = [
  { clave: "precio", etiqueta: "Precio", formato: (v) => formatearPrecio(v.precio), comparador: (v) => v.precio, invertir: true },
  { clave: "potencia", etiqueta: "Potencia", formato: (v) => `${formatearNumero(v.potencia)} HP`, comparador: (v) => v.potencia },
  { clave: "torque", etiqueta: "Torque", formato: (v) => `${formatearNumero(v.torque)} Nm`, comparador: (v) => v.torque },
  { clave: "velocidadMaxima", etiqueta: "Vel. máxima", formato: (v) => `${formatearNumero(v.velocidadMaxima)} km/h`, comparador: (v) => v.velocidadMaxima },
  { clave: "aceleracion0a100", etiqueta: "0 a 100 km/h", formato: (v) => `${v.aceleracion0a100}s`, comparador: (v) => v.aceleracion0a100, invertir: true },
  { clave: "año", etiqueta: "Año", formato: (v) => v.año, comparador: (v) => v.año },
  { clave: "motor", etiqueta: "Motor", formato: (v) => v.motor },
  { clave: "transmision", etiqueta: "Transmisión", formato: (v) => v.transmision },
  { clave: "combustible", etiqueta: "Combustible", formato: (v) => v.combustible },
  { clave: "traccion", etiqueta: "Tracción", formato: (v) => v.traccion },
  { clave: "categoria", etiqueta: "Categoría", formato: (v) => v.categoria },
]

function renderComparar(catalogo) {
  const placeholder = document.getElementById("cmp-ph")
  const wrap = document.getElementById("cmp-content")
  const ids = tienda.get().comparar
  const items = ids.map((slug) => catalogo.find((v) => v.id === slug)).filter(Boolean)

  if (items.length < 2) {
    placeholder.innerHTML = emptyStateMarkup({
      icono: "GitCompareArrows",
      titulo: "Añade vehículos al comparador",
      descripcion: "Compara lado a lado precios, rendimiento y especificaciones de hasta tres modelos.",
      ctaLabel: "Explorar vehículos",
      ctaHref: "/marketplace",
    })
    wrap.innerHTML = ""
    hydrateReveals(placeholder)
    return
  }

  placeholder.innerHTML = ""
  const cols = items.length + 1
  wrap.innerHTML = `
  <div class="overflow-x-auto scrollbar-premium">
    <div class="rounded-2xl border border-border/50 bg-card p-6 shadow-card" style="min-width: 720px">
      <table class="w-full" style="table-layout: fixed">
        <thead>
          <tr>
            <td class="align-bottom"></td>
            ${items.map((v) => `
              <td class="p-3 align-bottom" data-slug="${escapeHtml(v.id)}" style="width: ${100 / cols}%">
                <div class="relative rounded-xl border border-border/50 bg-secondary/40 p-3">
                  <button class="cmp-quitar absolute right-2 top-2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground" aria-label="Quitar del comparador">
                    ${icon("X", "h-4 w-4", 2)}
                  </button>
                  <a href="/vehiculos/${v.id}" class="block aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
                    <img src="${escapeHtml(v.imagenes[0] ?? "")}" alt="" class="h-full w-full object-cover" />
                  </a>
                  <p class="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">${escapeHtml(v.marca)}</p>
                  <a href="/vehiculos/${v.id}" class="block text-sm font-semibold text-foreground hover:underline">${escapeHtml(v.modelo)}</a>
                  <p class="text-xs text-muted-foreground">Año ${v.año}</p>
                </div>
              </td>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${CAMPOS.map((campo) => {
            let ganador
            if (campo.comparador && items.length > 1) {
              const valores = items.map((v) => campo.comparador(v))
              const extremo = campo.invertir ? Math.min(...valores) : Math.max(...valores)
              const valoresUnicos = new Set(valores)
              ganador = valoresUnicos.size > 1 ? extremo : undefined
            }
            return `
            <tr class="border-t border-border/40">
              <td class="p-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">${campo.etiqueta}</td>
              ${items.map((v) => {
                const esGanador = ganador !== undefined && campo.comparador(v) === ganador
                return `
                <td class="p-3 text-sm ${esGanador ? "font-semibold text-[var(--success)]" : "text-foreground"}">
                  <span class="inline-flex items-center gap-1">${campo.formato(v)}${esGanador ? icon("TrendingUp", "h-3 w-3 text-[var(--success)]", 2) : ""}</span>
                </td>`
              }).join("")}
            </tr>`
          }).join("")}
        </tbody>
      </table>
      <button id="cmp-vaciar" class="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent w-full">
        Vaciar comparador
      </button>
    </div>
  </div>`

  wrap.querySelectorAll(".cmp-quitar").forEach((b) =>
    b.addEventListener("click", () => {
      const slug = b.closest("[data-slug]").dataset.slug
      tienda.toggleComparar(slug)
    })
  )
  wrap.querySelector("#cmp-vaciar")?.addEventListener("click", () => tienda.vaciarComparador())
  hydrateReveals(wrap)
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Herramienta de comparación</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Comparar vehículos</h1>
      <p class="mt-5 text-sm leading-relaxed text-muted-foreground">Compara hasta tres vehículos en sus especificaciones, rendimiento y precio.</p>
    </div>
    <div class="mt-10" id="cmp-ph"></div>
    <div class="max-h-[calc(100vh-220px)] overflow-hidden" id="cmp-content"></div>
  </section>`
  const { items } = await api.catalogo()
  renderComparar(items)
  tienda.subscribe(() => renderComparar(items))
}

iniciar()
