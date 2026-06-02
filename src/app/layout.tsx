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
  title: "Boubane — Agents IA Locaux pour PME",
  description: "Installez un agent IA directement dans votre entreprise. Sur votre hardware, votre réseau, vos données. Réponses automatiques aux mails, rapports, support — tout tourne chez vous.",
  keywords: ["agent IA local", "IA on-premise", "automatisation PME", "Mac Mini IA", "Boubane"],
  openGraph: {
    title: "Boubane — Agents IA Locaux pour PME",
    description: "Un agent IA qui tourne sur votre hardware, dans votre entreprise. Vos données restent chez vous.",
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
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
