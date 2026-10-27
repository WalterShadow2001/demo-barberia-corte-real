import { SiteShell } from "@/components/site/site-shell";
import { CTASection } from "@/components/site/cta-section";
import { GalleryGrid } from "@/components/site/gallery-grid";

export const metadata = {
  title: "Galería | Barbería Corte Real",
  description:
    "Galería de trabajos realizados en Barbería Corte Real: fades, cortes clásicos, barbas y diseños creativos.",
};

export default function GaleriaPage() {
  return (
    <SiteShell>
      <section
        aria-labelledby="galeria-hero"
        className="border-b border-gold/15 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Galería
          </span>
          <h1
            id="galeria-hero"
            className="mt-3 font-display text-5xl text-[#f5f5f5] sm:text-6xl md:text-7xl"
          >
            Nuestro <span className="gold-text-gradient">trabajo</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[#d4d4d4]">
            Una selección de cortes, fades, barbas y diseños hechos en la
            barbería. Haz clic en cualquier imagen para verla en grande.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12">
        <GalleryGrid />
      </section>

      <CTASection />
    </SiteShell>
  );
}
