import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    const citas = await prisma.cita.findMany({
      include: { barbero: true, servicio: true },
      orderBy: { creadoEn: "desc" },
      take: 200,
    });
    return NextResponse.json(citas);
  } catch (e) {
    console.error("GET /api/admin/citas error:", e);
    return NextResponse.json(
      { error: "No se pudieron cargar las citas" },
      { status: 500 }
    );
  }
}
