"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scissors, LayoutDashboard, ScissorsIcon, Users, CalendarDays, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/servicios", label: "Servicios", icon: ScissorsIcon },
  { href: "/admin/barberos", label: "Barberos", icon: Users },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Sesión cerrada.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("No se pudo cerrar sesión.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-[#f5f5f5]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-[#0a0a0a]">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full gold-gradient text-[#0f0f0f]">
              <Scissors className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-wider text-gold">
                ADMIN · CORTE REAL
              </span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#a3a3a3]">
                Panel de control
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-[#a3a3a3] hover:text-gold">
              <Link href="/">Ver sitio ↗</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold"
            >
              <LogOut className="size-4" /> Salir
            </Button>
            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-cream"
                  aria-label="Abrir menú"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] border-gold/20 bg-[#0a0a0a] p-0">
                <SheetTitle className="sr-only">Menú de administración</SheetTitle>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gold/20">
                  <span className="font-display text-lg tracking-wider text-gold">
                    ADMIN
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-cream">
                      <X className="size-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-1 p-3">
                  {LINKS.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive(l.href, l.exact)
                            ? "bg-gold/10 text-gold"
                            : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-gold"
                        )}
                      >
                        <l.icon className="size-4" />
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex max-w-7xl flex-1 gap-6 px-4 py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav
            className="sticky top-20 flex flex-col gap-1 rounded-2xl border border-gold/20 bg-[#1a1a1a]/60 p-3"
            aria-label="Navegación de administración"
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(l.href, l.exact)
                    ? "bg-gold/10 text-gold"
                    : "text-[#d4d4d4] hover:bg-[#0f0f0f] hover:text-gold"
                )}
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
