export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Hardware from "@/components/Hardware";
import Processus from "@/components/Processus";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Hardware />
      <Processus />
      <Contact />
      <Footer />
    </main>
  );
}
