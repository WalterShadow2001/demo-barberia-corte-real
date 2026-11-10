import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { visible: true },
      orderBy: { fecha: "desc" },
      take: 12,
    });
    return NextResponse.json(testimonios);
  } catch (e) {
    console.error("GET /api/testimonios error:", e);
    return NextResponse.json(
      { error: "No se pudieron cargar los testimonios" },
      { status: 500 }
    );
  }
}
