"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ATELIER_EASE, ATELIER_SPRING, cn } from "@/lib/utils";

interface StoryBeat {
  id: string;
  pill: string;
  eyebrow: string;
  title: string;
  body: string;
  metric: string;
  focusCard: "agency" | "orange" | "code" | "all";
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: "beat-constat",
    pill: "LE DÉCLIC",
    eyebrow: "LE POINT DE DÉPART À SEGRÉ",
    title: "Une vitrine d'agence coûte souvent 4 500 €.",
    body: "Sur le terrain en Anjou, trop d'artisans et de gérants signent des factures lourdes ou un leasing sur quatre ans pour un site lent qu'ils ne possèdent même pas.",
    metric: "4 500 € en moyenne ailleurs",
    focusCard: "agency",
  },
  {
    id: "beat-declic",
    pill: "ÉCLATÉ 0 €",
    eyebrow: "L'ARCHITECTURE MISE À NU",
    title: "Enlever les intermédiaires ramène la création à 0 €.",
    body: "Pas de locaux parisiens, pas de commerciaux ni de réunions sans fin. Je dessine et j'écris chaque couche moi-même : structure Google, vraies photos et code rapide.",
    metric: "0 € d'honoraires de création",
    focusCard: "orange",
  },
  {
    id: "beat-rapidite",
    pill: "EN LIGNE 5J",
    eyebrow: "ASSEMBLÉ POUR VOTRE TÉLÉPHONE",
    title: "Votre métier, crédible en moins de 0,3 seconde.",
    body: "Vos vraies photos de chantier ou d'atelier, des mots justes et votre numéro cliquable dès la première seconde sur mobile.",
    metric: "Livré sous 5 jours ouvrés",
    focusCard: "code",
  },
  {
    id: "beat-liberte",
    pill: "À VOTRE NOM",
    eyebrow: "PROPRIÉTÉ INTÉGRALE",
    title: "Domaine et code source restent 100 % entre vos mains.",
    body: "Vous ne réglez que votre nom de domaine (~10 €/an) et votre hébergement (~5 €/mois) directement chez votre prestataire. Zéro engagement, jamais.",
    metric: "Liberté totale dès le premier jour",
    focusCard: "all",
  },
];

export function ScrollStory3DStage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Highlight active beat cleanly as user scrolls on desktop
  useEffect(() => {
    const onScroll = () => {
      const targetY = window.innerHeight * 0.42;
      let bestIdx = 0;
      let bestDist = Infinity;
      beatRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      setActiveIdx(bestIdx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectBeat = (idx: number, scrollIntoView = false) => {
    setActiveIdx(idx);
    if (scrollIntoView) {
      beatRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTilt({ rx: -ny * 7, ry: nx * 9 });
  };

  const currentFocus = STORY_BEATS[activeIdx].focusCard;

  return (
    <section id="modele" className="relative bg-[#FAF8F5] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Column: Penpot 3-Card Sculpted Fan Stack */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col items-center">
            <div
              onPointerMove={handleMouseMove}
              onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
              style={{ perspective: 1200 }}
              className="relative w-full max-w-[540px] h-[350px] sm:h-[440px] select-none flex items-center justify-center"
            >
              <motion.div
                animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-[320px] h-[340px] sm:w-[490px] sm:h-[420px] origin-center"
              >
                {/* Card 1 (Back-Left): Dark Slate — Agence Classique 4 500 € */}
                <motion.button
                  type="button"
                  onClick={() => selectBeat(0, true)}
                  animate={{
                    rotate: currentFocus === "orange" ? -10 : -7,
                    x: currentFocus === "orange" ? -14 : 0,
                    y: currentFocus === "agency" ? -6 : 0,
                    scale: currentFocus === "agency" ? 1.03 : 0.98,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute top-2 left-0 sm:left-3 w-[210px] sm:w-[290px] rounded-[18px] bg-[#F3EFE7] border border-[#E5DEC9] p-5 sm:p-6 text-left cursor-pointer",
                    "shadow-[0_24px_52px_rgba(12,10,8,0.1)]",
                    currentFocus === "agency" ? "z-30" : "z-10"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78716C]">
                    AGENCE CLASSIQUE
                  </div>
                  <div className="mt-4 sm:mt-5 font-[family-name:var(--font-jakarta)] text-[26px] sm:text-[34px] font-extrabold leading-[1.1] text-[#A8A29E] line-through tabular-nums">
                    4 500 €
                  </div>
                  <div className="mt-4 sm:mt-5 text-[11px] sm:text-[12px] text-[#78716C] leading-snug">
                    6 à 12 semaines · Leasing 4 ans
                  </div>
                </motion.button>

                {/* Card 2 (Right-Mid): White Ceramic — Propriété Intégrale < 0,3 s */}
                <motion.button
                  type="button"
                  onClick={() => selectBeat(2, true)}
                  animate={{
                    rotate: currentFocus === "orange" ? 7 : 4,
                    x: currentFocus === "orange" ? 14 : 0,
                    y: currentFocus === "code" ? -8 : 0,
                    scale: currentFocus === "code" ? 1.04 : 1,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute top-16 sm:top-20 right-0 sm:right-2 w-[215px] sm:w-[295px] rounded-[18px] bg-white border border-[#E7E3DC] p-5 sm:p-6 text-left cursor-pointer",
                    "shadow-[0_24px_52px_rgba(12,10,8,0.1)]",
                    currentFocus === "code" ? "z-30" : "z-20"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ED5B04]">
                    PROPRIÉTÉ INTÉGRALE
                  </div>
                  <div className="mt-3 sm:mt-4 font-[family-name:var(--font-jakarta)] text-[26px] sm:text-[34px] font-extrabold leading-[1.1] text-[#0C0A08] tabular-nums">
                    &lt; 0,3 s
                  </div>
                  <div className="mt-4 sm:mt-5 text-[11px] sm:text-[12.5px] font-medium text-[#57534E] leading-snug">
                    Domaine + code privé à votre nom
                  </div>
                </motion.button>

                {/* Card 3 (Foreground Hero): Vibrant Orange — Modèle Boubane 0 € */}
                <motion.button
                  type="button"
                  onClick={() => selectBeat(1, true)}
                  animate={{
                    rotate: currentFocus === "orange" ? 0 : -2,
                    y: currentFocus === "orange" || currentFocus === "all" ? -6 : 0,
                    scale: currentFocus === "orange" || currentFocus === "all" ? 1.03 : 1,
                  }}
                  transition={ATELIER_SPRING}
                  className={cn(
                    "absolute bottom-2 sm:bottom-3 left-6 sm:left-16 w-[240px] sm:w-[316px] rounded-[20px] bg-[#ED5B04] p-5 sm:p-7 text-left cursor-pointer",
                    "shadow-[0_24px_52px_rgba(237,91,4,0.3)]",
                    currentFocus === "orange" || currentFocus === "all" ? "z-40" : "z-20"
                  )}
                >
                  <div className="font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFF2E8]">
                    MODÈLE BOUBANE
                  </div>
                  <div className="mt-3 sm:mt-4 font-[family-name:var(--font-jakarta)] text-[36px] sm:text-[46px] font-extrabold leading-[1.05] text-white tabular-nums">
                    0 €
                  </div>
                  <div className="mt-3 sm:mt-4 text-[11.5px] sm:text-[13px] font-medium text-white leading-snug">
                    Conception &amp; code offerts · Livré en 5 jours
                  </div>
                </motion.button>
              </motion.div>
            </div>

            {/* Pill Switcher Tabs beneath 3-Card Fan (matches Penpot pills) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {STORY_BEATS.map((beat, idx) => {
                const selected = activeIdx === idx;
                return (
                  <button
                    key={beat.id}
                    type="button"
                    onClick={() => selectBeat(idx, true)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em] transition-all cursor-pointer active:scale-[0.97]",
                      selected
                        ? "bg-[#0C0A08] text-white border border-[#0C0A08]"
                        : "bg-[#FAF8F5] text-[#57534E] border border-[#E7E3DC] hover:border-[#0C0A08]/35 hover:text-[#0C0A08]"
                    )}
                  >
                    {beat.pill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Narrative Column */}
          <div className="lg:col-span-6 space-y-14 sm:space-y-16 lg:pt-2">
            {STORY_BEATS.map((beat, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={beat.id}
                  ref={(el) => {
                    beatRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={cn(
                    "transition-opacity duration-300",
                    isActive ? "lg:opacity-100" : "lg:opacity-45 hover:lg:opacity-85"
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, ease: ATELIER_EASE }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
                      {beat.eyebrow}
                    </p>

                    <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,3.3vw,2.55rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
                      {beat.title}
                    </h2>

                    <p className="mt-3.5 text-[0.98rem] sm:text-[1.03rem] leading-[1.65] text-[#57534E] max-w-[46ch]">
                      {beat.body}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C0A08]">
                        <span className="w-2 h-2 rounded-full bg-[#0C0A08]" aria-hidden="true" />
                        <span>{beat.metric}</span>
                      </span>

                      {idx === STORY_BEATS.length - 1 && (
                        <Link
                          href="/commander"
                          className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all"
                        >
                          <span>Lancer mon site à 0 €</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
