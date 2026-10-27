import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const soloActivos = searchParams.get("activo") === "true";
    const barberos = await prisma.barbero.findMany({
      where: soloActivos ? { activo: true } : undefined,
      orderBy: { nombre: "asc" },
      include: { horarios: true },
    });
    return NextResponse.json(barberos);
  } catch (e) {
    console.error("[GET /api/barberos]", e);
    return NextResponse.json(
      { error: "Error al obtener barberos" },
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
    const foto = String(body?.foto ?? "").trim();
    const especialidad = String(body?.especialidad ?? "").trim();
    const rating = body?.rating !== undefined ? Number(body.rating) : 5.0;
    const activo = body?.activo !== undefined ? Boolean(body.activo) : true;

    if (!nombre || !foto || !especialidad) {
      return NextResponse.json(
        { error: "Datos inválidos o incompletos" },
        { status: 400 }
      );
    }
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "Rating debe estar entre 0 y 5" },
        { status: 400 }
      );
    }

    const created = await prisma.barbero.create({
      data: { nombre, foto, especialidad, rating, activo },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/barberos]", e);
    return NextResponse.json(
      { error: "Error al crear barbero" },
      { status: 500 }
    );
  }
}
