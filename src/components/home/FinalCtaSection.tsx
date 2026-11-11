"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function FinalCtaSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0D0C0B] text-[#FAF8F5]">
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 text-center">
        <AtelierReveal>
          <img
            src="/images/cat-hero-code.png"
            alt="Mascotte chat Boubane derrière son ordinateur"
            width={720}
            height={720}
            className="w-28 sm:w-32 h-auto mx-auto mb-5 object-contain drop-shadow-[0_16px_28px_rgba(237,91,4,0.22)]"
            loading="lazy"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            À VOUS DE JOUER
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[clamp(2rem,4.5vw,2.75rem)] font-bold tracking-[-0.04em] leading-[1.06] text-white">
            Votre nouveau site peut être en ligne la semaine prochaine.
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.62] text-white/65 max-w-[46ch] mx-auto">
            Envoyez vos coordonnées en deux minutes ou réservez dix minutes au téléphone pour qu&apos;on
            en discute tranquillement.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all"
            >
              <span>Commander mon site à 0 €</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://rdv.boubane.com/boubane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#262523] border border-[#3F3F46] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#32302E] active:scale-[0.97] transition-all"
            >
              <span>Prendre RDV (10 min)</span>
            </a>
          </div>
        </AtelierReveal>
      </div>
    </section>
  );
}
