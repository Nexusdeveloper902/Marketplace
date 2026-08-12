# Digital Marketplace

A full-stack **premium marketplace of high-end vehicles** built with
Next.js 16, React 19, and TypeScript. The UI is in Spanish, uses a dark cinematic
theme with six selectable color themes, and is backed by a real relational
database (Prisma + PostgreSQL, Supabase-compatible) with server-side
authentication, orders, inventory, favorites, reviews, and analytics. Client UI
state (cart, comparison list, theme, recently viewed) is still held in Zustand,
but the source of truth for users, vehicles, orders, favorites, reviews, and
inventory is the database.

The catalog ships with 88 real vehicles across 30 brands, each with real
specifications and image galleries.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Bun** as the package manager and runtime
- **Tailwind CSS v4** + **shadcn/ui** + **Radix UI** primitives
- **Zustand** (with `persist` middleware) for client state
- **Prisma** + **PostgreSQL** (Supabase-compatible — see [Database](#database))
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
│   ├── admin/                # Admin dashboard (login + real DB-backed analytics)
│   ├── api/                  # REST API: auth, vehicles, favorites, orders, reviews, analytics
│   ├── layout.tsx            # Root layout, metadata, theme bootstrap
│   └── globals.css           # Global styles + theme CSS variables
├── components/
│   ├── landing/              # Hero, cinematic showcase, featured, brands
│   ├── layout/               # Header, footer, site shell, theme toggles
│   ├── marketplace/          # Cards, views, compare/favorite buttons, checkout, reviews
│   └── ui/                   # shadcn/ui primitives
├── data/vehicles.ts          # Vehicle catalog (88 vehicles, 30 brands) — imported by the seed
├── lib/
│   ├── utils.ts              # `cn()` (clsx + tailwind-merge)
│   ├── format.ts             # `formatearPrecio` / `formatearNumero` (es-ES, USD)
│   ├── db.ts                 # Prisma client singleton
│   ├── auth/                 # Auth context + favorites-sync hook (client)
│   ├── server/               # Backend: password, session, guards, http, events
│   │   └── data/             # Data-access layer: vehicles, brands, favorites, orders, reviews, analytics
│   └── admin/datos-sinteticos.ts  # Deterministic synthetic dashboard fallback
├── store/                    # Zustand stores (client UI state only)
│   ├── use-store.ts          # Cart, garage, favorites, compare, recents
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

The admin dashboard (`/admin`) is protected by **real server-side authentication**.
A demo admin account is created by the seed script:

- Email: `admin@luxicar.com`
- Password: `admin123`

> These are demo credentials for local development only. Set `AUTH_SECRET` and
> rotate the admin password before any real deployment.

## Database

The project uses **Prisma** as its data access layer over **PostgreSQL**. The
schema in [`prisma/schema.prisma`](prisma/schema.prisma) defines the full domain
model. PostgreSQL is required because the app runs on Vercel serverless, where a
local file database (SQLite) cannot persist writes at runtime.

A hosted Postgres works out of the box — **Supabase** is the recommended option.
Use the **session-mode pooler** connection string (port `5432`), which supports
both Prisma migrations and runtime queries:

```
postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:5432/postgres
```

(The transaction pooler on port `6543` does not support Prisma's schema engine
for migrations.)

### Models

| Model       | Purpose                                                                     |
| ----------- | --------------------------------------------------------------------------- |
| `User`      | id, name, email, passwordHash, role (`USER`/`ADMIN`), timestamps            |
| `Brand`     | id, name, slug, description, timestamps                                     |
| `Vehicle`   | Full catalog (marca, modelo, año, precio, motor, …) + `stock`, `available`, `featured`, `brandId`, timestamps |
| `Favorite`  | many-to-many User ↔ Vehicle (unique `userId_vehicleId`)                     |
| `Order`     | id, number (`LXC-YYYY-NNNNN`), userId, status, total, timestamps            |
| `OrderItem` | orderId, vehicleId, `priceAtPurchase` (frozen), quantity                    |
| `Review`    | userId, vehicleId, rating (1–5), comment (unique per user+vehicle)          |
| `Event`     | Lightweight analytics: type, userId, vehicleId, orderId, metadata, timestamp |

### Migrations, seed, and setup

```bash
bun run db:generate   # regenerate the Prisma Client
bun run db:migrate    # create + apply a migration (dev)
bun run db:push       # push the schema directly (--accept-data-loss)
bun run db:seed       # seed vehicles/brands/demo users/orders/reviews/events
bun run db:reset      # reset the DB and re-run migrations + seed
bun run db:setup      # generate + migrate deploy + seed (production-style)
```

The seed imports the existing 88 vehicles from [`src/data/vehicles.ts`](src/data/vehicles.ts)
without rewriting the catalog, and is **deterministic and safely rerunnable**
(upserts keyed by email/slug). It also creates 8 demo users, ~60 historical
orders, demo favorites, reviews, and analytics events so the admin dashboard is
populated immediately.

## Architecture

```
Next.js (App Router)
        ↓
API routes / Server Components / Server Actions
        ↓
Prisma data-access layer (src/lib/server/data/*)
        ↓
Database (PostgreSQL / Supabase)
```

- **Server components** fetch vehicles/brands directly from the Prisma data layer
  (`/marketplace`, `/vehiculos/[id]`, `/marcas`, `/marcas/[marca]`).
- **API routes** (`/api/auth/*`, `/api/vehicles`, `/api/favorites`, `/api/orders`,
  `/api/reviews`, `/api/analytics`) handle mutations with HTTP semantics.
- **Zustand** retains only client UI state: temporary cart, comparison list,
  theme, recently viewed, and optimistic UI. Favorites/orders/reviews/inventory
  are backend-owned.

## Authentication

Stateless **signed JWT-like sessions** stored in an `httpOnly` cookie
(`luxicar_session`). The token payload carries only the `userId`; the full user
record (including role) is **always reloaded from the database on the server**, so
permissions are never trusted from the client.

- Passwords are hashed with Node `scrypt` (`src/lib/server/password.ts`) — no
  plaintext, no external dependency.
- `requireUser` / `requireAdmin` guards protect server routes and UI pages.
- On login, guest favorites are merged into the user's DB favorites.

Set `AUTH_SECRET` (≥ 16 chars) in production. In development a fixed fallback is
used so seeding/preview works, but a missing/short secret throws in production.

## Testing

Unit tests use Bun's built-in test runner (`bun:test`) and are colocated with the
source as `*.test.ts` files. They cover pure helpers **and** real backend
business logic against the seeded PostgreSQL database:

- [`src/lib/utils.test.ts`](src/lib/utils.test.ts) — `cn()` class helper
- [`src/lib/format.test.ts`](src/lib/format.test.ts) — price/number formatting
- [`src/lib/admin/datos-sinteticos.test.ts`](src/lib/admin/datos-sinteticos.test.ts) —
  structural invariants of the synthetic dashboard generator (fallback)
- [`src/lib/server/password.test.ts`](src/lib/server/password.test.ts) — hashing/verification
- [`src/lib/server/session.test.ts`](src/lib/server/session.test.ts) — token sign/verify/tamper/expiry
- [`src/lib/server/data/orders.test.ts`](src/lib/server/data/orders.test.ts) — checkout atomicity,
  inventory reduction, oversell prevention, order ownership, favorites, reviews authorization
- [`src/lib/server/data/analytics.test.ts`](src/lib/server/data/analytics.test.ts) — real dashboard aggregation

> DB-backed tests create an isolated test user and clean up after themselves;
> they require a seeded database (`bun run db:seed`) to find a vehicle fixture.

Run them with:

```bash
bun test
```

## Environment variables

Configure these in `.env` (local) and in **Vercel → Project Settings →
Environment Variables** (never commit secrets — `.env` is gitignored):

| Variable       | Required | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL` | yes      | PostgreSQL connection URL (Supabase session pooler recommended).           |
| `AUTH_SECRET`  | prod     | Session signing secret (≥ 16 chars). Generate with `openssl rand -hex 32`. |

### Vercel deployment

1. Create a Supabase project and copy the **session-mode pooler** connection
   string (port `5432`) as `DATABASE_URL`.
2. Generate `AUTH_SECRET` and add it.
3. Set both in **Vercel → Settings → Environment Variables** for Production
   and Preview.
4. The `vercel-build` script runs `prisma generate && prisma migrate deploy
   && next build` automatically — migrations are applied during the build.
5. Seed the database **once** (the DB is persistent, so do not seed on every
   build): run `bun run db:seed` locally with `DATABASE_URL` set to the
   Supabase URL, or via a one-off Vercel task.

> **Deployment Protection:** if login/API calls return `401 Protected
> deployment`, disable Vercel Authentication (Settings → Deployment
> Protection) or generate a Protection Bypass secret for automation.

## CI/CD

A GitHub Actions workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
runs on every pull request and push to `main`. It spins up an **isolated
PostgreSQL service container**, applies migrations, seeds it, then runs lint,
tests, and a production build — so the shared production database is never
touched by CI. In-progress runs on the same branch are cancelled when a new
commit is pushed.

| Step    | Command              |
| ------- | -------------------- |
| Install | `bun install --frozen-lockfile` |
| DB      | `bun run db:setup` (migrate + seed the CI Postgres) |
| Lint    | `bun run lint`       |
| Test    | `bun test`           |
| Build   | `bun run build`      |

The project is deployed to **Vercel**, which builds and deploys on its own
integration (preview deployments per PR, production on merges to `main`). The
GitHub Actions pipeline is a quality gate that runs before Vercel's deployment.

## Production deployment

`bun run build` produces a standalone server in `.next/standalone`. Start it with:

```bash
bun run start
```

A [`Caddyfile`](Caddyfile) is included for reverse-proxying the app (default
upstream `localhost:3000`). On Vercel the standalone output is automatically
disabled (see [`next.config.ts`](next.config.ts)).
