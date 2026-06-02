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
  title: "Boubane — Agents IA Sécurisés pour PME",
  description: "Déployez des agents IA autonomes et sécurisés dans votre entreprise. Boubane conçoit, installe et maintient votre assistant IA personnalisé.",
  keywords: ["agent IA", "intelligence artificielle", "PME", "automatisation", "assistant IA", "Boubane"],
  openGraph: {
    title: "Boubane — Agents IA Sécurisés pour PME",
    description: "Déployez des agents IA autonomes et sécurisés dans votre entreprise.",
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
      <body className="min-h-full flex flex-col noise-bg grid-bg">
        {children}
      </body>
    </html>
  );
}
