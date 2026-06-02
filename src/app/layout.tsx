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
  title: "Boubane — Agents IA Locaux pour PME | Automatisation Sécurisée",
  description: "Installez un agent IA directement dans votre entreprise. Sur Mac Mini, NUC ou serveur. Réponses automatiques aux mails, rapports, support — 100% local, données privées.",
  keywords: [
    "agent IA local",
    "IA on-premise",
    "automatisation PME",
    "Mac Mini IA",
    "email automatique",
    "support client IA",
    "Boubane",
    "agent IA entreprise",
  ],
  authors: [{ name: "Boubane" }],
  creator: "Boubane",
  openGraph: {
    title: "Boubane — Agents IA Locaux pour PME",
    description: "Un agent IA qui tourne sur votre hardware, dans votre entreprise. Vos données restent chez vous.",
    type: "website",
    locale: "fr_FR",
    siteName: "Boubane",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boubane — Agents IA Locaux pour PME",
    description: "Un agent IA qui tourne sur votre hardware, dans votre entreprise. Vos données restent chez vous.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#0d0d0d" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
