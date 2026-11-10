"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function ComparisonSection() {
  return (
    <section
      id="comparatif"
      className="relative py-24 sm:py-32 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1040px] px-5 sm:px-6">
        <AtelierReveal className="max-w-xl mb-14 sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            En clair
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.3rem)] font-bold tracking-[-0.045em] leading-[1.05] text-[#0C0A08]">
            Deux façons de mettre votre entreprise en ligne.
          </h2>
        </AtelierReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 md:divide-x md:divide-[#0C0A08]/[0.09]">
          {/* Column 1: Classic Agency (recessed hierarchy) */}
          <AtelierReveal delay={0.04}>
            <div className="pb-6 border-b border-[#0C0A08]/[0.08] flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-[#57534E]">Agence classique</span>
              <span className="font-mono text-2xl font-bold text-[#0C0A08]/40 line-through tabular-nums">
                4 500 €
              </span>
            </div>

            <ul className="mt-6 space-y-4 text-[0.95rem] text-[#57534E]">
              {[
                "Facture initiale lourde ou location sur 36 mois",
                "6 à 12 semaines entre échanges commerciaux et validation",
                "Accès technique et code souvent conservés par le prestataire",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Minus className="w-4 h-4 shrink-0 mt-1 text-[#0C0A08]/30" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </AtelierReveal>

          {/* Column 2: Boubane (high contrast, clean, dominant focal weight) */}
          <AtelierReveal delay={0.08} className="md:pl-14">
            <div className="pb-6 border-b border-[#ED5B04]/40 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-[#0C0A08]">Avec Boubane</span>
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#ED5B04] tabular-nums">
                0 €
              </span>
            </div>

            <ul className="mt-6 space-y-4 text-[0.98rem] font-medium text-[#0C0A08]">
              {[
                "Design et code sur-mesure entièrement offerts",
                "En ligne en 5 jours ouvrés dès réception de vos photos",
                "Seulement vos frais directs (~10 €/an domaine, ~5 €/mois hébergement)",
                "Code source et nom de domaine 100 % à votre nom",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-1 text-[#ED5B04]" strokeWidth={2.5} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all"
              >
                <span>Commander à 0 €</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hebergement"
                className="text-sm font-medium text-[#57534E] hover:text-[#0C0A08] underline underline-offset-4 transition-colors"
              >
                Détail hébergement
              </Link>
            </div>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
