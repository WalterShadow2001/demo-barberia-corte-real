import { ServiciosManager } from "@/components/site/servicios-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Servicios | Admin · Barbería Corte Real",
};

export default function AdminServiciosPage() {
  return <ServiciosManager />;
}
