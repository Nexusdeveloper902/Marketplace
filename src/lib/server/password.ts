import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto"

/**
 * Password hashing using Node's scrypt (no external dependency).
 * Output format: "scrypt:<saltHex>:<hashHex>".
 */
const KEY_LEN = 64
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 }

export function hashPasswordSync(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS)
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`
}

export function verifyPasswordSync(password: string, stored: string): boolean {
  const parts = stored.split(":")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false
  const salt = Buffer.from(parts[1], "hex")
  const expected = Buffer.from(parts[2], "hex")
  if (salt.length === 0 || expected.length !== KEY_LEN) return false
  const hash = scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS)
  return timingSafeEqual(hash, expected)
}

export async function hashPassword(password: string): Promise<string> {
  return hashPasswordSync(password)
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  return verifyPasswordSync(password, stored)
}
