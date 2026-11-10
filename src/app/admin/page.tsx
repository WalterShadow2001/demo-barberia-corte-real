"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Lock,
  LogOut,
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  Check,
  X,
  Loader2,
  Crown,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Cita = {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string | null;
  fecha: string;
  hora: string;
  estado: string;
  notas: string | null;
  creadoEn: string;
  barbero: { id: string; nombre: string; apellidos: string };
  servicio: { id: string; nombre: string; precio: number };
};

const ESTADOS = ["pendiente", "confirmada", "completada", "cancelada"];
const ESTADO_COLORS: Record<string, string> = {
  pendiente: "text-[#F5E6D3] bg-[rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.3)]",
  confirmada: "text-primary bg-[rgba(212,175,55,0.15)] border-primary",
  completada: "text-[#7BB662] bg-[rgba(123,182,98,0.1)] border-[rgba(123,182,98,0.3)]",
  cancelada: "text-secondary bg-[rgba(139,26,26,0.15)] border-secondary",
};

export default function AdminPage() {
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [citas, setCitas] = React.useState<Cita[]>([]);
  const [loadingCitas, setLoadingCitas] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("todos");

  // Check if already authed
  React.useEffect(() => {
    fetch("/api/admin/citas")
      .then((r) => {
        setAuthed(r.ok);
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) setCitas(data);
      })
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Error al iniciar sesión");
        return;
      }
      toast.success("Bienvenido");
      setAuthed(true);
      setPassword("");
      loadCitas();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function loadCitas() {
    setLoadingCitas(true);
    try {
      const res = await fetch("/api/admin/citas");
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } finally {
      setLoadingCitas(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setCitas([]);
    toast.success("Sesión cerrada");
  }

  async function updateEstado(id: string, estado: string) {
    const res = await fetch(`/api/admin/citas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (res.ok) {
      toast.success(`Cita marcada como ${estado}`);
      setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
    } else {
      toast.error("No se pudo actualizar");
    }
  }

  async function deleteCita(id: string) {
    const res = await fetch(`/api/admin/citas/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Cita eliminada");
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="loader-gold-ring" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] px-4 hero-vignette">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-premium-glass rounded-2xl p-8 sm:p-10 max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Logo Corte Real"
              width={64}
              height={64}
              className="drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-center mb-1">
            Acceso <span className="text-gold-gradient">administrador</span>
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Ingresa la contraseña para ver las citas reservadas.
          </p>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-md pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold-glow w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4" />
                  Entrar
                </>
              )}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-[rgba(212,175,55,0.12)] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground/60 text-center">
            Demo · contraseña: <span className="text-primary">admin123</span>
          </p>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  const filtered = filter === "todos" ? citas : citas.filter((c) => c.estado === filter);
  const stats = {
    total: citas.length,
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    confirmadas: citas.filter((c) => c.estado === "confirmada").length,
    completadas: citas.filter((c) => c.estado === "completada").length,
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Admin header */}
      <header className="border-b border-[rgba(212,175,55,0.18)] bg-[#0A0A0A]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} />
            <div>
              <h1 className="font-serif text-lg font-bold text-gold-gradient leading-none">
                Corte Real · Admin
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                Panel de citas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Ver sitio
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs border border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-secondary hover:border-secondary transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="divider-barber w-full opacity-50" />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" value={stats.total} icon={Calendar} />
          <StatCard label="Pendientes" value={stats.pendientes} icon={Clock} />
          <StatCard label="Confirmadas" value={stats.confirmadas} icon={Check} />
          <StatCard label="Completadas" value={stats.completadas} icon={Crown} />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("todos")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filter === "todos"
                ? "bg-primary text-[#0F0F0F] border-primary"
                : "border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-primary"
            )}
          >
            Todos ({citas.length})
          </button>
          {ESTADOS.map((e) => {
            const count = citas.filter((c) => c.estado === e).length;
            return (
              <button
                key={e}
                onClick={() => setFilter(e)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                  filter === e
                    ? "bg-primary text-[#0F0F0F] border-primary"
                    : "border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-primary"
                )}
              >
                {e} ({count})
              </button>
            );
          })}
        </div>

        {/* Citas list */}
        {loadingCitas ? (
          <div className="flex justify-center py-20">
            <div className="loader-gold-ring" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-premium-glass rounded-xl p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No hay citas en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="card-premium-glass rounded-xl p-5 flex flex-col lg:flex-row lg:items-center gap-4"
              >
                <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Cliente
                    </p>
                    <p className="font-medium mt-0.5">{c.clienteNombre}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {c.clienteTelefono}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Scissors className="h-3 w-3" /> Servicio
                    </p>
                    <p className="font-medium mt-0.5">{c.servicio.nombre}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.barbero.nombre} {c.barbero.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Fecha
                    </p>
                    <p className="font-medium mt-0.5">{c.fecha}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.hora}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Estado</p>
                    <span className={cn("inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium border capitalize", ESTADO_COLORS[c.estado])}>
                      {c.estado}
                    </span>
                    {c.notas && (
                      <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                        &ldquo;{c.notas}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:w-44">
                  {ESTADOS.map((e) => (
                    <button
                      key={e}
                      onClick={() => updateEstado(c.id, e)}
                      className={cn(
                        "px-2 py-1.5 rounded text-[10px] uppercase tracking-wider font-medium border transition-all capitalize",
                        c.estado === e
                          ? "bg-primary text-[#0F0F0F] border-primary"
                          : "border-[rgba(212,175,55,0.2)] text-muted-foreground hover:text-primary hover:border-primary"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                  <button
                    onClick={() => deleteCita(c.id)}
                    className="px-2 py-1.5 rounded text-[10px] uppercase tracking-wider font-medium border border-secondary/30 text-secondary hover:bg-secondary hover:text-[#F5E6D3] transition-all inline-flex items-center justify-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-premium-glass rounded-xl p-5">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <div className="font-serif text-3xl font-bold text-gold-gradient">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
