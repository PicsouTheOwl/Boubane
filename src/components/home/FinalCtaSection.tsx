"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 sm:py-36 bg-[#0D0C0B] text-[#FAF8F5]">
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 text-center">
        <AtelierReveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            À vous de jouer
          </p>
          <h2 className="mt-5 text-[clamp(2.2rem,5vw,3.9rem)] font-bold tracking-[-0.045em] leading-[1.04] text-white">
            Votre nouveau site peut être en ligne la semaine prochaine.
          </h2>
          <p className="mt-5 text-[1.04rem] leading-[1.68] text-white/65 max-w-[46ch] mx-auto">
            Envoyez vos coordonnées en deux minutes ou réservez dix minutes au téléphone pour qu&apos;on
            en discute tranquillement.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#ED5B04] text-white px-8 py-4 text-sm sm:text-base font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all"
            >
              <span>Commander mon site à 0 €</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://rdv.boubane.com/boubane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] text-white px-6 py-4 text-sm sm:text-base font-semibold hover:bg-white/[0.14] active:scale-[0.97] transition-all"
            >
              <Calendar className="w-4 h-4 text-[#ED5B04]" />
              <span>Prendre RDV (10 min)</span>
            </a>
          </div>
        </AtelierReveal>
      </div>
    </section>
  );
}
