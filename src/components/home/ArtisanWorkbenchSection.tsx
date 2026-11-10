"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { FolderSheet, HandwrittenNote } from "@/components/DraftingPrimitives";
import { HandDrawnUnderline } from "@/components/HandDrawnAccents";
import { ATELIER_EASE } from "@/lib/utils";

export function ArtisanWorkbenchSection() {
  return (
    <section
      id="artisan"
      className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
        <AtelierReveal>
          <FolderSheet
            tone="cream"
            tabIndex="05"
            tabLabel="Lettre ouverte"
            registrationMarks
            innerClassName="p-6 sm:p-11 md:p-14"
          >
            {/* Stamp badge top-right */}
            <div
              aria-hidden="true"
              className="hidden sm:inline-flex items-center px-3 py-1 rounded-[3px] border border-[#ED5B04]/50 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ED5B04] float-right rotate-[-2deg]"
            >
              SEGRÉ · HAUT-ANJOU (49)
            </div>

            <HandwrittenNote className="mb-3 -rotate-1">
              Bonjour, moi c&apos;est Léo.
            </HandwrittenNote>

            <h2 className="text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-[-0.04em] leading-[1.12] text-[#0C0A08] max-w-[26ch]">
              Vous parlez directement à celui qui{" "}
              <span className="relative inline-block">
                dessine et code votre site
                <HandDrawnUnderline className="absolute -bottom-1.5 inset-x-0 h-2.5 w-full" delay={0.25} />
              </span>
              .
            </h2>

            {/* Narrative Open Letter Columns on desktop, crisp readable flow on mobile */}
            <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-dashed border-[#424242]/30">
              <div className="md:col-span-4 space-y-4 font-mono text-xs md:border-r md:border-dashed md:border-[#424242]/25 md:pr-6">
                <div>
                  <div className="text-[#57534E] text-[10px] uppercase tracking-[0.12em]">
                    AUTEUR &amp; CODE
                  </div>
                  <div className="text-[#0C0A08] font-semibold mt-1 text-sm">Léo Saillour</div>
                </div>
                <div className="pt-3 border-t border-dashed border-[#424242]/20">
                  <div className="text-[#57534E] text-[10px] uppercase tracking-[0.12em]">
                    ATELIER
                  </div>
                  <div className="text-[#0C0A08] font-medium mt-1">
                    Segré-en-Anjou Bleu (49500)
                  </div>
                  <div className="text-[#57534E] text-[11px] mt-0.5">Maine-et-Loire &amp; France</div>
                </div>
                <div className="pt-3 border-t border-dashed border-[#424242]/20">
                  <div className="text-[#57534E] text-[10px] uppercase tracking-[0.12em]">
                    PROMESSE SIMPLE
                  </div>
                  <div className="text-[#ED5B04] font-semibold mt-1">
                    0 € d&apos;honoraires, zéro sous-traitance
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-[0.98rem] sm:text-[1.03rem] leading-[1.72] text-[#2A2622]">
                <p>
                  En agence classique, vous échangez avec un commercial qui transmet ensuite vos notes
                  à une autre équipe. Trois mois plus tard, le site ne vous ressemble pas et le
                  moindre changement coûte un avenant.
                </p>
                <p>
                  Chez Boubane, j&apos;ai voulu retrouver le fonctionnement d&apos;un atelier artisanal :
                  on se parle dix minutes, je construis votre vitrine en quelques jours, et si une
                  photo ou une phrase ne vous convient pas, on la corrige ensemble immédiatement.
                </p>

                {/* Signature + Direct Contact Buttons */}
                <div className="mt-8 pt-6 border-t border-dashed border-[#424242]/30 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="w-44 h-14 mb-1" aria-label="Signature manuscrite de Léo Saillour">
                      <svg viewBox="0 0 220 72" className="w-full h-full overflow-visible" fill="none">
                        <motion.path
                          d="M12 52 C18 28, 28 12, 32 16 C36 20, 22 48, 26 52 C32 56, 48 40, 56 42 C62 44, 52 54, 62 52 C74 49, 86 32, 92 36 C96 39, 88 52, 98 50 C108 48, 122 24, 128 20 C134 16, 122 48, 130 50 C140 52, 152 38, 162 40 C172 42, 168 51, 180 47 C192 43, 202 36, 212 38"
                          stroke="#0C0A08"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1.3, ease: ATELIER_EASE }}
                        />
                        <motion.path
                          d="M16 61 C68 58, 135 55, 198 57"
                          stroke="#ED5B04"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.75, delay: 0.9, ease: ATELIER_EASE }}
                        />
                      </svg>
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#57534E]">
                      Léo Saillour · Fondateur de Boubane
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://rdv.boubane.com/boubane"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[4px] bg-[#141311] text-[#FAF7F0] px-4 py-2.5 text-xs font-semibold paper-sheet-shadow hover:bg-[#ED5B04] active:translate-x-[1px] active:translate-y-[1px] transition-all min-h-[42px]"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Appel 10 min</span>
                    </a>
                    <a
                      href="tel:+33778310346"
                      className="inline-flex items-center gap-2 rounded-[4px] bg-white border border-[#424242]/30 text-[#0C0A08] px-4 py-2.5 text-xs font-semibold hover:border-[#0C0A08] transition-all min-h-[42px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#ED5B04]" />
                      <span>07 78 31 03 46</span>
                    </a>
                    <a
                      href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet%20de%20site%20vitrine."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[4px] bg-white border border-[#424242]/30 text-[#0C0A08] px-4 py-2.5 text-xs font-semibold hover:border-[#ED5B04] hover:text-[#ED5B04] transition-all min-h-[42px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FolderSheet>
        </AtelierReveal>
      </div>
    </section>
  );
}
