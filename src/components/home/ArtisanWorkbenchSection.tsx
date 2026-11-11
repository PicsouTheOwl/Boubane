"use client";

import React from "react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function ArtisanWorkbenchSection() {
  return (
    <section
      id="artisan"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Boubane Coffee Mascot */}
          <AtelierReveal className="lg:col-span-6 lg:order-2 flex flex-col items-center">
            <div className="relative flex items-center justify-center py-4">
              <img
                src="/images/cat-cafe.png"
                alt="Mascotte chat Boubane prenant un café au chaud"
                width={720}
                height={720}
                className="w-56 sm:w-72 lg:w-80 h-auto object-contain drop-shadow-[0_18px_32px_rgba(237,91,4,0.14)]"
                loading="lazy"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#57534E] text-center">
              SEGRÉ-EN-ANJOU BLEU (49500) · LÉO SAILLOUR
            </p>
          </AtelierReveal>

          {/* Calm Human Words */}
          <AtelierReveal delay={0.05} className="lg:col-span-6 lg:order-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              UN SEUL INTERLOCUTEUR
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[clamp(1.9rem,3.6vw,2.65rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
              Vous appelez directement celui qui écrit votre site.
            </h2>

            <div className="mt-5 space-y-4 text-[1rem] leading-[1.68] text-[#57534E] max-w-[46ch]">
              <p>
                En agence, vous expliquez votre métier à un commercial qui passe ensuite vos notes
                à quelqu&apos;un d&apos;autre. Ici, je décroche le téléphone, je conçois la page
                et je la mets en ligne avec vous.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-semibold text-[#0C0A08]">
              <a
                href="tel:+33778310346"
                className="py-1.5 hover:text-[#ED5B04] transition-colors"
              >
                07 78 31 03 46
              </a>
              <span aria-hidden="true" className="text-[#0C0A08]/35">
                ·
              </span>
              <a
                href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet%20de%20site%20vitrine."
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 hover:text-[#ED5B04] transition-colors"
              >
                WhatsApp
              </a>
              <span aria-hidden="true" className="text-[#0C0A08]/35">
                ·
              </span>
              <a
                href="https://rdv.boubane.com/boubane"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 hover:text-[#ED5B04] transition-colors"
              >
                Prendre RDV
              </a>
            </div>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
