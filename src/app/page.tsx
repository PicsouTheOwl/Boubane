export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Deployment from "@/components/Deployment";
import WhyBoubane from "@/components/WhyBoubane";
import Hardware from "@/components/Hardware";
import CaseStudies from "@/components/CaseStudies";
import Processus from "@/components/Processus";
import FinalCTA from "@/components/FinalCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Deployment />
      <SectionDivider />
      <WhyBoubane />
      <SectionDivider />
      <Hardware />
      <SectionDivider />
      <CaseStudies />
      <SectionDivider />
      <Processus />
      <SectionDivider />
      <FinalCTA />
      <SectionDivider />
      <Contact />
      <Footer />
    </main>
  );
}
