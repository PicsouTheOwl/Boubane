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
  description: "Déployez des agents IA directement dans votre entreprise. Ils répondent à vos mails, préparent vos rapports, automatisent vos tâches. 100% local, données privées.",
  keywords: ["agent IA local", "automatisation PME", "IA sécurisé", "email automatique", "Boubane"],
  openGraph: {
    title: "Boubane — Agents IA Locaux pour PME",
    description: "Des agents IA intégrés à votre environnement de travail. 100% local, données privées.",
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
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col noise grid-bg scan-line">
        {children}
      </body>
    </html>
  );
}
