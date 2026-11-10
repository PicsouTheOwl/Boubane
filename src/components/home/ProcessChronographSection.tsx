"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { FolderSheet, HandwrittenNote, PaperSquareButton } from "@/components/DraftingPrimitives";
import { ATELIER_EASE, cn } from "@/lib/utils";

const STEPS = [
  {
    code: "JOUR 1",
    short: "Café ou appel 10 min",
    title: "On parle de votre métier sans jargon.",
    desc: "Vous me montrez ce que vous faites, vos photos de chantier ou d'atelier, et votre zone autour de Segré ou ailleurs. Pas de cahier des charges de 20 pages.",
    note: "Zero formulaire compliqué.",
  },
  {
    code: "JOURS 2–4",
    short: "Dessin & mise en page",
    title: "Je vous envoie un premier lien privé à tester.",
    desc: "Je rédige des textes simples qui vous ressemblent et je construis le site pour qu'il soit impeccable sur téléphone comme sur grand écran.",
    note: "On ajuste ensemble en direct.",
  },
  {
    code: "JOUR 5",
    short: "Mise en ligne à votre nom",
    title: "Votre nom de domaine et votre site sont en ligne.",
    desc: "Vous avez tous les accès, le code source, et votre fiche Google pointée vers la nouvelle vitrine. Vous ne devez toujours aucun honoraire de création.",
    note: "Votre vitrine tourne pour vous.",
  },
  {
    code: "APRÈS",
    short: "Liberté totale",
    title: "Vous modifiez ou vous me passez un coup de fil.",
    desc: "Une nouvelle photo à ajouter ou un horaire d'été ? Un message WhatsApp et c'est fait. Et si vous préférez gérer ailleurs un jour, tout est à vous.",
    note: "Aucun abonnement piège.",
  },
];

export function ProcessChronographSection() {
  const [selected, setSelected] = useState(0);
  const current = STEPS[selected];

  return (
    <section
      id="processus"
      className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <AtelierReveal className="max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#57534E] mb-3">
              <span className="px-2 py-0.5 bg-[#E8DAC1] text-[#0C0A08] font-semibold rounded-[2px]">
                04
              </span>
              <span>Carnet de route</span>
            </div>
            <h2 className="text-[clamp(2rem,4.4vw,3.3rem)] font-bold tracking-[-0.045em] leading-[1.04] text-[#0C0A08]">
              Cinq jours du premier coup de fil{" "}
              <span className="text-[#57534E] font-normal">à la mise en ligne.</span>
            </h2>
          </AtelierReveal>

          <AtelierReveal delay={0.05}>
            <HandwrittenNote className="rotate-1">
              Touchez une étape pour ouvrir la fiche du jour.
            </HandwrittenNote>
          </AtelierReveal>
        </div>

        {/* Interactive Index Strip + Open Kraft Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          <div
            role="tablist"
            aria-label="Étapes de création en 5 jours"
            className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-3"
          >
            {STEPS.map((step, idx) => {
              const active = selected === idx;
              return (
                <button
                  key={step.code}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setSelected(idx)}
                  className={cn(
                    "group text-left p-4 rounded-md border transition-all cursor-pointer min-h-[72px] active:scale-[0.99]",
                    active
                      ? "bg-[#141311] border-[#141311] text-[#FAF7F0] paper-sheet-shadow"
                      : "bg-[#FDFBF5] border-[#424242]/25 text-[#0C0A08] hover:border-[#ED5B04]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]",
                        active ? "text-[#ED5B04]" : "text-[#57534E]"
                      )}
                    >
                      {step.code}
                    </span>
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        active ? "bg-[#ED5B04]" : "bg-[#424242]/20 group-hover:bg-[#ED5B04]/60"
                      )}
                    />
                  </div>
                  <div className="mt-1 font-semibold text-sm sm:text-[15px] tracking-tight leading-snug">
                    {step.short}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: ATELIER_EASE }}
                className="w-full flex"
              >
                <FolderSheet
                  tone="kraft"
                  tabIndex={current.code}
                  tabLabel={current.short}
                  registrationMarks
                  tiltClassName="w-full"
                  innerClassName="p-6 sm:p-10 h-full flex flex-col justify-between"
                >
                  <div>
                    <HandwrittenNote className="-rotate-1 mb-2">{current.note}</HandwrittenNote>
                    <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.035em] leading-[1.1] text-[#0C0A08]">
                      {current.title}
                    </h3>
                    <p className="mt-4 text-[0.98rem] sm:text-[1.03rem] leading-[1.7] text-[#3B352F] max-w-[54ch]">
                      {current.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-[#424242]/35 flex flex-wrap items-center justify-between gap-4">
                    <div className="font-mono text-xs text-[#4A433B]">
                      Étape {selected + 1} sur {STEPS.length}
                    </div>
                    <PaperSquareButton href="/commander" label="Réserver mon créneau" variant="ink" />
                  </div>
                </FolderSheet>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
