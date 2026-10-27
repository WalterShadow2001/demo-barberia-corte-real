"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle, RefreshCw, Filter, CheckCircle2, XCircle, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

type Reserva = {
  id: string;
  clienteNombre: string;
  clientePhone: string;
  fecha: string;
  hora: string;
  estado: string;
  creadoEn: string;
  barbero: { id: string; nombre: string; foto: string };
  servicio: { id: string; nombre: string; precio: number };
};
type Barbero = { id: string; nombre: string };

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

const ESTADO_TONE: Record<string, string> = {
  pendiente: "bg-gold/15 text-gold hover:bg-gold/20",
  completada: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20",
  cancelada: "bg-[#8b1a1a]/30 text-[#f5e6d3] hover:bg-[#8b1a1a]/40",
};

export function ReservasManager() {
  const [items, setItems] = React.useState<Reserva[]>([]);
  const [barberos, setBarberos] = React.useState<Barbero[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [fechaFilter, setFechaFilter] = React.useState("");
  const [estadoFilter, setEstadoFilter] = React.useState("todos");
  const [barberoFilter, setBarberoFilter] = React.useState("todos");

  async function loadBarberos() {
    try {
      const r = await fetch("/api/barberos", { cache: "no-store" });
      const j = await r.json();
      setBarberos(Array.isArray(j) ? j : []);
    } catch {
      // ignore
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fechaFilter) params.set("fecha", fechaFilter);
      if (estadoFilter !== "todos") params.set("estado", estadoFilter);
      if (barberoFilter !== "todos") params.set("barberoId", barberoFilter);
      const r = await fetch(`/api/reservas?${params.toString()}`, {
        cache: "no-store",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error al cargar");
      setItems(Array.isArray(j) ? j : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadBarberos();
    // initial load with no filters
     
  }, []);

  React.useEffect(() => {
    load();
     
  }, [fechaFilter, estadoFilter, barberoFilter]);

  async function updateEstado(id: string, estado: string) {
    try {
      const r = await fetch(`/api/reservas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error");
      toast.success(`Reserva marcada como ${estado}.`);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Reservas</h1>
          <p className="text-sm text-[#a3a3a3]">
            Lista, filtra y actualiza el estado de las reservas.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={load}
          aria-label="Recargar"
          className="text-[#a3a3a3] hover:text-gold"
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1 min-w-[140px] space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#a3a3a3]">
              Fecha
            </label>
            <Input
              type="date"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
          <div className="flex-1 min-w-[140px] space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#a3a3a3]">
              Estado
            </label>
            <Select
              value={estadoFilter}
              onValueChange={setEstadoFilter}
            >
              <SelectTrigger className="bg-[#0f0f0f] border-gold/25 text-cream">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-gold/30 text-cream">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[160px] space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#a3a3a3]">
              Barbero
            </label>
            <Select
              value={barberoFilter}
              onValueChange={setBarberoFilter}
            >
              <SelectTrigger className="bg-[#0f0f0f] border-gold/25 text-cream">
                <SelectValue placeholder="Barbero" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-gold/30 text-cream">
                <SelectItem value="todos">Todos</SelectItem>
                {barberos.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFechaFilter("");
                setEstadoFilter("todos");
                setBarberoFilter("todos");
              }}
              className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold"
            >
              <Filter className="size-4" /> Limpiar
            </Button>
            <Button
              variant="outline"
              onClick={() => setFechaFilter(todayISO())}
              className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold"
            >
              Hoy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#a3a3a3]">
              <Loader2 className="size-5 animate-spin text-gold" />
              <span className="text-sm">Cargando…</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#f5e6d3]">
              <AlertCircle className="size-5 text-[#8b1a1a]" />
              <span className="text-sm">{error}</span>
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#737373]">
              No hay reservas con estos filtros.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/15 hover:bg-transparent">
                    <TableHead className="text-gold">Cliente</TableHead>
                    <TableHead className="hidden text-gold sm:table-cell">
                      Servicio
                    </TableHead>
                    <TableHead className="hidden text-gold md:table-cell">
                      Barbero
                    </TableHead>
                    <TableHead className="text-gold">Fecha</TableHead>
                    <TableHead className="text-gold">Hora</TableHead>
                    <TableHead className="text-center text-gold">
                      Estado
                    </TableHead>
                    <TableHead className="text-right text-gold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((r) => (
                    <TableRow
                      key={r.id}
                      className="border-gold/10 hover:bg-gold/5"
                    >
                      <TableCell>
                        <p className="font-medium text-cream">
                          {r.clienteNombre}
                        </p>
                        <p className="text-xs text-[#737373]">
                          {r.clientePhone}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm text-cream">
                          {r.servicio.nombre}
                        </p>
                        <p className="text-xs text-[#737373]">
                          ${r.servicio.precio.toLocaleString("es-MX")}
                        </p>
                      </TableCell>
                      <TableCell className="hidden text-sm text-cream md:table-cell">
                        {r.barbero.nombre}
                      </TableCell>
                      <TableCell className="text-sm text-cream">
                        {format(parseISO(`${r.fecha}T00:00:00`), "d MMM yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-cream">
                        {r.hora}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            ESTADO_TONE[r.estado] ?? "bg-gold/15 text-gold"
                          }
                        >
                          {r.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {r.estado !== "completada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEstado(r.id, "completada")}
                              className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                              <CheckCircle2 className="size-4" />
                              <span className="hidden sm:inline">Completar</span>
                            </Button>
                          )}
                          {r.estado !== "cancelada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEstado(r.id, "cancelada")}
                              className="text-[#f5e6d3] hover:bg-[#8b1a1a]/20"
                            >
                              <XCircle className="size-4" />
                              <span className="hidden sm:inline">Cancelar</span>
                            </Button>
                          )}
                          {r.estado === "completada" && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#737373]">
                              <Hourglass className="size-3.5" /> Completada
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
