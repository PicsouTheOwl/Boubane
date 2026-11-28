import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commander mon projet · Site Vitrine 0 € & Modules IA | Boubane",
  description:
    "Finalisez votre demande de site vitrine à 0 € d'honoraires et d'automatisations IA à prix fixe. Réponse directe de Léo sous 24h, sans acompte.",
  alternates: {
    canonical: "https://www.boubane.com/commander",
  },
};

export default function CommanderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
