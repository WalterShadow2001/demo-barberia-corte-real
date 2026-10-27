import Link from "next/link";
import { Scissors, Instagram, Facebook, Phone, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-gold/20 bg-[#0a0a0a] text-[#d4d4d4]"
      role="contentinfo"
    >
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
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
            <p className="text-sm text-[#a3a3a3]">
              Barbería premium en Delicias, Chihuahua. Cortes clásicos y
              modernos, fades, barbas y diseños con el mejor equipo.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="grid size-9 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-[#0f0f0f]"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="grid size-9 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-[#0f0f0f]"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="hover:text-gold transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/barberos"
                  className="hover:text-gold transition-colors"
                >
                  Barberos
                </Link>
              </li>
              <li>
                <Link
                  href="/galeria"
                  className="hover:text-gold transition-colors"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonios"
                  className="hover:text-gold transition-colors"
                >
                  Testimonios
                </Link>
              </li>
              <li>
                <Link
                  href="/reservar"
                  className="hover:text-gold transition-colors"
                >
                  Reservar cita
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm text-[#a3a3a3]">
              <li>Corte clásico</li>
              <li>Fade / degradado</li>
              <li>Arreglo de barba</li>
              <li>Diseño de ceja</li>
              <li>Paquete completo</li>
              <li>Corte niño</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-[#a3a3a3]">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0 text-gold" />
                <span>
                  Av. Independencia 45
                  <br />
                  Centro, Delicias, Chih.
                </span>
              </li>
              <li>
                <a
                  href="tel:+526394721234"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Phone className="size-4 text-gold" />
                  +52 639 472 1234
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="size-4 mt-0.5 shrink-0 text-gold" />
                <span>
                  Lun – Vie: 10:00–14:00 / 16:00–20:00
                  <br />
                  Sábado: 10:00–14:00
                  <br />
                  Domingo: Cerrado
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold/10 pt-6 text-xs text-[#737373] sm:flex-row">
          <p>
            © {new Date().getFullYear()} Barbería Corte Real. Todos los derechos
            reservados.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Acceso administradores
            </Link>
            <span>Hecho en Delicias, Chihuahua 🇲🇽</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
