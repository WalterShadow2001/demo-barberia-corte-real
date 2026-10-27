"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Scissors, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/barberos", label: "Barberos" },
  { href: "/galeria", label: "Galería" },
  { href: "/testimonios", label: "Testimonios" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gold/20 bg-[#0f0f0f]/85 backdrop-blur supports-[backdrop-filter]:bg-[#0f0f0f]/70"
      role="banner"
    >
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-gold/10 bg-[#0a0a0a]">
        <div className="container mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-[#a3a3a3]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-gold" />
              Av. Independencia 45, Delicias, Chihuahua
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-gold" />
              Lun–Sáb · 10:00–20:00
            </span>
          </div>
          <a
            href="tel:+526394721234"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone className="size-3.5 text-gold" />
            +52 639 472 1234
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#f5f5f5] hover:opacity-90 transition-opacity"
          aria-label="Barbería Corte Real - Inicio"
        >
          <span className="grid size-9 place-items-center rounded-full gold-gradient text-[#0f0f0f]">
            <Scissors className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wider text-gold">
              CORTE REAL
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a3a3a3]">
              Barbería · Delicias
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-gold"
                  : "text-[#d4d4d4] hover:text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden sm:inline-flex gold-gradient text-[#0f0f0f] hover:opacity-90 shadow-gold"
          >
            <Link href="/reservar">Reservar cita</Link>
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#f5f5f5]"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#0f0f0f] border-gold/20"
            >
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex items-center gap-2 px-4 pt-6">
                <span className="grid size-9 place-items-center rounded-full gold-gradient text-[#0f0f0f]">
                  <Scissors className="size-5" />
                </span>
                <span className="font-display text-2xl tracking-wider text-gold">
                  CORTE REAL
                </span>
              </div>
              <nav
                className="mt-6 flex flex-col gap-1 px-2"
                aria-label="Navegación móvil"
              >
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-4 py-3 text-base font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-[#1a1a1a] text-gold"
                          : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-gold"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full gold-gradient text-[#0f0f0f] shadow-gold"
                  >
                    <Link href="/reservar">Reservar cita</Link>
                  </Button>
                </SheetClose>
                <div className="mt-4 space-y-2 text-sm text-[#a3a3a3]">
                  <a
                    href="tel:+526394721234"
                    className="flex items-center gap-2 hover:text-gold transition-colors"
                  >
                    <Phone className="size-4 text-gold" />
                    +52 639 472 1234
                  </a>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-gold" />
                    Av. Independencia 45, Delicias
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="size-4 text-gold" />
                    Lun–Sáb · 10:00–20:00
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
