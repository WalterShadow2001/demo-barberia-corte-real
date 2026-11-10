"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GaleriaItem = {
  src: string;
  alt: string;
  title: string;
  tag: string;
};

// Real barbershop / haircut photos fetched via `z-ai image-search` (ZAI in-house OSS-hosted URLs).
// 12 images across 6 categories (2 per category) — fades, classic cuts, beard grooming,
// hair design, kids cuts, and barber tools.
const GALERIA: GaleriaItem[] = [
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d6e2a6bc3c8.jpg", alt: "Fade degradado moderno en corte de hombre con cabello corto", title: "Fade Degradado", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/137c6618978a.jpg", alt: "Corte fade degradado lateral con detalle en la parte alta", title: "Fade Degradado", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ec329407dfe.jpg", alt: "Corte clásico de caballero en barbershop con acabado de navaja", title: "Corte Clásico", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a57aaa2a63e4.png", alt: "Corte clásico texturizado con peine y tijera en barbershop", title: "Corte Clásico", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ff50f4ddbb92.jpg", alt: "Arreglo de barba perfilada con navaja por barbero profesional", title: "Arreglo de Barba", tag: "Barba" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f277106d1d90.jpeg", alt: "Perfilado de barba con toalla caliente en barbershop premium", title: "Arreglo de Barba", tag: "Barba" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5e624188815e.jpg", alt: "Diseño y líneas decorativas talladas con navaja sobre el degradado", title: "Diseño y Líneas", tag: "Detalles" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/82e4f867717f.jpg", alt: "Detalle de líneas y diseño artístico de barbería sobre fade", title: "Diseño y Líneas", tag: "Detalles" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d027e10037f4.jpg", alt: "Corte infantil en niño con acabado limpio en barbershop", title: "Corte Infantil", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a7a700f6b701.jpg", alt: "Niño recibiendo corte de cabello en silla de barbero", title: "Corte Infantil", tag: "Cortes" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ecb110bc9048.jpg", alt: "Herramientas del oficio: tijeras, navaja y peine sobre superficie oscura", title: "Herramientas del Oficio", tag: "Detalles" },
  { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/751bf26f4210.jpg", alt: "Flat lay de herramientas de barbería: tijeras, navaja y cepillo", title: "Herramientas del Oficio", tag: "Detalles" },
];

export default function GaleriaPage() {
  const [filter, setFilter] = React.useState<string>("Todo");
  const tags = ["Todo", ...Array.from(new Set(GALERIA.map((g) => g.tag)))];
  const items = filter === "Todo" ? GALERIA : GALERIA.filter((g) => g.tag === filter);

  return (
    <>
      <section className="border-b border-[rgba(212,175,55,0.15)] bg-gradient-to-b from-[rgba(212,175,55,0.05)] to-transparent">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Inicio
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Nuestro trabajo
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold">
            La <span className="text-gold-gradient">galería</span> real
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Una muestra de cortes, barbas y estilos creados por nuestros maestros
            barberos.
          </p>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                filter === t
                  ? "bg-primary text-[#0F0F0F] border-primary"
                  : "border-[rgba(212,175,55,0.25)] text-muted-foreground hover:text-primary hover:border-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {items.map((g, i) => (
            <motion.div
              key={`${g.src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="gallery-item card-gold-hover break-inside-avoid mb-4 group"
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              <div className="gallery-overlay">
                <p className="gallery-overlay-title text-base sm:text-lg">
                  {g.title}
                </p>
                <p className="gallery-overlay-text">
                  {g.tag} · Corte Real Barbería Premium
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/reservar"
            className="btn-gold-glow inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md"
          >
            Reserva tu cita
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
