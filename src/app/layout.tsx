import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { MotionConfig } from "motion/react";
import { AtelierCommandPalette } from "@/components/AtelierCommandPalette";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#FAF8F5" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.boubane.com"),
  title: "Boubane · Site Vitrine Sur-Mesure à 0 € & Automatisations IA | Segré & France",
  description:
    "Conception de sites vitrines sur-mesure à 0 € d'honoraires (livrés en 5 jours, code 100 % à vous) et automatisations IA à prix fixe branchées sur Gmail, Outlook, Excel et WhatsApp.",
  icons: {
    icon: "/assets/boubane-logo.png",
    apple: "/assets/boubane-logo.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.boubane.com/",
  },
  openGraph: {
    locale: "fr_FR",
    type: "website",
    url: "https://www.boubane.com/",
    siteName: "Boubane",
    title: "Boubane · Site Vitrine Sur-Mesure à 0 € & Automatisations IA",
    description:
      "Votre site vitrine sur-mesure créé à 0 € en 5 jours ouvrés + automatisations IA à prix fixe sans abonnement imposé.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boubane · Site Vitrine Sur-Mesure à 0 € & Automatisations IA",
    description:
      "Votre site vitrine sur-mesure créé à 0 € en 5 jours ouvrés + automatisations IA à prix fixe sans abonnement.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-[#FAF8F5] text-[#0C0A08] font-sans antialiased">
        <div className="ambient-glow" aria-hidden="true" />
        <div className="atelier-grain" aria-hidden="true" />
        <MotionConfig reducedMotion="user">
          {children}
          <AtelierCommandPalette />
        </MotionConfig>
        <Script src="/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

