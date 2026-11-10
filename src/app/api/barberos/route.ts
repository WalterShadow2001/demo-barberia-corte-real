import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const barberos = await prisma.barbero.findMany({
      where: { activo: true },
      include: { horarios: { where: { activo: true } } },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(barberos);
  } catch (e) {
    console.error("GET /api/barberos error:", e);
    return NextResponse.json(
      { error: "No se pudieron cargar los barberos" },
      { status: 500 }
    );
  }
}
