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
    index: "01",
    tag: "ARTISANAT & BÂTIMENT",
    title: "Menuisiers, Couvreurs, Ébénistes & Bâtiment",
    desc: "Mettez fin au bouche-à-oreille hasardeux : valorisez vos chantiers et recevez des demandes de devis qualifiées.",
  },
  {
    index: "02",
    tag: "PROFESSIONS LIBÉRALES",
    title: "Avocats, Notaires, Cabinets & Praticiens",
    desc: "Une image de rigueur et de confiance immédiate pour votre patientèle ou clientèle du Segréen.",
  },
  {
    index: "03",
    tag: "INDUSTRIE & B2B",
    title: "PME Industrielles & ZI d'Étriché",
    desc: "Une vitrine B2B rapide (< 0.3s) conçue pour convaincre vos donneurs d'ordres nationaux.",
  },
  {
    index: "04",
    tag: "COMMERCE & TERROIR",
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
          <AtelierReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8">
              <EyebrowBadge index="HAUT-ANJOU · 49500">Proximité Locale</EyebrowBadge>
              <h1 className="mt-6 text-[clamp(2.3rem,5vw,3.9rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
                Création de site internet à Segré{" "}
                <span className="text-[#0C0A08]/40 font-normal">&amp; Haut-Anjou.</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[1rem] leading-[1.6] text-[#57534E]">
                Un artisan du web basé à Segré, face-à-face avec vous. Conception et code
                sur-mesure offerts à 100 %.
              </p>
            </div>
          </AtelierReveal>

          <AtelierReveal delay={0.05} className="flex flex-wrap gap-3 mb-20">
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
          </AtelierReveal>

          {/* Grand Livre des Métiers du Segréen (Zero 2x2 Card Grid) */}
          <AtelierReveal delay={0.08} className="mb-20">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0C0A08]/45 mb-4">
              SAVOIR-FAIRE DU TERRITOIRE
            </div>
            <div className="divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09]">
              {SECTORS.map((sec) => (
                <div
                  key={sec.index}
                  className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline group"
                >
                  <div className="md:col-span-2 flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#ED5B04] font-semibold">{sec.index}</span>
                    <span className="text-[#0C0A08]/45 uppercase tracking-[0.08em]">
                      {sec.tag.split(" ")[0]}
                    </span>
                  </div>
                  <h2 className="md:col-span-5 text-xl font-semibold tracking-[-0.02em] text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                    {sec.title}
                  </h2>
                  <p className="md:col-span-5 text-[0.94rem] leading-[1.6] text-[#57534E]">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>
          </AtelierReveal>

          {/* Rayon d'intervention Monolithe Sombre */}
          <AtelierReveal delay={0.12}>
            <SpecularPlate dark crosshairs className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#ED5B04]">
                    <MapPin className="w-4 h-4" />
                    <span>RAYON D&apos;INTERVENTION</span>
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-[-0.035em] text-white">
                    En direct dans votre atelier ou cabinet.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Pas de sous-traitance anonyme. Rencontre possible autour de Segré,
                    Château-Gontier et Angers.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
