import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Wraps public-facing pages with the site header + footer.
 * Pages should still use `<div className="min-h-screen flex flex-col">` at root
 * and apply `mt-auto` to footer (handled here).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-[#f5f5f5]">
      <SiteHeader />
      <main className="flex-1" role="main">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
