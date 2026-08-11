import { describe, expect, it } from "bun:test"
import {
  hashPasswordSync,
  verifyPasswordSync,
} from "./password"

describe("password hashing", () => {
  it("produce un hash con formato scrypt:salt:hash", () => {
    const hash = hashPasswordSync("supersecret")
    const parts = hash.split(":")
    expect(parts.length).toBe(3)
    expect(parts[0]).toBe("scrypt")
    // salt and hash are hex strings of sane length
    expect(parts[1].length).toBeGreaterThan(0)
    expect(parts[2].length).toBeGreaterThan(0)
  })

  it("verifica la contraseña correcta", () => {
    const hash = hashPasswordSync("admin123")
    expect(verifyPasswordSync("admin123", hash)).toBe(true)
  })

  it("rechaza una contraseña incorrecta", () => {
    const hash = hashPasswordSync("admin123")
    expect(verifyPasswordSync("wrong", hash)).toBe(false)
  })

  it("genera salts distintos para el mismo input (no reutiliza)", () => {
    const a = hashPasswordSync("misma")
    const b = hashPasswordSync("misma")
    expect(a).not.toBe(b) // salt distinto → hash distinto
    // pero ambos verifican
    expect(verifyPasswordSync("misma", a)).toBe(true)
    expect(verifyPasswordSync("misma", b)).toBe(true)
  })

  it("rechaza formatos corruptos sin lanzar", () => {
    expect(verifyPasswordSync("x", "")).toBe(false)
    expect(verifyPasswordSync("x", "plain")).toBe(false)
    expect(verifyPasswordSync("x", "scrypt:bad")).toBe(false)
    expect(verifyPasswordSync("x", "md5:ab:cd")).toBe(false)
  })
})
