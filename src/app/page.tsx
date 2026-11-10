import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/HeroSection";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { ShowcaseDossiersSection } from "@/components/home/ShowcaseDossiersSection";
import { ProcessChronographSection } from "@/components/home/ProcessChronographSection";
import { ArtisanWorkbenchSection } from "@/components/home/ArtisanWorkbenchSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <SiteHeader isHome />
      <main id="top">
        <HeroSection />
        <ManifestoSection />
        <ComparisonSection />
        <ShowcaseDossiersSection />
        <ProcessChronographSection />
        <ArtisanWorkbenchSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

