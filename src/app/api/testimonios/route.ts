import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { aprobado: true },
      orderBy: { rating: "desc" },
    });
    return NextResponse.json(testimonios);
  } catch (e) {
    console.error("[GET /api/testimonios]", e);
    return NextResponse.json(
      { error: "Error al obtener testimonios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const autor = String(body?.autor ?? "").trim();
    const texto = String(body?.texto ?? "").trim();
    const ratingRaw = Number(body?.rating);
    const rating = Number.isInteger(ratingRaw) ? ratingRaw : 0;

    if (!autor || !texto) {
      return NextResponse.json(
        { error: "Nombre y testimonio son obligatorios" },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Calificación debe estar entre 1 y 5" },
        { status: 400 }
      );
    }
    if (autor.length > 100) {
      return NextResponse.json(
        { error: "Nombre muy largo (máx 100)" },
        { status: 400 }
      );
    }
    if (texto.length > 500) {
      return NextResponse.json(
        { error: "Testimonio muy largo (máx 500)" },
        { status: 400 }
      );
    }

    const created = await prisma.testimonio.create({
      data: { autor, texto, rating, aprobado: false },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/testimonios]", e);
    return NextResponse.json(
      { error: "Error al crear testimonio" },
      { status: 500 }
    );
  }
}
