"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function FinalCtaSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#FAF8F5] text-[#0C0A08] border-t border-[#0C0A08]/[0.07]">
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 text-center">
        <AtelierReveal>
          <img
            src="/images/cat-hero-code.png"
            alt="Mascotte chat Boubane derrière son ordinateur"
            width={720}
            height={720}
            className="w-28 sm:w-32 h-auto mx-auto mb-5 object-contain drop-shadow-[0_16px_28px_rgba(237,91,4,0.16)]"
            loading="lazy"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            À VOUS DE JOUER
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[clamp(2rem,4.5vw,2.75rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
            Votre nouveau site peut être en ligne la semaine prochaine.
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.62] text-[#57534E] max-w-[46ch] mx-auto">
            Envoyez vos coordonnées en deux minutes ou réservez dix minutes au téléphone pour qu&apos;on
            en discute tranquillement.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all shadow-[0_10px_28px_rgba(237,91,4,0.22)]"
            >
              <span>Commander mon site à 0 €</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://rdv.boubane.com/boubane/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.14] text-[#0C0A08] px-6 py-3.5 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all"
            >
              <span>Prendre RDV (30 min)</span>
            </a>
          </div>
        </AtelierReveal>
      </div>
    </section>
  );
}
