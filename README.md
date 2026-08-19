# Digital Marketplace

A full-stack **premium marketplace of high-end vehicles**, migrated from a
Next.js 16/React 19 application to a **traditional full-stack web app**:

```
HTML + CSS + Vanilla JavaScript (no frameworks)
        ↓  fetch()
Express.js REST API
        ↓
SQLite (better-sqlite3)
```

The UI is entirely in Spanish, preserves the original dark cinematic design with
six selectable color themes, the original flows (checkout, reviews, favorites,
comparator, garage, orders), and the admin dashboard with real-time analytics.

## Tech stack

- **Frontend**: HTML5 + CSS (handcrafted, ported from Tailwind output) + Vanilla
  JavaScript ES modules. No React, no Next.js, no build step.
- **Backend**: Node.js + Express.js REST API
- **Database**: SQLite via `better-sqlite3` (in-file, auto-created & seeded on
  first run)
- **Deps**: `express`, `better-sqlite3` (2 production dependencies)

## Getting started

```bash
npm install
npm start
```

Then open **http://localhost:3000**.

Optional dev command (same as start, kept for parity): `npm run dev`.

The first time it runs, the server creates `server/database/marketplace.db`,
applies `server/database/schema.sql` and executes `server/database/seed.js`:
88 vehicles across 30 brands, 9 demo users, ~60 historical orders, favorites,
reviews, and analytic events. To reset the database, stop the server, delete
`server/database/marketplace.db`, and restart.

### Demo accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@luxicar.com   | admin123  |
| User  | carlos@demo.com     | demo1234  |
| User  | maria@demo.com      | demo1234  |
| User  | juan@demo.com       | demo1234  |
| User  | ana@demo.com        | demo1234  |
| User  | pedro@demo.com      | demo1234  |
| User  | laura@demo.com      | demo1234  |
| User  | diego@demo.com      | demo1234  |
| User  | sofia@demo.com      | demo1234  |

## Project structure

```
server/
  server.js            express app (static + /api)
  routes/              auth, vehicles, brands, favorites, orders, reviews, analytics
  controllers/         request-handling logic
  middleware/          session + guards (attachUser/requireUser/requireAdmin)
  lib/                 password (scrypt), session token (JWT-like cookie)
  database/
    database.js        better-sqlite3 connection & init
    schema.sql         relational schema (users, vehicles, orders, ...)
    seed.js            demo data import
    vehicles-data.js   88-vehicle catalog
public/
  index.html           landing page
  pages/               one HTML per route (marketplace, vehiculos, marcas, ...)
  css/app.css          hand-crafted stylesheet (ported from Tailwind output)
  js2/                 vanilla JS ES modules
  vehicles/            vehicle image galleries (public/<slug>/1..4)
  icon.svg, logo.svg
tools/
  migrate-frontend.js  builds the static frontend-only bundle (frontend/)
  dump-seed.js         dumps SQLite tables as the SEED for that bundle
package.json
README.md
```

## Frontend-only build (no backend at all)

`tools/migrate-frontend.js` concatenates `public/js2/` + the pages into
`frontend/`, replacing every `fetch("/api/...")` call with an in-browser
localStorage-backed mini-API (`tools/local-api.js`). Data comes from a `SEED`
object dumped live from SQLite by `tools/dump-seed.js` (demo passwords are
embedded in plaintext — the bundle cannot verify scrypt hashes; this variant
is demo/presentation only, never production).

```bash
node tools/migrate-frontend.js
cd frontend && python3 -m http.server 8090   # or any static server
```

Then open **http://localhost:8090/index.html**.

## API endpoints (Express)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/vehicles              (list w/ filters + pagination; ?all=1 returns all)
GET    /api/vehicles/:id          (slug lookup)
GET    /api/brands                (brand summaries)
GET    /api/brands/:slug          (brand + its vehicles)

GET    /api/favorites             (auth)
POST   /api/favorites             { slug } (auth)
DELETE /api/favorites/:slug       (auth)

GET    /api/orders                (auth; admin sees all)
POST   /api/orders                { items: [{ vehicleSlug, quantity }] } (auth)
GET    /api/orders/:id            (ownership-filtered)

GET    /api/reviews?vehicleSlug=…
POST   /api/reviews               { vehicleSlug, rating, comment } (auth)

GET    /api/analytics/dashboard   (admin only)
GET    /api/health
```

Static pages are served from `public/index.html` and `public/pages/*.html` for
the routes `/`, `/marketplace`, `/vehiculos/:slug`, `/marcas`, `/marcas/:slug`,
`/favoritos`, `/comparar`, `/garaje`, `/carrito`, `/gracias`, `/login`,
`/registro`, `/perfil`, `/pedidos`, `/privacidad`, `/terminos`, `/admin`, and
`/admin/login`. Unknown HTML routes return the styled `404.html`.

## Data model

- **users**: id (cuid), email (unique), name, passwordHash (scrypt), role
  (USER | ADMIN), createdAt
- **vehicles**: id (cuid), slug (unique), marca, modelo, año, precio, motor,
  potencia, torque, transmision, combustible, traccion, velocidadMaxima,
  aceleracion0a100, categoria, descripcion, imagenes (JSON array), destacado,
  stock, available
- **brands**: id, slug (unique), name
- **favorites**: id, userId, vehicleId (unique user+vehicle)
- **orders**: id (cuid), number (LXC-YYYY-NNNNN unique), userId, status
  (PENDING | PROCESSING | COMPLETED | CANCELLED), total, createdAt
- **order_items**: id, orderId, vehicleId, quantity, priceAtPurchase
- **reviews**: id, userId, vehicleId, rating (1–5), comment, createdAt
  (unique per user+vehicle)
- **events**: id, type, userId, vehicleId, orderId, metadata (JSON), createdAt

## Migration notes

- The original Next.js/Prisma/PostgreSQL stack was replaced entirely; nothing
  in `server/`, `public/`, or the flows depends on build tooling. No React, no
  Next.js runtime, no PostgreSQL/Supabase. Works fully offline on localhost.
- Session: signed JWT-like token in an `httpOnly` cookie (`luxicar_session`),
  30-day expiry; the full user/role is re-read from SQLite per request.
- Frontend pages are plain HTML + one `<script type="module"
  src="/js2/pages/<page>.js">` each; interactivity is `fetch()` + DOM
  manipulation. URL state powers the marketplace filters, like the original.
- Client UI state (cart, comparator, garage, theme) is kept in `localStorage`
  and mirrored to the server where needed (favorites are server-persisted;
  orders, reviews, admin analytics are fully server-side).
- Charts in the admin dashboard are hand-rolled inline SVG (the original used
  Recharts). The financing simulator on each vehicle page is pure client JS.
- Both the Tailwind visual fidelity and the six-color theme switcher are
  preserved in `public/css/app.css`.
