import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prendre rendez-vous avec Léo (15–30 min) · Boubane",
  description:
    "Réservez un échange téléphonique ou visio sans engagement avec Léo Saillour pour cadrer votre site vitrine à 0 € ou vos automatisations IA.",
  alternates: {
    canonical: "https://www.boubane.com/rdv",
  },
};

export default function RdvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
