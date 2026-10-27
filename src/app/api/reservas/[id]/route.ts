import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: { barbero: true, servicio: true },
    });
    if (!reserva) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(reserva);
  } catch (e) {
    console.error("[GET /api/reservas/:id]", e);
    return NextResponse.json(
      { error: "Error al obtener reserva" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const estado = String(body?.estado ?? "").trim();

    if (!["pendiente", "completada", "cancelada"].includes(estado)) {
      return NextResponse.json(
        { error: "Estado inválido (pendiente | completada | cancelada)" },
        { status: 400 }
      );
    }

    const updated = await prisma.reserva.update({
      where: { id },
      data: { estado },
      include: { barbero: true, servicio: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/reservas/:id]", e);
    return NextResponse.json(
      { error: "Error al actualizar reserva" },
      { status: 500 }
    );
  }
}
