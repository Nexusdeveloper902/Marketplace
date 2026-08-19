#!/usr/bin/env node
/**
 * One-time migration build: assembles the frontend-only version of the app
 * (frontend/) from public/ (HTML/CSS) and public/js2/ (JS modules).
 *
 * - Concatenates the shared modules + a hand-written local API into js/app.js
 *   (all ES imports/exports stripped so plain <script> tags work under file://).
 * - Emits one js/pages/<name>.js per page (imports stripped).
 * - Rewrites HTML pages with relative paths and plain script tags.
 *
 * The OUTPUT is dependency-free; Node is only needed to run this build.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const SRC_JS = path.join(ROOT, "public/js2")
const SRC_HTML_ROOT = path.join(ROOT, "public/index.html")
const SRC_HTML_PAGES = path.join(ROOT, "public/pages")
const OUT = path.join(ROOT, "frontend")

const LOCAL_API = fs.readFileSync(path.join(__dirname, "local-api.js"), "utf8")
const SHARED_ORDER = [
  // NOTE: api.js is NOT included — it is replaced by local-api below.
  "format.js",
  "ui.js",
  "icons.js",
  "toast.js",
  "store.js",
  "@@LOCAL_API@@",
  "auth.js",
  "vehicle-card.js",
  "layout.js",
  "charts.js",
  "checkout-modal.js",
]

function stripModuleSyntax(code) {
  return code
    .replace(/import\s[\s\S]*?from\s+["'][^"']+["'];?/g, "")
    .replace(/import\s+["'][^"']+["'];?/g, "")
    .replace(/export\s+\{[^}]*\};?/g, "")
    .replace(/(^|\n)\s*export\s+(async function|function|const|let|var|class)/g, "$1$2")
    .replace(/(^|\n)\s*export\s+default\s+/g, "$1")
}

// --- Build js/app.js -----------------------------------------------------
const header = `/* Digital Marketplace — frontend-only bundle (generated).
   Sections, in order: routing helpers, injected seed data, shared modules,
   local API (replaces the original Express backend). */
`
const routeHelper = fs.readFileSync(path.join(__dirname, "route-helper.js"), "utf8")
const { dumpSeed } = require("./dump-seed")
const dataJs = "var SEED = " + JSON.stringify(dumpSeed()) + ";\n"

let app = [header, routeHelper, dataJs]
for (const name of SHARED_ORDER) {
  let code
  if (name === "@@LOCAL_API@@") {
    code = stripModuleSyntax(LOCAL_API)
  } else {
    code = fixPaths(stripModuleSyntax(fs.readFileSync(path.join(SRC_JS, name), "utf8")), name)
  }
  app.push(`/* ---- ${name} ---- */\n${code}`)
  if (name === "ui.js") {
    // route smart-image assets through the path prefix helper
    app.push("")
  }
}
fs.writeFileSync(path.join(OUT, "js/app.js"), app.join("\n"))

// --- Build js/pages/<name>.js --------------------------------------------
const pages = fs.readdirSync(path.join(SRC_JS, "pages"))
for (const name of pages) {
  const code = stripModuleSyntax(fs.readFileSync(path.join(SRC_JS, "pages", name), "utf8"))
  fs.writeFileSync(path.join(OUT, "js/pages", name), fixPaths(code, name))
}

// Cross-cutting path fixes applied to every JS file.
function fixPaths(code, name) {
  let out = code
  // Static absolute app-path hrefs.
  out = out.replace(/href="(\/[^"$]*)"/g, 'href="${hrefFromApp("$1")}"')
  // Dynamic hrefs with a single template interpolation, e.g. href="/vehiculos/${v.id}".
  out = out.replace(
    /href="(\/[\w-]+)\/\$\{([^}$]*)\}"/g,
    'href="${hrefFromApp("$1/" + ($2))}"'
  )
  // `const href = "/..."` route-style variables go through the router
  out = out.replace(
    /(const href =\s*)`(\/[^`]*)`/g,
    '$1hrefFromApp(`$2`)'
  )
  // marketplace URL sync: keep the base page file when pushing query params
  if (name === "marketplace.js") {
    out = out.replace(
      /const url = qs \? `\/marketplace\?\$\{qs\}` : "\/marketplace"/,
      'const url = hrefFromApp("/marketplace") + (qs ? "?" + qs : "")'
    )
  }
  // All raw interpolated image srcs go through assetPath (pages/ pages need "../").
  out = out.replace(
    /src="\$\{escapeHtml\(([^}]*?)\)\}"/g,
    'src="${escapeHtml(assetPath($1))}"'
  )
  // Literal absolute asset srcs (e.g. /icon.svg, /logo.svg, /vehicles/...).
  out = out.replace(/src="(\/[^"$]*)"/g, 'src="${assetPath("$1")}"')
  out = out.replace(/location\.href\s*=\s*["`](\/[^"$]*)["`]/g, 'location.href = hrefFromApp("$1")')
  out = out.replace(/window\.location\.pathname/g, "currentAppRoute()")
  out = out.replace(/location\.pathname/g, "currentAppRoute()")
  // --- dynamic case fixes (template interpolations inside the URL) ---
  out = out.replace(
    /href="\/registro\$\{redirect !== "\/" \? `[^`]*` : ""\}/g,
    'href="${hrefFromApp("/registro")}${redirect !== "/" ? "?redirect=" + encodeURIComponent(redirect) : ""}'
  )
  out = out.replace(
    /href="\/login\$\{redirect !== "\/" \? `[^`]*` : ""\}/g,
    'href="${hrefFromApp("/login")}${redirect !== "/" ? "?redirect=" + encodeURIComponent(redirect) : ""}'
  )
  out = out.replace(
    /window\.location\.href = `\/login\?redirect=\$\{encodeURIComponent\(([^)]*)\)\}`/g,
    'window.location.href = hrefFromApp("/login") + "?redirect=" + encodeURIComponent($1)'
  )
  out = out.replace(
    /window\.location\.href = `\/gracias\?order=\$\{(result\.orderId \?\? "")\}`/g,
    'window.location.href = hrefFromApp("/gracias") + "?order=" + ($1)'
  )
  // post-login redirect now goes through the router
  if (name === "login.js" || name === "registro.js") {
    out = out.replace(/window\.location\.href = redirect\b/g, "window.location.href = hrefFromApp(redirect)")
  }
  // smart-image assets through prefix helper
  if (name === "ui.js") {
    out = out.replace(
      /<img src="\$\{escapeHtml\(src\)\}"/g,
      '<img src="${escapeHtml(assetPath(src))}"'
    )
  }
  if (name === "layout.js") {
    // logo svg asset
    out = out.replace(/src="\/logo\.svg"/g, 'src="${assetPath("/logo.svg")}"')
    out = out.replace(/src="\/icon\.svg"/g, 'src="${assetPath("/icon.svg")}"')
    // nav item hrefs come from a data array → route them at render time
    out = out.replace(/href="\$\{item\.href\}"/g, 'href="${hrefFromApp(item.href)}"')
    out = out.replace(/href="\$\{enlace\.href\}"/g, 'href="${hrefFromApp(enlace.href)}"')
    out = out.replace(/href="\$\{link\.href\}"/g, 'href="${hrefFromApp(link.href)}"')
    out = out.replace(/href="\$\{ruta\.href\}"/g, 'href="${hrefFromApp(ruta.href)}"')
  }
  // vehiculo/marca slug extraction helpers
  if (name === "vehiculo.js") {
    out = out.replace(
      /const slug = currentAppRoute\(\)\.split\("\/vehiculos\/"\)\[1\]/,
      'const slug = new URLSearchParams(location.search).get("id")'
    )
  }
  if (name === "marca.js") {
    out = out.replace(
      /const slug = currentAppRoute\(\)\.split\("\/marcas\/"\)\[1\]/,
      'const slug = new URLSearchParams(location.search).get("slug")'
    )
  }
  return out
}

// --- Rewrite HTML pages ---------------------------------------------------
function rewriteHtml(file, isRoot) {
  let html = fs.readFileSync(file, "utf8")
  const prefix = isRoot ? "" : "../"
  // favicon + css
  html = html.replace(/href="\/icon\.svg"/g, `href="${prefix}icon.svg"`)
  html = html.replace(/href="\/css\/app\.css"/g, `href="${prefix}css/app.css"`)
  // script: module → app.js + page file
  html = html.replace(
    /<script type="module" src="\/js2\/pages\/([^"]+)"><\/script>/g,
    (m, page) =>
      `<script src="${prefix}js/app.js"></script>\n  <script src="${prefix}js/pages/${page}"></script>`
  )
  // temporary debug: surface JS errors in-page
  html = html.replace(
    "<body>",
    `<body><div id="dbg" style="position:fixed;top:0;left:0;z-index:99999;color:#ff6;font-size:11px;background:#000;max-width:100%"></div>
<script>window.onerror=function(m,s,l){var d=document.getElementById('dbg');if(d)d.textContent+="ERR: "+m+" @"+(s||"")+":"+l+" || ";return false;};window.addEventListener('unhandledrejection',function(e){var d=document.getElementById('dbg');var msg=e.reason&&e.reason.message?e.reason.message:String(e.reason);if(d)d.textContent+="REJ: "+msg+" || ";});</script>`
  )
  const dest = isRoot ? path.join(OUT, "index.html") : path.join(OUT, "pages", path.basename(file))
  fs.writeFileSync(dest, html)
}
rewriteHtml(SRC_HTML_ROOT, true)
for (const f of fs.readdirSync(SRC_HTML_PAGES)) {
  if (f.endsWith(".html")) rewriteHtml(path.join(SRC_HTML_PAGES, f), false)
}
console.log("Frontend build OK:", pages.length, "pages")
