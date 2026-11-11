"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function ComparisonSection() {
  return (
    <section
      id="comparatif"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.08]"
    >
      <div className="mx-auto max-w-[1040px] px-5 sm:px-6">
        <AtelierReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              EN CLAIR
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.9rem,4vw,2.75rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Deux façons de mettre votre entreprise en ligne.
            </h2>
          </div>

          <img
            src="/images/cat-confiance.png"
            alt="Mascotte chat Boubane validant l'offre 0 €"
            width={720}
            height={720}
            className="w-24 sm:w-28 h-auto object-contain shrink-0 self-start sm:self-end drop-shadow-[0_12px_22px_rgba(237,91,4,0.14)]"
            loading="lazy"
          />
        </AtelierReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 md:divide-x md:divide-[#0C0A08]/[0.12]">
          {/* Left Column: Classic Agency */}
          <AtelierReveal delay={0.04}>
            <div className="pb-4 border-b border-[#0C0A08]/[0.12] flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-[#57534E]">Agence classique</span>
              <span className="font-mono text-2xl font-bold text-[#0C0A08]/45 line-through tabular-nums">
                4 500 €
              </span>
            </div>

            <ul className="mt-5 space-y-4 text-[0.95rem] leading-[1.5] text-[#57534E]">
              {[
                "Facture initiale lourde ou location sur 36 mois",
                "6 à 12 semaines entre échanges commerciaux et validation",
                "Accès technique et code souvent conservés par le prestataire",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="text-[#57534E]/60 shrink-0 select-none">—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </AtelierReveal>

          {/* Right Column: With Boubane */}
          <AtelierReveal delay={0.08} className="md:pl-14">
            <div className="pb-4 border-b border-[#ED5B04]/70 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-[#0C0A08]">Avec Boubane</span>
              <span className="font-mono text-3xl sm:text-[34px] leading-none font-bold text-[#ED5B04] tabular-nums">
                0 €
              </span>
            </div>

            <ul className="mt-5 space-y-3.5 text-[0.95rem] font-medium text-[#0C0A08]">
              {[
                "Design et code sur-mesure entièrement offerts",
                "En ligne en 5 jours ouvrés dès réception de vos photos",
                "Seulement vos frais directs (~10 €/an domaine, ~5 €/mois hébergement)",
                "Code source et nom de domaine 100 % à votre nom",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 shrink-0 mt-1 text-[#0C0A08]" strokeWidth={2.2} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all"
              >
                <span>Commander à 0 €</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hebergement"
                className="text-sm font-medium text-[#57534E] underline underline-offset-4 hover:text-[#0C0A08] transition-colors"
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
