"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    index: "01",
    q: "Le site est-il réellement 100% gratuit en création ?",
    a: "Oui, exactement 0 €. Vous ne réglez aucun honoraire de conception, de design ou de développement. Vos seuls frais sont techniques (votre nom de domaine ~10 €/an et votre hébergement habituel ~5 €/mois), réglés directement et en toute transparence auprès de votre hébergeur (IONOS, OVH, Hostinger, Vercel...).",
  },
  {
    index: "02",
    q: "Y a-t-il un engagement ou un abonnement caché ?",
    a: "Aucun. Vous n'êtes engagé sur aucune durée. Vous êtes le seul propriétaire légal du nom de domaine et du code source. Vous pouvez migrer, modifier ou faire évoluer votre site à tout moment en toute indépendance.",
  },
  {
    index: "03",
    q: "Quel est le délai de livraison ?",
    a: "Dès réception de vos éléments (textes, photos ou préférences d'activité), votre site est conçu, validé avec vous et mis en ligne sous 5 à 7 jours ouvrés.",
  },
  {
    index: "04",
    q: "Que se passe-t-il si le résultat ne me convient pas ?",
    a: "Nous faisons les ajustements nécessaires ensemble. Si le résultat ne vous satisfait toujours pas, vous êtes entièrement libre d'arrêter le projet sans débourser un centime. Le risque est à 100% de mon côté.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 md:py-36 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.06]">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <AtelierReveal className="lg:col-span-4">
            <EyebrowBadge index="06">Transparence</EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2rem,3.8vw,3rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Questions{" "}
              <span className="text-[#0C0A08]/40 font-normal">fréquentes.</span>
            </h2>
            <p className="mt-4 text-[0.96rem] leading-[1.6] text-[#57534E]">
              Tout ce qu&apos;il faut savoir avant de réserver votre vitrine offerte.
            </p>
          </AtelierReveal>

          {/* Accordéon Éditorial Ouvert à Filets Fins */}
          <div className="lg:col-span-8 divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full py-6 flex items-center justify-between gap-6 text-left cursor-pointer group active:scale-[0.996] transition-transform"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[#ED5B04] font-semibold tabular-nums">
                        {item.index}
                      </span>
                      <span className="font-semibold text-[1.06rem] tracking-[-0.02em] text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                        {item.q}
                      </span>
                    </div>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.22, ease: ATELIER_EASE }}
                      className="w-7 h-7 shrink-0 rounded-full border border-[#0C0A08]/[0.12] flex items-center justify-center text-[#0C0A08]"
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
                        transition={{ duration: 0.28, ease: ATELIER_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-8 pr-6 text-[0.96rem] leading-[1.68] text-[#57534E] max-w-[62ch]">
                          {item.a}
                        </div>
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
