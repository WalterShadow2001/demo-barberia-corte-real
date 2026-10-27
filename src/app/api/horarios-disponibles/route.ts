import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAvailableSlotsForBarber,
  getAvailableSlotsAnyBarber,
} from "@/lib/booking-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const barberoId = (searchParams.get("barberoId") ?? "").trim();
    const fecha = (searchParams.get("fecha") ?? "").trim();
    const servicioId = (searchParams.get("servicioId") ?? "").trim();

    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return NextResponse.json(
        { error: "Fecha inválida (formato YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!servicioId) {
      return NextResponse.json(
        { error: "servicioId requerido" },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
      select: { duracionMin: true },
    });
    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    if (barberoId && barberoId !== "cualquiera") {
      const slots = await getAvailableSlotsForBarber(
        barberoId,
        fecha,
        servicio
      );
      return NextResponse.json({ slots });
    }
    const slots = await getAvailableSlotsAnyBarber(fecha, servicio);
    return NextResponse.json({ slots });
  } catch (e) {
    console.error("[GET /api/horarios-disponibles]", e);
    return NextResponse.json(
      { error: "Error al obtener horarios disponibles" },
      { status: 500 }
    );
  }
}
