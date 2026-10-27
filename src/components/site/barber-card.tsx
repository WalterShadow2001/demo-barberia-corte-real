"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type BarberoPublic = {
  id: string;
  nombre: string;
  foto: string;
  especialidad: string;
  rating: number;
  activo: boolean;
};

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={
        i < rounded ? "size-4 fill-gold text-gold" : "size-4 text-[#525252]"
      }
      aria-hidden
    />
  ));
}

export function BarberCard({
  barbero,
  index = 0,
}: {
  barbero: BarberoPublic;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
    >
      <Card className="group relative h-full overflow-hidden border-gold/15 bg-[#1a1a1a]/80 backdrop-blur transition-all hover:border-gold/50 hover:shadow-gold">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-gold/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
        />
        <CardContent className="relative flex h-full flex-col items-center p-6 text-center">
          <div className="relative">
            <span
              className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-4xl text-gold ring-2 ring-gold/40"
              aria-hidden
            >
              {barbero.foto}
            </span>
            <span
              className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full gold-gradient text-[#0f0f0f] ring-2 ring-[#1a1a1a]"
              aria-hidden
            >
              ✂
            </span>
          </div>
          <h3 className="mt-5 font-heading text-xl text-[#f5f5f5]">
            {barbero.nombre}
          </h3>
          <p className="mt-1 text-sm text-gold">{barbero.especialidad}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex" aria-label={`Calificación ${barbero.rating} de 5`}>
              {renderStars(barbero.rating)}
            </div>
            <span className="text-xs text-[#a3a3a3]">
              {barbero.rating.toFixed(1)}
            </span>
          </div>
          <Button
            asChild
            className="mt-5 w-full gold-gradient text-[#0f0f0f] hover:opacity-90"
          >
            <Link href={`/reservar?barbero=${encodeURIComponent(barbero.id)}`}>
              Reservar con {barbero.nombre.split(" ")[0]}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
