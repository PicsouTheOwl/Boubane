"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING, ATELIER_SPRING, cn } from "@/lib/utils";

interface StoryChapter {
  id: string;
  pill: string;
  eyebrow: string;
  title: string;
  body: string;
  highlight: string;
  focusCard: "agency" | "orange" | "ownership";
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "declic",
    pill: "Le déclic",
    eyebrow: "Le point de départ",
    title: "Une vitrine d'agence coûte souvent 4 500 €.",
    body: "Trop d'artisans et de gérants signent des factures lourdes ou un leasing sur quatre ans pour un site lent qu'ils ne possèdent même pas.",
    highlight: "4 500 € en moyenne ailleurs",
    focusCard: "agency",
  },
  {
    id: "modele",
    pill: "Modèle 0 €",
    eyebrow: "Sans intermédiaires",
    title: "Enlever le superflu ramène la création à 0 €.",
    body: "Pas de locaux parisiens, pas de commerciaux ni de réunions sans fin. Je dessine et j'écris votre site directement avec vous.",
    highlight: "0 € d'honoraires de création",
    focusCard: "orange",
  },
  {
    id: "delai",
    pill: "En 5 jours",
    eyebrow: "Pensé pour votre téléphone",
    title: "En ligne en 5 jours avec vos vraies photos.",
    body: "Vos réalisations, des mots clairs et votre numéro accessible dès la première seconde sur mobile.",
    highlight: "Livré sous 5 jours ouvrés",
    focusCard: "orange",
  },
  {
    id: "propriete",
    pill: "À votre nom",
    eyebrow: "Propriété intégrale",
    title: "Le code reste 100 % entre vos mains.",
    body: "Vous réglez uniquement votre domaine (~10 €/an) et votre hébergement (~5 €/mois) directement chez votre prestataire.",
    highlight: "Liberté totale sans engagement",
    focusCard: "ownership",
  },
];

export function ScrollStory3DStage() {
  const [activeIdx, setActiveIdx] = useState(1);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const current = CHAPTERS[activeIdx];

  const stepBy = (delta: number) => {
    setActiveIdx((prev) => (prev + delta + CHAPTERS.length) % CHAPTERS.length);
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTilt({ rx: -ny * 9, ry: nx * 12 });
  };

  const isAgency = current.focusCard === "agency";
  const isOrange = current.focusCard === "orange";
  const isOwnership = current.focusCard === "ownership";

  return (
    <section id="modele" className="relative bg-[#FAF8F5] py-14 sm:py-20">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Interactive Tactile Card Fan */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div
              onPointerMove={handleMouseMove}
              onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
              style={{ perspective: 1200 }}
              className="relative w-full max-w-[490px] h-[300px] sm:h-[340px] select-none flex items-center justify-center"
            >
              <motion.div
                animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
                transition={{ type: "spring", stiffness: 170, damping: 22 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-[310px] h-[290px] sm:w-[460px] sm:h-[325px]"
              >
                {/* Card A: Agence Classique 4 500 € */}
                <motion.button
                  type="button"
                  onClick={() => setActiveIdx(0)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    rotate: isAgency ? 0 : -7,
                    x: isAgency ? 28 : 0,
                    y: isAgency ? 18 : 0,
                    scale: isAgency ? 1.05 : 0.95,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute top-2 left-0 sm:left-2 w-[205px] sm:w-[275px] rounded-[18px] bg-[#F3EFE7] border p-5 sm:p-6 text-left cursor-pointer",
                    isAgency
                      ? "z-40 border-[#0C0A08]/25 shadow-[0_24px_48px_rgba(12,10,8,0.14)]"
                      : "z-10 border-[#E5DEC9] shadow-[0_14px_30px_rgba(12,10,8,0.07)]"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78716C]">
                    AGENCE CLASSIQUE
                  </div>
                  <div className="mt-3 font-[family-name:var(--font-jakarta)] text-[26px] sm:text-[32px] font-extrabold leading-[1.1] text-[#A8A29E] line-through tabular-nums">
                    4 500 €
                  </div>
                  <div className="mt-3 text-[11px] sm:text-[12px] text-[#78716C] leading-snug">
                    6 à 12 semaines · Leasing 4 ans
                  </div>
                </motion.button>

                {/* Card B: Propriété Intégrale 100 % à vous */}
                <motion.button
                  type="button"
                  onClick={() => setActiveIdx(3)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    rotate: isOwnership ? 0 : 5,
                    x: isOwnership ? -24 : 0,
                    y: isOwnership ? 10 : 0,
                    scale: isOwnership ? 1.05 : 0.97,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute top-12 sm:top-14 right-0 sm:right-2 w-[210px] sm:w-[285px] rounded-[18px] bg-white border p-5 sm:p-6 text-left cursor-pointer",
                    isOwnership
                      ? "z-40 border-[#ED5B04]/50 shadow-[0_24px_52px_rgba(12,10,8,0.14)]"
                      : "z-20 border-[#E7E3DC] shadow-[0_18px_36px_rgba(12,10,8,0.08)]"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ED5B04]">
                    PROPRIÉTÉ INTÉGRALE
                  </div>
                  <div className="mt-3 font-[family-name:var(--font-jakarta)] text-[24px] sm:text-[30px] font-extrabold leading-[1.1] text-[#0C0A08] tabular-nums">
                    100 % à vous
                  </div>
                  <div className="mt-3 text-[11px] sm:text-[12px] font-medium text-[#57534E] leading-snug">
                    Domaine &amp; code à votre nom
                  </div>
                </motion.button>

                {/* Card C: Modèle Boubane 0 € */}
                <motion.button
                  type="button"
                  onClick={() => setActiveIdx(activeIdx === 1 ? 2 : 1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    rotate: isOrange ? 0 : -2,
                    x: 0,
                    y: isOrange ? -10 : 0,
                    scale: isOrange ? 1.05 : 0.96,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute bottom-1 left-6 sm:left-14 w-[235px] sm:w-[304px] rounded-[20px] bg-[#ED5B04] p-5 sm:p-6 text-left cursor-pointer",
                    isOrange
                      ? "z-40 shadow-[0_26px_54px_rgba(237,91,4,0.34)]"
                      : "z-30 shadow-[0_18px_36px_rgba(237,91,4,0.22)]"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFF2E8]">
                    MODÈLE BOUBANE
                  </div>
                  <div className="mt-2.5 font-[family-name:var(--font-jakarta)] text-[36px] sm:text-[44px] font-extrabold leading-[1.05] text-white tabular-nums">
                    0 €
                  </div>
                  <div className="mt-2.5 text-[11.5px] sm:text-[12.5px] font-medium text-white leading-snug">
                    Design &amp; code offerts · Livré en 5 jours
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Right Compact Interactive Story Panel (Single Stage, Zero Scroll Bloat) */}
          <div className="lg:col-span-6">
            {/* Segmented Tab Bar with Animated Pill + Prev/Next */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#0C0A08]/[0.08]">
              <div
                role="tablist"
                aria-label="Choisir une étape"
                className="inline-flex flex-wrap p-1 rounded-full bg-white border border-[#E7E3DC]"
              >
                {CHAPTERS.map((chap, idx) => {
                  const selected = activeIdx === idx;
                  return (
                    <button
                      key={chap.id}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "relative px-3.5 py-2 rounded-full text-[11px] font-semibold tracking-[0.02em] transition-colors cursor-pointer",
                        selected ? "text-white" : "text-[#57534E] hover:text-[#0C0A08]"
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="compactStoryTabPill"
                          transition={ATELIER_SNAPPY_SPRING}
                          className="absolute inset-0 rounded-full bg-[#ED5B04]"
                        />
                      )}
                      <span className="relative z-10">{chap.pill}</span>
                    </button>
                  );
                })}
              </div>

              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepBy(-1)}
                  aria-label="Étape précédente"
                  className="w-9 h-9 rounded-full bg-white border border-[#E7E3DC] flex items-center justify-center text-[#0C0A08] hover:border-[#ED5B04] hover:text-[#ED5B04] active:scale-[0.95] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepBy(1)}
                  aria-label="Étape suivante"
                  className="w-9 h-9 rounded-full bg-white border border-[#E7E3DC] flex items-center justify-center text-[#0C0A08] hover:border-[#ED5B04] hover:text-[#ED5B04] active:scale-[0.95] transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Story Content with Smooth Swaps */}
            <div className="pt-7 min-h-[250px] flex flex-col justify-between">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: ATELIER_EASE }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
                    {current.eyebrow}
                  </p>

                  <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.4vw,2.55rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
                    {current.title}
                  </h2>

                  <p className="mt-3.5 text-[0.98rem] sm:text-[1.04rem] leading-[1.66] text-[#57534E] max-w-[46ch]">
                    {current.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 pt-5 border-t border-[#0C0A08]/[0.07] flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C0A08]">
                  <span className="w-2 h-2 rounded-full bg-[#ED5B04]" aria-hidden="true" />
                  <span>{current.highlight}</span>
                </span>

                <Link
                  href="/commander"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all"
                >
                  <span>Lancer mon site à 0 €</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
