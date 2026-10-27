import { SiteShell } from "@/components/site/site-shell";
import { ServiceCard } from "@/components/site/service-card";
import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Servicios | Barbería Corte Real",
  description:
    "Catálogo completo de servicios: corte clásico, fade, arreglo de barba, diseño de ceja, paquete completo y corte niño.",
};

export default async function ServiciosPage() {
  let servicios: Awaited<ReturnType<typeof prisma.servicio.findMany>> = [];
  let err: string | null = null;
  try {
    servicios = await prisma.servicio.findMany({
      orderBy: [{ precio: "asc" }, { nombre: "asc" }],
    });
  } catch (e) {
    console.error(e);
    err = "No pudimos cargar los servicios. Intenta de nuevo más tarde.";
  }

  return (
    <SiteShell>
      <section
        aria-labelledby="servicios-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Servicios
          </span>
          <h1
            id="servicios-hero"
            className="mt-3 font-display text-5xl text-[#f5f5f5] sm:text-6xl md:text-7xl"
          >
            Lo que <span className="gold-text-gradient">hacemos</span> por ti
          </h1>
          <p className="mt-4 max-w-2xl text-[#d4d4d4]">
            Todos los servicios están pensados para que salgas con un corte a la
            altura de tu estilo. Precios claros, sin sorpresas.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Catálogo"
          title="Servicios disponibles"
          subtitle="Haz clic en cualquier tarjeta para reservar directamente ese servicio."
        />
        {err ? (
          <p className="text-center text-[#a3a3a3]">{err}</p>
        ) : servicios.length === 0 ? (
          <p className="text-center text-[#a3a3a3]">
            Próximamente publicaremos el catálogo completo.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s, i) => (
              <ServiceCard
                key={s.id}
                servicio={{
                  id: s.id,
                  nombre: s.nombre,
                  descripcion: s.descripcion,
                  precio: s.precio,
                  duracionMin: s.duracionMin,
                  icono: s.icono,
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
