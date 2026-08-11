import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Marketplace — Vehículos de Alta Gama",
  description:
    "Marketplace digital de vehículos de alta gama. Descubre, compara y adquiere los modelos más exclusivos del mundo en una experiencia de compra premium.",
  keywords: [
    "Digital Marketplace",
    "vehículos",
    "autos",
    "coches",
    "deportivos",
    "supercars",
    "marketplace",
    "alta gama",
  ],
  authors: [{ name: "Digital Marketplace" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Digital Marketplace — Vehículos de Alta Gama",
    description:
      "Descubre, compara y adquiere los modelos más exclusivos del mundo.",
    siteName: "Digital Marketplace",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketplace — Vehículos de Alta Gama",
    description:
      "Descubre, compara y adquiere los modelos más exclusivos del mundo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes de la hidratación para evitar FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('digital-marketplace-tema');
                  if (!raw) return;
                  var parsed = JSON.parse(raw);
                  var temaId = parsed && parsed.state && parsed.state.temaActivo;
                  var temas = {
                    midnight: {"--background":"oklch(0.12 0.004 75)","--foreground":"oklch(0.98 0.002 75)","--card":"oklch(0.165 0.005 75)","--popover":"oklch(0.17 0.005 75)","--primary":"oklch(0.98 0.002 75)","--primary-foreground":"oklch(0.12 0.004 75)","--secondary":"oklch(0.215 0.005 75)","--muted":"oklch(0.2 0.005 75)","--muted-foreground":"oklch(0.64 0.012 75)","--accent":"oklch(0.245 0.006 75)","--border":"oklch(1 0 0 / 8%)","--input":"oklch(1 0 0 / 12%)","--ring":"oklch(0.98 0 0 / 35%)","--signature":"oklch(0.85 0.09 80)","--success":"oklch(0.72 0.16 155)"},
                    arctic: {"--background":"oklch(0.13 0.006 240)","--foreground":"oklch(0.98 0.003 240)","--card":"oklch(0.17 0.008 240)","--popover":"oklch(0.18 0.008 240)","--primary":"oklch(0.97 0.01 240)","--primary-foreground":"oklch(0.13 0.006 240)","--secondary":"oklch(0.22 0.008 240)","--muted":"oklch(0.2 0.008 240)","--muted-foreground":"oklch(0.66 0.015 240)","--accent":"oklch(0.25 0.01 240)","--border":"oklch(1 0 0 / 8%)","--input":"oklch(1 0 0 / 12%)","--ring":"oklch(0.7 0.12 240 / 40%)","--signature":"oklch(0.72 0.12 220)","--success":"oklch(0.72 0.16 155)"},
                    emerald: {"--background":"oklch(0.12 0.006 160)","--foreground":"oklch(0.98 0.003 160)","--card":"oklch(0.165 0.008 160)","--popover":"oklch(0.17 0.008 160)","--primary":"oklch(0.97 0.01 160)","--primary-foreground":"oklch(0.12 0.006 160)","--secondary":"oklch(0.215 0.008 160)","--muted":"oklch(0.2 0.008 160)","--muted-foreground":"oklch(0.65 0.015 160)","--accent":"oklch(0.245 0.01 160)","--border":"oklch(1 0 0 / 8%)","--input":"oklch(1 0 0 / 12%)","--ring":"oklch(0.72 0.16 155 / 40%)","--signature":"oklch(0.75 0.15 155)","--success":"oklch(0.72 0.16 155)"},
                    crimson: {"--background":"oklch(0.13 0.008 25)","--foreground":"oklch(0.98 0.003 25)","--card":"oklch(0.17 0.01 25)","--popover":"oklch(0.18 0.01 25)","--primary":"oklch(0.97 0.01 25)","--primary-foreground":"oklch(0.13 0.008 25)","--secondary":"oklch(0.22 0.01 25)","--muted":"oklch(0.2 0.01 25)","--muted-foreground":"oklch(0.66 0.018 25)","--accent":"oklch(0.25 0.012 25)","--border":"oklch(1 0 0 / 8%)","--input":"oklch(1 0 0 / 12%)","--ring":"oklch(0.62 0.22 25 / 40%)","--signature":"oklch(0.65 0.22 25)","--success":"oklch(0.72 0.16 155)"},
                    royal: {"--background":"oklch(0.13 0.008 290)","--foreground":"oklch(0.98 0.003 290)","--card":"oklch(0.17 0.01 290)","--popover":"oklch(0.18 0.01 290)","--primary":"oklch(0.97 0.01 290)","--primary-foreground":"oklch(0.13 0.008 290)","--secondary":"oklch(0.22 0.01 290)","--muted":"oklch(0.2 0.01 290)","--muted-foreground":"oklch(0.66 0.018 290)","--accent":"oklch(0.25 0.012 290)","--border":"oklch(1 0 0 / 8%)","--input":"oklch(1 0 0 / 12%)","--ring":"oklch(0.6 0.2 290 / 40%)","--signature":"oklch(0.68 0.18 290)","--success":"oklch(0.72 0.16 155)"},
                    carbon: {"--background":"oklch(0.11 0.002 250)","--foreground":"oklch(0.96 0.002 250)","--card":"oklch(0.155 0.003 250)","--popover":"oklch(0.165 0.003 250)","--primary":"oklch(0.96 0.002 250)","--primary-foreground":"oklch(0.11 0.002 250)","--secondary":"oklch(0.205 0.003 250)","--muted":"oklch(0.19 0.003 250)","--muted-foreground":"oklch(0.6 0.005 250)","--accent":"oklch(0.235 0.004 250)","--border":"oklch(1 0 0 / 7%)","--input":"oklch(1 0 0 / 11%)","--ring":"oklch(0.96 0 0 / 30%)","--signature":"oklch(0.7 0.015 250)","--success":"oklch(0.72 0.16 155)"}
                  };
                  var vars = temas[temaId];
                  if (vars) {
                    Object.keys(vars).forEach(function(k) {
                      document.documentElement.style.setProperty(k, vars[k]);
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
