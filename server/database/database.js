/**
 * SQLite database connection (better-sqlite3).
 *
 * Opens (and creates if needed) the local database file, applies the schema
 * and seeds demo data on first run, so the app works from a clean install
 * with just `npm install && npm start`.
 */
const path = require("path")
const fs = require("fs")
const Database = require("better-sqlite3")

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "marketplace.db")

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Apply schema (idempotent: everything is CREATE ... IF NOT EXISTS).
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
db.exec(schema)

/** Generate a cuid-like unique id (timestamp base36 + random suffix). */
function createId() {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  )
}

/** Current timestamp in the ISO format the frontend expects. */
function nowISO() {
  return new Date().toISOString()
}

/** Seed automatically when the database is empty (first run). */
function ensureSeeded() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM vehicles").get()
  if (count === 0) {
    console.log("Base de datos vacía — ejecutando seed inicial…")
    require("./seed").run(db)
  }
}

ensureSeeded()

module.exports = { db, createId, nowISO, DB_PATH }
