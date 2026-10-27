import type { Metadata } from "next";
import { Bebas_Neue, Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/site/theme-provider";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barbería Corte Real | Cortes clásicos y modernos en Delicias, Chihuahua",
  description:
    "Barbería premium en Delicias, Chihuahua. Cortes clásicos, fades, diseño de ceja, arreglo de barba. Reserva tu cita en línea con los mejores barberos.",
  keywords: [
    "barbería",
    "corte de cabello",
    "Delicias",
    "Chihuahua",
    "fade",
    "barba",
    "reserva en línea",
  ],
  authors: [{ name: "Barbería Corte Real" }],
  openGraph: {
    title: "Barbería Corte Real",
    description:
      "Cortes clásicos y modernos en Delicias, Chihuahua. Reserva tu cita en línea.",
    siteName: "Barbería Corte Real",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbería Corte Real",
    description:
      "Cortes clásicos y modernos en Delicias, Chihuahua. Reserva tu cita en línea.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${bebas.variable} ${oswald.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          {children}
          <SonnerToaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast:
                  "bg-[#1a1a1a] border border-[#d4af37]/30 text-[#f5f5f5] shadow-gold",
                description: "text-[#a3a3a3]",
                actionButton: "bg-[#d4af37] text-[#0f0f0f]",
                cancelButton: "bg-[#2a2a2a] text-[#f5f5f5]",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
