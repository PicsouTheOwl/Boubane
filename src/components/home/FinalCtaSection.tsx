"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";

export function FinalCtaSection() {
  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden border-t border-[#0C0A08]/[0.06]"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(238, 248, 90, 0.08) 0%, rgba(250, 248, 245, 0) 70%)",
      }}
    >
      {/* Arche d'ancrage cinétique */}
      <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden="true">
        <svg viewBox="0 0 1440 340" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <radialGradient id="ctaAuraGrad" cx="50%" cy="80%" r="70%">
              <stop offset="0%" stopColor="rgba(237, 91, 4, 0.1)" />
              <stop offset="40%" stopColor="rgba(238, 248, 90, 0.07)" />
              <stop offset="85%" stopColor="rgba(250, 248, 245, 0)" />
            </radialGradient>
          </defs>
          <path
            d="M -80, 300 C 260, 60 1180, 60 1520, 300 L 1520, 340 L -80, 340 Z"
            fill="url(#ctaAuraGrad)"
          />
          <path
            d="M -80, 300 C 260, 60 1180, 60 1520, 300"
            stroke="rgba(237, 91, 4, 0.2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[820px] px-6 text-center">
        <AtelierReveal>
          <div className="flex justify-center">
            <EyebrowBadge index="07">Conception Sur-Mesure</EyebrowBadge>
          </div>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08] mx-auto max-w-[16ch]">
            Votre vitrine d&apos;exception peut être en ligne la semaine prochaine
            <span className="text-[#ED5B04]">.</span>
          </h2>
          <p className="mt-5 text-[1.05rem] leading-[1.6] text-[#57534E] max-w-[50ch] mx-auto">
            Réservez votre créneau de conception. 100 % de la création et du code sont offerts à nos
            frais. Zéro discours commercial, zéro engagement captif.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0C0A08] text-white px-8 py-4 text-base font-semibold shadow-[0_8px_28px_rgba(12,10,8,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
            >
              <span>Commander mon site offert (0 €)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://rdv.boubane.com/boubane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.14] text-[#0C0A08] px-6 py-4 text-base font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all"
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
