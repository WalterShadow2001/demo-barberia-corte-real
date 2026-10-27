import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Users,
  MessageSquare,
  Scissors,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export const metadata = {
  title: "Dashboard | Admin · Barbería Corte Real",
};

export default async function AdminDashboardPage() {
  const today = todayISO();

  const [
    todayCount,
    upcomingReservas,
    pendingTestimonios,
    totalBarberos,
    totalServicios,
    totalReservas,
    completadasCount,
    canceladasCount,
    topBarberosRaw,
  ] = await Promise.all([
    prisma.reserva.count({ where: { fecha: today } }),
    prisma.reserva.findMany({
      where: { estado: "pendiente" },
      include: { barbero: true, servicio: true },
      orderBy: [{ fecha: "asc" }, { hora: "asc" }],
      take: 6,
    }),
    prisma.testimonio.count({ where: { aprobado: false } }),
    prisma.barbero.count(),
    prisma.servicio.count(),
    prisma.reserva.count(),
    prisma.reserva.count({ where: { estado: "completada" } }),
    prisma.reserva.count({ where: { estado: "cancelada" } }),
    prisma.reserva.groupBy({
      by: ["barberoId"],
      _count: { _all: true },
      orderBy: { _count: { barberoId: "desc" } },
      take: 5,
    }),
  ]);

  const topBarberoIds = topBarberosRaw.map((b) => b.barberoId);
  const topBarberos = await prisma.barbero.findMany({
    where: { id: { in: topBarberoIds } },
  });
  const topBarberosWithCount = topBarberosRaw
    .map((row) => {
      const b = topBarberos.find((x) => x.id === row.barberoId);
      if (!b) return null;
      return {
        barbero: b,
        count: row._count._all,
      };
    })
    .filter(Boolean) as { barbero: { id: string; nombre: string; foto: string }; count: number }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">Dashboard</h1>
        <p className="text-sm text-[#a3a3a3]">
          Resumen de actividad de la barbería.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Kpi
          icon={<CalendarDays className="size-5" />}
          label="Reservas hoy"
          value={todayCount.toString()}
          tone="gold"
        />
        <Kpi
          icon={<Hourglass className="size-5" />}
          label="Pendientes"
          value={upcomingReservas.length.toString()}
          tone="cream"
        />
        <Kpi
          icon={<MessageSquare className="size-5" />}
          label="Testimonios por aprobar"
          value={pendingTestimonios.toString()}
          tone="red"
        />
        <Kpi
          icon={<Users className="size-5" />}
          label="Barberos activos"
          value={totalBarberos.toString()}
          tone="cream"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<Scissors className="size-5" />} label="Servicios" value={totalServicios.toString()} tone="cream" />
        <Kpi icon={<TrendingUp className="size-5" />} label="Reservas totales" value={totalReservas.toString()} tone="gold" />
        <Kpi
          icon={<CheckCircle2 className="size-5" />}
          label="Completadas / Canceladas"
          value={`${completadasCount} / ${canceladasCount}`}
          tone="cream"
        />
      </div>

      {/* Próximas reservas */}
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg text-cream">
              Próximas reservas
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-gold">
              <Link href="/admin/reservas">Ver todas</Link>
            </Button>
          </div>
          {upcomingReservas.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#737373]">
              No hay reservas pendientes.
            </p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {upcomingReservas.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-sm text-gold ring-1 ring-gold/30">
                      {r.barbero.foto}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-cream">
                        {r.clienteNombre}
                      </p>
                      <p className="text-xs text-[#a3a3a3]">
                        {r.servicio.nombre} · {r.barbero.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold">
                      {format(parseISO(`${r.fecha}T00:00:00`), "d MMM", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-xs text-[#a3a3a3]">
                      <Clock className="mr-1 inline size-3" />
                      {r.hora}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Top barberos */}
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-lg text-cream">
            Barberos con más reservas
          </h2>
          {topBarberosWithCount.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#737373]">
              Aún no hay datos.
            </p>
          ) : (
            <ul className="space-y-3">
              {topBarberosWithCount.map((t, i) => (
                <li
                  key={t.barbero.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-gold/10 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-gold/60">
                      #{i + 1}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#2a1a0a] to-[#0f0f0f] font-display text-sm text-gold ring-1 ring-gold/30">
                      {t.barbero.foto}
                    </span>
                    <span className="text-sm font-medium text-cream">
                      {t.barbero.nombre}
                    </span>
                  </div>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    {t.count} reservas
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-lg text-cream">
            Accesos rápidos
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold">
              <Link href="/admin/servicios">Gestionar servicios</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold">
              <Link href="/admin/barberos">Gestionar barberos</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold">
              <Link href="/admin/reservas">Ver reservas</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/30 text-cream hover:bg-gold/10 hover:text-gold">
              <Link href="/admin/testimonios">
                Testimonios por aprobar ({pendingTestimonios})
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "gold" | "cream" | "red";
}) {
  const toneClass =
    tone === "gold"
      ? "bg-gold/10 text-gold"
      : tone === "red"
      ? "bg-[#8b1a1a]/30 text-[#f5e6d3]"
      : "bg-[#f5e6d3]/10 text-[#f5e6d3]";
  return (
    <Card className="border-gold/20 bg-[#1a1a1a]/80 backdrop-blur">
      <CardContent className="flex items-center gap-3 p-4">
        <span className={`grid size-10 place-items-center rounded-full ${toneClass}`}>
          {icon}
        </span>
        <div>
          <p className="font-display text-2xl text-cream">{value}</p>
          <p className="text-xs uppercase tracking-wider text-[#a3a3a3]">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
