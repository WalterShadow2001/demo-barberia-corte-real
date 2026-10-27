"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ServicioPublic = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMin: number;
  icono: string | null;
};

export function ServiceCard({
  servicio,
  index = 0,
}: {
  servicio: ServicioPublic;
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
        {/* Glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-gold/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0"
        />
        <CardContent className="relative flex h-full flex-col p-6">
          <div className="flex items-start justify-between">
            <span
              className="grid size-14 place-items-center rounded-2xl bg-[#0f0f0f] text-3xl ring-1 ring-gold/30"
              aria-hidden
            >
              {servicio.icono ?? "✂️"}
            </span>
            <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              ${servicio.precio.toLocaleString("es-MX")} MXN
            </span>
          </div>

          <h3 className="mt-5 font-heading text-xl text-[#f5f5f5]">
            {servicio.nombre}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#a3a3a3]">
            {servicio.descripcion}
          </p>

          <div className="mt-5 flex items-center gap-1.5 text-xs text-[#737373]">
            <Clock className="size-3.5 text-gold" />
            <span>{servicio.duracionMin} minutos</span>
          </div>

          <Button
            asChild
            className="mt-5 w-full gold-gradient text-[#0f0f0f] hover:opacity-90"
          >
            <Link
              href={`/reservar?servicio=${encodeURIComponent(servicio.id)}`}
            >
              Reservar este servicio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
