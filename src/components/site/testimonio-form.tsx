"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TestimonioForm() {
  const [autor, setAutor] = React.useState("");
  const [texto, setTexto] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!autor.trim() || !texto.trim()) {
      toast.error("Completa tu nombre y tu testimonio.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autor: autor.trim(),
          texto: texto.trim(),
          rating,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      toast.success(
        "¡Gracias por tu testimonio! Lo revisaremos y lo publicaremos pronto."
      );
      setAutor("");
      setTexto("");
      setRating(5);
    } catch {
      toast.error("Error de red. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl space-y-5 rounded-2xl border border-gold/20 bg-[#1a1a1a]/80 p-6 backdrop-blur sm:p-8"
      aria-label="Formulario de testimonio"
    >
      <div className="space-y-2">
        <Label htmlFor="autor" className="text-cream">
          Tu nombre
        </Label>
        <Input
          id="autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          maxLength={100}
          placeholder="Ej. Juan Pérez"
          className="bg-[#0f0f0f] border-gold/25 text-cream placeholder:text-[#737373]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-cream">Tu calificación</Label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} estrella${value > 1 ? "s" : ""}`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
                className="rounded-md p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-7 transition-colors",
                    (hoverRating || rating) >= value
                      ? "fill-gold text-gold"
                      : "text-[#525252]"
                  )}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-[#a3a3a3]">
            {rating} / 5
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="texto" className="text-cream">
          Tu testimonio
        </Label>
        <Textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={500}
          rows={5}
          placeholder="Cuéntanos cómo te fue en la barbería. (máx 500 caracteres)"
          className="bg-[#0f0f0f] border-gold/25 text-cream placeholder:text-[#737373] resize-none"
          required
        />
        <p className="text-right text-xs text-[#737373]">
          {texto.length}/500
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gold-gradient text-[#0f0f0f] shadow-gold hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Enviando…" : "Enviar testimonio"}
      </Button>
      <p className="text-center text-xs text-[#737373]">
        Tu testimonio se publicará después de que el equipo lo revise.
      </p>
    </motion.form>
  );
}
