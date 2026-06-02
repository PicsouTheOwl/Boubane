export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Deployment from "@/components/Deployment";
import Hardware from "@/components/Hardware";
import CaseStudies from "@/components/CaseStudies";
import Processus from "@/components/Processus";
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
      <Hardware />
      <SectionDivider />
      <CaseStudies />
      <SectionDivider />
      <Processus />
      <SectionDivider />
      <Contact />
      <Footer />
    </main>
  );
}
