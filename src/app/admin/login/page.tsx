import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/site/login-form";
import { Scissors } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acceso administradores | Barbería Corte Real",
};

export default async function AdminLoginPage() {
  const admin = await isAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-4 py-12 text-[#f5f5f5]">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full gold-gradient text-[#0f0f0f] shadow-gold">
            <Scissors className="size-7" />
          </span>
          <h1 className="font-display text-3xl text-cream">CORTE REAL</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-[#a3a3a3]">
            Acceso administradores
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-[#737373]">
          ¿Eres cliente?{" "}
          <a href="/" className="text-gold hover:underline">
            Volver a la página principal
          </a>
        </p>
      </div>
    </div>
  );
}
