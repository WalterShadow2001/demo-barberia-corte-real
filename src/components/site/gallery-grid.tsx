"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  description: string;
  span?: "tall" | "wide" | "normal";
};

const ITEMS: GalleryItem[] = [
  {
    src: "/gallery/g1.jpg",
    alt: "Barbero dándole un corte de fade a un cliente en la barbería premium",
    title: "El corte del día",
    description: "Fades impecables, todos los días.",
    span: "tall",
  },
  {
    src: "/gallery/g2.jpg",
    alt: "Primer plano de un fade con degradado de piel a cabello más largo",
    title: "Detalles que importan",
    description: "El degradado perfecto, hecho a mano.",
    span: "normal",
  },
  {
    src: "/gallery/g3.jpg",
    alt: "Interior de la barbería con sillas vintage, ladrillo y luces cálidas",
    title: "Nuestra casa",
    description: "Un espacio pensado para que te relajes.",
    span: "wide",
  },
  {
    src: "/gallery/g4.jpg",
    alt: "Cliente con barba recién arreglada mirándose al espejo",
    title: "A mirror moment",
    description: "Salimos impecables, siempre.",
    span: "normal",
  },
  {
    src: "/gallery/g5.jpg",
    alt: "Primer plano de arreglo de barba con navaja",
    title: "Navaja en mano",
    description: "Barbas perfiladas con técnica clásica.",
    span: "wide",
  },
  {
    src: "/gallery/g6.jpg",
    alt: "Niño recibiéndose un corte de cabello con barbero sonriente",
    title: "Los pequeños también",
    description: "Cortes infantiles con paciencia.",
    span: "normal",
  },
  {
    src: "/gallery/g7.jpg",
    alt: "Diseño creativo con líneas geométricas en el cabello",
    title: "Diseños únicos",
    description: "Diseños creativos para los que arriesgan.",
    span: "tall",
  },
  {
    src: "/gallery/g8.jpg",
    alt: "Herramientas de barbería: tijeras, máquina, navaja, peine y aceite",
    title: "Herramientas del oficio",
    description: "Calidad en cada pieza de nuestro set.",
    span: "normal",
  },
];

export function GalleryGrid() {
  const [active, setActive] = React.useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {ITEMS.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            onClick={() => setActive(item)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
            className={`group relative overflow-hidden rounded-2xl border border-gold/15 bg-[#1a1a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] ${
              item.span === "tall"
                ? "row-span-2 aspect-[3/4]"
                : item.span === "wide"
                ? "sm:col-span-2 aspect-[4/3]"
                : "aspect-square"
            }`}
            aria-label={`Ver: ${item.title}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(15,15,15,0.92), rgba(15,15,15,0.3) 60%, transparent)",
              }}
            >
              <p className="font-heading text-base text-gold">{item.title}</p>
              <p className="text-xs text-[#d4d4d4]">{item.description}</p>
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-[#0f0f0f]/60 px-2 py-1 text-[10px] uppercase tracking-wider text-gold opacity-0 transition-opacity group-hover:opacity-100">
              Ver
            </span>
          </motion.button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Ampliación: ${active.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-gold/30 bg-[#0f0f0f]/80 text-gold hover:bg-gold hover:text-[#0f0f0f]"
            onClick={() => setActive(null)}
          >
            <X className="size-5" />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(min-width: 768px) 800px, 100vw"
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f0f0f] to-transparent p-6 text-left">
              <p className="font-heading text-xl text-gold">{active.title}</p>
              <p className="text-sm text-[#d4d4d4]">{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
