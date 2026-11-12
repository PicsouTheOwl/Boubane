import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReadingCompass } from "@/components/AtelierPrimitives";
import { HeroSection } from "@/components/HeroSection";
import { ScrollStory3DStage } from "@/components/home/ScrollStory3DStage";
import { ComparisonSection } from "@/components/home/ComparisonSection";
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
        <ComparisonSection />
        <ArtisanWorkbenchSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
