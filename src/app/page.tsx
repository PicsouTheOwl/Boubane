import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Processus from "@/components/Processus";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-10">
      <Navbar />
      <Hero />
      <Services />
      <Processus />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
