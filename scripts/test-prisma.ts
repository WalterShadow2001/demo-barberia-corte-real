import { prisma } from "../src/lib/db";
const s = await prisma.servicio.findMany();
console.log("Servicios:", s.length);
const b = await prisma.barbero.findMany({ include: { horarios: true } });
console.log("Barberos:", b.length, "with horarios:", b[0]?.horarios.length);
const r = await prisma.reserva.findMany({ include: { barbero: true, servicio: true } });
console.log("Reservas:", r.length);
const t = await prisma.testimonio.findMany();
console.log("Testimonios:", t.length);
