"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={center ? "mx-auto mb-12 max-w-2xl text-center" : "mb-12 max-w-2xl"}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-4xl leading-tight text-[#f5f5f5] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-[#a3a3a3] sm:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}

export function TestimonialPreview({
  autor,
  texto,
  rating,
  index = 0,
}: {
  autor: string;
  texto: string;
  rating: number;
  index?: number;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
      className="relative rounded-2xl border border-gold/15 bg-[#1a1a1a] p-6 shadow-lg"
    >
      <span
        className="absolute -top-3 left-6 font-display text-6xl text-gold/40"
        aria-hidden
      >
        &ldquo;
      </span>
      <div className="mt-2 flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < rating ? "size-4 fill-gold text-gold" : "size-4 text-[#525252]"
            }
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#d4d4d4]">{texto}</p>
      <footer className="mt-4 text-sm font-semibold text-gold">— {autor}</footer>
    </motion.blockquote>
  );
}
