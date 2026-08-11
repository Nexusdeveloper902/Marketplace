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
