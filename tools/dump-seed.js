#!/usr/bin/env node
/**
 * Dumps the SQLite tables to the seed object embedded in the frontend-only
 * build (frontend/js/app.js). Called by migrate-frontend.js; also runnable
 * directly to refresh /tmp/seed.json.
 */
const { db } = require("../server/database/database.js")

const TABLES = [
  "users",
  "vehicles",
  "brands",
  "favorites",
  "orders",
  "order_items",
  "reviews",
  "events",
]

function dumpSeed() {
  const seed = {}
  for (const t of TABLES) seed[t] = db.prepare(`SELECT * FROM ${t}`).all()
  // The frontend-only bundle cannot verify scrypt hashes in the browser, so
  // it needs the plaintext demo passwords (documented in the README).
  for (const u of seed.users) {
    u.password = u.role === "ADMIN" ? "admin123" : "demo1234"
  }
  return seed
}

if (require.main === module) {
  const fs = require("fs")
  const out = process.argv[2] || "/tmp/seed.json"
  fs.writeFileSync(out, JSON.stringify(dumpSeed()))
  console.log(`Wrote ${out} (${TABLES.join(", ")})`)
}

module.exports = { dumpSeed }
