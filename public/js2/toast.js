/**
 * Toast notifications — replaces the shadcn/ui toaster (radix) with a small
 * DOM-based equivalent. Same look: bottom-right on desktop, top on mobile,
 * one toast at a time (TOAST_LIMIT = 1 como en el original).
 */
let container = null

function getContainer() {
  if (container) return container
  container = document.createElement("div")
  container.className =
    "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none"
  document.body.appendChild(container)
  return container
}

export function toast({ title, description }) {
  const el = document.createElement("div")
  el.className =
    "toast-enter pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg bg-background text-foreground"
  el.innerHTML = `
    <div class="grid gap-1">
      ${title ? `<div class="text-sm font-semibold [&+div]:text-xs"></div>` : ""}
      ${description ? `<div class="text-sm opacity-90"></div>` : ""}
    </div>
    <button type="button" class="toast-close absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none" aria-label="Cerrar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`
  const [titleEl, descEl] = el.querySelectorAll(".grid > div")
  if (titleEl) titleEl.textContent = title
  if (descEl) descEl.textContent = description

  const box = getContainer()
  box.innerHTML = "" // TOAST_LIMIT = 1
  box.appendChild(el)

  const dismiss = () => {
    el.classList.add("toast-exit")
    setTimeout(() => el.remove(), 260)
  }
  el.querySelector(".toast-close").addEventListener("click", dismiss)
  setTimeout(dismiss, 4500)
}
