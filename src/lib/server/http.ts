import { NextResponse } from "next/server"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

export function badRequest(message = "Solicitud inválida") {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function unauthorized(message = "No autorizado") {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = "Acceso denegado") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = "No encontrado") {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function conflict(message = "Conflicto") {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function serverError(message = "Error del servidor") {
  return NextResponse.json({ error: message }, { status: 500 })
}
