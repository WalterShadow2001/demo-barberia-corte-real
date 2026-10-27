import { SiteShell } from "@/components/site/site-shell";
import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimonialPreview } from "@/components/site/testimonial-preview";
import { TestimonioForm } from "@/components/site/testimonio-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonios | Barbería Corte Real",
  description:
    "Testimonios de nuestros clientes en Delicias, Chihuahua. Déjanos tu opinión sobre nuestro servicio.",
};

export default async function TestimoniosPage() {
  let testimonios: Awaited<ReturnType<typeof prisma.testimonio.findMany>> = [];
  let err: string | null = null;
  try {
    testimonios = await prisma.testimonio.findMany({
      where: { aprobado: true },
      orderBy: [{ rating: "desc" }, { autor: "asc" }],
    });
  } catch (e) {
    console.error(e);
    err = "No pudimos cargar los testimonios. Intenta más tarde.";
  }

  return (
    <SiteShell>
      <section
        aria-labelledby="testimonios-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Testimonios
          </span>
          <h1
            id="testimonios-hero"
            className="mt-3 font-display text-5xl text-[#f5f5f5] sm:text-6xl md:text-7xl"
          >
            Lo que <span className="gold-text-gradient">dicen</span> de nosotros
          </h1>
          <p className="mt-4 max-w-2xl text-[#d4d4d4]">
            La mejor recomendación viene de quienes ya nos conocen. Si ya
            viniste, déjanos tu testimonio abajo.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Opiniones"
          title="Testimonios aprobados"
          subtitle="Mostramos solo los testimonios revisados por el equipo para evitar spam."
        />
        {err ? (
          <p className="text-center text-[#a3a3a3]">{err}</p>
        ) : testimonios.length === 0 ? (
          <p className="text-center text-[#a3a3a3]">
            Aún no hay testimonios aprobados. Sé el primero.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonios.map((t, i) => (
              <TestimonialPreview
                key={t.id}
                autor={t.autor}
                texto={t.texto}
                rating={t.rating}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <section
        aria-labelledby="dejar-testimonio"
        className="border-t border-gold/15 bg-[#0a0a0a] py-16"
      >
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Cuéntanos"
            title="Deja tu testimonio"
            subtitle="Tu opinión nos ayuda a mejorar y a que más gente confíe en nosotros."
          />
          <TestimonioForm />
        </div>
      </section>

      <CTASection />
    </SiteShell>
  );
}
