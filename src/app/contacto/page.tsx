"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Send,
} from "lucide-react";
import { BARBERIA_INFO } from "@/lib/info";
import { toast } from "sonner";

export default function ContactoPage() {
  const [form, setForm] = React.useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [sending, setSending] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.mensaje) {
      toast.error("Completa nombre, teléfono y mensaje");
      return;
    }
    setSending(true);
    // Simulated send — this is a demo
    setTimeout(() => {
      setSending(false);
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
      setForm({ nombre: "", telefono: "", email: "", mensaje: "" });
    }, 900);
  }

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
            Estamos para servirte
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold">
            <span className="text-gold-gradient">Contáctanos</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Visítanos, llámanos o escríbenos. También puedes agendar tu cita
            directamente en línea.
          </p>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="card-premium-glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-1">Dirección</h2>
                  <p className="text-sm text-muted-foreground">{BARBERIA_INFO.direccion}</p>
                </div>
              </div>
            </div>

            <div className="card-premium-glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-1">Teléfono</h2>
                  <a href={BARBERIA_INFO.telefonoHref} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {BARBERIA_INFO.telefono}
                  </a>
                </div>
              </div>
            </div>

            <div className="card-premium-glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-1">Email</h2>
                  <a href={`mailto:${BARBERIA_INFO.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {BARBERIA_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="card-premium-glass rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-1">Horario</h2>
                  <p className="text-sm text-muted-foreground">Lunes a Sábado</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {BARBERIA_INFO.horario.map((h) => (
                  <li key={h.dia} className="flex items-center justify-between text-sm py-1.5 border-b border-[rgba(212,175,55,0.08)] last:border-0">
                    <span className="text-muted-foreground">{h.dia}</span>
                    <span className={h.horas === "Cerrado" ? "text-secondary" : "text-foreground"}>
                      {h.horas}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <a
                href={BARBERIA_INFO.redes.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn-neon-outline flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a
                href={BARBERIA_INFO.redes.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn-neon-outline flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card-premium-glass rounded-xl p-6 sm:p-8"
          >
            <h2 className="font-serif text-2xl font-bold mb-2">
              Envíanos un <span className="text-gold-gradient">mensaje</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Cuéntanos qué necesitas y te responderemos a la brevedad.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="floating-input">
                <input
                  type="text"
                  id="contacto-nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder=" "
                />
                <label htmlFor="contacto-nombre">Nombre completo *</label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="floating-input">
                  <input
                    type="tel"
                    id="contacto-telefono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder=" "
                  />
                  <label htmlFor="contacto-telefono">Teléfono *</label>
                </div>
                <div className="floating-input">
                  <input
                    type="email"
                    id="contacto-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=" "
                  />
                  <label htmlFor="contacto-email">Email</label>
                </div>
              </div>
              <div className="floating-input">
                <textarea
                  id="contacto-mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  placeholder=" "
                  className="resize-none"
                />
                <label htmlFor="contacto-mensaje">Mensaje *</label>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-gold-glow w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-[#0F0F0F]/30 border-t-[#0F0F0F] animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
