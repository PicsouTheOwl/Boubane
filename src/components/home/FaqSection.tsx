"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Le site est-il réellement 100% gratuit en création ?",
    a: "Oui, exactement 0 €. Vous ne réglez aucun honoraire de conception, de design ou de développement. Vos seuls frais sont techniques (votre nom de domaine ~10 €/an et votre hébergement habituel ~5 €/mois), réglés directement et en toute transparence auprès de votre hébergeur (IONOS, OVH, Hostinger, Vercel...).",
  },
  {
    q: "Y a-t-il un engagement ou un abonnement caché ?",
    a: "Aucun. Vous n'êtes engagé sur aucune durée. Vous êtes le seul propriétaire légal du nom de domaine et du code source. Vous pouvez migrer, modifier ou faire évoluer votre site à tout moment en toute indépendance.",
  },
  {
    q: "Quel est le délai de livraison ?",
    a: "Dès réception de vos éléments (textes, photos ou préférences d'activité), votre site est conçu, validé avec vous et mis en ligne sous 5 à 7 jours ouvrés.",
  },
  {
    q: "Que se passe-t-il si le résultat ne me convient pas ?",
    a: "Nous faisons les ajustements nécessaires ensemble. Si le résultat ne vous satisfait toujours pas, vous êtes entièrement libre d'arrêter le projet sans débourser un centime. Le risque est à 100% de mon côté.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 bg-[#F5F2EC] border-t border-[#0C0A08]/[0.06]"
    >
      <div className="mx-auto max-w-[840px] px-6">
        <AtelierReveal className="text-center mb-12 md:mb-14">
          <div className="flex justify-center">
            <EyebrowBadge index="06">Questions Fréquentes</EyebrowBadge>
          </div>
          <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Tout comprendre en toute transparence<span className="text-[#ED5B04]">.</span>
          </h2>
          <p className="mt-3 text-[1rem] text-[#57534E]">
            Tout ce que vous devez savoir avant de commander votre vitrine offerte. Zéro frais
            d&apos;agence, zéro engagement.
          </p>
        </AtelierReveal>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <AtelierReveal key={item.q} delay={idx * 0.04}>
                <div className="rounded-[20px] bg-white border border-[#0C0A08]/[0.08] overflow-hidden shadow-[0_2px_8px_rgba(12,10,8,0.025)] transition-colors hover:border-[#0C0A08]/[0.16]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer active:scale-[0.995] transition-transform"
                  >
                    <span className="font-semibold text-[1.02rem] tracking-[-0.015em] text-[#0C0A08]">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.22, ease: ATELIER_EASE }}
                      className="w-7 h-7 shrink-0 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] flex items-center justify-center text-[#0C0A08]"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2} />
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
                        <div className="px-6 pb-6 pt-1 text-[0.95rem] leading-[1.68] text-[#57534E] border-t border-[#0C0A08]/[0.05]">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AtelierReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
