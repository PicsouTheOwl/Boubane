import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Processus from "@/components/Processus";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-10">
      <Navbar />
      <Hero />
      <Services />
      <CaseStudies />
      <Processus />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
