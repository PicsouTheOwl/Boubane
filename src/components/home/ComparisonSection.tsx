"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { FolderSheet, HandwrittenNote, PaperSquareButton } from "@/components/DraftingPrimitives";

export function ComparisonSection() {
  return (
    <section
      id="comparatif"
      className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <AtelierReveal className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#57534E] mb-3">
            <span className="px-2 py-0.5 bg-[#E8DAC1] text-[#0C0A08] font-semibold rounded-[2px]">
              02
            </span>
            <span>Trois feuilles posées sur la table</span>
          </div>
          <h2 className="text-[clamp(2rem,4.4vw,3.3rem)] font-bold tracking-[-0.045em] leading-[1.04] text-[#0C0A08]">
            Pourquoi vous restez libre,{" "}
            <span className="text-[#57534E] font-normal">noir sur blanc.</span>
          </h2>
          <HandwrittenNote className="mt-2 rotate-0.5">
            Comparez ce que vous achetez ailleurs et ce que vous gardez ici.
          </HandwrittenNote>
        </AtelierReveal>

        {/* Three overlapping-feel paper sheets on mobile stack -> desktop 3-column spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-5 items-stretch">
          {/* Sheet 1: Classic Agency (Cream tilted -0.8deg on lg) */}
          <AtelierReveal delay={0.02} className="lg:col-span-4 flex">
            <FolderSheet
              tone="cream"
              tabIndex="A"
              tabLabel="Agence classique"
              tiltClassName="w-full lg:-rotate-[0.8deg] lg:mt-4"
              innerClassName="p-6 sm:p-7 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-4 border-b border-dashed border-[#424242]/30">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#57534E]">
                    Devis moyen constaté
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#0C0A08]/45 line-through tabular-nums">
                    4 500 €
                  </span>
                </div>

                <ul className="mt-5 space-y-3 text-[13.5px] text-[#4A433B]">
                  {[
                    "Ou location à 150 €/mois sur 36 mois (5 400 € au total)",
                    "Délai habituel de 6 à 12 semaines entre réunions",
                    "Code source et accès hébergeur souvent retenus",
                    "Facture supplémentaire pour la moindre virgule",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 pb-2.5 border-b border-dashed border-[#424242]/20 last:border-b-0"
                    >
                      <Minus className="w-4 h-4 shrink-0 mt-0.5 text-[#0C0A08]/35" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-[#424242]/30 font-mono text-[11px] uppercase tracking-[0.08em] text-[#57534E]">
                Modèle historique lourd
              </div>
            </FolderSheet>
          </AtelierReveal>

          {/* Sheet 2: Boubane Core Offer (Coral #ED5B04 foreground centerpiece) */}
          <AtelierReveal delay={0.06} className="lg:col-span-4 flex z-10">
            <FolderSheet
              tone="coral"
              tabIndex="B"
              tabLabel="Boubane · Offert"
              tiltClassName="w-full"
              innerClassName="p-6 sm:p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-4 border-b border-dashed border-white/40">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-white/85">
                    Création &amp; design
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums">
                    0 €
                  </span>
                </div>

                <ul className="mt-5 space-y-3 text-[14px] text-white font-medium">
                  {[
                    "Maquette sur-mesure codée à la main pour votre métier",
                    "En ligne en 5 jours ouvrés dès réception de vos photos",
                    "Nom de domaine et code source 100 % à votre nom",
                    "Chargement rapide (< 0,3 s) et lisible sur mobile",
                    "Échange direct avec Léo par téléphone ou WhatsApp",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 pb-2.5 border-b border-dashed border-white/30 last:border-b-0"
                    >
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#EEF85A]" strokeWidth={2.6} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                <PaperSquareButton
                  href="/commander"
                  label="Commander à 0 €"
                  variant="cream"
                  className="w-full justify-between"
                />
              </div>
            </FolderSheet>
          </AtelierReveal>

          {/* Sheet 3: Blueprint Navy — Transparent Ongoing Costs */}
          <AtelierReveal delay={0.1} className="lg:col-span-4 flex">
            <FolderSheet
              tone="blueprint"
              tabIndex="C"
              tabLabel="Vos seuls frais"
              tiltClassName="w-full lg:rotate-[0.8deg] lg:mt-4"
              innerClassName="p-6 sm:p-7 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-4 border-b border-dashed border-white/30">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#CBD5E1]">
                    Hébergement direct
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#EEF85A] tabular-nums">
                    ~5 €/mois
                  </span>
                </div>

                <ul className="mt-5 space-y-3 text-[13.5px] text-[#E2E8F0]">
                  {[
                    "Nom de domaine payé par vous (~10 €/an) à votre nom",
                    "Hébergement chez OVH, Hostinger ou Vercel (~5 €/mois)",
                    "Option sans souci : maintenance & mises à jour si besoin",
                    "Vous partez avec tout votre site quand vous voulez",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 pb-2.5 border-b border-dashed border-white/20 last:border-b-0"
                    >
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#EEF85A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-white/25 flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="text-[#CBD5E1] uppercase tracking-[0.08em]">Zéro frais cachés</span>
                <a
                  href="/hebergement"
                  className="text-[#EEF85A] underline underline-offset-4 hover:text-white"
                >
                  Détail hébergement
                </a>
              </div>
            </FolderSheet>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
