"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  Scissors,
  Instagram,
  Award,
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

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {barberos?.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-premium-glass rounded-xl overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-auto">
                  <Image
                    src={b.foto}
                    alt={`Barbero ${b.nombre} ${b.apellidos}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#1A1A1A]/40" />
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">
                        {b.nombre} {b.apellidos}
                      </h2>
                      <p className="text-xs uppercase tracking-wider text-primary mt-1">
                        {b.especialidad}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-primary shrink-0">
                      <Star className="h-3.5 w-3.5 fill-primary" />
                      {b.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed my-4">
                    {b.bio}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      {b.experiencia} años de experiencia
                    </span>
                    {b.instagram && (
                      <a
                        href={BARBERIA_INFO.redes.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <Instagram className="h-4 w-4 text-primary" />
                        {b.instagram}
                      </a>
                    )}
                  </div>

                  {/* Horario */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 text-primary" />
                      Horario
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {b.horarios
                        .sort((a, z) => a.diaSemana - z.diaSemana)
                        .map((h) => (
                          <span
                            key={h.id}
                            className="px-2 py-1 rounded text-[10px] border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.05)] text-muted-foreground"
                          >
                            {DIAS[h.diaSemana]} {h.horaInicio}–{h.horaFin}
                          </span>
                        ))}
                    </div>
                  </div>

                  <Link
                    href={`/reservar?barbero=${b.id}`}
                    className="btn-gold-glow mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Reservar con {b.nombre}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
