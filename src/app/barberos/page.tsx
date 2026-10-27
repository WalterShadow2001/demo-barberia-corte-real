import { SiteShell } from "@/components/site/site-shell";
import { BarberCard } from "@/components/site/barber-card";
import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Barberos | Barbería Corte Real",
  description:
    "Conoce al equipo de barberos de Corte Real en Delicias, Chihuahua. Experiencia, especialidad y calificaciones.",
};

export default async function BarberosPage() {
  let barberos: Awaited<ReturnType<typeof prisma.barbero.findMany>> = [];
  let err: string | null = null;
  try {
    barberos = await prisma.barbero.findMany({
      where: { activo: true },
      orderBy: { rating: "desc" },
    });
  } catch (e) {
    console.error(e);
    err = "No pudimos cargar el equipo. Intenta más tarde.";
  }

  return (
    <SiteShell>
      <section
        aria-labelledby="barberos-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            El equipo
          </span>
          <h1
            id="barberos-hero"
            className="mt-3 font-display text-5xl text-[#f5f5f5] sm:text-6xl md:text-7xl"
          >
            Manos <span className="gold-text-gradient">expertas</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[#d4d4d4]">
            Conoce a los barberos que cuidarán tu estilo. Cada uno con su
            especialidad y su trato único.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Equipo"
          title="Nuestros barberos"
          subtitle="Reserva directo con tu barbero favorito, o elige &ldquo;cualquier barbero&rdquo; al reservar para mayor disponibilidad."
        />
        {err ? (
          <p className="text-center text-[#a3a3a3]">{err}</p>
        ) : barberos.length === 0 ? (
          <p className="text-center text-[#a3a3a3]">Próximamente presentaremos al equipo.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barberos.map((b, i) => (
              <BarberCard
                key={b.id}
                barbero={{
                  id: b.id,
                  nombre: b.nombre,
                  foto: b.foto,
                  especialidad: b.especialidad,
                  rating: b.rating,
                  activo: b.activo,
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </SiteShell>
  );
}
