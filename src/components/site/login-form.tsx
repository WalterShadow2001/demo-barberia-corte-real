"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      toast.error("Ingresa la contraseña.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        toast.error(data?.error ?? "No se pudo iniciar sesión.");
        return;
      }
      toast.success("Acceso concedido.");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-gold/30 bg-[#1a1a1a]/80 backdrop-blur">
      <CardContent className="space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-cream">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-[#0f0f0f] border-gold/25 text-cream placeholder:text-[#737373]"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-[#0f0f0f] shadow-gold hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            Entrar
          </Button>
        </form>
        <p className="text-center text-xs text-[#737373]">
          Contraseña de demo: <span className="text-gold">admin123</span>
        </p>
      </CardContent>
    </Card>
  );
}
