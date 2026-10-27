"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, Scissors, Phone, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMin: number;
  icono: string | null;
};
type Barbero = {
  id: string;
  nombre: string;
  foto: string;
  especialidad: string;
  rating: number;
};

const STEPS = [
  { label: "Servicio", icon: Scissors },
  { label: "Barbero", icon: User },
  { label: "Fecha y hora", icon: CalendarIcon },
  { label: "Tus datos", icon: Phone },
];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function dateToISO(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export function ReservationStepper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preServicio = searchParams.get("servicio");
  const preBarbero = searchParams.get("barbero");

  const [step, setStep] = React.useState(0);
  const [servicios, setServicios] = React.useState<Servicio[]>([]);
  const [barberos, setBarberos] = React.useState<Barbero[]>([]);
  const [loadingCatalog, setLoadingCatalog] = React.useState(true);

  const [servicioId, setServicioId] = React.useState<string | null>(
    preServicio ?? null
  );
  const [barberoId, setBarberoId] = React.useState<string | null>(
    preBarbero ?? null
  );

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [slots, setSlots] = React.useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [hora, setHora] = React.useState<string | null>(null);

  const [clienteNombre, setClienteNombre] = React.useState("");
  const [clientePhone, setClientePhone] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Load catalog.
  React.useEffect(() => {
    (async () => {
      setLoadingCatalog(true);
      try {
        const [sr, br] = await Promise.all([
          fetch("/api/servicios", { cache: "no-store" }),
          fetch("/api/barberos?activo=true", { cache: "no-store" }),
        ]);
        const s = (await sr.json()) as Servicio[];
        const b = (await br.json()) as Barbero[];
        setServicios(Array.isArray(s) ? s : []);
        setBarberos(Array.isArray(b) ? b : []);
      } catch {
        toast.error("No se pudo cargar el catálogo. Recarga la página.");
      } finally {
        setLoadingCatalog(false);
      }
    })();
  }, []);

  // If preselected service/barber match the catalog, advance to step 1.
  React.useEffect(() => {
    if (loadingCatalog) return;
    if (preServicio && servicios.length) {
      const exists = servicios.find((s) => s.id === preServicio);
      if (exists && preBarbero && barberos.length) {
        const bexists = barberos.find((b) => b.id === preBarbero);
        if (bexists) {
          setStep(2); // jump to date selection
        } else {
          setStep(1);
        }
      } else if (exists) {
        setStep(1);
      }
    }
     
  }, [loadingCatalog]);

  // Load slots when step 2 + date + service + barber chosen.
  React.useEffect(() => {
    if (step !== 2) return;
    if (!servicioId) return;
    if (!date) return;
    setLoadingSlots(true);
    setSlots([]);
    setHora(null);
    (async () => {
      try {
        const params = new URLSearchParams({
          servicioId,
          fecha: dateToISO(date),
        });
        if (barberoId) params.set("barberoId", barberoId);
        else params.set("barberoId", "cualquiera");
        const r = await fetch(
          `/api/horarios-disponibles?${params.toString()}`,
          { cache: "no-store" }
        );
        const data = await r.json();
        if (!r.ok) {
          toast.error(data?.error ?? "No se pudieron cargar horarios.");
          setSlots([]);
          return;
        }
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      } catch {
        toast.error("Error de red al cargar horarios.");
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [step, date, servicioId, barberoId]);

  const selectedServicio = servicios.find((s) => s.id === servicioId);
  const selectedBarbero = barberos.find((b) => b.id === barberoId);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function canNext() {
    if (step === 0) return !!servicioId;
    if (step === 1) return !!barberoId || barberoId === null; // null = cualquiera is OK once user picks "cualquiera"
    if (step === 2) return !!date && !!hora;
    return false;
  }

  async function submitReserva() {
    if (!servicioId || !date || !hora || !clienteNombre.trim() || !clientePhone.trim()) {
      toast.error("Completa todos los campos.");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, string> = {
        clienteNombre: clienteNombre.trim(),
        clientePhone: clientePhone.trim(),
        servicioId,
        fecha: dateToISO(date),
        hora,
      };
      if (barberoId) body.barberoId = barberoId;
      else body.barberoId = "cualquiera";

      const r = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        toast.error(data?.error ?? "No se pudo crear la reserva.");
        return;
      }
      toast.success("¡Reserva confirmada!");
      router.push(`/reservar/confirmacion/${data.id}`);
    } catch {
      toast.error("Error de red.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCatalog) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold" />
        <span className="ml-3 text-[#a3a3a3]">Cargando catálogo…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <ol
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-4"
        aria-label="Pasos de la reserva"
      >
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === i;
          const done = step > i;
          return (
            <li key={s.label} className="flex items-center gap-2 sm:gap-4">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors",
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : done
                    ? "border-gold/40 text-gold"
                    : "border-[#525252] text-[#737373]"
                )}
              >
                {done ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
                <span className="font-medium">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="size-4 text-[#525252]" />
              )}
            </li>
          );
        })}
      </ol>

      {/* Summary card */}
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="flex flex-wrap gap-4 p-4 text-sm">
          <div className="flex items-center gap-2">
            <Scissors className="size-4 text-gold" />
            <span className="text-[#a3a3a3]">Servicio:</span>
            <span className="text-cream">
              {selectedServicio?.nombre ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="size-4 text-gold" />
            <span className="text-[#a3a3a3]">Barbero:</span>
            <span className="text-cream">
              {barberoId === null
                ? "Cualquiera"
                : selectedBarbero?.nombre ?? "—"}
            </span>
          </div>
          {date && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-gold" />
              <span className="text-[#a3a3a3]">Fecha:</span>
              <span className="text-cream">
                {format(date, "EEE d 'de' MMMM", { locale: es })}
              </span>
            </div>
          )}
          {hora && (
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gold" />
              <span className="text-[#a3a3a3]">Hora:</span>
              <span className="text-cream">{hora}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <Step1Servicio
              servicios={servicios}
              servicioId={servicioId}
              onPick={(id) => {
                setServicioId(id);
                next();
              }}
            />
          )}
          {step === 1 && (
            <Step2Barbero
              barberos={barberos}
              barberoId={barberoId}
              onPick={(id) => {
                setBarberoId(id);
                next();
              }}
              onPickCualquiera={() => {
                setBarberoId(null);
                next();
              }}
            />
          )}
          {step === 2 && (
            <Step3FechaHora
              date={date}
              setDate={setDate}
              slots={slots}
              loadingSlots={loadingSlots}
              hora={hora}
              setHora={(h) => {
                setHora(h);
              }}
            />
          )}
          {step === 3 && (
            <Step4Datos
              nombre={clienteNombre}
              setNombre={setClienteNombre}
              phone={clientePhone}
              setPhone={setClientePhone}
              servicio={selectedServicio}
              barbero={selectedBarbero}
              barberoId={barberoId}
              date={date}
              hora={hora}
              submitting={submitting}
              onSubmit={submitReserva}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          className="text-[#a3a3a3] hover:text-gold"
        >
          <ChevronLeft className="size-4" /> Atrás
        </Button>
        {step < 3 && (
          <Button
            type="button"
            onClick={next}
            disabled={!canNext()}
            className="gold-gradient text-[#0f0f0f] shadow-gold hover:opacity-90"
          >
            Continuar <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------- STEP COMPONENTS ----------------

function Step1Servicio({
  servicios,
  servicioId,
  onPick,
}: {
  servicios: Servicio[];
  servicioId: string | null;
  onPick: (id: string) => void;
}) {
  if (servicios.length === 0) {
    return (
      <p className="text-center text-[#a3a3a3]">
        No hay servicios disponibles.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {servicios.map((s) => {
        const selected = s.id === servicioId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all hover:shadow-gold",
              selected
                ? "border-gold bg-gold/10 shadow-gold"
                : "border-gold/15 bg-[#1a1a1a] hover:border-gold/50"
            )}
          >
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-xl bg-[#0f0f0f] text-2xl ring-1 ring-gold/30">
                {s.icono ?? "✂️"}
              </span>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                ${s.precio.toLocaleString("es-MX")}
              </span>
            </div>
            <h3 className="mt-3 font-heading text-lg text-cream">{s.nombre}</h3>
            <p className="mt-1 text-sm text-[#a3a3a3]">{s.descripcion}</p>
            <p className="mt-3 text-xs text-[#737373]">{s.duracionMin} min</p>
          </button>
        );
      })}
    </div>
  );
}

function Step2Barbero({
  barberos,
  barberoId,
  onPick,
  onPickCualquiera,
}: {
  barberos: Barbero[];
  barberoId: string | null;
  onPick: (id: string) => void;
  onPickCualquiera: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <button
        type="button"
        onClick={onPickCualquiera}
        className={cn(
          "rounded-2xl border p-5 text-left transition-all hover:shadow-gold",
          barberoId === null
            ? "border-gold bg-gold/10 shadow-gold"
            : "border-gold/15 bg-[#1a1a1a] hover:border-gold/50"
        )}
      >
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-xl text-gold ring-2 ring-gold/40">
            ?
          </span>
          <div>
            <h3 className="font-heading text-lg text-cream">Cualquier barbero</h3>
            <p className="text-sm text-[#a3a3a3]">
              Mayor disponibilidad de horarios.
            </p>
          </div>
        </div>
      </button>

      {barberos.map((b) => {
        const selected = b.id === barberoId;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onPick(b.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all hover:shadow-gold",
              selected
                ? "border-gold bg-gold/10 shadow-gold"
                : "border-gold/15 bg-[#1a1a1a] hover:border-gold/50"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-xl text-gold ring-2 ring-gold/40">
                {b.foto}
              </span>
              <div>
                <h3 className="font-heading text-lg text-cream">{b.nombre}</h3>
                <p className="text-sm text-gold">{b.especialidad}</p>
                <p className="mt-1 text-xs text-[#737373]">
                  ★ {b.rating.toFixed(1)} / 5
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Step3FechaHora({
  date,
  setDate,
  slots,
  loadingSlots,
  hora,
  setHora,
}: {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  slots: string[];
  loadingSlots: boolean;
  hora: string | null;
  setHora: (h: string) => void;
}) {
  // Disable past days and Sundays (0) — barbero closed Sunday.
  const disabledDays = React.useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable all past dates.
    const past = new Date(today);
    past.setDate(past.getDate() - 365);
    for (let d = new Date(past); d < today; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    // Disable Sundays for next 60 days.
    for (let i = 0; i < 60; i++) {
      const dd = new Date(today);
      dd.setDate(dd.getDate() + i);
      if (dd.getDay() === 0) arr.push(new Date(dd));
    }
    return arr;
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-4">
          <h3 className="mb-3 font-heading text-lg text-cream">
            Selecciona una fecha
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              locale={es}
              classNames={{
                day: "text-cream",
                weekday: "text-gold",
                today: "bg-gold/20 text-cream",
              }}
            />
          </div>
          <p className="mt-3 text-xs text-[#737373]">
            Cerramos los domingos. Elige de lunes a sábado.
          </p>
        </CardContent>
      </Card>

      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-4">
          <h3 className="mb-3 font-heading text-lg text-cream">
            Horarios disponibles
          </h3>
          {!date ? (
            <p className="py-12 text-center text-sm text-[#737373]">
              Primero elige una fecha.
            </p>
          ) : loadingSlots ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#a3a3a3]">
              <Loader2 className="size-5 animate-spin text-gold" />
              <span className="text-sm">Cargando horarios…</span>
            </div>
          ) : slots.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#737373]">
              No hay horarios disponibles para esta fecha. Prueba con otro día.
            </p>
          ) : (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
              {slots.map((s) => {
                const selected = s === hora;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setHora(s)}
                    className={cn(
                      "rounded-md border px-2 py-2 text-sm font-medium transition-all",
                      selected
                        ? "border-gold bg-gold text-[#0f0f0f]"
                        : "border-gold/30 text-cream hover:border-gold hover:bg-gold/10"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Step4Datos({
  nombre,
  setNombre,
  phone,
  setPhone,
  servicio,
  barbero,
  barberoId,
  date,
  hora,
  submitting,
  onSubmit,
}: {
  nombre: string;
  setNombre: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  servicio: Servicio | undefined;
  barbero: Barbero | undefined;
  barberoId: string | null;
  date: Date | undefined;
  hora: string | null;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="space-y-4 p-6">
          <h3 className="font-heading text-xl text-cream">Tus datos</h3>
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-cream">
              Nombre completo
            </Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={80}
              required
              placeholder="Ej. Juan Pérez"
              className="bg-[#0f0f0f] border-gold/25 text-cream placeholder:text-[#737373]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-cream">
              Teléfono (con WhatsApp si possible)
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Ej. 6391234567"
              inputMode="tel"
              className="bg-[#0f0f0f] border-gold/25 text-cream placeholder:text-[#737373]"
            />
          </div>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="w-full gold-gradient text-[#0f0f0f] shadow-gold-lg hover:opacity-90"
          >
            {submitting ? "Confirmando…" : "Confirmar reserva"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-gold/30 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-xl text-cream">Resumen</h3>
          <Summary label="Servicio" value={servicio?.nombre} />
          <Summary
            label="Precio"
            value={servicio ? `$${servicio.precio.toLocaleString("es-MX")} MXN` : undefined}
          />
          <Summary
            label="Duración"
            value={servicio ? `${servicio.duracionMin} min` : undefined}
          />
          <Summary
            label="Barbero"
            value={
              barberoId === null ? "Cualquiera" : barbero?.nombre ?? undefined
            }
          />
          <Summary
            label="Fecha"
            value={
              date ? format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : undefined
            }
          />
          <Summary label="Hora" value={hora ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
}

function Summary({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gold/10 pb-2">
      <span className="text-sm text-[#a3a3a3]">{label}</span>
      <span className="text-sm font-medium text-cream">{value ?? "—"}</span>
    </div>
  );
}
