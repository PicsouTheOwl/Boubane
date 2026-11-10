"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Minus } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";
import { HandDrawnUnderline } from "@/components/HandDrawnAccents";
import { ATELIER_SNAPPY_SPRING } from "@/lib/utils";

const ROWS = [
  {
    index: "01",
    criterion: "Frais de création",
    legacy: "3 500 € à 6 000 €",
    legacyNote: "Avec 40 % d'acompte dès la signature",
    boubane: "0 €",
    boubaneNote: "Design et développement faits pour vous",
  },
  {
    index: "02",
    criterion: "Vitesse sur mobile",
    legacy: "WordPress lourd (~4s)",
    legacyNote: "Thème générique ralenti par des extensions",
    boubane: "Code propre (< 0,3s)",
    boubaneNote: "Affichage quasi instantané en 4G",
  },
  {
    index: "03",
    criterion: "Abonnement mensuel",
    legacy: "120 € à 180 € / mois",
    legacyNote: "Engagement sur 24 ou 48 mois",
    boubane: "~5 € / mois chez votre hébergeur",
    boubaneNote: "Ou 15 € / an si on gère la technique",
  },
  {
    index: "04",
    criterion: "Propriété du site",
    legacy: "Bloquée chez le prestataire",
    legacyNote: "Si vous arrêtez de payer, le site ferme",
    boubane: "100 % à votre nom",
    boubaneNote: "Domaine et code source remis dès la livraison",
  },
  {
    index: "05",
    criterion: "Votre interlocuteur",
    legacy: "Commercial puis sous-traitant",
    legacyNote: "Des intermédiaires qui rallongent les délais",
    boubane: "En direct avec Léo",
    boubaneNote: "Celui qui code le site répond au téléphone",
  },
];

const HORIZONS = [
  { years: 1, label: "Sur 1 an", legacyTotal: "6 300 €", boubaneTotal: "~60 €" },
  { years: 3, label: "Sur 3 ans", legacyTotal: "9 900 €", boubaneTotal: "~180 €" },
  { years: 5, label: "Sur 5 ans", legacyTotal: "13 500 €", boubaneTotal: "~300 €" },
] as const;

export function ComparisonSection() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(ROWS[0].index);
  const [horizonIdx, setHorizonIdx] = useState(1);
  const currentHorizon = HORIZONS[horizonIdx];

  return (
    <section
      id="comparatif"
      className="relative py-28 md:py-36 bg-[#F3EFE7] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <AtelierReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-16">
          <div className="max-w-2xl">
            <EyebrowBadge index="02">Comparatif honnête</EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
              Agence classique{" "}
              <span className="text-[#0C0A08]/35 font-normal">contre</span>{" "}
              <span className="relative inline-block">
                Atelier Boubane
                <HandDrawnUnderline className="absolute -bottom-2 inset-x-0 h-3 w-full" delay={0.25} />
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div
              role="tablist"
              aria-label="Durée de comparaison"
              className="inline-flex p-1 rounded-full bg-white/80 border border-[#0C0A08]/[0.08] shadow-xs"
            >
              {HORIZONS.map((h, i) => {
                const active = horizonIdx === i;
                return (
                  <button
                    key={h.years}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setHorizonIdx(i)}
                    className={`relative px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                      active ? "text-white" : "text-[#0C0A08]/60 hover:text-[#0C0A08]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="horizonPill"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#0C0A08]"
                      />
                    )}
                    <span className="relative z-10">{h.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-baseline gap-4 font-mono text-xs tabular-nums">
              <span className="text-[#0C0A08]/45 line-through">
                Agence : {currentHorizon.legacyTotal}
              </span>
              <span className="text-[#ED5B04] font-bold">
                Boubane : {currentHorizon.boubaneTotal} d&apos;hébergement
              </span>
            </div>
          </div>
        </AtelierReveal>

        <AtelierReveal delay={0.08}>
          <div className="rounded-[26px] bg-white atelier-shadow-warm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 border-b border-[#0C0A08]/[0.08] bg-[#FAF8F5]/70 px-8 py-5 font-mono text-[11px] uppercase tracking-[0.12em]">
              <div className="col-span-4 text-[#0C0A08]/45">Ce qui compte</div>
              <div className="col-span-4 text-[#0C0A08]/45">En agence web</div>
              <div className="col-span-4 text-[#ED5B04] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED5B04]" />
                <span>Chez Boubane</span>
              </div>
            </div>

            <div className="divide-y divide-[#0C0A08]/[0.07]">
              {ROWS.map((row) => {
                const isActive = hoveredRow === row.index;
                return (
                  <div
                    key={row.index}
                    onMouseEnter={() => setHoveredRow(row.index)}
                    className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-6 sm:px-8 py-6 items-center transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="compareRowHighlight"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="pointer-events-none absolute inset-0 bg-[#FAF8F5]/90 border-l-2 border-[#ED5B04]"
                      />
                    )}

                    <div className="relative z-10 md:col-span-4 flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-[#0C0A08]/35 tabular-nums">
                        {row.index}
                      </span>
                      <span className="font-semibold text-[#0C0A08] tracking-[-0.015em]">
                        {row.criterion}
                      </span>
                    </div>

                    <div className="relative z-10 md:col-span-4 flex items-start gap-2.5">
                      <Minus className="w-4 h-4 text-[#0C0A08]/30 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-mono text-sm text-[#0C0A08]/50 line-through">
                          {row.legacy}
                        </div>
                        <div className="text-xs text-[#57534E]/75 mt-0.5">{row.legacyNote}</div>
                      </div>
                    </div>

                    <div className="relative z-10 md:col-span-4 flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ED5B04]/10 text-[#ED5B04]">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      </span>
                      <div>
                        <div className="font-mono text-sm font-bold text-[#0C0A08] tabular-nums">
                          {row.boubane}
                        </div>
                        <div className="text-xs text-[#57534E] mt-0.5">{row.boubaneNote}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AtelierReveal>
      </div>
    </section>
  );
}
