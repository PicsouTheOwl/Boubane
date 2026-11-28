import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles & Guides · Création Web, Coûts d'Agence & IA | Boubane",
  description:
    "Analyses concrètes sur la création de sites vitrines à 0 €, le vrai coût des abonnements d'agence, la vitesse mobile et le référencement local.",
  alternates: {
    canonical: "https://www.boubane.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
