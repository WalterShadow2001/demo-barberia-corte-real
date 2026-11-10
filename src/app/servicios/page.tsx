"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Scissors,
  Crown,
  Sparkles,
  Clock,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
  icon: string;
  destacado: boolean;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  crown: Crown,
  sparkles: Sparkles,
  razor: Scissors,
};

export default function ServiciosPage() {
  const { data: servicios, loading } = useFetch<Servicio[]>("/api/servicios");
  const [cat, setCat] = React.useState<string>("Todas");

  const categorias = React.useMemo(() => {
    const set = new Set<string>((servicios ?? []).map((s) => s.categoria));
    return ["Todas", ...Array.from(set)];
  }, [servicios]);

  const filtrados = (servicios ?? []).filter(
    (s) => cat === "Todas" || s.categoria === cat
  );

  return (
    <>
      {/* Header */}
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
            Carta de servicios
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold title-underline-reveal">
            Nuestros <span className="text-gold-gradient">servicios</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Desde el corte clásico hasta el Paquete Real. Elige la experiencia
            que más te guste y reserva tu cita.
          </p>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Categorías filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                cat === c
                  ? "bg-primary text-[#0F0F0F] border-primary"
                  : "border-[rgba(212,175,55,0.25)] text-muted-foreground hover:text-primary hover:border-primary"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loader-gold-ring" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map((s, i) => {
              const Icon = ICON_MAP[s.icon] ?? Scissors;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={cn(
                    "card-gold-hover shine-on-hover shine-line-card rounded-xl bg-card p-6 relative",
                    s.destacado && "border-[rgba(212,175,55,0.35)]"
                  )}
                >
                  {s.destacado && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-[10px] uppercase tracking-wider text-primary">
                      <Crown className="h-3 w-3" />
                      Destacado
                    </span>
                  )}
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    {s.categoria}
                  </p>
                  <h2 className="font-serif text-2xl font-semibold mb-2">
                    {s.nombre}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {s.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(212,175,55,0.12)]">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {s.duracion} min
                    </div>
                    <span className="font-serif text-2xl font-bold text-gold-gradient">
                      ${s.precio}
                    </span>
                  </div>
                  <Link
                    href={`/reservar?servicio=${s.id}`}
                    className="btn-neon-outline mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Reservar
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
