"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  ChevronLeft,
  Instagram,
  Award,
  Sparkles,
} from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { BARBERIA_INFO } from "@/lib/info";

type Horario = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
};

type Barbero = {
  id: string;
  nombre: string;
  apellidos: string;
  bio: string;
  especialidad: string;
  experiencia: number;
  foto: string;
  rating: number;
  instagram: string | null;
  horarios: Horario[];
};

export default function BarberosPage() {
  const { data: barberos, loading } = useFetch<Barbero[]>("/api/barberos");

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
            Nuestro equipo
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold">
            Maestros <span className="text-gold-gradient">barberos</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Cada uno con su estilo único, pero todos compartiendo la misma
            pasión: el arte de cortar bien.
          </p>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loader-gold-ring" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barberos?.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flip-card"
              >
                <div className="flip-card-inner">
                  {/* Front: photo + name + rating */}
                  <div className="flip-card-front relative">
                    <Image
                      src={b.foto}
                      alt={`Barbero ${b.nombre} ${b.apellidos}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-serif text-xl font-bold text-foreground">
                            {b.nombre} {b.apellidos}
                          </h2>
                          <p className="text-xs uppercase tracking-wider text-primary mt-1">
                            {b.especialidad}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F0F0F]/80 border border-primary/30 text-xs font-medium text-primary shrink-0">
                          <Star className="h-3.5 w-3.5 fill-primary" />
                          {b.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-3 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Pasa el cursor para ver más
                      </p>
                    </div>
                  </div>

                  {/* Back: bio + especialidad + instagram + reservar */}
                  <div className="flip-card-back">
                    <Award className="h-8 w-8 text-primary" />
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {b.nombre} {b.apellidos}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-primary">
                      {b.especialidad}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {b.bio}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="h-4 w-4 text-primary" />
                      {b.experiencia} años de experiencia
                    </div>
                    {b.instagram && (
                      <a
                        href={BARBERIA_INFO.redes.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-bounce inline-flex items-center gap-1.5 text-primary hover:text-primary"
                      >
                        <Instagram className="h-5 w-5 social-icon-bounce" />
                        <span className="text-xs">{b.instagram}</span>
                      </a>
                    )}
                    <Link
                      href={`/reservar?barbero=${b.id}`}
                      className="btn-gold-glow inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md text-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Reservar con {b.nombre}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
