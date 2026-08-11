# Digital Marketplace

A frontend-only, premium **digital marketplace of high-end vehicles** built with
Next.js 16, React 19, and TypeScript. The UI is in Spanish, uses a dark cinematic
theme with six selectable color themes, and persists state (cart, garage,
favorites, compare list) in `localStorage` via Zustand.

The catalog ships with 88 real vehicles across 29 brands, each with real
specifications and image galleries.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Bun** as the package manager and runtime
- **Tailwind CSS v4** + **shadcn/ui** + **Radix UI** primitives
- **Zustand** (with `persist` middleware) for client state
- **Prisma** + **SQLite** (see [Database](#database))
- **Framer Motion** for transitions, **Recharts** for the admin dashboard charts

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (the project pins `bun-types` and ships a `bun.lock`)
- Node.js 22+ (only if you can't use Bun)

### Install dependencies

```bash
bun install
```

### Run the dev server

```bash
bun run dev
```

The app starts on <http://localhost:3000>.

## Available scripts

| Script            | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `bun run dev`     | Start the Next.js dev server on port 3000 (logs to `dev.log`)                |
| `bun run build`   | Production build; copies static assets into `.next/standalone` when present  |
| `bun run start`   | Run the standalone production server (`bun .next/standalone/server.js`)      |
| `bun run lint`    | Run ESLint (flat config in `eslint.config.mjs`)                              |
| `bun run test`    | Run the unit tests with Bun's built-in test runner (`bun test`)              |
| `bun run db:push` | Push the Prisma schema to the database (`--accept-data-loss`)                |
| `bun run db:generate` | Regenerate the Prisma Client                                             |
| `bun run db:migrate`  | Create and apply a Prisma migration                                       |
| `bun run db:reset`    | Reset the database and re-run migrations                                  |

## Project structure

```
src/
├── app/                      # Next.js App Router routes
│   ├── page.tsx              # Landing page (hero + cinematic showcase)
│   ├── marketplace/page.tsx  # Browse, search and filter the catalog
│   ├── vehiculos/[id]/page.tsx  # Vehicle detail view
│   ├── garaje/page.tsx       # Purchased vehicles ("garage")
│   ├── carrito/page.tsx      # Shopping cart + checkout
│   ├── favoritos/page.tsx    # Favorites
│   ├── comparar/page.tsx     # Side-by-side comparator (up to 3)
│   ├── marcas/page.tsx       # All brands index
│   ├── marcas/[marca]/page.tsx  # Brand detail
│   ├── admin/                # Admin dashboard (login + synthetic analytics)
│   ├── api/route.ts
│   ├── layout.tsx            # Root layout, metadata, theme bootstrap
│   └── globals.css           # Global styles + theme CSS variables
├── components/
│   ├── landing/              # Hero, cinematic showcase, featured, brands
│   ├── layout/               # Header, footer, site shell, theme toggles
│   ├── marketplace/          # Cards, views, compare/favorite buttons, checkout
│   └── ui/                   # shadcn/ui primitives
├── data/vehicles.ts          # Vehicle catalog (88 vehicles, 29 brands)
├── lib/
│   ├── utils.ts              # `cn()` (clsx + tailwind-merge)
│   ├── format.ts             # `formatearPrecio` / `formatearNumero` (es-ES, USD)
│   ├── db.ts                 # Prisma client singleton
│   └── admin/datos-sinteticos.ts  # Deterministic synthetic dashboard data
├── store/                    # Zustand stores
│   ├── use-store.ts          # Cart, garage, favorites, compare, recents
│   ├── use-auth.ts           # Admin auth (demo credentials)
│   └── use-tema.ts           # Theme selection (6 themes)
├── hooks/                    # use-hydrated, use-mobile, use-toast
└── types/vehicle.ts          # Vehicle types and filter constants
```

## Features

- **Catalog browsing** with search and filters by brand.
- **Vehicle detail** pages with image galleries and full specifications
  (engine, power, torque, transmission, fuel, drivetrain, top speed, 0–100).
- **Shopping cart** with a checkout modal and financing calculator.
- **Garage** of purchased vehicles with running total value.
- **Favorites** and a side-by-side **comparator** (up to 3 vehicles).
- **Brand pages** per manufacturer.
- **Admin dashboard** (`/admin`) with 36 months of synthetic sales analytics,
  KPIs, and charts. The data is generated deterministically from a seeded PRNG.
- **Theming**: six premium dark themes selectable from the header toggle.

## Admin access

The admin dashboard is protected by demo credentials defined in
[`src/store/use-auth.ts`](src/store/use-auth.ts):

- User: `admin`
- Password: `root123`

> These are hardcoded demo credentials for development only. Do not use them in
> production.

## Database

The project includes a Prisma + SQLite setup. The schema lives in
[`prisma/schema.prisma`](prisma/schema.prisma) and defines `User` and `Post`
models (a starter scaffold). The database URL is read from the `DATABASE_URL`
environment variable in [`.env`](.env).

After changing the schema, regenerate the client and push it:

```bash
bun run db:generate
bun run db:push
```

## Testing

Unit tests use Bun's built-in test runner (`bun:test`) and are colocated with the
source as `*.test.ts` files. They cover the pure helpers in `src/lib/`:

- [`src/lib/utils.test.ts`](src/lib/utils.test.ts) — the `cn()` class helper
- [`src/lib/format.test.ts`](src/lib/format.test.ts) — price/number formatting
- [`src/lib/admin/datos-sinteticos.test.ts`](src/lib/admin/datos-sinteticos.test.ts) —
  structural invariants of the dashboard generator

Run them with:

```bash
bun test
```

## Production deployment

`bun run build` produces a standalone server in `.next/standalone`. Start it with:

```bash
bun run start
```

A [`Caddyfile`](Caddyfile) is included for reverse-proxying the app (default
upstream `localhost:3000`). On Vercel the standalone output is automatically
disabled (see [`next.config.ts`](next.config.ts)).
