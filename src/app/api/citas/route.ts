import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TIME_SLOTS } from "@/lib/info";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clienteNombre,
      clienteTelefono,
      clienteEmail,
      barberoId,
      servicioId,
      fecha,
      hora,
      notas,
    } = body ?? {};

    if (
      !clienteNombre ||
      !clienteTelefono ||
      !barberoId ||
      !servicioId ||
      !fecha ||
      !hora
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    if (!TIME_SLOTS.includes(hora)) {
      return NextResponse.json(
        { error: "Hora inválida" },
        { status: 400 }
      );
    }

    // Validar que el slot no esté ocupado
    const existe = await prisma.cita.findFirst({
      where: {
        barberoId,
        fecha,
        hora,
        estado: { not: "cancelada" },
      },
    });
    if (existe) {
      return NextResponse.json(
        { error: "Ese horario ya está reservado. Elige otro." },
        { status: 409 }
      );
    }

    const cita = await prisma.cita.create({
      data: {
        clienteNombre,
        clienteTelefono,
        clienteEmail: clienteEmail || null,
        barberoId,
        servicioId,
        fecha,
        hora,
        notas: notas || null,
        estado: "pendiente",
      },
      include: {
        barbero: true,
        servicio: true,
      },
    });

    return NextResponse.json({ ok: true, cita }, { status: 201 });
  } catch (e) {
    console.error("POST /api/citas error:", e);
    return NextResponse.json(
      { error: "No se pudo crear la cita" },
      { status: 500 }
    );
  }
}
