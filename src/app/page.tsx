"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Scissors,
  Crown,
  Sparkles,
  Star,
  Clock,
  Calendar,
  ArrowRight,
  Phone,
  MapPin,
  Award,
  Users,
  ChevronRight,
} from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { BARBERIA_INFO } from "@/lib/info";
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
};

type Testimonio = {
  id: string;
  nombre: string;
  rating: number;
  comentario: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  crown: Crown,
  sparkles: Sparkles,
  razor: Scissors,
};

function ServicioIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] ?? Scissors;
  return <Cmp className={className} />;
}

function GoldRing() {
  return (
    <div className="flex justify-center">
      <div className="loader-gold-ring" />
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const { data: servicios, loading: loadingServ } = useFetch<Servicio[]>(
    "/api/servicios"
  );
  const { data: barberos, loading: loadingBarb } = useFetch<Barbero[]>(
    "/api/barberos"
  );
  const { data: testimonios } = useFetch<Testimonio[]>("/api/testimonios");

  const serviciosDestacados = (servicios ?? []).filter((s) => s.destacado).slice(0, 4);
  const barberosTop = (barberos ?? []).slice(0, 4);

  return (
    <>
      {/* === HERO === */}
      <section className="relative overflow-hidden hero-vignette">
        <div className="absolute inset-0 grain-gold pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-36 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)] mb-6">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                  Barbería Premium · Delicias, Chih.
                </span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight">
                El arte de
                <br />
                cortar <span className="text-gold-gradient">bien</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Barbería premium en Delicias, Chihuahua. Cortes clásicos, fades,
                barba y afeitado tradicional con maestros barberos y productos
                de la más alta calidad.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/reservar"
                  className="btn-gold-glow inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm sm:text-base"
                >
                  <Calendar className="h-5 w-5" />
                  Agenda tu cita
                </Link>
                <Link
                  href="/servicios"
                  className="btn-neon-outline inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm sm:text-base"
                >
                  Ver servicios
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Quick stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <Stat icon={Award} value="15+" label="Años de experiencia" />
                <Stat icon={Users} value="4" label="Maestros barberos" />
                <Stat icon={Star} value="4.9" label="Rating promedio" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px]">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                <Image
                  src="/logo.svg"
                  alt="Logo Corte Real — corona, tijeras y navaja cruzadas"
                  width={440}
                  height={440}
                  priority
                  className="relative z-10 w-full h-full drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary/60" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-secondary" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#F5E6D3]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      {/* === SERVICIOS DESTACADOS === */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Nuestros servicios
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold">
            Experiencias que <span className="text-gold-gradient">definen</span> un rey
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Cada servicio está diseñado con atención al detalle, productos
            premium y la maestría de nuestros barberos.
          </p>
        </motion.div>

        {loadingServ ? (
          <GoldRing />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviciosDestacados.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href="/reservar"
                  className="card-gold-hover shine-on-hover block rounded-xl bg-card p-6 h-full group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-primary group-hover:bg-primary group-hover:text-[#0F0F0F] transition-all">
                      <ServicioIcon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {s.categoria}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                    {s.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                    {s.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(212,175,55,0.1)]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {s.duracion} min
                    </div>
                    <span className="font-serif text-xl font-bold text-gold-gradient">
                      ${s.precio}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/servicios"
            className="btn-neon-outline inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm"
          >
            Ver todos los servicios
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      {/* === WHY CHOOSE US === */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: Crown,
              title: "Trato Real",
              desc: "Te recibimos como mereces. Ambiente premium, bebida de cortesía y atención personalizada de principio a fin.",
            },
            {
              icon: Scissors,
              title: "Maestros Barberos",
              desc: "Más de 15 años de experiencia. Cada corte es una obra: técnica, precisión y estilo que se adapta a ti.",
            },
            {
              icon: Sparkles,
              title: "Productos Premium",
              desc: "Trabajamos con las mejores marcas: aceites, pomadas y lociones que cuidan tu cabello y barba.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-premium-glass rounded-xl p-7"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-[rgba(212,175,55,0.25)] text-primary mb-5">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-2xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      {/* === BARBEROS === */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Nuestro equipo
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold">
            Maestros <span className="text-gold-gradient">barberos</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Conoce a los artistas detrás de cada corte. Profesionales apasionados
            por su oficio.
          </p>
        </motion.div>

        {loadingBarb ? (
          <GoldRing />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {barberosTop.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-premium-glass rounded-xl overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={b.foto}
                    alt={`Barbero ${b.nombre} ${b.apellidos}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#0F0F0F]/70 border border-[rgba(212,175,55,0.3)] text-[10px] text-primary">
                      <Star className="h-3 w-3 fill-primary" />
                      {b.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {b.experiencia} años exp.
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-semibold">
                    {b.nombre} {b.apellidos}
                  </h3>
                  <p className="text-xs text-primary uppercase tracking-wider mt-1 mb-3">
                    {b.especialidad}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                    {b.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/barberos"
            className="btn-neon-outline inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm"
          >
            Conoce al equipo completo
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      {/* === GALERIA PREVIEW === */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Nuestro trabajo
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold">
            La <span className="text-gold-gradient">galería</span> real
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {GALLERY_IMAGES.slice(0, 8).map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "card-gold-hover relative overflow-hidden rounded-lg group aspect-square"
              )}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase tracking-wider text-primary font-medium">
                  {g.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/galeria"
            className="btn-neon-outline inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm"
          >
            Ver galería completa
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      {/* === TESTIMONIOS === */}
      {testimonios && testimonios.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Lo que dicen
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold">
              Clientes <span className="text-gold-gradient">satisfechos</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonios.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-premium-glass rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "h-4 w-4",
                        j < t.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-5 italic">
                  &ldquo;{t.comentario}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-[#8B6914] flex items-center justify-center text-[#0F0F0F] font-serif font-bold">
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.nombre}</p>
                    <p className="text-xs text-muted-foreground">Cliente verificado</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="divider-barber w-32 mx-auto" />

      {/* === CTA FINAL === */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <motion.div
          {...fadeUp}
          className="card-premium-glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative">
            <Crown className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              ¿Listo para tu <span className="text-gold-gradient">próximo corte</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Reserva tu cita en segundos. Te esperamos con una bebida de cortesía
              y la mejor atención en Corte Real.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/reservar"
                className="btn-gold-glow inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md"
              >
                <Calendar className="h-5 w-5" />
                Reservar ahora
              </Link>
              <a
                href={BARBERIA_INFO.telefonoHref}
                className="btn-neon-outline inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md"
              >
                <Phone className="h-5 w-5" />
                {BARBERIA_INFO.telefono}
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {BARBERIA_INFO.direccion}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center lg:text-left">
      <Icon className="h-5 w-5 text-primary mx-auto lg:mx-0 mb-1.5" />
      <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5 leading-tight">
        {label}
      </div>
    </div>
  );
}

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1503951918679-11664729b38d?w=500&h=500&fit=crop", alt: "Corte clásico de tijera", tag: "Corte clásico" },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f026789a6?w=500&h=500&fit=crop", alt: "Fade degradado", tag: "Fade" },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&h=500&fit=crop", alt: "Barba perfilada", tag: "Barba" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=500&fit=crop", alt: "Afeitado clásico", tag: "Afeitado" },
  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&h=500&fit=crop", alt: "Diseño con navaja", tag: "Diseño" },
  { src: "https://images.unsplash.com/photo-1635273051937-39ad6cbd4dd4?w=500&h=500&fit=crop", alt: "Corte moderno", tag: "Moderno" },
  { src: "https://images.unsplash.com/photo-1605497788044-5a32c70e8d34?w=500&h=500&fit=crop", alt: "Corte infantil", tag: "Infantil" },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&h=500&fit=crop", alt: "Estilo barbería", tag: "Estilo" },
];
