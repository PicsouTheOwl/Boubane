import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReadingCompass } from "@/components/AtelierPrimitives";
import { HeroSection } from "@/components/HeroSection";
import { ScrollStory3DStage } from "@/components/home/ScrollStory3DStage";
import { AtelierConfiguratorSection } from "@/components/home/AtelierConfiguratorSection";
import { AtelierLiveDemosSection } from "@/components/home/AtelierLiveDemosSection";
import { AtelierIntegrationsSection } from "@/components/home/AtelierIntegrationsSection";
import { ArtisanWorkbenchSection } from "@/components/home/ArtisanWorkbenchSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://www.boubane.com/#organization",
      name: "Boubane",
      founder: {
        "@type": "Person",
        name: "Léo Saillour",
      },
      url: "https://www.boubane.com",
      telephone: "+33778310346",
      email: "leo@boubane.com",
      priceRange: "0 € - 790 €",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Segré-en-Anjou Bleu",
        postalCode: "49500",
        addressRegion: "Pays de la Loire",
        addressCountry: "FR",
      },
      areaServed: "FR",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.boubane.com/#website",
      url: "https://www.boubane.com",
      name: "Boubane",
      inLanguage: "fr-FR",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <AtelierReadingCompass />
      <SiteHeader isHome />
      <main id="top">
        <HeroSection />
        <ScrollStory3DStage />
        <AtelierConfiguratorSection />
        <AtelierLiveDemosSection />
        <AtelierIntegrationsSection />
        <ArtisanWorkbenchSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
