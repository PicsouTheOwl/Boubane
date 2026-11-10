"use client";

import React from "react";
import { Check } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import {
  DottedInkLink,
  FolderSheet,
  HandwrittenNote,
  PaperSquareButton,
} from "@/components/DraftingPrimitives";
import { IsometricSiteBuilder } from "@/components/home/IsometricSiteBuilder";

const RECEIPT_LINES = [
  { label: "Conception sur-mesure & code", price: "0 €", accent: true },
  { label: "Nom de domaine à votre nom", price: "~10 €/an", accent: false },
  { label: "Hébergement chez votre prestataire", price: "~5 €/mois", accent: false },
  { label: "Engagement de durée", price: "Aucun", accent: false },
];

export function ManifestoSection() {
  return (
    <section
      id="modele"
      className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left column: Léo's origin story folder sheet */}
          <AtelierReveal className="lg:col-span-5">
            <FolderSheet
              tone="cream"
              tabIndex="01"
              tabLabel="Le déclic"
              registrationMarks
              innerClassName="p-6 sm:p-8"
            >
              <HandwrittenNote className="mb-2 -rotate-1">
                Tout a commencé autour d&apos;un café à Segré...
              </HandwrittenNote>

              <h2 className="text-[clamp(1.85rem,3.6vw,2.65rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
                Créer votre site{" "}
                <span className="text-[#57534E] font-normal">ne devrait pas coûter 4 500 €.</span>
              </h2>

              <div className="mt-5 space-y-3.5 text-[0.95rem] leading-[1.68] text-[#4A433B]">
                <p>
                  Sur le terrain, je voyais toujours la même histoire : un artisan ou un gérant
                  signe un devis à 4 500 € (ou un leasing sur 48 mois) pour se retrouver avec un site
                  lent dont il ne possède même pas les accès.
                </p>
                <p>
                  J&apos;ai décidé de couper tout ce qui fait gonfler la facture : les bureaux, les
                  commerciaux et les réunions inutiles. Je conçois et je code votre vitrine{" "}
                  <strong className="font-semibold text-[#0C0A08]">directement à votre nom</strong>,
                  sans honoraires de création.
                </p>
              </div>

              {/* Receipt-style breakdown with dashed lines */}
              <div className="mt-6 pt-5 border-t border-dashed border-[#424242]/30 space-y-2.5">
                {RECEIPT_LINES.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 py-1.5 border-b border-dashed border-[#424242]/20 last:border-b-0 text-[13px]"
                  >
                    <span className="flex items-center gap-2 text-[#2A2622]">
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${row.accent ? "text-[#ED5B04]" : "text-[#0E7541]"}`}
                      />
                      <span>{row.label}</span>
                    </span>
                    <span
                      className={`font-mono font-semibold tabular-nums shrink-0 ${
                        row.accent ? "text-[#ED5B04] text-sm" : "text-[#0C0A08]"
                      }`}
                    >
                      {row.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <PaperSquareButton href="/commander" label="Lancer mon site à 0 €" variant="coral" />
                <DottedInkLink href="#comparatif" className="text-xs font-mono uppercase tracking-[0.08em] text-[#0C0A08]">
                  Voir le comparatif
                </DottedInkLink>
              </div>
            </FolderSheet>
          </AtelierReveal>

          {/* Right column: Interactive Faux-3D Layer Builder */}
          <AtelierReveal delay={0.08} className="lg:col-span-7">
            <IsometricSiteBuilder />
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
