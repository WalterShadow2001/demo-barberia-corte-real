"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MapPin,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/barberos", label: "Barberos" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
];

function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group"
      aria-label="Corte Real — Inicio"
    >
      <Image
        src="/logo.svg"
        alt="Logo Corte Real — corona, tijeras y navaja cruzadas, monograma CR"
        width={size}
        height={size}
        priority
        className="shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
      />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-gold-gradient">
            Corte Real
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-muted-foreground mt-1">
            Barbería Premium
          </span>
        </span>
      )}
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
      {NAV.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "nav-gold-underline px-3 py-2 text-sm font-medium rounded-md transition-colors",
              active
                ? "text-primary"
                : "text-foreground/75 hover:text-primary"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-primary hover:text-primary"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[340px] bg-[#0F0F0F] border-r border-[rgba(212,175,55,0.2)]"
      >
        <div className="flex items-center justify-between mb-8">
          <Logo size={36} />
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cerrar"
              className="text-muted-foreground hover:text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-md transition-colors border-l-2",
                    active
                      ? "text-primary border-primary bg-[rgba(212,175,55,0.08)]"
                      : "text-foreground/80 hover:text-primary border-transparent hover:bg-[rgba(212,175,55,0.05)]"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
          <SheetClose asChild>
            <Link
              href="/reservar"
              className="btn-gold-glow mt-4 px-4 py-3 text-sm rounded-md text-center"
            >
              Reservar Cita
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/admin"
              className="mt-4 px-4 py-2.5 text-xs text-muted-foreground hover:text-primary rounded-md border border-[rgba(212,175,55,0.15)] text-center"
            >
              Acceso Administrador
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function OpenBadge() {
  return (
    <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.05)]">
      <span className="dot-pulse-gold" aria-hidden="true" />
      <span className="text-xs font-medium text-primary">Abierto ahora</span>
    </div>
  );
}

export function BarberiaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[rgba(212,175,55,0.18)] bg-[#0F0F0F]/85 backdrop-blur supports-[backdrop-filter]:bg-[#0F0F0F]/70">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MobileNav pathname={pathname} />
              <Logo />
            </div>
            <DesktopNav pathname={pathname} />
            <div className="flex items-center gap-3">
              <OpenBadge />
              <Link
                href="/reservar"
                className="btn-gold-glow hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm"
              >
                <Calendar className="h-4 w-4" />
                Reservar Cita
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(212,175,55,0.18)] bg-[#0A0A0A]">
      <div className="divider-barber w-full opacity-60" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.svg"
                alt="Logo Corte Real"
                width={48}
                height={48}
                className="drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-2xl font-bold text-gold-gradient">
                  Corte Real
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mt-1">
                  Barbería Premium
                </span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              El arte de cortar bien. Barbería premium en Delicias, Chihuahua.
              Cortes clásicos, fades, barba y afeitado tradicional con maestros
              barberos y productos de la más alta calidad.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] text-primary hover:bg-primary hover:text-[#0F0F0F] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] text-primary hover:bg-primary hover:text-[#0F0F0F] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-primary">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/reservar"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Reservar Cita
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-primary">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Av. Reforma 425, Centro<br />Delicias, Chihuahua, MX
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+526394720099" className="text-muted-foreground hover:text-primary transition-colors">
                  (639) 472 0099
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:hola@cortereal.mx" className="text-muted-foreground hover:text-primary transition-colors">
                  hola@cortereal.mx
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Lun – Sáb: 10:00 – 20:00<br />Domingo: Cerrado
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(212,175,55,0.12)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Corte Real Barbería. Hecho con orgullo en Delicias, Chihuahua.</p>
          <p className="tracking-wider uppercase">El arte de cortar bien</p>
        </div>
      </div>
    </footer>
  );
}
