import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TIME_SLOTS } from "@/lib/info";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberoId = searchParams.get("barberoId");
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD

    if (!barberoId || !fecha) {
      return NextResponse.json(
        { error: "barberoId y fecha son requeridos" },
        { status: 400 }
      );
    }

    const ocupadas = await prisma.cita.findMany({
      where: { barberoId, fecha, estado: { not: "cancelada" } },
      select: { hora: true },
    });
    const ocupadasSet = new Set(ocupadas.map((c) => c.hora));

    const fechaObj = new Date(fecha + "T00:00:00");
    const diaSemana = fechaObj.getDay();

    const barbero = await prisma.barbero.findUnique({
      where: { id: barberoId },
      include: { horarios: true },
    });

    const horario = barbero?.horarios.find(
      (h) => h.diaSemana === diaSemana && h.activo
    );

    let disponibles: string[] = [];
    if (horario) {
      disponibles = TIME_SLOTS.filter((slot) => {
        if (ocupadasSet.has(slot)) return false;
        return slot >= horario.horaInicio && slot < horario.horaFin;
      });
    }

    return NextResponse.json({
      fecha,
      barberoId,
      disponibles,
      ocupadas: Array.from(ocupadasSet),
      laborable: !!horario,
      diaSemana,
    });
  } catch (e) {
    console.error("GET /api/citas/disponibilidad error:", e);
    return NextResponse.json(
      { error: "No se pudo verificar disponibilidad" },
      { status: 500 }
    );
  }
}
