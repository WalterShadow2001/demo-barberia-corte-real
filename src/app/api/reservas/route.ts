import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import {
  isSlotAvailable,
  findFreeBarberForSlot,
  parseDate,
} from "@/lib/booking-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha") ?? undefined;
    const estado = searchParams.get("estado") ?? undefined;
    const barberoId = searchParams.get("barberoId") ?? undefined;

    const where: Record<string, unknown> = {};
    if (fecha) where.fecha = fecha;
    if (estado) where.estado = estado;
    if (barberoId) where.barberoId = barberoId;

    const reservas = await prisma.reserva.findMany({
      where,
      include: { barbero: true, servicio: true },
      orderBy: [{ fecha: "desc" }, { hora: "desc" }],
    });
    return NextResponse.json(reservas);
  } catch (e) {
    console.error("[GET /api/reservas]", e);
    return NextResponse.json(
      { error: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clienteNombre = String(body?.clienteNombre ?? "").trim();
    const clientePhone = String(body?.clientePhone ?? "").trim();
    const barberoIdRaw = String(body?.barberoId ?? "").trim();
    const servicioId = String(body?.servicioId ?? "").trim();
    const fecha = String(body?.fecha ?? "").trim();
    const hora = String(body?.hora ?? "").trim();

    if (!clienteNombre || !clientePhone || !servicioId || !fecha || !hora) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return NextResponse.json(
        { error: "Fecha inválida (YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!/^\d{2}:\d{2}$/.test(hora)) {
      return NextResponse.json(
        { error: "Hora inválida (HH:mm)" },
        { status: 400 }
      );
    }
    // Phone: at least 7 digits
    if (!/[\d\s+-]{7,}/.test(clientePhone)) {
      return NextResponse.json(
        { error: "Teléfono inválido" },
        { status: 400 }
      );
    }
    // No past date.
    const date = parseDate(fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return NextResponse.json(
        { error: "No se puede reservar en una fecha pasada" },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
    });
    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Determine the actual barberoId to use.
    let barberoId = barberoIdRaw;
    if (!barberoId || barberoId === "cualquiera") {
      const free = await findFreeBarberForSlot(fecha, hora, servicio);
      if (!free) {
        return NextResponse.json(
          {
            error:
              "Ningún barbero está disponible en esa fecha y hora. Elige otra hora.",
          },
          { status: 409 }
        );
      }
      barberoId = free;
    } else {
      // Validate the barber exists and is active.
      const b = await prisma.barbero.findUnique({ where: { id: barberoId } });
      if (!b || !b.activo) {
        return NextResponse.json(
          { error: "Barbero no disponible" },
          { status: 400 }
        );
      }
    }

    // Validate slot is available.
    const ok = await isSlotAvailable(barberoId, fecha, hora, servicio);
    if (!ok) {
      return NextResponse.json(
        { error: "Ese horario acaba de ser reservado. Elige otro." },
        { status: 409 }
      );
    }

    const reserva = await prisma.reserva.create({
      data: {
        clienteNombre,
        clientePhone,
        barberoId,
        servicioId,
        fecha,
        hora,
        estado: "pendiente",
      },
      include: { barbero: true, servicio: true },
    });
    return NextResponse.json(reserva, { status: 201 });
  } catch (e) {
    console.error("[POST /api/reservas]", e);
    return NextResponse.json(
      { error: "Error al crear reserva" },
      { status: 500 }
    );
  }
}
