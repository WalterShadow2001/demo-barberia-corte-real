"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Scissors, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bgClass: string;
  emoji: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Barbería premium en Delicias, Chihuahua",
    title: "EL ARTE DE",
    highlight: "CORTAR BIEN",
    description:
      "Cortes clásicos, fades y diseños únicos. Hechos por manos que entienden tu estilo.",
    ctaLabel: "Reservar cita",
    ctaHref: "/reservar",
    secondaryLabel: "Ver servicios",
    secondaryHref: "/servicios",
    bgClass:
      "from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]",
    emoji: "✂️",
  },
  {
    eyebrow: "Barberos con experiencia",
    title: "MANOS",
    highlight: "EXPERTAS",
    description:
      "Nuestro equipo combina técnica clásica con tendencias modernas para que salgas sintiéndote bien.",
    ctaLabel: "Conocer al equipo",
    ctaHref: "/barberos",
    secondaryLabel: "Ver galería",
    secondaryHref: "/galeria",
    bgClass:
      "from-[#2a1a0a] via-[#0f0f0f] to-[#0a0a0a]",
    emoji: "💈",
  },
  {
    eyebrow: "Reserva en línea en 4 pasos",
    title: "TU PRÓXIMO",
    highlight: "CORTE TE ESPERA",
    description:
      "Elige servicio, barbero, fecha y hora. Sin llamadas. Sin esperas. Reserva cuando quieras.",
    ctaLabel: "Reservar ahora",
    ctaHref: "/reservar",
    secondaryLabel: "Ver testimonios",
    secondaryHref: "/testimonios",
    bgClass:
      "from-[#1a0a0a] via-[#0f0f0f] to-[#0a0a0a]",
    emoji: "📅",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(id);
    };
  }, [emblaApi]);

  return (
    <section
      aria-label="Presentación principal"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden"
    >
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {SLIDES.map((slide, i) => (
            <article
              key={i}
              className="embla__slide min-w-full"
              aria-hidden={i !== selected}
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${SLIDES.length}`}
            >
              <div
                className={cn(
                  "relative flex min-h-[88vh] flex-col items-start justify-center bg-gradient-to-br px-6 py-20 sm:px-10 md:px-16 lg:px-24",
                  slide.bgClass
                )}
              >
                {/* Decorative giant emoji */}
                <span
                  className="pointer-events-none absolute -right-10 -top-10 select-none text-[28rem] leading-none opacity-[0.06] md:text-[40rem]"
                  aria-hidden
                >
                  {slide.emoji}
                </span>

                {/* Decorative grid */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  aria-hidden
                  style={{
                    backgroundImage:
                      "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />

                <div className="relative z-10 mx-auto w-full max-w-5xl">
                  <div className="flex items-center gap-3 text-gold">
                    <Scissors className="size-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.35em]">
                      {slide.eyebrow}
                    </span>
                  </div>
                  <h1 className="mt-6 font-display text-6xl leading-[0.9] text-[#f5f5f5] sm:text-7xl md:text-8xl lg:text-9xl">
                    {slide.title}
                    <span className="block gold-text-gradient">
                      {slide.highlight}
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-lg text-[#d4d4d4] sm:text-xl">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="gold-gradient text-[#0f0f0f] shadow-gold-lg hover:opacity-90"
                    >
                      <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                    </Button>
                    {slide.secondaryLabel && slide.secondaryHref && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-gold/40 bg-transparent text-cream hover:bg-gold/10 hover:text-cream"
                      >
                        <Link href={slide.secondaryHref}>
                          {slide.secondaryLabel}
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Rating badge */}
                  <div className="mt-10 flex items-center gap-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className="size-5 fill-gold text-gold"
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#a3a3a3]">
                      4.9 · +1,200 cortes en Delicias
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="container absolute bottom-6 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-4 md:bottom-10">
        <div className="flex items-center gap-2" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-selected={selected === i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i
                  ? "w-8 bg-gold"
                  : "w-3 bg-[#525252] hover:bg-[#a3a3a3]"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => emblaApi?.scrollPrev()}
            className="grid size-10 place-items-center rounded-full border border-gold/30 bg-[#0f0f0f]/60 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-[#0f0f0f]"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => emblaApi?.scrollNext()}
            className="grid size-10 place-items-center rounded-full border border-gold/30 bg-[#0f0f0f]/60 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-[#0f0f0f]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
