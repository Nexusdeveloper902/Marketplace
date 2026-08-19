/**
 * Admin dashboard page — port of admin-dashboard-view.tsx. Requires an ADMIN
 * session; renders KPIs, revenue trend (area), yearly income (bar), top
 * brands (hbar), category distribution (donut), monthly volume (bar) and the
 * recent-orders table. Charts are vanilla SVG.
 */







const KPI_DEFS = [
  { icono: "DollarSign", etiqueta: "Ventas totales", valor: (d) => formatearPrecio(d.kpis.ventasTotales), variacion: 18.5 },
  { icono: "Car", etiqueta: "Vehículos vendidos", valor: (d) => formatearNumero(d.kpis.vehiculosVendidos), variacion: 12.3 },
  { icono: "Users", etiqueta: "Clientes", valor: (d) => formatearNumero(d.kpis.clientes), variacion: 9.8 },
  { icono: "Receipt", etiqueta: "Ticket promedio", valor: (d) => formatearPrecio(d.kpis.ticketPromedio), variacion: 4.2 },
  { icono: "TrendingUp", etiqueta: "Crecimiento anual", valor: (d) => `${d.kpis.crecimientoAnual}%`, variacion: (d) => d.kpis.crecimientoAnual },
  { icono: "Gauge", etiqueta: "Marcas disponibles", valor: (d) => String(d.kpis.marcasDisponibles), variacion: 0 },
  { icono: "Target", etiqueta: "Tasa de conversión", valor: (d) => `${d.kpis.tasaConversion.toFixed(1)}%`, variacion: 0.6 },
  { icono: "Clock", etiqueta: "Pedidos pendientes", valor: (d) => String(d.kpis.pedidosPendientes), variacion: -3.1 },
]

function kpiCard(def, d, i) {
  const variacion = typeof def.variacion === "function" ? def.variacion(d) : def.variacion
  const esPositivo = variacion > 0
  const esNeutro = variacion === 0
  return `
  <div class="rounded-2xl border border-border/50 bg-card p-5 shadow-card transition-all duration-500 hover:border-border hover:shadow-card-hover lg:p-6" style="animation-delay: ${i * 0.06}s">
    <div class="flex items-start justify-between">
      <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">
        ${icon(def.icono, "h-5 w-5", 1.8)}
      </span>
      ${!esNeutro ? `
        <span class="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold ${esPositivo ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-[var(--destructive)]/15 text-[var(--destructive)]"}">
          ${esPositivo ? icon("TrendingUp", "h-3 w-3", 2.2) : icon("TrendingDown", "h-3 w-3", 2.2)}
          ${esPositivo ? `+${variacion}%` : `${variacion}%`}
        </span>` : ""}
    </div>
    <p class="mt-4 text-2xl font-semibold tracking-tight text-foreground">${def.valor(d)}</p>
    <p class="mt-1 text-xs text-muted-foreground">${def.etiqueta}</p>
  </div>`
}

function markup(datos) {
  const ultimos12Meses = datos.meses
  const ingresosPorAño = [
    { label: "Año 1", value: datos.meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0), formatted: formatearPrecio(datos.meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0)) },
    { label: "Año 2", value: datos.meses.slice(12, 24).reduce((s, m) => s + m.ingresos, 0), formatted: formatearPrecio(datos.meses.slice(12, 24).reduce((s, m) => s + m.ingresos, 0)) },
    { label: "Año 3", value: datos.meses.slice(24, 36).reduce((s, m) => s + m.ingresos, 0), formatted: formatearPrecio(datos.meses.slice(24, 36).reduce((s, m) => s + m.ingresos, 0)) },
  ]
  const topMarcas = datos.ventasPorMarca.slice(0, 6)
  return `
  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <a href="${hrefFromApp("/")}" class="group flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
              ${icon("Gauge", "h-5 w-5", 2.2)}
            </span>
            <span class="hidden flex-col items-start leading-none sm:flex">
              <span class="text-[15px] font-semibold tracking-tight text-foreground">Digital <span class="text-gradient">Marketplace</span></span>
              <span class="mt-0.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Admin Dashboard
              </span>
            </span>
          </a>
        </div>
        <div class="flex items-center gap-3">
          <a href="${hrefFromApp("/")}" class="hidden items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex">
            Ver marketplace ${icon("ArrowUpRight", "h-3.5 w-3.5")}
          </a>
          <button id="admin-logout" class="flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            ${icon("LogOut", "h-4 w-4")}<span class="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div class="mb-10">
        <p class="text-eyebrow text-[11px] text-[var(--signature)]">Resumen ejecutivo</p>
        <h1 class="text-display mt-4 text-4xl text-foreground sm:text-5xl">Panel administrativo</h1>
        <p class="mt-3 max-w-2xl text-sm text-muted-foreground">Métricas y análisis de los últimos 36 meses de operación del marketplace.</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        ${KPI_DEFS.map((def, i) => kpiCard(def, datos, i)).join("")}
      </div>

      <section class="mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:mt-10 lg:p-7">
        <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Tendencia de ingresos</h2>
            <p class="mt-2 text-xl font-semibold tracking-tight text-foreground">Últimos 36 meses</p>
          </div>
        </div>
        <div class="relative" id="ch-ingresos">
          ${areaChart({ data: datos.meses.map((m) => ({ label: m.mesLabel, value: m.ingresos, formatted: formatearPrecio(m.ingresos) })), width: 1200 })}
        </div>
      </section>

      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Comparativa anual</h2>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Ingresos por año</p>
          <div class="relative mt-4" id="ch-año">
            ${barChart({ data: ingresosPorAño, color: "var(--signature)", width: 560, height: 280 })}
          </div>
        </section>
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Ventas por marca</h2>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Marcas más vendidas</p>
          <div class="relative mt-4" id="ch-marcas">
            ${hbarChart({ data: topMarcas.map((m) => ({ label: m.marca, value: m.ventas, formatted: `${m.ventas} vehículos` })), width: 520, height: topMarcas.length * 44 })}
          </div>
        </section>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Categorías</h2>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Distribución</p>
          <div class="relative mt-4" id="ch-categorias">
            ${pieChart({ data: datos.ventasPorCategoria.map((c) => ({ label: c.categoria, value: c.ventas, formatted: `${c.ventas} vehículos` })) })}
          </div>
        </section>
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:col-span-2 lg:p-7">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Actividad reciente</h2>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Últimos pedidos</p>
          <div class="mt-5 overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <th class="pb-3 pr-4 font-medium">Pedido</th>
                  <th class="pb-3 pr-4 font-medium">Cliente</th>
                  <th class="pb-3 pr-4 font-medium">Vehículo</th>
                  <th class="pb-3 pr-4 font-medium">Estado</th>
                  <th class="pb-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${datos.pedidosRecientes.map((p) => `
                  <tr class="border-b border-border/30 transition-colors hover:bg-secondary/30">
                    <td class="py-3 pr-4 font-mono text-xs text-muted-foreground">${escapeHtml(p.id)}</td>
                    <td class="py-3 pr-4 text-foreground">${escapeHtml(p.cliente)}</td>
                    <td class="py-3 pr-4 text-muted-foreground">${escapeHtml(p.vehiculo)}</td>
                    <td class="py-3 pr-4">
                      <span class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium ${p.estado === "Completado" ? "bg-[var(--success)]/15 text-[var(--success)]" : p.estado === "Pendiente" ? "bg-secondary text-muted-foreground" : p.estado === "En proceso" ? "bg-[var(--signature)]/15 text-[var(--signature)]" : "bg-[var(--destructive)]/15 text-[var(--destructive)]"}">${escapeHtml(p.estado)}</span>
                    </td>
                    <td class="py-3 text-right font-semibold text-foreground">${formatearPrecio(p.valor)}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
          <div class="flex items-center gap-2">
            ${icon("Trophy", "h-4 w-4 text-[var(--signature)]", 2)}
            <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Top modelos</h2>
          </div>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Vehículos más vendidos</p>
          <div class="mt-5 space-y-2.5">
            ${datos.topVehiculos.map((veh, i) => `
              <div class="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">${i + 1}</span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-foreground">${escapeHtml(veh.vehiculo)}</p>
                  <p class="text-[11px] text-muted-foreground">${escapeHtml(veh.marca)} · ${formatearNumero(veh.ventas)} unidades</p>
                </div>
                <p class="shrink-0 text-sm font-semibold text-foreground">${formatearPrecio(veh.ingresos)}</p>
              </div>`).join("")}
          </div>
        </section>
        <section class="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Volumen mensual</h2>
          <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Vehículos vendidos (12 meses)</p>
          <div class="relative mt-4" id="ch-mensual">
            ${barChart({ data: ultimos12Meses.map((m) => ({ label: m.mesLabel, value: m.ventas, formatted: `${m.ventas} vehículos` })), color: "var(--success)", width: 560, height: 320 })}
          </div>
        </section>
      </div>

      <div class="mt-12 flex items-center justify-between border-t border-border/40 pt-6 text-xs text-muted-foreground">
        <p>Datos sintéticos generados para demostración.</p>
        <a href="${hrefFromApp("/")}" class="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground">
          Volver al marketplace ${icon("ChevronRight", "h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5")}
        </a>
      </div>
    </main>
  </div>`
}

async function iniciar() {
  await auth.refresh().catch(() => null)
  if (!auth.isAdmin) {
    window.location.href = hrefFromApp("/admin/login")
    return
  }
  let datos
  try {
    datos = await api.analytics()
  } catch {
    window.location.href = hrefFromApp("/admin/login")
    return
  }
  document.body.insertAdjacentHTML("afterbegin", markup(datos))
  document.getElementById("admin-logout").addEventListener("click", async () => {
    await auth.logout()
    window.location.href = hrefFromApp("/admin/login")
  })
  // Tooltips para los gráficos
  document.querySelectorAll("svg").forEach((svg) => attachTooltip(svg))
}

iniciar()
