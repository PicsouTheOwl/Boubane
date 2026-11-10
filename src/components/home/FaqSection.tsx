"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "La création du site est-elle vraiment gratuite ?",
    a: "Oui, vous réglez 0 € d'honoraires pour le design et le développement. Vos seuls frais sont techniques : votre nom de domaine (environ 10 € par an) et votre hébergement (environ 5 € par mois), payés directement chez l'hébergeur de votre choix comme OVH, Hostinger ou Vercel.",
  },
  {
    q: "Y a-t-il un engagement ou un abonnement caché ?",
    a: "Non. Vous êtes propriétaire du nom de domaine et de tout le code source dès la mise en ligne. Si vous voulez un jour faire modifier le site par quelqu'un d'autre ou changer d'hébergeur, vous êtes libre.",
  },
  {
    q: "Combien de temps faut-il pour avoir le site en ligne ?",
    a: "Une fois que j'ai vos photos et vos infos de base, la maquette est prête en quelques jours et le site complet est généralement en ligne sous 5 à 7 jours ouvrés.",
  },
  {
    q: "Et si la proposition ne me plaît pas ?",
    a: "On ajuste ensemble ce qui bloque jusqu'à ce que ça vous convienne. Et si vraiment ça ne colle pas, vous êtes libre d'arrêter sans rien débourser.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1040px] px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <AtelierReveal className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              Questions fréquentes
            </p>
            <h2 className="mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
              Tout est clair avant de commencer.
            </h2>
          </AtelierReveal>

          <div className="lg:col-span-8 divide-y divide-[#0C0A08]/[0.1] border-t border-b border-[#0C0A08]/[0.1]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full py-6 flex items-center justify-between gap-6 text-left cursor-pointer group"
                  >
                    <span className="font-semibold text-[1.04rem] tracking-[-0.02em] text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                      {item.q}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: ATELIER_EASE }}
                      className="w-7 h-7 shrink-0 rounded-full border border-[#0C0A08]/15 flex items-center justify-center text-[#0C0A08]"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: ATELIER_EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-8 text-[0.96rem] leading-[1.68] text-[#57534E] max-w-[58ch]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
