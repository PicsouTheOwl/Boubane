"use client";

import React from "react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import {
  DottedInkLink,
  FolderSheet,
  HandwrittenNote,
  PaperSquareButton,
} from "@/components/DraftingPrimitives";
import { HandDrawnUnderline } from "@/components/HandDrawnAccents";

export function FinalCtaSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip">
      <div className="mx-auto max-w-[980px] px-4 sm:px-6">
        <AtelierReveal>
          <FolderSheet
            tone="ink"
            tabIndex="07"
            tabLabel="À vous de jouer"
            registrationMarks
            innerClassName="p-7 sm:p-12 md:p-16 text-center"
          >
            <HandwrittenNote className="text-[#EEF85A] mb-3">
              Dernière feuille sur la table.
            </HandwrittenNote>

            <h2 className="text-[clamp(2rem,4.8vw,3.7rem)] font-bold tracking-[-0.045em] leading-[1.05] text-white mx-auto max-w-[18ch]">
              Votre nouveau site peut être{" "}
              <span className="relative inline-block text-white/75 font-normal">
                en ligne la semaine prochaine
                <HandDrawnUnderline className="absolute -bottom-2 inset-x-0 h-3 w-full" delay={0.25} />
              </span>
              .
            </h2>

            <p className="mt-5 text-[0.98rem] sm:text-[1.05rem] leading-[1.68] text-white/70 max-w-[48ch] mx-auto">
              Envoyez vos coordonnées en deux minutes ou réservez dix minutes au téléphone pour qu&apos;on
              regarde votre activité ensemble.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <PaperSquareButton
                href="/commander"
                label="Commander mon site à 0 €"
                variant="coral"
              />
              <PaperSquareButton
                href="https://rdv.boubane.com/boubane"
                label="Appel 10 min avec Léo"
                variant="cream"
                external
              />
            </div>

            <div className="mt-8 pt-6 border-t border-dashed border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/65">
              <DottedInkLink href="/creation-site-internet-segre" className="hover:text-white">
                Studio à Segré (49)
              </DottedInkLink>
              <DottedInkLink href="/hebergement" className="hover:text-white">
                Guide hébergement
              </DottedInkLink>
              <DottedInkLink href="/blog" className="hover:text-white">
                Articles &amp; conseils
              </DottedInkLink>
            </div>
          </FolderSheet>
        </AtelierReveal>
      </div>
    </section>
  );
}
