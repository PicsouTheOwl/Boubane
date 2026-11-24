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

export default function HomePage() {
  return (
    <>
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
