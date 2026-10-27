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
    if (typeof body?.foto === "string") data.foto = body.foto.trim();
    if (typeof body?.especialidad === "string")
      data.especialidad = body.especialidad.trim();
    if (typeof body?.rating === "number") data.rating = body.rating;
    if (typeof body?.activo === "boolean") data.activo = body.activo;

    // Horarios (optional): replace whole set.
    if (Array.isArray(body?.horarios)) {
      await prisma.horarioBarbero.deleteMany({ where: { barberoId: id } });
      for (const h of body.horarios) {
        const dia = Number(h?.diaSemana);
        const inicio = String(h?.horaInicio ?? "").trim();
        const fin = String(h?.horaFin ?? "").trim();
        if (
          Number.isInteger(dia) &&
          dia >= 0 &&
          dia <= 6 &&
          inicio &&
          fin
        ) {
          await prisma.horarioBarbero.create({
            data: {
              barberoId: id,
              diaSemana: dia,
              horaInicio: inicio,
              horaFin: fin,
            },
          });
        }
      }
    }

    const updated = await prisma.barbero.update({
      where: { id },
      data,
      include: { horarios: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/barberos/:id]", e);
    return NextResponse.json(
      { error: "Error al actualizar barbero" },
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
    const reservas = await prisma.reserva.count({
      where: { barberoId: id },
    });
    if (reservas > 0) {
      // Soft delete: deactivate instead of removing FK rows.
      await prisma.barbero.update({
        where: { id },
        data: { activo: false },
      });
      return NextResponse.json({
        ok: true,
        soft: true,
        message: `Barbero desactivado (tenía ${reservas} reservas).`,
      });
    }
    await prisma.barbero.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/barberos/:id]", e);
    return NextResponse.json(
      { error: "Error al eliminar barbero" },
      { status: 500 }
    );
  }
}
