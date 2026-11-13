import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SegreInteractiveExperience } from "@/components/segre/SegreInteractiveExperience";
import { SEGRE_FAQS } from "@/data/segre";

export const metadata: Metadata = {
  title: "Création Site Internet Segré (49500) · Site Vitrine Artisans & PME | Boubane",
  description:
    "Création de site internet à Segré-en-Anjou Bleu (49500) et en Haut-Anjou. Site vitrine sur-mesure à 0 € d'honoraires, livré en 5 jours ouvrés pour artisans, commerces et PME (Segré, Le Lion-d'Angers, Candé, Pouancé, Château-Gontier).",
  keywords: [
    "création site internet Segré",
    "création site web Segré-en-Anjou Bleu",
    "agence web Segré 49500",
    "site vitrine artisan Haut-Anjou",
    "développeur web Segré",
    "référencement local Segré",
  ],
  alternates: {
    canonical: "https://www.boubane.com/creation-site-internet-segre",
  },
  openGraph: {
    title: "Création Site Internet à Segré (49500) | Studio Boubane",
    description:
      "Site vitrine sur-mesure à 0 € d'honoraires à Segré-en-Anjou Bleu. Livré en 5 jours ouvrés, code 100 % à vous, optimisé pour Google Maps & recherche locale.",
    url: "https://www.boubane.com/creation-site-internet-segre",
    siteName: "Boubane",
    locale: "fr_FR",
    type: "website",
  },
};

const LOCAL_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://www.boubane.com/creation-site-internet-segre#service",
      name: "Boubane — Création de site internet à Segré",
      url: "https://www.boubane.com/creation-site-internet-segre",
      telephone: "+33778310346",
      email: "leo@boubane.com",
      priceRange: "0 €",
      image: "https://www.boubane.com/images/leo-artisan-desk.jpg",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Segré-en-Anjou Bleu",
        postalCode: "49500",
        addressRegion: "Pays de la Loire",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 47.6869,
        longitude: -0.8719,
      },
      areaServed: [
        { "@type": "City", name: "Segré-en-Anjou Bleu" },
        { "@type": "City", name: "Le Lion-d'Angers" },
        { "@type": "City", name: "Candé" },
        { "@type": "City", name: "Ombrée d'Anjou" },
        { "@type": "City", name: "Château-Gontier-sur-Mayenne" },
        { "@type": "City", name: "Châteaubriant" },
        { "@type": "City", name: "Angers" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://www.boubane.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Création site internet Segré",
          item: "https://www.boubane.com/creation-site-internet-segre",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: SEGRE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
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
