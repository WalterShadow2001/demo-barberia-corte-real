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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMin: number;
  icono: string | null;
};

export function ServiciosManager() {
  const [items, setItems] = React.useState<Servicio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Servicio | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/servicios", { cache: "no-store" });
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
  function openEdit(s: Servicio) {
    setEditing(s);
    setDialogOpen(true);
  }

  async function onSubmit(data: Omit<Servicio, "id">) {
    try {
      if (editing) {
        const r = await fetch(`/api/servicios/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? "Error al actualizar");
        toast.success("Servicio actualizado.");
      } else {
        const r = await fetch("/api/servicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? "Error al crear");
        toast.success("Servicio creado.");
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
      const r = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error al eliminar");
      toast.success(j?.soft ? j.message : "Servicio eliminado.");
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
          <h1 className="font-display text-3xl text-cream">Servicios</h1>
          <p className="text-sm text-[#a3a3a3]">
            Crea, edita y elimina los servicios del catálogo.
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
                <Plus className="size-4" /> Nuevo servicio
              </Button>
            </DialogTrigger>
            <ServicioFormDialog
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
              No hay servicios. Crea el primero.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/15 hover:bg-transparent">
                    <TableHead className="text-gold">Icono</TableHead>
                    <TableHead className="text-gold">Nombre</TableHead>
                    <TableHead className="hidden text-gold md:table-cell">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right text-gold">Precio</TableHead>
                    <TableHead className="text-right text-gold">Min</TableHead>
                    <TableHead className="text-right text-gold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((s) => (
                    <TableRow
                      key={s.id}
                      className="border-gold/10 hover:bg-gold/5"
                    >
                      <TableCell className="text-2xl">
                        {s.icono ?? "✂️"}
                      </TableCell>
                      <TableCell className="font-medium text-cream">
                        {s.nombre}
                      </TableCell>
                      <TableCell className="hidden max-w-xs text-sm text-[#a3a3a3] md:table-cell">
                        <span className="line-clamp-2">{s.descripcion}</span>
                      </TableCell>
                      <TableCell className="text-right text-cream">
                        ${s.precio.toLocaleString("es-MX")}
                      </TableCell>
                      <TableCell className="text-right text-cream">
                        {s.duracionMin}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(s)}
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
                                  ¿Eliminar servicio?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#a3a3a3]">
                                  Vas a eliminar <strong>{s.nombre}</strong>.
                                  Esta acción no se puede deshacer. Si hay
                                  reservas ligadas, no se permitirá la
                                  eliminación.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gold/30 text-cream hover:bg-gold/10">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(s.id)}
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

function ServicioFormDialog({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Servicio | null;
  onSubmit: (data: Omit<Servicio, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = React.useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = React.useState(
    initial?.descripcion ?? ""
  );
  const [precio, setPrecio] = React.useState(
    initial ? String(initial.precio) : ""
  );
  const [duracionMin, setDuracionMin] = React.useState(
    initial ? String(initial.duracionMin) : "30"
  );
  const [icono, setIcono] = React.useState(initial?.icono ?? "");
  const [saving, setSaving] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) {
      toast.error("Nombre y descripción son obligatorios.");
      return;
    }
    const p = Number(precio);
    const d = parseInt(duracionMin, 10);
    if (Number.isNaN(p) || p < 0) {
      toast.error("Precio inválido.");
      return;
    }
    if (Number.isNaN(d) || d <= 0) {
      toast.error("Duración inválida.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: p,
        duracionMin: d,
        icono: icono.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogContent className="border-gold/30 bg-[#1a1a1a] text-cream">
      <DialogHeader>
        <DialogTitle className="text-gold">
          {initial ? "Editar servicio" : "Nuevo servicio"}
        </DialogTitle>
        <DialogDescription className="text-[#a3a3a3]">
          Completa los datos del servicio.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1 space-y-2">
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
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <Label htmlFor="icono" className="text-cream">
              Icono (emoji, opcional)
            </Label>
            <Input
              id="icono"
              value={icono}
              onChange={(e) => setIcono(e.target.value)}
              maxLength={4}
              placeholder="✂️"
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion" className="text-cream">
            Descripción
          </Label>
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={3}
            className="bg-[#0f0f0f] border-gold/25 text-cream resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="precio" className="text-cream">
              Precio (MXN)
            </Label>
            <Input
              id="precio"
              type="number"
              inputMode="decimal"
              step="1"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duracionMin" className="text-cream">
              Duración (min)
            </Label>
            <Input
              id="duracionMin"
              type="number"
              inputMode="numeric"
              step="5"
              min="5"
              value={duracionMin}
              onChange={(e) => setDuracionMin(e.target.value)}
              required
              className="bg-[#0f0f0f] border-gold/25 text-cream"
            />
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
