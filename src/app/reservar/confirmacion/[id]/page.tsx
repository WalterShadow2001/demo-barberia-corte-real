import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Phone,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export const metadata = {
  title: "Confirmación de reserva | Barbería Corte Real",
};

export default async function ConfirmacionPage({ params }: Params) {
  const { id } = await params;
  let reserva:
    | Awaited<ReturnType<typeof prisma.reserva.findUnique>>
    | null = null;
  let dbError: string | null = null;

  try {
    reserva = await prisma.reserva.findUnique({
      where: { id },
      include: { barbero: true, servicio: true },
    });
  } catch (e) {
    console.error(e);
    dbError = "Error al cargar la reserva.";
  }

  if (dbError) {
    return (
      <SiteShell>
        <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-cream">{dbError}</h1>
          <Button asChild className="mt-6 gold-gradient text-[#0f0f0f]">
            <Link href="/reservar">Volver a reservar</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  if (!reserva) {
    notFound();
  }

  const fechaFmt = format(
    parseISO(`${reserva.fecha}T00:00:00`),
    "EEEE d 'de' MMMM 'de' yyyy",
    { locale: es }
  );

  // WhatsApp link to barbería phone.
  const waMessage = encodeURIComponent(
    `Hola, hice una reserva en línea:\n` +
      `• Servicio: ${reserva.servicio.nombre}\n` +
      `• Barbero: ${reserva.barbero.nombre}\n` +
      `• Fecha: ${fechaFmt}\n` +
      `• Hora: ${reserva.hora}\n` +
      `• A nombre de: ${reserva.clienteNombre}\n` +
      `• Tel: ${reserva.clientePhone}\n` +
      `Folio: ${reserva.id.slice(-8).toUpperCase()}`
  );
  const waUrl = `https://wa.me/526394721234?text=${waMessage}`;

  return (
    <SiteShell>
      <section
        aria-labelledby="confirmacion-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 text-center">
          <div className="mx-auto mb-4 grid size-16 animate-in fade-in zoom-in place-items-center rounded-full gold-gradient text-[#0f0f0f] shadow-gold-lg duration-500">
            <CheckCircle2 className="size-8" />
          </div>
          <h1
            id="confirmacion-hero"
            className="font-display text-4xl text-[#f5f5f5] sm:text-5xl md:text-6xl"
          >
            ¡Reserva <span className="gold-text-gradient">confirmada!</span>
          </h1>
          <p className="mt-3 text-[#d4d4d4]">
            Nos vemos pronto. Te esperamos en la barbería.
          </p>
          <p className="mt-2 text-xs text-[#737373]">
            Folio: {reserva.id.slice(-8).toUpperCase()}
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-10">
        <Card className="border-gold/30 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-heading text-xl text-gold">Detalles</h2>
            <Row
              icon={<Scissors className="size-4 text-gold" />}
              label="Servicio"
              value={reserva.servicio.nombre}
              extra={`$${reserva.servicio.precio.toLocaleString(
                "es-MX"
              )} MXN · ${reserva.servicio.duracionMin} min`}
            />
            <Row
              icon={<User className="size-4 text-gold" />}
              label="Barbero"
              value={reserva.barbero.nombre}
              extra={reserva.barbero.especialidad}
            />
            <Row
              icon={<CalendarIcon className="size-4 text-gold" />}
              label="Fecha"
              value={fechaFmt}
            />
            <Row
              icon={<Clock className="size-4 text-gold" />}
              label="Hora"
              value={reserva.hora}
            />
            <Row
              icon={<User className="size-4 text-gold" />}
              label="A nombre de"
              value={reserva.clienteNombre}
            />
            <Row
              icon={<Phone className="size-4 text-gold" />}
              label="Teléfono"
              value={reserva.clientePhone}
            />
            <Row
              icon={<CheckCircle2 className="size-4 text-gold" />}
              label="Estado"
              value={
                reserva.estado.charAt(0).toUpperCase() +
                reserva.estado.slice(1)
              }
            />
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md gold-gradient px-5 py-3 text-[#0f0f0f] font-semibold shadow-gold transition-opacity hover:opacity-90"
          >
            <Phone className="size-4" /> Avisar por WhatsApp
          </a>
          <div className="rounded-md border border-gold/30 bg-[#1a1a1a] p-3 text-sm text-[#d4d4d4]">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-gold" />
              <span>
                Av. Independencia 45, Centro, Delicias, Chihuahua.
                <br />
                Llega 5 minutos antes de tu cita.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
            <Link href="/reservar">Hacer otra reserva</Link>
          </Button>
          <Button asChild variant="ghost" className="text-[#a3a3a3] hover:text-gold">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function Row({
  icon,
  label,
  value,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="flex items-start justify-between border-b border-gold/10 pb-3 last:border-0">
      <div className="flex items-center gap-2 text-[#a3a3a3]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-cream">{value}</p>
        {extra && <p className="text-xs text-[#737373]">{extra}</p>}
      </div>
    </div>
  );
}

// Local motion import to keep page server-side but allow a small client-ish effect.
// (No longer using framer-motion here — kept the page as a pure server component.)
