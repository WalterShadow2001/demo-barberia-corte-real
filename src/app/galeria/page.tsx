"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GaleriaItem = {
  src: string;
  alt: string;
  tag: string;
  tall?: boolean;
};

const GALERIA: GaleriaItem[] = [
  { src: "https://images.unsplash.com/photo-1503951918679-11664729b38d?w=800&h=800&fit=crop", alt: "Corte clásico de tijera con acabado de navaja", tag: "Corte clásico" },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f026789a6?w=800&h=800&fit=crop", alt: "Fade degradado limpio", tag: "Fade", tall: true },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=800&fit=crop", alt: "Barba perfilada con navaja", tag: "Barba" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=800&fit=crop", alt: "Afeitado clásico con toalla caliente", tag: "Afeitado" },
  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=800&fit=crop", alt: "Diseño con navaja", tag: "Diseño", tall: true },
  { src: "https://images.unsplash.com/photo-1635273051937-39ad6cbd4dd4?w=800&h=800&fit=crop", alt: "Corte moderno texturizado", tag: "Moderno" },
  { src: "https://images.unsplash.com/photo-1605497788044-5a32c70e8d34?w=800&h=800&fit=crop", alt: "Corte infantil", tag: "Infantil" },
  { src: "https://images.unsplash.com/photo-1596702608244-71d94d44d97c?w=800&h=800&fit=crop", alt: "Estilo urbano", tag: "Urbano", tall: true },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=800&fit=crop", alt: "Acabado premium", tag: "Premium" },
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
              className="card-gold-hover shine-on-hover break-inside-avoid mb-4 relative overflow-hidden rounded-xl group"
            >
              <Image
                src={g.src}
                alt={g.alt}
                width={800}
                height={g.tall ? 1100 : 800}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80">
                  Corte Real
                </span>
                <p className="font-serif text-lg font-semibold text-foreground mt-0.5">
                  {g.tag}
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
