"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";
import { HandDrawnUnderline } from "@/components/HandDrawnAccents";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 md:py-36 bg-[#0B0A09] text-[#FAF8F5] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[960px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(237,91,4,0.18)_0%,transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-[920px] px-6 text-center">
        <AtelierReveal>
          <div className="flex justify-center">
            <EyebrowBadge dark index="07">
              C&apos;est à vous
            </EyebrowBadge>
          </div>
          <h2 className="mt-7 text-[clamp(2.4rem,5.4vw,4.1rem)] font-bold tracking-[-0.045em] leading-[1.03] text-white mx-auto max-w-[16ch]">
            Votre nouveau site peut être{" "}
            <span className="relative inline-block text-white/60 font-normal">
              en ligne la semaine prochaine
              <HandDrawnUnderline className="absolute -bottom-2 inset-x-0 h-3 w-full" delay={0.3} />
            </span>
            .
          </h2>
          <p className="mt-5 text-[1.04rem] leading-[1.65] text-white/60 max-w-[50ch] mx-auto">
            Envoyez vos coordonnées en deux minutes ou réservez dix minutes au téléphone pour qu&apos;on
            en discute tranquillement.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#ED5B04] text-white px-8 py-4 text-base font-semibold shadow-[0_12px_36px_rgba(237,91,4,0.3)] hover:bg-[#D64E00] active:scale-[0.97] transition-all"
            >
              <span>Commander mon site offert (0 €)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://rdv.boubane.com/boubane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.14] text-white px-6 py-4 text-base font-semibold hover:bg-white/[0.12] active:scale-[0.97] transition-all"
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
