import Link from "next/link";
import { Calendar, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="container mx-auto max-w-7xl px-4 py-20"
    >
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] p-8 text-center sm:p-12 md:p-16">
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-4 flex justify-center">
            <span className="grid size-14 place-items-center rounded-full gold-gradient text-[#0f0f0f] shadow-gold">
              <Scissors className="size-7" />
            </span>
          </div>
          <h2
            id="cta-heading"
            className="font-display text-4xl text-[#f5f5f5] sm:text-5xl md:text-6xl"
          >
            ¿Listo para tu <span className="gold-text-gradient">próximo corte</span>?
          </h2>
          <p className="mt-4 text-[#d4d4d4]">
            Reserva tu cita en menos de un minuto. Sin llamadas. Sin esperas.
            Tú eliges el servicio, el barbero, la fecha y la hora.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gold-gradient text-[#0f0f0f] shadow-gold-lg">
              <Link href="/reservar">
                <Calendar className="size-4" /> Reservar cita ahora
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
              <Link href="/servicios">Ver servicios</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
