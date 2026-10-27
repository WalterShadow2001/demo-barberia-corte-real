// Booking helpers — compute available time slots for a barber/date.
import { prisma } from "@/lib/db";

export const SLOT_GRID_MIN = 15; // 15-min grid
export const MIN_LEAD_MIN = 0; // allow booking same hour

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Parse YYYY-MM-DD as a local Date (no UTC shift). */
export function parseDate(fecha: string): Date {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Get day of week from YYYY-MM-DD string (0=Sunday ... 6=Saturday). */
export function getDayOfWeek(fecha: string): number {
  return parseDate(fecha).getDay();
}

/** True if the date is today. */
export function isToday(fecha: string): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  return fecha === today;
}

/** Get current time in minutes for today-only filtering. */
export function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

type BarberHorario = {
  horaInicio: string;
  horaFin: string;
};

type ExistingReserva = {
  hora: string;
  servicio?: { duracionMin: number } | null;
};

type ServicioInput = { duracionMin: number };

/** Generate candidate slot start-times within the barber's working hours. */
function generateCandidateSlots(
  horarios: BarberHorario[],
  service: ServicioInput
): number[] {
  const slots: number[] = [];
  for (const h of horarios) {
    const start = timeToMinutes(h.horaInicio);
    const end = timeToMinutes(h.horaFin);
    // Slot must end by working hour end, so the last valid start is end - duracionMin.
    for (let t = start; t + service.duracionMin <= end; t += SLOT_GRID_MIN) {
      slots.push(t);
    }
  }
  return slots;
}

/** Filter out slots that conflict with existing reservations. */
function filterFreeSlots(
  candidates: number[],
  reservas: ExistingReserva[],
  service: ServicioInput
): number[] {
  const busy: [number, number][] = reservas.map((r) => {
    const start = timeToMinutes(r.hora);
    const dur = r.servicio?.duracionMin ?? 30;
    return [start, start + dur] as [number, number];
  });

  return candidates.filter((c) => {
    const cs = c;
    const ce = c + service.duracionMin;
    // overlap test
    for (const [bs, be] of busy) {
      if (cs < be && bs < ce) return false;
    }
    return true;
  });
}

/**
 * Available slots for a specific barber.
 */
export async function getAvailableSlotsForBarber(
  barberoId: string,
  fecha: string,
  service: ServicioInput
): Promise<string[]> {
  const dia = getDayOfWeek(fecha);
  const [horarios, reservas] = await Promise.all([
    prisma.horarioBarbero.findMany({
      where: { barberoId, diaSemana: dia },
    }),
    prisma.reserva.findMany({
      where: { barberoId, fecha, estado: { not: "cancelada" } },
      include: { servicio: { select: { duracionMin: true } } },
    }),
  ]);

  if (horarios.length === 0) return [];

  const candidates = generateCandidateSlots(horarios, service);
  let free = filterFreeSlots(candidates, reservas, service);

  // If the date is today, filter out past times.
  if (isToday(fecha)) {
    const cutoff = nowMinutes() + MIN_LEAD_MIN;
    free = free.filter((s) => s >= cutoff);
  }
  return free.map(minutesToTime);
}

/**
 * Available slots when the client picked "cualquier barbero".
 * A slot is "available" if at least one active barber is free at that time.
 */
export async function getAvailableSlotsAnyBarber(
  fecha: string,
  service: ServicioInput
): Promise<string[]> {
  const dia = getDayOfWeek(fecha);
  const barberos = await prisma.barbero.findMany({
    where: { activo: true },
    include: {
      horarios: { where: { diaSemana: dia } },
    },
  });

  // Build a set of working intervals across all barbers.
  // For each 15-min slot in the union of working intervals, check if at least
  // one barber is free.
  const allHorarios = barberos.flatMap((b) => b.horarios);
  if (allHorarios.length === 0) return [];

  const candidates = generateCandidateSlots(allHorarios, service);

  // For each candidate slot, check if any barber is free at that slot.
  // We need the reservations for each barber.
  const reservasByBarbero = await prisma.reserva.findMany({
    where: {
      fecha,
      estado: { not: "cancelada" },
      barbero: { activo: true },
    },
    include: { servicio: { select: { duracionMin: true } } },
  });

  // Group reservations by barberoId.
  const reservasMap = new Map<string, ExistingReserva[]>();
  for (const r of reservasByBarbero) {
    const list = reservasMap.get(r.barberoId) ?? [];
    list.push(r);
    reservasMap.set(r.barberoId, list);
  }

  const freeSlots = candidates.filter((slot) => {
    const cs = slot;
    const ce = slot + service.duracionMin;
    for (const b of barberos) {
      if (b.horarios.length === 0) continue;
      // Check that slot fits within this barber's working hours.
      const fits = b.horarios.some((h) => {
        const hs = timeToMinutes(h.horaInicio);
        const he = timeToMinutes(h.horaFin);
        return cs >= hs && ce <= he;
      });
      if (!fits) continue;
      // Check no conflict with their reservations.
      const rsv = reservasMap.get(b.id) ?? [];
      const conflict = rsv.some((r) => {
        const bs = timeToMinutes(r.hora);
        const be = bs + (r.servicio?.duracionMin ?? 30);
        return cs < be && bs < ce;
      });
      if (!conflict) return true; // this barber is free at this slot
    }
    return false;
  });

  let result = freeSlots;
  if (isToday(fecha)) {
    const cutoff = nowMinutes() + MIN_LEAD_MIN;
    result = result.filter((s) => s >= cutoff);
  }
  return result.map(minutesToTime);
}

/** True if the given slot is still available for the given barber+date. */
export async function isSlotAvailable(
  barberoId: string,
  fecha: string,
  hora: string,
  service: ServicioInput
): Promise<boolean> {
  const slots =
    barberoId === "cualquiera"
      ? await getAvailableSlotsAnyBarber(fecha, service)
      : await getAvailableSlotsForBarber(barberoId, fecha, service);
  return slots.includes(hora);
}

/** For "cualquiera": find the first barber who is actually free for the slot.
 * Returns the barberoId or null if none free. */
export async function findFreeBarberForSlot(
  fecha: string,
  hora: string,
  service: ServicioInput
): Promise<string | null> {
  const dia = getDayOfWeek(fecha);
  const slotStart = timeToMinutes(hora);
  const slotEnd = slotStart + service.duracionMin;

  const barberos = await prisma.barbero.findMany({
    where: { activo: true },
    include: {
      horarios: { where: { diaSemana: dia } },
    },
  });

  const reservasByBarbero = await prisma.reserva.findMany({
    where: {
      fecha,
      estado: { not: "cancelada" },
      barbero: { activo: true },
    },
    include: { servicio: { select: { duracionMin: true } } },
  });
  const reservasMap = new Map<string, ExistingReserva[]>();
  for (const r of reservasByBarbero) {
    const list = reservasMap.get(r.barberoId) ?? [];
    list.push(r);
    reservasMap.set(r.barberoId, list);
  }

  for (const b of barberos) {
    if (b.horarios.length === 0) continue;
    const fits = b.horarios.some((h) => {
      const hs = timeToMinutes(h.horaInicio);
      const he = timeToMinutes(h.horaFin);
      return slotStart >= hs && slotEnd <= he;
    });
    if (!fits) continue;
    const rsv = reservasMap.get(b.id) ?? [];
    const conflict = rsv.some((r) => {
      const bs = timeToMinutes(r.hora);
      const be = bs + (r.servicio?.duracionMin ?? 30);
      return slotStart < be && bs < slotEnd;
    });
    if (!conflict) return b.id;
  }
  return null;
}
