"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

export function ArtisanWorkbenchSection() {
  return (
    <section
      id="artisan"
      className="relative py-24 sm:py-32 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Candid Studio Photograph */}
          <AtelierReveal className="lg:col-span-6 lg:order-2">
            <div className="overflow-hidden rounded-2xl bg-[#EFEAE2]">
              <img
                src="/images/story-leo-desk.jpg"
                alt="Léo Saillour devant son poste de travail à Segré-en-Anjou Bleu"
                className="w-full aspect-[4/3] object-cover object-center"
                loading="lazy"
              />
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#57534E]">
              Segré-en-Anjou Bleu (49500) · Léo Saillour
            </p>
          </AtelierReveal>

          {/* Calm Human Words + Signature */}
          <AtelierReveal delay={0.05} className="lg:col-span-6 lg:order-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              Un seul interlocuteur
            </p>

            <h2 className="mt-4 text-[clamp(2rem,4vw,3.1rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
              Vous appelez directement celui qui écrit votre site.
            </h2>

            <div className="mt-6 space-y-4 text-[1.02rem] leading-[1.7] text-[#57534E] max-w-[46ch]">
              <p>
                En agence, vous expliquez votre métier à un commercial qui passe ensuite vos notes
                à quelqu&apos;un d&apos;autre. Ici, je décroche le téléphone, je conçois la page
                et je la mets en ligne avec vous.
              </p>
              <p>
                Si un titre ou une photo ne vous convient pas, un simple message suffit pour le
                changer le jour même.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="w-40 h-12" aria-label="Signature de Léo Saillour">
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
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://rdv.boubane.com/boubane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-5 py-3 text-xs font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appel 10 min</span>
              </a>
              <a
                href="tel:+33778310346"
                className="inline-flex items-center gap-2 rounded-full border border-[#0C0A08]/15 text-[#0C0A08] px-5 py-3 text-xs font-semibold hover:border-[#0C0A08] transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#ED5B04]" />
                <span>07 78 31 03 46</span>
              </a>
              <a
                href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet%20de%20site%20vitrine."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#0C0A08]/15 text-[#0C0A08] px-5 py-3 text-xs font-semibold hover:border-[#ED5B04] hover:text-[#ED5B04] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
