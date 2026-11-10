import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { MotionConfig } from "motion/react";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.boubane.com"),
  title: "Boubane · Studio Web & Création de Sites Sur-Mesure | Segré (49) & France",
  description:
    "Studio d'artisanat web à Segré-en-Anjou Bleu (49500). Conception de sites vitrines sur-mesure d'exception pour artisans, cabinets et PME d'Anjou. 0 € en création, livré en 5 jours, liberté totale sans engagement.",
  icons: {
    icon: "/assets/boubane-logo.png",
    apple: "/assets/boubane-logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    locale: "fr_FR",
    type: "website",
    url: "https://www.boubane.com/",
    siteName: "Boubane",
    title: "Boubane · Studio Web & Création de Sites Sur-Mesure | Segré (49) & France",
    description:
      "Conception et développement de sites vitrines d'exception à Segré-en-Anjou Bleu et dans tout le Haut-Anjou. 100% de la création offerte à nos frais.",
    images: ["/assets/boubane-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boubane · Studio Web & Création de Sites Sur-Mesure | Segré (49)",
    description:
      "Des vitrines sur-mesure d'exception pour artisans et entreprises de Segré et d'Anjou. 100% offert, zéro engagement.",
    images: ["/assets/boubane-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="bg-[#FAF8F5] text-[#0C0A08] font-sans antialiased">
        <div className="ambient-glow" aria-hidden="true" />
        <div className="atelier-grain" aria-hidden="true" />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Script src="/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

