import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ServiceCard } from "@/components/site/service-card";
import { BarberCard } from "@/components/site/barber-card";
import { TestimonialPreview } from "@/components/site/testimonial-preview";
import { CTASection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Scissors, Clock, MapPin, Users, Award, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [servicios, barberos, testimonios] = await Promise.all([
    prisma.servicio.findMany({ take: 4 }),
    prisma.barbero.findMany({ where: { activo: true }, take: 4 }),
    prisma.testimonio.findMany({ where: { aprobado: true }, take: 3 }),
  ]);

  return (
    <SiteShell>
      {/* HERO */}
      <HeroCarousel />

      {/* STATS BAR */}
      <section
        aria-label="Estadísticas"
        className="border-y border-gold/15 bg-[#0a0a0a]"
      >
        <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          <StatItem icon={<Users className="size-5" />} value="+1,200" label="Cortes hechos" />
          <StatItem icon={<Award className="size-5" />} value="4.9" label="Calificación promedio" />
          <StatItem icon={<Scissors className="size-5" />} value="4" label="Barberos expertos" />
          <StatItem icon={<Clock className="size-5" />} value="6 años" label="Sirviendo a Delicias" />
        </div>
      </section>

      {/* SERVICIOS PREVIEW */}
      <section
        id="servicios"
        aria-labelledby="servicios-heading"
        className="container mx-auto max-w-7xl px-4 py-20"
      >
        <SectionHeading
          eyebrow="Lo que hacemos"
          title="Servicios que nos definen"
          subtitle="Desde un corte clásico hasta un paquete completo. Calidad premium en cada servicio."
        />
        {servicios.length === 0 ? (
          <p className="text-center text-[#a3a3a3]">Próximamente publicaremos nuestros servicios.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
            <Link href="/servicios">Ver todos los servicios</Link>
          </Button>
        </div>
      </section>

      {/* BARBEROS HIGHLIGHT */}
      <section
        aria-labelledby="barberos-heading"
        className="border-y border-gold/15 bg-[#0a0a0a] py-20"
      >
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="El equipo"
            title="Manos expertas detrás de cada corte"
            subtitle="Conoce a los barberos que cuidarán tu estilo. Todos con años de experiencia y actitud de servicio."
          />
          {barberos.length === 0 ? (
            <p className="text-center text-[#a3a3a3]">Equipo próximamente.</p>
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
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
              <Link href="/barberos">Conoce al equipo completo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GALERIA CTA */}
      <section aria-labelledby="galeria-heading" className="container mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#1a0a0a] via-[#0f0f0f] to-[#0a0a0a] p-8 sm:p-12 md:p-16">
          <span className="pointer-events-none absolute -right-10 -top-10 text-[18rem] opacity-[0.07]" aria-hidden>
            💈
          </span>
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              Galería
            </span>
            <h2 id="galeria-heading" className="mt-3 font-display text-4xl text-[#f5f5f5] sm:text-5xl md:text-6xl">
              Mira nuestro trabajo <span className="gold-text-gradient">en acción</span>
            </h2>
            <p className="mt-4 text-[#d4d4d4]">
              Recopilamos los mejores cortes, fades y diseños hechos en la barbería.
              Inspírate y cuéntanos qué quieres para tu próxima cita.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gold-gradient text-[#0f0f0f] shadow-gold">
                <Link href="/galeria">Ver galería</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
                <Link href="/reservar">
                  <Calendar className="size-4" /> Reservar ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS PREVIEW */}
      <section
        aria-labelledby="testimonios-heading"
        className="border-y border-gold/15 bg-[#0a0a0a] py-20"
      >
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Lo que dicen"
            title="Testimonios de nuestros clientes"
            subtitle="Delicias confía en nosotros. Esto es lo que opina la banda."
          />
          {testimonios.length === 0 ? (
            <p className="text-center text-[#a3a3a3]">Sé el primero en dejar tu testimonio.</p>
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
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-gold/40 text-cream hover:bg-gold/10 hover:text-cream">
              <Link href="/testimonios">Ver todos los testimonios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </SiteShell>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-full bg-gold/10 text-gold">
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl text-[#f5f5f5]">{value}</p>
        <p className="text-xs uppercase tracking-wider text-[#a3a3a3]">{label}</p>
      </div>
    </div>
  );
}
