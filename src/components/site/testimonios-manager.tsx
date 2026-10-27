"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

type Testimonio = {
  id: string;
  autor: string;
  texto: string;
  rating: number;
  aprobado: boolean;
};

export function TestimoniosManager() {
  const [items, setItems] = React.useState<Testimonio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/testimonios/todas", { cache: "no-store" });
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
    load();
  }, []);

  async function aprobar(id: string) {
    try {
      const r = await fetch(`/api/testimonios/${id}/aprobar`, {
        method: "PUT",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error");
      toast.success("Testimonio aprobado.");
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(msg);
    }
  }

  async function onDelete(id: string) {
    try {
      const r = await fetch(`/api/testimonios/${id}`, {
        method: "DELETE",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error ?? "Error");
      toast.success("Testimonio eliminado.");
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(msg);
    }
  }

  const pendientes = items.filter((t) => !t.aprobado);
  const aprobados = items.filter((t) => t.aprobado);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Testimonios</h1>
          <p className="text-sm text-[#a3a3a3]">
            Aprueba o elimina los testimonios enviados por los clientes.
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
          No hay testimonios.
        </p>
      ) : (
        <div className="space-y-6">
          {pendientes.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-gold">
                <span className="grid size-6 place-items-center rounded-full bg-gold/15">
                  <Star className="size-3.5" />
                </span>
                Pendientes de aprobación ({pendientes.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {pendientes.map((t) => (
                  <TestimonioCard
                    key={t.id}
                    t={t}
                    onApprove={() => aprobar(t.id)}
                    onDelete={() => onDelete(t.id)}
                  />
                ))}
              </div>
            </section>
          )}
          {aprobados.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-cream">
                <span className="grid size-6 place-items-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                </span>
                Aprobados ({aprobados.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {aprobados.map((t) => (
                  <TestimonioCard
                    key={t.id}
                    t={t}
                    onDelete={() => onDelete(t.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TestimonioCard({
  t,
  onApprove,
  onDelete,
}: {
  t: Testimonio;
  onApprove?: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < t.rating
                      ? "size-4 fill-gold text-gold"
                      : "size-4 text-[#525252]"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-[#737373]">{t.rating}/5</span>
          </div>
          <Badge
            className={
              t.aprobado
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-gold/15 text-gold"
            }
          >
            {t.aprobado ? "Aprobado" : "Pendiente"}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-[#d4d4d4]">{t.texto}</p>
        <p className="text-xs text-[#737373]">— {t.autor}</p>
        <div className="flex items-center justify-end gap-2 border-t border-gold/10 pt-3">
          {onApprove && (
            <Button
              size="sm"
              onClick={onApprove}
              className="gold-gradient text-[#0f0f0f] shadow-gold"
            >
              <CheckCircle2 className="size-4" /> Aprobar
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-[#8b1a1a]/40 text-[#f5e6d3] hover:bg-[#8b1a1a]/20"
              >
                <Trash2 className="size-4" /> Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-gold/30 bg-[#1a1a1a] text-cream">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar testimonio?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#a3a3a3]">
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gold/30 text-cream hover:bg-gold/10">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-[#8b1a1a] text-cream hover:bg-[#8b1a1a]/80"
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
