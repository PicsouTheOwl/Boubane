import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hébergement Direct & Pass Clé en Main (15 €/an) · Boubane",
  description:
    "Votre hébergement web au prix réel sans marge cachée : compte direct à votre nom (~5 €/mois) ou Pass Hébergement Boubane à 15 €/an sans engagement.",
  alternates: {
    canonical: "https://www.boubane.com/hebergement",
  },
};

export default function HebergementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
