-- Digital Marketplace — SQLite schema
-- Ported from the original Prisma/PostgreSQL schema (prisma/schema.prisma).
-- IDs are TEXT (cuid-like generated in code). Enums are plain TEXT with
-- values constrained in the application layer, as in the original project.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  passwordHash  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'USER',      -- 'USER' | 'ADMIN'
  createdAt     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS brands (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  createdAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS vehicles (
  id               TEXT PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  marca            TEXT NOT NULL,
  modelo           TEXT NOT NULL,
  "año"            INTEGER NOT NULL,
  precio           INTEGER NOT NULL,
  motor            TEXT NOT NULL,
  potencia         INTEGER NOT NULL,
  torque           INTEGER NOT NULL,
  transmision      TEXT NOT NULL,
  combustible      TEXT NOT NULL,
  traccion         TEXT NOT NULL,
  velocidadMaxima  INTEGER NOT NULL,
  aceleracion0a100 REAL NOT NULL,
  categoria        TEXT NOT NULL,
  descripcion      TEXT NOT NULL,
  images           TEXT NOT NULL DEFAULT '[]',     -- JSON-encoded string[]
  stock            INTEGER NOT NULL DEFAULT 1,
  available        INTEGER NOT NULL DEFAULT 1,     -- SQLite boolean (0/1)
  featured         INTEGER NOT NULL DEFAULT 0,
  brandId          TEXT REFERENCES brands(id),
  createdAt        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  id        TEXT PRIMARY KEY,
  userId    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicleId TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (userId, vehicleId)
);

CREATE TABLE IF NOT EXISTS orders (
  id        TEXT PRIMARY KEY,
  number    TEXT NOT NULL UNIQUE,                  -- e.g. 'LXC-2026-00042'
  userId    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status    TEXT NOT NULL DEFAULT 'PENDING',       -- PENDING | PROCESSING | COMPLETED | CANCELLED
  total     INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders(userId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
  id              TEXT PRIMARY KEY,
  orderId         TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vehicleId       TEXT NOT NULL REFERENCES vehicles(id),
  priceAtPurchase INTEGER NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  UNIQUE (orderId, vehicleId)
);

CREATE TABLE IF NOT EXISTS reviews (
  id        TEXT PRIMARY KEY,
  userId    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicleId TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  rating    INTEGER NOT NULL,                      -- 1-5
  comment   TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updatedAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (userId, vehicleId)
);

CREATE TABLE IF NOT EXISTS events (
  id        TEXT PRIMARY KEY,
  type      TEXT NOT NULL,                         -- VEHICLE_VIEWED, VEHICLE_FAVORITED, ...
  userId    TEXT REFERENCES users(id) ON DELETE SET NULL,
  vehicleId TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  orderId   TEXT,
  metadata  TEXT NOT NULL DEFAULT '{}',            -- JSON-encoded
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_createdAt ON events(createdAt);
