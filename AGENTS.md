# Marketplace

Next.js 16 + React 19 + TypeScript marketplace app. UI text is in Spanish.

## Tooling

- Runtime/package manager: **Bun** (lockfile is `bun.lock`; `bun-types` is a devDep).
  Bun is NOT preinstalled in this sandbox; install with `npm config set prefix
  ~/.npm-global && npm install -g bun` and export `PATH="$HOME/.npm-global/bin:$PATH"`.
- Install deps: `bun install`.
- Dev: `bun run dev` (Next dev server on :3000).
- Build: `bun run build`.
- Lint: `bun run lint` (ESLint flat config).

## Tests

- Framework: **Bun's built-in test runner** (`bun:test`). No Vitest/Jest.
- Run: `bun test` (or `bun run test`), added as the `test` script in package.json.
- Convention: colocate `*.test.ts` next to the module under test (Bun auto-discovers
  `*.test.ts` recursively). The `@/*` tsconfig path alias resolves under `bun test`.
- Existing test coverage lives in `src/lib/`:
  - `src/lib/utils.test.ts` — `cn()` (clsx + tailwind-merge)
  - `src/lib/format.test.ts` — `formatearPrecio` / `formatearNumero` (Intl es-ES)
  - `src/lib/admin/datos-sinteticos.test.ts` — `generarDatosDashboard()` invariants
- Gotcha: `Intl.NumberFormat("es-ES", { currency: "USD" })` emits the currency as
  `US$` separated by a NON-BREAKING SPACE (U+00A0), e.g. `"120.000\u00a0US$"`.

## Notes on `generarDatosDashboard`

- Uses a deterministic mulberry32 PRNG seeded at 42 (`rng` is module-scoped, so it
  advances across calls). Call it once per test module and assert structural invariants.
- `kpis.pedidosPendientes` is counted over ALL generated orders (before the slice to 15),
  so it can exceed the pending count visible in the returned `pedidosRecientes`.

## Backend (full-stack upgrade)

The app is now full-stack. Backend lives under `src/lib/server/`:

- `password.ts` — scrypt hashing (`hashPasswordSync`/`verifyPasswordSync`), format
  `scrypt:<saltHex>:<hashHex>`.
- `session.ts` — stateless signed JWT-like token in `luxicar_session` httpOnly cookie.
  Payload carries only `sub` (userId); the full user/role is always reloaded from DB
  server-side. `verifySessionToken` validates signature + expiry.
- `guards.ts` — `getCurrentUser`, `requireUser`, `requireAdmin`, `isAdmin`.
- `http.ts` — `ok/badRequest/unauthorized/forbidden/notFound/serverError` helpers.
- `events.ts` — best-effort `trackEvent` (swallows errors); `EventType` const-enum.
- `data/vehicles.ts` — `listVehicles` (returns `{ items, total, page, pageSize, totalPages }`),
  `listAllVehicles`, `getVehicleBySlug` (raw row), `getVehicleDTOBySlug` (Vehicle DTO),
  `listAllMarcas`. `parseOrden` validates sort keys.
- `data/brands.ts` — `listBrands` (BrandSummary with cantidad/precioMin/precioMax/imagen),
  `getBrandBySlug`, `getBrandNameBySlug`.
- `data/favorites.ts` — `addFavorite`/`removeFavorite`/`isFavorited`/`listFavoriteSlugs`/
  `addFavoritesBulk`. Unique constraint = idempotent add.
- `data/orders.ts` — `checkout` runs in `db.$transaction`: validates exists/available/stock,
  uses DB price (never client price), freezes `priceAtPurchase`, decrements stock, marks
  `available=false` at 0. Throws `CheckoutError` with code. `listOrders`/`getOrderForUser`
  (ownership-filtered). `OrderDetail.items[].vehicle` is a full Vehicle DTO (`vehicle.id` = slug).
- `data/reviews.ts` — `createReview` validates rating 1–5 BEFORE purchase check, then
  requires a COMPLETED order containing the vehicle, unique per user+vehicle. `ReviewError`
  with code. `listReviews` returns `{ reviews, average, count }`.
- `data/analytics.ts` — `getDashboardData` aggregates real completed orders/events.
  `ventasPorMarca`/`ventasPorCategoria`/`topVehiculos` sorted by `ventas` (count), not ingresos.

### Key conventions

- Frontend `Vehicle.id` is the **slug** (stable URL id). DB row `id` is a cuid. The
  mapper `toVehicleDTO` maps `id: v.slug`.
- `OrderDetail` shape: `{ id, number, status, statusLabel, total, createdAt,
  items: [{ id, quantity, priceAtPurchase, vehicle: Vehicle }] }`. Frontend DTOs in
  `/perfil`, `/pedidos`, `garage-view` must read `it.vehicle.marca/modelo/id` (NOT
  `it.marca`/`it.vehicleSlug`).
- Server components (`/marketplace`, `/vehiculos/[id]`, `/marcas`, `/marcas/[marca]`)
  fetch from the data layer and pass props to client views. `generateStaticParams` is
  now async and DB-backed.
- `useSearchParams()` in `/login` must be wrapped in `<Suspense>` or the static
  prerender fails the production build.
- Zustand store: `setFavoritos(ids)` added (dedup via Set). `useFavoritesSync()` hydrates
  the store from DB on auth change; `useToggleFavorito()` wraps toggle + API sync.

### Tests

`bun:test` matchers are `toBeGreaterThanOrEqual`/`toBeLessThanOrEqual` (NOT
`toBeGreaterThanOr`). DB-backed tests in `src/lib/server/data/*.test.ts` create an
isolated test user (unique email suffix) and clean up via user delete cascade; they
restore the fixture vehicle's stock in `afterAll`. They require a seeded DB.

### Build gotchas

- `next.config.ts` has `ignoreBuildErrors` for the pre-existing `sufijo` TS error in
  `vehicle-detail-view.tsx` — leave it.
- 64 tests pass (32 baseline + 32 backend). Lint must be clean (eslint is a CI gate).
