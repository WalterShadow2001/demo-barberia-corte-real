import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "admin_session";

/** Returns true if the current request is authenticated as admin. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "true";
}

/** Throws a redirect to /admin/login if not authenticated. Use in admin pages. */
export async function requireAdmin(): Promise<void> {
  const ok = await isAdmin();
  if (!ok) {
    redirect("/admin/login");
  }
}
