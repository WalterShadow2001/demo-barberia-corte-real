import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(_req: NextRequest, { params }: Params) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const updated = await prisma.testimonio.update({
      where: { id },
      data: { aprobado: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/testimonios/:id/aprobar]", e);
    return NextResponse.json(
      { error: "Error al aprobar testimonio" },
      { status: 500 }
    );
  }
}
