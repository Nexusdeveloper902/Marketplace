/**
 * 404 page — port of not-found.tsx.
 */
import { renderShell } from "../layout.js"
import { icon } from "../icons.js"
import { hydrateReveals } from "../ui.js"

function iniciar() {
  renderShell({ cta: false })
  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
    <p class="text-eyebrow text-[11px] text-[var(--signature)]">Error 404</p>
    <h1 class="text-display mt-5 text-5xl text-foreground sm:text-6xl" style="font-size: clamp(3rem, 10vw, 6rem)">404</h1>
    <h2 class="text-display mt-4 text-2xl text-foreground">Página no encontrada</h2>
    <p class="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">La página que buscas no existe o fue movida. Vuelve al marketplace y sigue explorando la colección.</p>
    <a href="/" class="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]">
      Volver al inicio ${icon("ArrowRight", "h-4 w-4")}
    </a>
  </section>`
  hydrateReveals(main)
}

iniciar()
