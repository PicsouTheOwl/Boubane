"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { FolderSheet, HandwrittenNote } from "@/components/DraftingPrimitives";
import { ATELIER_EASE, cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    index: "01",
    q: "La création du site est-elle vraiment gratuite ?",
    a: "Oui, vous réglez 0 € d'honoraires pour le design et le développement. Vos seuls frais sont techniques : votre nom de domaine (environ 10 € par an) et votre hébergement (environ 5 € par mois), payés directement chez l'hébergeur de votre choix comme OVH, Hostinger ou Vercel.",
  },
  {
    index: "02",
    q: "Y a-t-il un engagement ou un abonnement caché ?",
    a: "Non. Vous êtes propriétaire du nom de domaine et de tout le code source dès la mise en ligne. Si vous voulez un jour faire modifier le site par quelqu'un d'autre ou changer d'hébergeur, vous êtes libre.",
  },
  {
    index: "03",
    q: "Combien de temps faut-il pour avoir le site en ligne ?",
    a: "Une fois que j'ai vos photos et vos infos de base, la maquette est prête en quelques jours et le site complet est généralement en ligne sous 5 à 7 jours ouvrés.",
  },
  {
    index: "04",
    q: "Et si la proposition ne me plaît pas ?",
    a: "On ajuste ensemble ce qui bloque jusqu'à ce que ça vous convienne. Et si vraiment ça ne colle pas, vous êtes libre d'arrêter sans rien débourser.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 bg-[#FAF7F0] drafting-grid border-t border-[#424242]/15 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <AtelierReveal className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#57534E] mb-3">
              <span className="px-2 py-0.5 bg-[#E8DAC1] text-[#0C0A08] font-semibold rounded-[2px]">
                06
              </span>
              <span>Questions fréquentes</span>
            </div>
            <h2 className="text-[clamp(1.9rem,3.8vw,2.9rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Ce qu&apos;on me demande{" "}
              <span className="text-[#57534E] font-normal">avant de se lancer.</span>
            </h2>
            <HandwrittenNote className="mt-3 -rotate-1">
              Les réponses directes, sans astérisque en bas de page.
            </HandwrittenNote>
          </AtelierReveal>

          <AtelierReveal delay={0.05} className="lg:col-span-8">
            <FolderSheet
              tone="kraft"
              tabIndex="FAQ"
              tabLabel="Réponses claires"
              innerClassName="px-5 sm:px-8 py-2"
            >
              <div className="divide-y divide-dashed divide-[#424242]/35">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openIdx === idx;
                  return (
                    <div key={item.q}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenIdx(isOpen ? null : idx)}
                        className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer group active:scale-[0.996] transition-transform min-h-[60px]"
                      >
                        <div className="flex items-baseline gap-3 sm:gap-4 pr-2">
                          <span className="font-mono text-xs text-[#ED5B04] font-semibold tabular-nums shrink-0">
                            {item.index}
                          </span>
                          <span className="font-semibold text-[1rem] sm:text-[1.06rem] tracking-[-0.02em] text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                            {item.q}
                          </span>
                        </div>

                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: ATELIER_EASE }}
                          className={cn(
                            "w-8 h-8 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors",
                            isOpen
                              ? "bg-[#141311] border-[#141311] text-[#FAF7F0]"
                              : "bg-[#FDFBF5] border-[#424242]/35 text-[#0C0A08] group-hover:border-[#ED5B04]"
                          )}
                        >
                          <ChevronDown className="w-4 h-4" strokeWidth={2} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.26, ease: ATELIER_EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6 pl-7 sm:pl-9 pr-2 text-[0.95rem] leading-[1.68] text-[#3B352F] max-w-[60ch]">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </FolderSheet>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
