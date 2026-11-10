import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const { estado } = await req.json();
    const valid = ["pendiente", "confirmada", "completada", "cancelada"];
    if (!valid.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    const updated = await prisma.cita.update({
      where: { id },
      data: { estado },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/admin/citas/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo actualizar la cita" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.cita.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/citas/[id] error:", e);
    return NextResponse.json(
      { error: "No se pudo eliminar la cita" },
      { status: 500 }
    );
  }
}
