import { ReservasManager } from "@/components/site/reservas-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservas | Admin · Barbería Corte Real",
};

export default function AdminReservasPage() {
  return <ReservasManager />;
}
