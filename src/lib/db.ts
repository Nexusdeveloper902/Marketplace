import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Build the runtime datasource URL. The goal is to never exhaust a pooled
// Postgres (e.g. Supabase Supavisor, pool_size 15) from Vercel serverless,
// where each function instance owns its own PrismaClient + connection pool.
//
// Two failure modes we guard against:
//   1. Session-mode pooler (port 5432): 1 client conn = 1 backend conn, so a
//      handful of concurrent functions × pool_size per function hits pool_size.
//      Symptom: EMAXCONNSESSION.
//   2. Transaction-mode pooler (port 6543, ?pgbouncer=true): multiplexes, but
//      Prisma still opens connection_limit TCP connections per instance, which
//      count toward the pooler's per-tier client cap.
//
// Fix: cap Prisma's client pool to 1 per instance (a serverless function does
// sequential, short-lived work and needs exactly one connection), and never
// double-append the param if the URL already carries it.
function buildUrl(): string {
  const base = process.env.DATABASE_URL
  if (!base) return ''
  if (base.includes('connection_limit=')) return base
  return base + (base.includes('?') ? '&' : '?') + 'connection_limit=1'
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['warn', 'error'],
    datasources: {
      db: {
        url: buildUrl(),
      },
    },
  })

// Persist the singleton on the global in every environment so warm serverless
// function containers reuse the same PrismaClient (and its single connection)
// instead of opening a new pool per invocation. Do NOT $disconnect() after
// requests — that defeats container reuse.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db