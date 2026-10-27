import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: [{ aprobado: "asc" }, { rating: "desc" }],
    });
    return NextResponse.json(testimonios);
  } catch (e) {
    console.error("[GET /api/testimonios/todas]", e);
    return NextResponse.json(
      { error: "Error al obtener testimonios" },
      { status: 500 }
    );
  }
}
