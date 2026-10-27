import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(servicios);
  } catch (e) {
    console.error("[GET /api/servicios]", e);
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const nombre = String(body?.nombre ?? "").trim();
    const descripcion = String(body?.descripcion ?? "").trim();
    const precio = Number(body?.precio);
    const duracionMin = parseInt(String(body?.duracionMin), 10);
    const icono = body?.icono ? String(body.icono) : null;

    if (!nombre || !descripcion || Number.isNaN(precio) || Number.isNaN(duracionMin)) {
      return NextResponse.json(
        { error: "Datos inválidos o incompletos" },
        { status: 400 }
      );
    }
    if (precio < 0 || duracionMin <= 0) {
      return NextResponse.json(
        { error: "Precio y duración deben ser positivos" },
        { status: 400 }
      );
    }

    const created = await prisma.servicio.create({
      data: { nombre, descripcion, precio, duracionMin, icono },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/servicios]", e);
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}
