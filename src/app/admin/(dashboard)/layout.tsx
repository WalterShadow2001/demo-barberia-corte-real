import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/site/admin-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
