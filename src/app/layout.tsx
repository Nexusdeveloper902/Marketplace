import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
