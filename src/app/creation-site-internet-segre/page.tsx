import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";

export const metadata: Metadata = {
  title: "Création de Site Internet à Segré (49500) · Studio Web Sur-Mesure | Boubane",
  description:
    "Studio d'artisanat web à Segré-en-Anjou Bleu (49500). Conception de sites sur-mesure à 0 € d'honoraires pour artisans, cabinets et PME du Haut-Anjou.",
};

const SECTORS = [
  {
    title: "Menuisiers, Couvreurs, Ébénistes & Bâtiment",
    desc: "Mettez fin au bouche-à-oreille hasardeux : valorisez vos chantiers et recevez des demandes de devis qualifiées.",
  },
  {
    title: "Avocats, Notaires, Cabinets & Praticiens",
    desc: "Une image de rigueur et de confiance immédiate pour votre patientèle ou clientèle du Segréen.",
  },
  {
    title: "PME Industrielles & ZI d'Étriché",
    desc: "Une vitrine B2B rapide (< 0.3s) conçue pour convaincre vos donneurs d'ordres nationaux.",
  },
  {
    title: "Boutiques, Domaines Viticoles & Tables",
    desc: "Réservations directes sans commission intermédiaire et mise en lumière éditoriale.",
  },
];

const CITIES = [
  "Segré-en-Anjou Bleu (49500)",
  "Le Lion-d'Angers (49220)",
  "Château-Gontier-sur-Mayenne (53200)",
  "Candé (49440)",
  "Pouancé / Ombrée d'Anjou (49420)",
  "Châteaubriant (44110)",
  "Angers & Agglomération (49000)",
];

export default function SegreLocalPage() {
  return (
    <>
      <SiteHeader isHome={false} />
      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[1160px] px-6">
          <AtelierReveal className="max-w-3xl mb-14">
            <EyebrowBadge index="HAUT-ANJOU · 49500">Proximité Locale</EyebrowBadge>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.7rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Création de site internet à Segré-en-Anjou Bleu<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[#57534E] max-w-[56ch]">
              Un artisan du web basé à Segré, face-à-face avec vous. Conception et code sur-mesure
              offerts à 100 % pour les entreprises et artisans du 49 et du 53.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
              >
                <span>Commander mon site offert (0 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://rdv.boubane.com/boubane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] px-6 py-3.5 text-sm font-semibold text-[#0C0A08] hover:border-[#0C0A08] active:scale-[0.97] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#ED5B04]" />
                <span>Rencontre ou appel (10 min)</span>
              </a>
            </div>
          </AtelierReveal>

          {/* Grille Métiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {SECTORS.map((sec, i) => (
              <AtelierReveal key={sec.title} delay={i * 0.05} className="flex">
                <SpecularPlate className="w-full p-7 bg-white">
                  <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#ED5B04]">
                    SAVOIR-FAIRE LOCAL
                  </div>
                  <h2 className="mt-2.5 text-xl font-bold tracking-[-0.02em] text-[#0C0A08]">
                    {sec.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#57534E]">{sec.desc}</p>
                </SpecularPlate>
              </AtelierReveal>
            ))}
          </div>

          {/* Rayon d'intervention */}
          <AtelierReveal>
            <SpecularPlate dark crosshairs className="p-8 sm:p-11">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#ED5B04]">
                <MapPin className="w-4 h-4" />
                <span>RAYON D&apos;INTERVENTION EN ANJOU &amp; MAYENNE</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                En direct dans votre atelier ou cabinet.
              </h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CITIES.map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white/85"
                  >
                    <Check className="w-4 h-4 text-[#ED5B04] shrink-0" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
