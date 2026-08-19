/**
 * Checkout modal — port of checkout-modal.tsx. Confirma la compra de los
 * vehículos del carrito (una ficha), muestra el progreso y finaliza en el
 * servidor. En caso de éxito vacía el carrito y redirige a /gracias.
 */
import { icon } from "./icons.js"
import { tienda } from "./store.js"
import { auth } from "./auth.js"
import { api } from "./api.js"
import { toast } from "./toast.js"
import { formatearPrecio } from "./format.js"
import { escapeHtml } from "./ui.js"

let modalEl = null

export function openCheckoutModal(vehiculos, opts = {}) {
  if (!vehiculos.length) return
  closeCheckoutModal()
  const total = vehiculos.reduce((s, v) => s + v.precio, 0)
  modalEl = document.createElement("div")
  modalEl.className = "fixed inset-0 z-[80] flex items-center justify-center p-4"
  modalEl.innerHTML = `
    <div class="anim-fade-in absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
    <div class="anim-pop-in relative w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-card-hover" role="dialog" aria-modal="true">
      <button class="chx-close absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Cerrar">${icon("X", "h-4 w-4")}</button>
      <h2 class="text-display text-xl text-foreground">Confirmar compra</h2>
      <p class="mt-1.5 text-sm text-muted-foreground">Revisa los vehículos antes de completar la compra. Pago simulado, sin cargos reales.</p>
      <ol class="mt-4 max-h-56 space-y-2 overflow-y-auto">
        ${vehiculos.map((v, i) => `
          <li class="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5">
            <span class="flex items-center gap-3">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">${i + 1}</span>
              <span class="text-sm font-medium text-foreground">${escapeHtml(v.marca)} ${escapeHtml(v.modelo)}</span>
            </span>
            <span class="text-sm font-semibold text-foreground">${formatearPrecio(v.precio)}</span>
          </li>`).join("")}
      </ol>
      <div class="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
        <p class="text-sm font-medium text-muted-foreground">Total</p>
        <p class="text-lg font-semibold text-foreground chx-total">${formatearPrecio(total)}</p>
      </div>
      <div class="mt-2.5 min-h-[18px] text-xs text-muted-foreground chx-msg"></div>
      <div class="mt-5 flex flex-col gap-2.5">
        <button class="chx-confirm flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
          ${icon("Check", "h-4 w-4")}<span class="chx-label">Completar compra</span>
        </button>
        <p class="chx-capitalize text-wrap flex items-center justify-center text-[11px] text-muted-foreground">
          Pago simulado · No se realiza ningún cargo real
        </p>
      </div>
    </div>`

  document.body.appendChild(modalEl)
  const steps = [
    "Comprobando disponibilidad…",
    "Generando número de pedido…",
    "Reservando vehículos…",
    "Guardando pedido…",
  ]
  let busy = false
  modalEl.querySelector(".chx-close").addEventListener("click", () => { if (!busy) closeCheckoutModal() })
  modalEl.querySelector(".absolute").addEventListener("click", () => { if (!busy) closeCheckoutModal() })

  modalEl.querySelector(".chx-confirm").addEventListener("click", async () => {
    if (busy) return
    if (!auth.isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para completar la compra." })
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }
    busy = true
    const btn = modalEl.querySelector(".chx-confirm")
    btn.disabled = true
    const msgEl = modalEl.querySelector(".chx-msg")
    let step = 0
    const iv = setInterval(() => {
      if (step < steps.length) {
        msgEl.textContent = steps[step]
        step++
      }
    }, 350)
    try {
      const items = vehiculos.map((v) => ({ vehicleSlug: v.id, quantity: 1 }))
      const result = await api.checkout(items)
      clearInterval(iv)
      modalEl.querySelector(".chx-label").textContent = "Compra completada"
      msgEl.textContent = `Pedido ${result.orderNumber ?? ""} creado correctamente.`
      tienda.finalizarCompra()
      setTimeout(() => {
        closeCheckoutModal()
        window.location.href = `/gracias?order=${result.orderId ?? ""}`
      }, 600)
    } catch (e) {
      clearInterval(iv)
      btn.disabled = false
      busy = false
      msgEl.textContent = e.message || "La compra no pudo completarse. Inténtalo de nuevo."
    }
  })
}

export function closeCheckoutModal() {
  if (modalEl) {
    modalEl.remove()
    modalEl = null
  }
}
