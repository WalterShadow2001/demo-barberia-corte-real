import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (typeof body?.nombre === "string") data.nombre = body.nombre.trim();
    if (typeof body?.descripcion === "string")
      data.descripcion = body.descripcion.trim();
    if (typeof body?.precio === "number") data.precio = body.precio;
    if (typeof body?.duracionMin === "number") data.duracionMin = body.duracionMin;
    if (body?.icono !== undefined)
      data.icono = body.icono ? String(body.icono) : null;

    if (data.precio !== undefined && Number(data.precio) < 0) {
      return NextResponse.json(
        { error: "Precio debe ser positivo" },
        { status: 400 }
      );
    }
    if (
      data.duracionMin !== undefined &&
      Number(data.duracionMin) <= 0
    ) {
      return NextResponse.json(
        { error: "Duración debe ser mayor a 0" },
        { status: 400 }
      );
    }

    const updated = await prisma.servicio.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/servicios/:id]", e);
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    // Check if there are reservations depending on this service.
    const reservas = await prisma.reserva.count({
      where: { servicioId: id },
    });
    if (reservas > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar: ${reservas} reservas dependen de este servicio.`,
        },
        { status: 400 }
      );
    }
    await prisma.servicio.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/servicios/:id]", e);
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 }
    );
  }
}
