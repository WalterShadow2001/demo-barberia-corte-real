import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { orden: "asc" },
    });
    return NextResponse.json(servicios);
  } catch (e) {
    console.error("GET /api/servicios error:", e);
    return NextResponse.json(
      { error: "No se pudieron cargar los servicios" },
      { status: 500 }
    );
  }
}
