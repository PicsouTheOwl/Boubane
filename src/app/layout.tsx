import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boubane — Votre Allié IA pour PME | Agents Autonomes & Sécurisés",
  description: "Boubane déploie des agents IA autonomes qui automatisent vos tâches répétitives, réduisent vos coûts et vous aident à scaler — sans embaucher. Résultats concrets en 48h.",
  keywords: ["agent IA", "intelligence artificielle PME", "automatisation entreprise", "assistant IA", "Boubane", "IA sécurisé", "agent autonome"],
  openGraph: {
    title: "Boubane — Votre Allié IA pour PME",
    description: "Des agents IA autonomes qui automatisent vos tâches, réduisent vos coûts et vous aident à scaler. Résultats concrets en 48h.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col noise-bg grid-bg">
        {children}
      </body>
    </html>
  );
}
