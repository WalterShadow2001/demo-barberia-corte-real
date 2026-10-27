"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Horario = {
  id?: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
};

type Barbero = {
  id: string;
  nombre: string;
  foto: string;
  especialidad: string;
  rating: number;
  activo: boolean;
  horarios?: Horario[];
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function BarberosManager() {
  const [items, setItems] = React.useState<Barbero[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Barbero | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/barberos", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "Error al cargar");
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(b: Barbero) {
    setEditing(b);
    setDialogOpen(true);
  }

  async function onSubmit(data: {
    nombre: string;
    foto: string;
    especialidad: string;
    rating: number;
    activo: boolean;
    horarios: Horario[];
  }) {
    try {
      if (editing) {
        const r = await fetch(`/api/barberos/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? "Error al actualizar");
        toast.success("Barbero actualizado.");
      } else {
        const r = await fetch("/api/barberos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? "Error al crear");
        toast.success("Barbero creado.");
      }
      setDialogOpen(false);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(msg);
    }
  }

  async function onDelete(id: string) {
    try {
      const r = await fetch(`/api/barberos/${id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error al eliminar");
      toast.success(j?.soft ? j.message : "Barbero eliminado.");
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
          <h1 className="font-display text-3xl text-cream">Barberos</h1>
          <p className="text-sm text-[#a3a3a3]">
            Gestiona al equipo y sus horarios de atención.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={load}
            aria-label="Recargar"
            className="text-[#a3a3a3] hover:text-gold"
          >
            <RefreshCw className="size-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openNew}
                className="gold-gradient text-[#0f0f0f] shadow-gold"
              >
                <Plus className="size-4" /> Nuevo barbero
              </Button>
            </DialogTrigger>
            <BarberoFormDialog
              key={editing?.id ?? "new"}
              initial={editing}
              onSubmit={onSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

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
              No hay barberos. Agrega el primero.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/15 hover:bg-transparent">
                    <TableHead className="text-gold">Foto</TableHead>
                    <TableHead className="text-gold">Nombre</TableHead>
                    <TableHead className="hidden text-gold sm:table-cell">
                      Especialidad
                    </TableHead>
                    <TableHead className="text-right text-gold">Rating</TableHead>
                    <TableHead className="text-center text-gold">Activo</TableHead>
                    <TableHead className="text-right text-gold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((b) => (
                    <TableRow
                      key={b.id}
                      className="border-gold/10 hover:bg-gold/5"
                    >
                      <TableCell>
                        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-sm text-gold ring-1 ring-gold/30">
                          {b.foto}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-cream">
                        {b.nombre}
                      </TableCell>
                      <TableCell className="hidden text-sm text-[#a3a3a3] sm:table-cell">
                        {b.especialidad}
                      </TableCell>
                      <TableCell className="text-right text-cream">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-gold text-gold" />
                          {b.rating.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {b.activo ? (
                          <Badge className="bg-gold/15 text-gold hover:bg-gold/20">
                            Sí
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-[#525252] text-[#a3a3a3]"
                          >
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(b)}
                                  className="text-[#a3a3a3] hover:text-gold"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#a3a3a3] hover:text-[#8b1a1a]"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-gold/30 bg-[#1a1a1a] text-cream">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar barbero?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#a3a3a3]">
                                  Vas a eliminar a <strong>{b.nombre}</strong>.
                                  Si tiene reservas, será desactivado en lugar
                                  de eliminado.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gold/30 text-cream hover:bg-gold/10">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(b.id)}
                                  className="bg-[#8b1a1a] text-cream hover:bg-[#8b1a1a]/80"
                                >
                                  Sí, eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

function BarberoFormDialog({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Barbero | null;
  onSubmit: (data: {
    nombre: string;
    foto: string;
    especialidad: string;
    rating: number;
    activo: boolean;
    horarios: Horario[];
  }) => Promise<void>;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = React.useState(initial?.nombre ?? "");
  const [foto, setFoto] = React.useState(initial?.foto ?? "");
  const [especialidad, setEspecialidad] = React.useState(
    initial?.especialidad ?? ""
  );
  const [rating, setRating] = React.useState(
    initial ? String(initial.rating) : "5"
  );
  const [activo, setActivo] = React.useState(initial?.activo ?? true);
  const [horarios, setHorarios] = React.useState<Horario[]>(
    initial?.horarios ?? []
  );
  const [saving, setSaving] = React.useState(false);

  // Working hours presets per day (initial fill): if no horarios, default to
  // Lun-Vie 10-14 y 16-20; Sab 10-14.
  React.useEffect(() => {
    if (!initial && horarios.length === 0) {
      const base: Horario[] = [];
      [1, 2, 3, 4, 5].forEach((d) => {
        base.push({ diaSemana: d, horaInicio: "10:00", horaFin: "14:00" });
        base.push({ diaSemana: d, horaInicio: "16:00", horaFin: "20:00" });
      });
      base.push({ diaSemana: 6, horaInicio: "10:00", horaFin: "14:00" });
      setHorarios(base);
    }
     
  }, [initial]);

  function updateHorario(idx: number, patch: Partial<Horario>) {
    setHorarios((h) =>
      h.map((x, i) => (i === idx ? { ...x, ...patch } : x))
    );
  }
  function removeHorario(idx: number) {
    setHorarios((h) => h.filter((_, i) => i !== idx));
  }
  function addHorario() {
    setHorarios((h) => [
      ...h,
      { diaSemana: 1, horaInicio: "10:00", horaFin: "14:00" },
    ]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !foto.trim() || !especialidad.trim()) {
      toast.error("Completa todos los campos.");
      return;
    }
    const r = Number(rating);
    if (Number.isNaN(r) || r < 0 || r > 5) {
      toast.error("Rating inválido (0 a 5).");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        foto: foto.trim(),
        especialidad: especialidad.trim(),
        rating: r,
        activo,
        horarios,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto border-gold/30 bg-[#1a1a1a] text-cream sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-gold">
          {initial ? "Editar barbero" : "Nuevo barbero"}
        </DialogTitle>
        <DialogDescription className="text-[#a3a3a3]">
          Completa los datos del barbero y sus horarios.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-cream">
              Nombre
            </Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={100}
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="foto" className="text-cream">
              Iniciales (foto)
            </Label>
            <Input
              id="foto"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              required
              maxLength={3}
              placeholder="Ej. CM"
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="especialidad" className="text-cream">
              Especialidad
            </Label>
            <Input
              id="especialidad"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
              maxLength={80}
              placeholder="Ej. Fades y diseños"
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-cream">
              Rating (0–5)
            </Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md border border-gold/15 bg-[#0f0f0f] p-3">
          <Label htmlFor="activo" className="text-cream">
            Activo (disponible para reservas)
          </Label>
          <Switch
            id="activo"
            checked={activo}
            onCheckedChange={setActivo}
          />
        </div>

        {/* Horarios */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-cream">Horarios</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHorario}
              className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold"
            >
              <Plus className="size-4" /> Agregar
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {horarios.map((h, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center gap-2 rounded-md border border-gold/15 bg-[#0f0f0f] p-2"
              >
                <select
                  value={h.diaSemana}
                  onChange={(e) =>
                    updateHorario(idx, { diaSemana: Number(e.target.value) })
                  }
                  className="col-span-4 rounded-md border border-gold/25 bg-[#1a1a1a] px-2 py-1.5 text-sm text-cream"
                  aria-label="Día"
                >
                  {DIAS.map((d, i) => (
                    <option key={i} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
                <Input
                  type="time"
                  value={h.horaInicio}
                  onChange={(e) =>
                    updateHorario(idx, { horaInicio: e.target.value })
                  }
                  className="col-span-3 bg-[#1a1a1a] border-gold/25 text-cream"
                  aria-label="Inicio"
                />
                <Input
                  type="time"
                  value={h.horaFin}
                  onChange={(e) =>
                    updateHorario(idx, { horaFin: e.target.value })
                  }
                  className="col-span-3 bg-[#1a1a1a] border-gold/25 text-cream"
                  aria-label="Fin"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHorario(idx)}
                  className="col-span-2 text-[#a3a3a3] hover:text-[#8b1a1a]"
                  aria-label="Quitar horario"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {horarios.length === 0 && (
              <p className="py-3 text-center text-xs text-[#737373]">
                Sin horarios. Agrega al menos uno.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-[#a3a3a3] hover:text-cream"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="gold-gradient text-[#0f0f0f] shadow-gold"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : initial ? (
              "Guardar"
            ) : (
              "Crear"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
