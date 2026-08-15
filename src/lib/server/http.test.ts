import { describe, expect, it } from "bun:test"
import {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
} from "./http"

// These helpers wrap NextResponse.json. Under bun, NextResponse resolves to
// the runtime Response, so we assert on status + decoded JSON body.

async function body(res: Response) {
  return res.json()
}

describe("http helpers", () => {
  it("ok devuelve 200 con el payload", async () => {
    const res = ok({ a: 1 })
    expect(res.status).toBe(200)
    expect(await body(res)).toEqual({ a: 1 })
  })

  it("ok respeta un status personalizado", async () => {
    const res = ok({ id: "x" }, 201)
    expect(res.status).toBe(201)
  })

  it("created devuelve 201", async () => {
    const res = created({ id: "x" })
    expect(res.status).toBe(201)
    expect(await body(res)).toEqual({ id: "x" })
  })

  it("badRequest devuelve 400 con { error }", async () => {
    const res = badRequest("mal")
    expect(res.status).toBe(400)
    expect(await body(res)).toEqual({ error: "mal" })
  })

  it("badRequest usa mensaje por defecto", async () => {
    expect((await body(badRequest())).error).toBe("Solicitud inválida")
  })

  it("unauthorized devuelve 401", async () => {
    expect(unauthorized().status).toBe(401)
    expect((await body(unauthorized("no"))).error).toBe("no")
  })

  it("forbidden devuelve 403", async () => {
    expect(forbidden().status).toBe(403)
  })

  it("notFound devuelve 404", async () => {
    expect(notFound().status).toBe(404)
  })

  it("conflict devuelve 409", async () => {
    expect(conflict().status).toBe(409)
  })

  it("serverError devuelve 500", async () => {
    expect(serverError().status).toBe(500)
    expect((await body(serverError())).error).toBe("Error del servidor")
  })
})
