import { NextResponse } from "next/server";
import { verifyAdminPassword, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { error: "Contraseña requerida" },
        { status: 400 }
      );
    }
    const ok = await verifyAdminPassword(password);
    if (!ok) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }
    await setAdminCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/login error:", e);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
