"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  Check,
  Hammer,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Zap,
} from "lucide-react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { SEGRE_FAQS } from "@/data/segre";

interface TownItem {
  name: string;
  cp: string;
  distance: string;
  note: string;
}

const TOWNS: TownItem[] = [
  {
    name: "Segré-en-Anjou Bleu",
    cp: "49500",
    distance: "Sur place",
    note: "Centre Segréen, Nyoiseau, Sainte-Gemmes-d'Andigné, Aviré",
  },
  {
    name: "Le Lion-d'Angers",
    cp: "49220",
    distance: "14 min",
    note: "Axe D775 · Artisans, cabinets et commerces",
  },
  {
    name: "Candé",
    cp: "49440",
    distance: "18 min",
    note: "Sud-Ouest Segréen · BTP, paysagistes, services",
  },
  {
    name: "Pouancé · Ombrée d'Anjou",
    cp: "49420",
    distance: "24 min",
    note: "Nord-Ouest Anjou · Zones artisanales & PME",
  },
  {
    name: "Château-Gontier",
    cp: "53200",
    distance: "22 min",
    note: "Sud Mayenne · Entreprises du bâtiment & industrie",
  },
  {
    name: "Châteaubriant",
    cp: "44110",
    distance: "35 min",
    note: "Bassin 44/49 · Artisans, négoce & services locaux",
  },
  {
    name: "Angers & Agglomération",
    cp: "49000",
    distance: "34 min",
    note: "Avrillé, Beaucouzé, Saint-Barthélemy-d'Anjou",
  },
];

const SECTORS = [
  {
    icon: Hammer,
    tag: "ARTISANS & BTP",
    title: "Menuisiers, couvreurs, maçons & plombiers à Segré",
    desc: "Une vitrine mobile-first pensée pour décrocher des chantiers autour de Segré sans perdre de temps en prospection.",
    features: [
      "Galerie de vos vrais chantiers avant / après",
      "Bouton d'appel direct et demande de devis en 30 secondes",
      "Optimisé pour « couvreur Segré », « menuisier 49500 »",
    ],
  },
  {
    icon: BedDouble,
    tag: "TOURISME & COMMERCE",
    title: "Gîtes, restaurants, domaines & boutiques du Haut-Anjou",
    desc: "Transformez vos visiteurs Google Maps en réservations ou clients directs, sans commission de plateforme.",
    features: [
      "Présentation claire des prestations, menus ou hébergements",
      "Lien direct réservation / contact sans intermédiaire",
      "Photos soignées et chargement instantané sur 4G",
    ],
  },
  {
    icon: Building2,
    tag: "CABINETS & PME",
    title: "Professions libérales, indépendants & PME locales",
    desc: "Une image sérieuse et structurée qui inspire confiance dès le premier clic pour vos prospects en Maine-et-Loire et Mayenne.",
    features: [
      "Architecture claire de vos expertises et zone d'action",
      "Prise de rendez-vous en ligne intégrée",
      "Code source 100 % à vous, hébergé à votre nom",
    ],
  },
];

export function SegreInteractiveExperience() {
  return (
    <main className="relative pt-14 pb-28">
      {/* ====================================================================
          HERO LOCALE — SEGRÉ-EN-ANJOU BLEU (49500)
         ==================================================================== */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <AtelierReveal className="lg:col-span-7 space-y-6">
            <EyebrowBadge index="SEGRÉ-EN-ANJOU BLEU · 49500">
              Création Web & SEO Local
            </EyebrowBadge>

            <h1 className="font-[family-name:var(--font-jakarta)] text-[clamp(2.2rem,4.8vw,3.75rem)] font-bold tracking-[-0.04em] leading-[1.05] text-[#0C0A08]">
              Création de site internet à Segré{" "}
              <span className="text-[#0C0A08]/40 font-normal">&amp; en Haut-Anjou.</span>
            </h1>

            <p className="text-[1.05rem] leading-[1.65] text-[#57534E] max-w-[54ch]">
              Basé à <strong>Segré-en-Anjou Bleu (49500)</strong>, je conçois des sites vitrines
              sur-mesure pour les artisans, commerces et PME du Segréen :{" "}
              <strong className="text-[#0C0A08]">0 € de création</strong>, code 100 % à vous et
              mise en ligne en 5 jours ouvrés.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold shadow-[0_10px_28px_rgba(237,91,4,0.24)] hover:bg-[#D64E00] active:scale-[0.97] transition-all"
              >
                <span>Commander mon site (0 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://rdv.boubane.com/boubane/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] px-6 py-3.5 text-sm font-semibold text-[#0C0A08] hover:border-[#0C0A08] active:scale-[0.97] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#ED5B04]" />
                <span>Prendre RDV (30 min)</span>
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-[#57534E]">
              <a
                href="tel:+33778310346"
                className="inline-flex items-center gap-2 font-semibold text-[#0C0A08] hover:text-[#ED5B04] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#ED5B04]" />
                <span>07 78 31 03 46</span>
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ED5B04]" />
                <span>Rendez-vous possible sur place en Segréen</span>
              </span>
            </div>
          </AtelierReveal>

          <AtelierReveal delay={0.06} className="lg:col-span-5">
            <SpecularPlate tilt={false} crosshairs className="p-4 sm:p-5 bg-white">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#FAF8F5]">
                <img
                  src="/images/leo-artisan-desk.jpg"
                  alt="Léo Saillour, créateur de sites internet à Segré-en-Anjou Bleu"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[#0C0A08]/85 backdrop-blur-md px-4 py-3 text-white flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ED5B04]">
                      INTERLOCUTEUR DIRECT
                    </div>
                    <div className="text-sm font-semibold">Léo Saillour · Segré (49500)</div>
                  </div>
                  <span className="font-mono text-xs rounded-full bg-white/10 px-2.5 py-1">
                    5 jours
                  </span>
                </div>
              </div>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </section>

      {/* ====================================================================
          3 PILIERS — POURQUOI BOUBANE À SEGRÉ
         ==================================================================== */}
      <section className="py-16 sm:py-20 border-t border-[#0C0A08]/[0.07] bg-white/60">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              APPROCHE TERRAIN · 49500
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold tracking-[-0.035em] leading-[1.08] text-[#0C0A08]">
              Un site pensé pour être trouvé à Segré et convertir vos appels.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpecularPlate tilt={false} className="p-7 bg-white">
              <div className="font-mono text-xs text-[#ED5B04] font-semibold">01 · BUDGET</div>
              <h3 className="mt-3 text-lg font-bold text-[#0C0A08]">0 € d&apos;honoraires</h3>
              <p className="mt-2 text-sm leading-[1.6] text-[#57534E]">
                Pas de facture à 4 500 € ni de location sur 36 mois. Vous ne réglez que votre
                domaine (~10 €/an) et votre hébergement (~5 €/mois).
              </p>
            </SpecularPlate>

            <SpecularPlate tilt={false} className="p-7 bg-white">
              <div className="font-mono text-xs text-[#ED5B04] font-semibold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>02 · VISIBILITÉ GOOGLE</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#0C0A08]">
                SEO local Segré &amp; Haut-Anjou
              </h3>
              <p className="mt-2 text-sm leading-[1.6] text-[#57534E]">
                Structure sémantique optimisée, données Schema.org locales et vitesse mobile pour
                ressortir sur les recherches près de chez vous.
              </p>
            </SpecularPlate>

            <SpecularPlate tilt={false} className="p-7 bg-white">
              <div className="font-mono text-xs text-[#ED5B04] font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>03 · RAPIDITÉ</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#0C0A08]">En ligne en 5 jours</h3>
              <p className="mt-2 text-sm leading-[1.6] text-[#57534E]">
                On échange 30 minutes, vous m&apos;envoyez vos photos par téléphone et je m&apos;occupe
                du design, des textes et de la mise en ligne.
              </p>
            </SpecularPlate>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTEURS ACCOMPAGNÉS À SEGRÉ (TOUT VISIBLE POUR GOOGLE)
         ==================================================================== */}
      <section className="py-20 sm:py-24 border-t border-[#0C0A08]/[0.07]">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              MÉTIERS DU SEGRÉEN
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold tracking-[-0.035em] leading-[1.08] text-[#0C0A08]">
              Des sites adaptés aux entreprises de Segré-en-Anjou Bleu.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <SpecularPlate
                  key={sector.tag}
                  tilt={false}
                  className="p-7 bg-white flex flex-col justify-between space-y-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                        {sector.tag}
                      </span>
                      <span className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#0C0A08]/[0.08] flex items-center justify-center text-[#0C0A08]">
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold tracking-[-0.02em] text-[#0C0A08]">
                      {sector.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.6] text-[#57534E]">{sector.desc}</p>
                    <ul className="mt-5 space-y-2.5">
                      {sector.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-[#0C0A08]">
                          <Check className="w-4 h-4 text-[#ED5B04] shrink-0 mt-0.5" strokeWidth={2.3} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#0C0A08]/[0.07]">
                    <Link
                      href="/commander"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C0A08] hover:text-[#ED5B04] transition-colors"
                    >
                      <span>Demander ma maquette gratuite</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </SpecularPlate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          ZONE D'INTERVENTION HAUT-ANJOU & SUD MAYENNE
         ==================================================================== */}
      <section className="py-20 sm:py-24 border-t border-[#0C0A08]/[0.07] bg-white/60">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
                ZONE D&apos;INTERVENTION LOCALE
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold tracking-[-0.035em] leading-[1.08] text-[#0C0A08]">
                Création de sites web autour de Segré, en Anjou et Sud Mayenne.
              </h2>
            </div>
            <p className="text-sm text-[#57534E] max-w-[38ch]">
              Un rayon d&apos;action de 40 km autour de Segré pour des rencontres sur place ou un
              suivi 100 % à distance partout en France.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOWNS.map((town) => (
              <div
                key={town.name}
                className="rounded-2xl bg-white border border-[#0C0A08]/[0.08] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-[#ED5B04] font-semibold">
                      {town.cp}
                    </span>
                    <span className="font-mono text-[11px] text-[#57534E]">{town.distance}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-[#0C0A08]">{town.name}</h3>
                  <p className="mt-1.5 text-xs leading-[1.55] text-[#57534E]">{town.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ LOCALE SEGRÉ (CONTENU INDEXABLE PAR GOOGLE)
         ==================================================================== */}
      <section className="py-20 sm:py-24 border-t border-[#0C0A08]/[0.07]">
        <div className="mx-auto max-w-[920px] px-5 sm:px-6">
          <div className="mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              QUESTIONS FRÉQUENTES · SEGRÉ
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.6vw,2.4rem)] font-bold tracking-[-0.035em] leading-[1.08] text-[#0C0A08]">
              Tout savoir sur la création de votre site à Segré.
            </h2>
          </div>

          <div className="divide-y divide-[#0C0A08]/[0.1] border-y border-[#0C0A08]/[0.1]">
            {SEGRE_FAQS.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="text-base sm:text-lg font-bold text-[#0C0A08]">{item.q}</h3>
                <p className="mt-2 text-sm sm:text-[0.96rem] leading-[1.65] text-[#57534E]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CTA FINAL
         ==================================================================== */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <SpecularPlate dark className="p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
              SEGRÉ-EN-ANJOU BLEU · DISPONIBLE CETTE SEMAINE
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.7rem,3.2vw,2.35rem)] font-bold tracking-[-0.035em] leading-[1.1] text-white">
              Prêt à lancer votre site internet à Segré ?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/70">
              Commandez votre maquette en 3 étapes ou réservez un créneau de 30 minutes
              avec Léo Saillour.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all"
            >
              <span>Commander à 0 €</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/33778310346"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 text-white px-6 py-3.5 text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#22C55E]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </SpecularPlate>
      </section>
    </main>
  );
}
