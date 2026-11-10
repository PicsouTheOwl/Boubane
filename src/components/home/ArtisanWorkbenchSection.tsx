"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { AtelierReveal, Crosshair, EyebrowBadge } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

export function ArtisanWorkbenchSection() {
  return (
    <section id="artisan" className="relative py-24 md:py-32 border-t border-[#0C0A08]/[0.06]">
      <div className="mx-auto max-w-[1000px] px-6">
        <AtelierReveal>
          <div className="relative rounded-[28px] bg-[#FCFBF8] border border-[#0C0A08]/[0.1] p-8 sm:p-12 md:p-16 shadow-[0_24px_60px_-20px_rgba(12,10,8,0.09),inset_0_1px_0_rgba(255,255,255,1)]">
            {/* Repères de coupe architecturaux */}
            <Crosshair className="absolute top-4 left-4" />
            <Crosshair className="absolute top-4 right-4" />
            <Crosshair className="absolute bottom-4 left-4" />
            <Crosshair className="absolute bottom-4 right-4" />

            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#0C0A08]/[0.07]">
              <EyebrowBadge index="05">L&apos;Artisan du Studio</EyebrowBadge>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 border border-[#0C0A08]/[0.1] rounded-full px-3.5 py-1 bg-white">
                Artisanat Web Français · Haut-Anjou
              </span>
            </div>

            <blockquote className="mt-9 text-[clamp(1.25rem,2.3vw,1.72rem)] font-medium tracking-[-0.025em] leading-[1.48] text-[#0C0A08]">
              « En agence, votre interlocuteur est un commercial qui sous-traite votre projet. Chez
              Boubane, vous échangez directement avec celui qui écrit chaque ligne de code de votre
              vitrine. Pas de filtre, pas de déperdition, pas de fausses promesses. »
            </blockquote>

            <div className="mt-10 pt-8 border-t border-[#0C0A08]/[0.07] flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                {/* Signature Manuscrite SVG qui se dessine au scroll */}
                <div className="w-48 h-16 mb-2" aria-label="Signature manuscrite de Léo Saillour">
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
                <div className="font-semibold text-base text-[#0C0A08]">Léo Saillour</div>
                <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#57534E]">
                  Fondateur &amp; Développeur Web · Segré-en-Anjou Bleu
                </div>
              </div>

              {/* Canaux d'échange directs */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://rdv.boubane.com/boubane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Visio / Appel 10 min</span>
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
        </AtelierReveal>
      </div>
    </section>
  );
}
