/**
 * Vanilla SVG charts replacing recharts for the admin dashboard:
 * area, bar, horizontal bar and donut charts with hover tooltips.
 */
import { formatearPrecio, formatearNumero } from "./format.js"

const CHART_COLORS = [
  "var(--signature)", "var(--success)", "#60a5fa", "#f472b6", "#a78bfa",
  "#fb923c", "#34d399", "#f87171", "#facc15", "#22d3ee",
]

function attachTooltip(svg) {
  const tooltip = document.createElement("div")
  tooltip.className = "chart-tooltip"
  svg.parentElement.appendChild(tooltip)
  svg.querySelectorAll("[data-tx]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const tx = el.dataset.tx
      const tw = el.dataset.tw
      tooltip.innerHTML = `
        <p class="font-semibold">${tx}</p>
        ${tw ? `<p class="text-muted-foreground">${tw}</p>` : ""}`
      tooltip.classList.add("is-visible")
    })
    el.addEventListener("mousemove", (e) => {
      const box = svg.parentElement.getBoundingClientRect()
      let x = e.clientX - box.left + 8
      let y = e.clientY - box.top - 8
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`
    })
    el.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"))
  })
}

/** Area chart with gradient fill, dashed grid, axis ticks. */
export function areaChart({ data, width = 900, height = 320, padding = { l: 60, r: 16, t: 12, b: 28 } }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const w = width - padding.l - padding.r
  const h = height - padding.t - padding.b
  const max = Math.max(...data.map((d) => d.value), 1)
  const pts = data.map((d, i) => [padding.l + (i * w) / Math.max(1, data.length - 1), padding.t + h - (d.value / max) * h])
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${padding.t + h} L${pts[0][0].toFixed(1)},${padding.t + h} Z`
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    return `<line x1="${padding.l}" x2="${padding.l + w}" y1="${y}" y2="${y}" stroke="oklch(1 0 0 / 6%)" stroke-dasharray="3 3"/>`
  })
  const xTicks = data.filter((_, i) => i % 3 === 0).map((d, i) => {
    const idx = i * 3
    const x = padding.l + (idx * w) / Math.max(1, data.length - 1)
    return `<text x="${x}" y="${padding.t + h + 18}" text-anchor="middle" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>`
  })
  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    const v = max * f
    const label = v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(0)}K` : `${Math.round(v)}`
    return `<text x="${padding.l - 8}" y="${y + 3}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${label}</text>`
  })
  const hitRects = pts.map((p, i) => `
    <rect class="cursor-pointer" x="${Math.max(p[0] - w / (2 * (data.length - 1)), padding.l)}" y="${padding.t}" width="${Math.max(w / (data.length - 1), 24)}" height="${h}" fill="transparent" data-tx="${data[i].label}: ${data[i].formatted}"></rect>`)
  const gradId = `grad-${Math.random().toString(36).slice(2, 8)}`
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stop-color="var(--signature)" stop-opacity="0.45"/>
        <stop offset="95%" stop-color="var(--signature)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines.join("")}${yTicks.join("")}${xTicks.join("")}
    <path d="${area}" fill="url(#${gradId})"></path>
    <path d="${line}" fill="none" stroke="var(--signature)" stroke-width="2" class="chart-area-line"/>
    ${hitRects.join("")}
  </svg>`
}

/** Vertical bar chart. */
export function barChart({ data, color = "var(--signature)", width = 560, height = 300, padding = { l: 56, r: 16, t: 12, b: 28 }, barRadius = 8, valueFormat }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const w = width - padding.l - padding.r
  const h = height - padding.t - padding.b
  const max = Math.max(...data.map((d) => d.value), 1)
  const barW = Math.min(w / data.length - 16, 64)
  const bars = data.map((d, i) => {
    const x = padding.l + (i * w) / data.length + (w / data.length - barW) / 2
    const bh = (d.value / max) * h
    const y = padding.t + h - bh
    const grad = d.color ?? color
    return `
      <rect class="origin-bottom" x="${x}" y="${y}" width="${barW}" height="${Math.max(bh, 0)}" rx="${barRadius}" fill="${grad}" data-tx="${d.label}: ${d.formatted}"/>
      <text x="${x + barW / 2}" y="${padding.t + h + 18}" text-anchor="middle" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>`
  })
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    return `<line x1="${padding.l}" x2="${padding.l + w}" y1="${y}" y2="${y}" stroke="oklch(1 0 0 / 6%)" stroke-dasharray="3 3"/>`
  })
  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    const v = max * f
    const label = valueFormat ? valueFormat(v) : (v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : Math.round(v))
    return `<text x="${padding.l - 8}" y="${y + 3}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${label}</text>`
  })
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    ${gridLines.join("")}${yTicks.join("")}${bars.join("")}
  </svg>`
}

/** Horizontal bar chart (top brands). */
export function hbarChart({ data, width = 700, height = 260, nameWidth = 96 }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const max = Math.max(...data.map((d) => d.value), 1)
  const rows = data.map((d, i) => {
    const rowH = height / data.length
    const y = i * rowH + (rowH - 22) / 2
    const barW = ((d.value / max) * (width - nameWidth - 16))
    return `
      <g>
        <text x="${nameWidth - 8}" y="${y + 16}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>
        <rect x="${nameWidth}" y="${y + 2}" width="${Math.max(barW, 2)}" height="18" fill="${CHART_COLORS[i % CHART_COLORS.length]}" rx="6" data-tx="${d.label}: ${d.formatted}"/>
        <line x1="${nameWidth}" x2="${nameWidth}" y1="0" y2="${height}" stroke="oklch(1 0 0 / 12%)" stroke-dasharray="3 3"/>
      </g>`
  })
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    ${rows.join("")}
  </svg>`
}

/** Donut chart (category distribution). */
export function pieChart({ data, width = 320, height = 260, innerRatio = 0.55 }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) / 2 - 6
  const ir = r * innerRatio
  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const frac = d.value / total
    const next = angle + frac * Math.PI * 2
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    const x2 = cx + r * Math.cos(next), y2 = cy + r * Math.sin(next)
    const xi2 = cx + ir * Math.cos(next), yi2 = cy + ir * Math.sin(next)
    const xi1 = cx + ir * Math.cos(angle), yi1 = cy + ir * Math.sin(angle)
    const large = next - angle > Math.PI ? 1 : 0
    angle = next
    return `
      <path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z"
        fill="${CHART_COLORS[i % CHART_COLORS.length]}" data-tx="${d.label}: ${Math.round(frac * 100)}%"/>
      `
  })
  const legend = data.map((d, i) => {
    const frac = d.value / total
    return `
    <div class="flex items-center gap-2 text-xs">
      <span class="h-2.5 w-2.5 rounded-full" style="background-color: ${CHART_COLORS[i % CHART_COLORS.length]}"></span>
      <span class="text-foreground">${d.label}</span>
      <span class="ml-auto text-muted-foreground">${Math.round(frac * 100)}%</span>
    </div>`
  })
  return `
  <div class="flex items-center justify-center gap-8">
    <svg viewBox="0 0 ${width} ${height}" class="w-[240px] shrink-0">${slices.join("")}</svg>
    <div class="hidden min-w-[180px] space-y-1.5 sm:block">${legend.join("")}</div>
  </div>`
}

// ---------- Demos: helpers para demos no sanitizados --------------------------
export { CHART_COLORS, attachTooltip }
