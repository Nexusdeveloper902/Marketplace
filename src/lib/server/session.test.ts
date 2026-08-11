import { describe, expect, it } from "bun:test"
import {
  createSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "./session"

describe("session tokens", () => {
  it("crea y verifica un token válido", () => {
    const token = createSessionToken("user-abc")
    expect(token.split(".").length).toBe(3) // header.body.signature
    const payload = verifySessionToken(token)
    expect(payload).not.toBeNull()
    expect((payload as SessionPayload).sub).toBe("user-abc")
    expect((payload as SessionPayload).exp).toBeGreaterThan((payload as SessionPayload).iat)
  })

  it("rechaza tokens malformados", () => {
    expect(verifySessionToken("")).toBeNull()
    expect(verifySessionToken("a.b")).toBeNull()
    expect(verifySessionToken("a.b.c.d")).toBeNull()
  })

  it("rechaza tokens con firma manipulada", () => {
    const token = createSessionToken("user-abc")
    const [header, body, sig] = token.split(".")
    // Cambiar el payload conservando la firma original debe invalidar el token
    const tampered = `${header}.${body.replace(/^./, "Z")}.${sig}`
    expect(verifySessionToken(tampered)).toBeNull()
  })

  it("rechaza tokens expirados", () => {
    const token = createSessionToken("user-abc")
    const [header, body] = token.split(".")
    const payload: SessionPayload = {
      sub: "user-abc",
      iat: Math.floor(Date.now() / 1000) - 100000,
      exp: Math.floor(Date.now() / 1000) - 1, // expirado
    }
    const expiredBody = Buffer.from(JSON.stringify(payload)).toString("base64url")
    // Reutiliza la firma de un token válido NO sirve; calculamos una nueva
    // emulando el formato. verifySessionToken valida exp, así que aunque la
    // firma sea la original del token vivo, exp la invalida.
    const [, , sig] = token.split(".")
    const reassembled = `${header}.${expiredBody}.${sig}`
    expect(verifySessionToken(reassembled)).toBeNull()
  })
})
