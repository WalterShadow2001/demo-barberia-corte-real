"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Scissors,
  Crown,
  Sparkles,
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  ArrowRight,
  Home,
} from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { TIME_SLOTS, DIAS_SEMANA } from "@/lib/info";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  horarios: Horario[];
};

type Disponibilidad = {
  fecha: string;
  barberoId: string;
  disponibles: string[];
  ocupadas: string[];
  laborable: boolean;
  diaSemana: number;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  crown: Crown,
  sparkles: Sparkles,
  razor: Scissors,
};

const STEPS = ["Servicio", "Barbero", "Fecha & Hora", "Tus datos", "Confirmación"];

function Suspended() {
  return null;
}

export default function ReservarPage() {
  return (
    <React.Suspense fallback={<Suspended />}>
      <ReservarInner />
    </React.Suspense>
  );
}

function ReservarInner() {
  const searchParams = useSearchParams();
  const preServicio = searchParams.get("servicio");
  const preBarbero = searchParams.get("barbero");

  const { data: servicios, loading: loadingServ } = useFetch<Servicio[]>("/api/servicios");
  const { data: barberos, loading: loadingBarb } = useFetch<Barbero[]>("/api/barberos");

  const [step, setStep] = React.useState(0);
  const [servicioId, setServicioId] = React.useState<string | null>(preServicio);
  const [barberoId, setBarberoId] = React.useState<string | null>(preBarbero);
  const [fecha, setFecha] = React.useState<string>("");
  const [hora, setHora] = React.useState<string>("");
  const [contacto, setContacto] = React.useState({
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmado, setConfirmado] = React.useState<null | {
    id: string;
    barbero: Barbero;
    servicio: Servicio;
    fecha: string;
    hora: string;
  }>(null);

  // Auto-advance step when preselecting
  React.useEffect(() => {
    if (preServicio && servicios && !barberoId) {
      setStep(1);
    }
    if (preBarbero && barberos) {
      setStep(2);
    }
  }, [preServicio, preBarbero, servicios, barberos]);

  const servicio = servicios?.find((s) => s.id === servicioId);
  const barbero = barberos?.find((b) => b.id === barberoId);

  function next() {
    if (step === 0 && !servicioId) {
      toast.error("Selecciona un servicio");
      return;
    }
    if (step === 1 && !barberoId) {
      toast.error("Selecciona un barbero");
      return;
    }
    if (step === 2 && (!fecha || !hora)) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    if (step === 3) {
      if (!contacto.nombre.trim() || !contacto.telefono.trim()) {
        toast.error("Nombre y teléfono son obligatorios");
        return;
      }
      submitCita();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submitCita() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: contacto.nombre,
          clienteTelefono: contacto.telefono,
          clienteEmail: contacto.email,
          barberoId,
          servicioId,
          fecha,
          hora,
          notas: contacto.notas,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo crear la cita");
        return;
      }
      setConfirmado(data.cita);
      setStep(4);
      toast.success("¡Cita reservada con éxito!");
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <section className="border-b border-[rgba(212,175,55,0.15)] bg-gradient-to-b from-[rgba(212,175,55,0.05)] to-transparent">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Inicio
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3 text-center">
            Reserva tu cita
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-center">
            Agenda con <span className="text-gold-gradient">Corte Real</span>
          </h1>

          {/* Stepper */}
          <div className="mt-8 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all",
                    i < step && "border-primary bg-primary text-[#0F0F0F]",
                    i === step && "border-primary bg-[rgba(212,175,55,0.12)] text-primary",
                    i > step && "border-[rgba(212,175,55,0.15)] text-muted-foreground"
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="text-xs font-medium hidden sm:inline">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-barber w-32 mx-auto" />

      <section className="container mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Resumen lateral */}
        {(servicio || barbero || fecha) && step < 4 && (
          <div className="card-premium-glass rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
            {servicio && (
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Servicio:</span>
                <span className="font-medium text-foreground">{servicio.nombre}</span>
                <span className="text-gold-gradient font-bold">${servicio.precio}</span>
              </div>
            )}
            {barbero && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Barbero:</span>
                <span className="font-medium text-foreground">{barbero.nombre}</span>
              </div>
            )}
            {fecha && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium text-foreground">{formatearFecha(fecha)} · {hora}</span>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: Servicio */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-1">
                Elige tu <span className="text-gold-gradient">servicio</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Selecciona la experiencia que deseas.
              </p>
              {loadingServ ? (
                <div className="flex justify-center py-12">
                  <div className="loader-gold-ring" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicios?.map((s) => {
                    const Icon = ICON_MAP[s.icon] ?? Scissors;
                    const sel = servicioId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setServicioId(s.id)}
                        className={cn(
                          "card-gold-hover shine-on-hover text-left rounded-xl bg-card p-5 transition-all",
                          sel && "border-primary bg-[rgba(212,175,55,0.08)]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)] text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-serif text-lg font-semibold truncate">{s.nombre}</h3>
                              {sel && <Check className="h-4 w-4 text-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{s.descripcion}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" /> {s.duracion} min
                              </span>
                              <span className="font-serif font-bold text-gold-gradient">${s.precio}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 1: Barbero */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-1">
                Elige tu <span className="text-gold-gradient">barbero</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                ¿Con quién prefieres que te atienda?
              </p>
              {loadingBarb ? (
                <div className="flex justify-center py-12">
                  <div className="loader-gold-ring" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {barberos?.map((b) => {
                    const sel = barberoId === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBarberoId(b.id)}
                        className={cn(
                          "card-premium-glass text-left rounded-xl overflow-hidden transition-all",
                          sel && "ring-2 ring-primary"
                        )}
                      >
                        <div className="relative aspect-[4/3]">
                          <Image src={b.foto} alt={b.nombre} fill sizes="33vw" className="object-cover" />
                          {sel && (
                            <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary text-[#0F0F0F] flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif text-lg font-semibold">{b.nombre} {b.apellidos}</h3>
                          <p className="text-xs text-primary uppercase tracking-wider mt-0.5">{b.especialidad}</p>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{b.bio}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Fecha & Hora */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-1">
                Elige <span className="text-gold-gradient">fecha y hora</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Selecciona el día y el horario disponible.
              </p>
              <DatePicker
                barberoId={barberoId}
                fecha={fecha}
                hora={hora}
                onFecha={setFecha}
                onHora={setHora}
              />
            </motion.div>
          )}

          {/* STEP 3: Datos */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-1">
                Tus <span className="text-gold-gradient">datos</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Para confirmar tu cita necesitamos contactarte.
              </p>
              <div className="card-premium-glass rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={contacto.nombre}
                      onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                      className="w-full bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-md pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={contacto.telefono}
                        onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
                        className="w-full bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-md pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="(639) ..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={contacto.email}
                        onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
                        className="w-full bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-md pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Notas (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={contacto.notas}
                    onChange={(e) => setContacto({ ...contacto, notas: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="Ej. Quiero un corte fade medio con diseño en la línea..."
                  />
                </div>

                {/* Resumen */}
                <div className="pt-4 border-t border-[rgba(212,175,55,0.15)]">
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Resumen de tu cita</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {servicio && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Servicio</span>
                        <span className="font-medium">{servicio.nombre}</span>
                      </div>
                    )}
                    {barbero && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Barbero</span>
                        <span className="font-medium">{barbero.nombre}</span>
                      </div>
                    )}
                    {fecha && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Fecha</span>
                        <span className="font-medium">{formatearFecha(fecha)}</span>
                      </div>
                    )}
                    {hora && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Hora</span>
                        <span className="font-medium">{hora}</span>
                      </div>
                    )}
                    {servicio && (
                      <div className="flex items-center justify-between col-span-full pt-2 border-t border-[rgba(212,175,55,0.08)]">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-serif text-xl font-bold text-gold-gradient">${servicio.precio}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmación */}
          {step === 4 && confirmado && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="card-premium-glass rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#8B6914] mb-6 mx-auto shadow-[0_0_40px_rgba(212,175,55,0.5)]"
                >
                  <Check className="h-10 w-10 text-[#0F0F0F]" strokeWidth={3} />
                </motion.div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
                  ¡Cita <span className="text-gold-gradient">confirmada</span>!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Hemos registrado tu cita. Te enviaremos un recordatorio. ¡Te esperamos!
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
                  <div className="rounded-lg bg-[#0F0F0F]/60 border border-[rgba(212,175,55,0.15)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Servicio</p>
                    <p className="font-serif text-lg font-semibold mt-1">{confirmado.servicio.nombre}</p>
                    <p className="text-sm text-gold-gradient font-bold mt-1">${confirmado.servicio.precio}</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0F0F]/60 border border-[rgba(212,175,55,0.15)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Barbero</p>
                    <p className="font-serif text-lg font-semibold mt-1">{confirmado.barbero.nombre} {confirmado.barbero.apellidos}</p>
                    <p className="text-xs text-muted-foreground mt-1">{confirmado.barbero.especialidad}</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0F0F]/60 border border-[rgba(212,175,55,0.15)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Fecha</p>
                    <p className="font-serif text-lg font-semibold mt-1">{formatearFecha(confirmado.fecha)}</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0F0F]/60 border border-[rgba(212,175,55,0.15)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hora</p>
                    <p className="font-serif text-lg font-semibold mt-1">{confirmado.hora}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/"
                    className="btn-gold-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm"
                  >
                    <Home className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                  <button
                    onClick={() => {
                      setConfirmado(null);
                      setStep(0);
                      setServicioId(null);
                      setBarberoId(null);
                      setFecha("");
                      setHora("");
                      setContacto({ nombre: "", telefono: "", email: "", notas: "" });
                    }}
                    className="btn-neon-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm"
                  >
                    Reservar otra cita
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navegación */}
        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-muted-foreground hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              onClick={next}
              disabled={submitting}
              className="btn-gold-glow inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-[#0F0F0F]/30 border-t-[#0F0F0F] animate-spin" />
                  Confirmando...
                </>
              ) : step === 3 ? (
                <>
                  Confirmar cita
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function DatePicker({
  barberoId,
  fecha,
  hora,
  onFecha,
  onHora,
}: {
  barberoId: string | null;
  fecha: string;
  hora: string;
  onFecha: (f: string) => void;
  onHora: (h: string) => void;
}) {
  const [monthOffset, setMonthOffset] = React.useState(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);

  const diasEnMes = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const primerDia = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const dias: (Date | null)[] = [];
  for (let i = 0; i < primerDia; i++) dias.push(null);
  for (let d = 1; d <= diasEnMes; d++) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    dias.push(date);
  }

  const { data: disp, loading } = useFetch<Disponibilidad>(
    barberoId && fecha ? `/api/citas/disponibilidad?barberoId=${barberoId}&fecha=${fecha}` : null
  );

  const disponiblesSet = new Set(disp?.disponibles ?? []);

  function toISO(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <div className="card-premium-glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMonthOffset((o) => o - 1)}
            disabled={monthOffset === 0}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="font-serif text-xl font-semibold">
            {viewDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
          </h3>
          <button
            onClick={() => setMonthOffset((o) => o + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-primary transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dias.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = toISO(d);
            const isPast = d < today;
            const isSunday = d.getDay() === 0;
            const isToday = iso === toISO(today);
            const sel = fecha === iso;
            const disabled = isPast || isSunday;
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => {
                  onFecha(iso);
                  onHora("");
                }}
                className={cn(
                  "aspect-square rounded-md text-sm font-medium transition-all relative",
                  sel && "bg-primary text-[#0F0F0F]",
                  !sel && !disabled && "text-foreground hover:bg-[rgba(212,175,55,0.1)] hover:text-primary",
                  disabled && "text-muted-foreground/30 cursor-not-allowed line-through",
                  isToday && !sel && "ring-1 ring-primary"
                )}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="dot-pulse-gold" />
          Días laborables: Lun – Sáb (cerrado domingos)
        </p>
      </div>

      {/* Time slots */}
      <div className="card-premium-glass rounded-xl p-5">
        <h3 className="font-serif text-xl font-semibold mb-1">Horario disponible</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {fecha ? (
            <>Para {formatearFecha(fecha)}</>
          ) : (
            <>Primero elige una fecha en el calendario</>
          )}
        </p>

        {!fecha ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Selecciona una fecha</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="loader-gold-ring" />
          </div>
        ) : disp && disp.laborable ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-80 overflow-y-auto scrollbar-gold pr-1">
            {TIME_SLOTS.map((slot) => {
              const disp = disponiblesSet.has(slot);
              const sel = hora === slot;
              return (
                <button
                  key={slot}
                  disabled={!disp}
                  onClick={() => onHora(slot)}
                  className={cn(
                    "py-2.5 rounded-md text-sm font-medium transition-all border",
                    sel && "bg-primary text-[#0F0F0F] border-primary",
                    !sel && disp && "border-[rgba(212,175,55,0.2)] text-foreground hover:border-primary hover:text-primary",
                    !disp && "border-[rgba(212,175,55,0.08)] text-muted-foreground/30 cursor-not-allowed line-through"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ) : disp && !disp.laborable ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-secondary">Este día el barbero no trabaja</p>
            <p className="text-xs text-muted-foreground mt-1">Elige otro día</p>
          </div>
        ) : null}

        {hora && (
          <div className="mt-4 pt-4 border-t border-[rgba(212,175,55,0.12)] flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hora seleccionada:</span>
            <span className="font-serif text-lg font-bold text-gold-gradient">{hora}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatearFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const diaSemana = DIAS_SEMANA[date.getDay()];
  return `${diaSemana} ${d} de ${date.toLocaleDateString("es-MX", { month: "long" })}`;
}
