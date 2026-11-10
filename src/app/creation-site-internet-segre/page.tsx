import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SegreInteractiveExperience } from "@/components/segre/SegreInteractiveExperience";

export const metadata: Metadata = {
  title: "Création de Site Internet à Segré (49500) · Studio Web Sur-Mesure | Boubane",
  description:
    "Studio d'artisanat web à Segré-en-Anjou Bleu (49500). Conception de sites vitrines sur-mesure à 0 € d'honoraires pour artisans, cabinets et PME du Haut-Anjou (Segré, Le Lion-d'Angers, Château-Gontier, Angers).",
  alternates: {
    canonical: "https://www.boubane.com/creation-site-internet-segre",
  },
};

const LOCAL_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Boubane · Création Site Internet Segré",
  url: "https://www.boubane.com/creation-site-internet-segre",
  telephone: "+33778310346",
  priceRange: "0 €",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Segré-en-Anjou Bleu",
    postalCode: "49500",
    addressRegion: "Pays de la Loire",
    addressCountry: "FR",
  },
  areaServed: [
    "Segré-en-Anjou Bleu",
    "Le Lion-d'Angers",
    "Château-Gontier-sur-Mayenne",
    "Candé",
    "Pouancé",
    "Châteaubriant",
    "Angers",
  ],
};

export default function SegreLocalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_JSON_LD) }}
      />
      <SiteHeader isHome={false} />
      <SegreInteractiveExperience />
      <SiteFooter />
    </>
  );
}
