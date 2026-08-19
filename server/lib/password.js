/**
 * Password hashing using Node's built-in scrypt (no external dependency).
 * Output format: "scrypt:<saltHex>:<hashHex>" — same as the original project.
 */
const { scryptSync, randomBytes, timingSafeEqual } = require("node:crypto")

const KEY_LEN = 64
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 }

function hashPasswordSync(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS)
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`
}

function verifyPasswordSync(password, stored) {
  const parts = String(stored).split(":")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false
  const salt = Buffer.from(parts[1], "hex")
  const expected = Buffer.from(parts[2], "hex")
  if (salt.length === 0 || expected.length !== KEY_LEN) return false
  const hash = scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS)
  return timingSafeEqual(hash, expected)
}

module.exports = { hashPasswordSync, verifyPasswordSync }
