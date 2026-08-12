import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Cap the connection pool so the app plays nicely with pooled Postgres
// providers (e.g. Supabase's session pooler, pool_size ~15) and with Vercel
// serverless, where each function instance opening many connections can
// exhaust the shared pool. Override via DATABASE_URL ?connection_limit= if needed.
const connectionLimit = process.env.NODE_ENV === 'production' ? 3 : 2

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + `connection_limit=${connectionLimit}`,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db