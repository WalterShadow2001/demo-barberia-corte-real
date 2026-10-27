import { Suspense } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { ReservationStepper } from "@/components/site/reservation-stepper";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Reservar cita | Barbería Corte Real",
  description:
    "Reserva tu cita en línea en 4 pasos. Elige servicio, barbero, fecha y hora.",
};

export const dynamic = "force-dynamic";

export default function ReservarPage() {
  return (
    <SiteShell>
      <section
        aria-labelledby="reservar-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Reserva
          </span>
          <h1
            id="reservar-hero"
            className="mt-3 font-display text-4xl text-[#f5f5f5] sm:text-5xl md:text-6xl"
          >
            Agenda tu <span className="gold-text-gradient">próximo corte</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[#d4d4d4]">
            Cuatro pasos. Menos de un minuto. Sin llamadas.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-10">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="size-8 animate-spin text-gold" />
              <span className="ml-3 text-[#a3a3a3]">Cargando…</span>
            </div>
          }
        >
          <ReservationStepper />
        </Suspense>
      </section>
    </SiteShell>
  );
}
