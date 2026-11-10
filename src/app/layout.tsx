import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { BarberiaShell } from "@/components/site/barberia-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corte Real | Barbería Premium en Delicias, Chihuahua",
  description:
    "Barbería premium en Delicias, Chihuahua. Cortes clásicos, fades, barba, afeitado tradicional y diseños. Reserva tu cita con los mejores barberos.",
  keywords: [
    "barbería",
    "barberia",
    "corte",
    "Delicias",
    "Chihuahua",
    "Corte Real",
    "fade",
    "barba",
    "afeitado",
    "navaja",
  ],
  authors: [{ name: "Corte Real" }],
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    title: "Corte Real | Barbería Premium",
    description: "El arte de cortar bien. Barbería premium en Delicias, Chihuahua.",
    siteName: "Corte Real",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BarberiaShell>{children}</BarberiaShell>
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#F5E6D3",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
