"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { AtelierReveal, Crosshair, EyebrowBadge } from "@/components/AtelierPrimitives";
import { HandDrawnUnderline } from "@/components/HandDrawnAccents";
import { ATELIER_EASE } from "@/lib/utils";

export function ArtisanWorkbenchSection() {
  return (
    <section
      id="artisan"
      className="relative py-28 md:py-36 bg-[#F3EFE7] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <AtelierReveal>
          <div className="relative rounded-[28px] bg-[#FDFCF9] atelier-shadow-warm p-8 sm:p-12 md:p-16">
            <Crosshair className="absolute top-4 left-4" />
            <Crosshair className="absolute top-4 right-4" />
            <Crosshair className="absolute bottom-4 left-4" />
            <Crosshair className="absolute bottom-4 right-4" />

            <div
              aria-hidden="true"
              className="hidden sm:flex flex-col items-end absolute top-10 right-12 select-none pointer-events-none rotate-[-2.5deg] opacity-75"
            >
              <div className="rounded-md border border-[#ED5B04]/45 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#ED5B04]">
                SEGRÉ · HAUT-ANJOU
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-4 space-y-6 lg:border-r lg:border-[#0C0A08]/[0.07] lg:pr-8">
                <EyebrowBadge index="05">Un seul interlocuteur</EyebrowBadge>

                <div className="space-y-4 pt-2 divide-y divide-[#0C0A08]/[0.07] font-mono text-xs">
                  <div className="pb-3">
                    <div className="text-[#0C0A08]/40 text-[10px] uppercase tracking-[0.12em]">
                      DÉVELOPPEUR
                    </div>
                    <div className="text-[#0C0A08] font-semibold mt-1">Léo Saillour</div>
                  </div>
                  <div className="py-3">
                    <div className="text-[#0C0A08]/40 text-[10px] uppercase tracking-[0.12em]">
                      BASÉ À
                    </div>
                    <div className="text-[#0C0A08] font-medium mt-1">
                      Segré-en-Anjou Bleu (49500)
                    </div>
                    <div className="text-[#0C0A08]/45 text-[10px] mt-0.5">Maine-et-Loire</div>
                  </div>
                  <div className="pt-3">
                    <div className="text-[#0C0A08]/40 text-[10px] uppercase tracking-[0.12em]">
                      FONCTIONNEMENT
                    </div>
                    <div className="text-[#ED5B04] font-semibold mt-1">
                      En direct, sans sous-traitance
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between">
                <blockquote className="text-[clamp(1.25rem,2.3vw,1.72rem)] font-medium tracking-[-0.025em] leading-[1.48] text-[#0C0A08]">
                  « En agence, vous parlez à un commercial qui passe ensuite le dossier à quelqu&apos;un
                  d&apos;autre. Ici, vous discutez{" "}
                  <span className="relative inline-block">
                    directement avec celui qui dessine et code votre site
                    <HandDrawnUnderline className="absolute -bottom-1.5 inset-x-0 h-2.5 w-full" delay={0.35} />
                  </span>{" "}
                  du début à la fin. Si un détail ne vous plaît pas, on le corrige ensemble. »
                </blockquote>

                <div className="mt-10 pt-8 border-t border-[#0C0A08]/[0.07] flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                  <div>
                    <div className="w-48 h-16 mb-1" aria-label="Signature manuscrite de Léo Saillour">
                      <svg viewBox="0 0 220 72" className="w-full h-full overflow-visible" fill="none">
                        <motion.path
                          d="M12 52 C18 28, 28 12, 32 16 C36 20, 22 48, 26 52 C32 56, 48 40, 56 42 C62 44, 52 54, 62 52 C74 49, 86 32, 92 36 C96 39, 88 52, 98 50 C108 48, 122 24, 128 20 C134 16, 122 48, 130 50 C140 52, 152 38, 162 40 C172 42, 168 51, 180 47 C192 43, 202 36, 212 38"
                          stroke="#0C0A08"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 1.4, ease: ATELIER_EASE }}
                        />
                        <motion.path
                          d="M16 61 C68 58, 135 55, 198 57"
                          stroke="#ED5B04"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.8, delay: 1.0, ease: ATELIER_EASE }}
                        />
                      </svg>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#57534E]">
                      Léo Saillour · Boubane
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://rdv.boubane.com/boubane"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Appel 10 min</span>
                    </a>
                    <a
                      href="tel:+33778310346"
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-4 py-2.5 text-xs font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>07 78 31 03 46</span>
                    </a>
                    <a
                      href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet%20de%20site%20vitrine."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-4 py-2.5 text-xs font-semibold hover:border-[#ED5B04] hover:text-[#ED5B04] active:scale-[0.97] transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AtelierReveal>
      </div>
    </section>
  );
}
