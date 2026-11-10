import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { orden: "asc" },
    });
    return NextResponse.json(servicios);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : "";
    console.error("GET /api/servicios error:", err);
    return NextResponse.json(
      { error: "No se pudieron cargar los servicios", detail: err, stack: stack?.slice(0, 500) },
      { status: 500 }
    );
  }
}
