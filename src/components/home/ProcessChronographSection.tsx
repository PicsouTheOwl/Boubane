"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

const PHASES = [
  {
    index: "01",
    day: "JOUR 1",
    title: "Brief Express 10 min",
    desc: "Vous remplissez l'essentiel ou nous échangeons 10 minutes par téléphone. Aucun cahier des charges indigeste.",
    deliverable: "Arborescence & positionnement validés",
    telemetry: "0 € d'acompte · 10 min chrono",
    visualLines: [
      "ANALYSE MÉTIER & ZONE GÉOGRAPHIQUE",
      "EXTRACTION DES PREUVES DE CHANTIER",
      "ARCHITECTURE DE CONVERSION DIRECTE",
    ],
  },
  {
    index: "02",
    day: "JOURS 2–4",
    dayShort: "JOURS 2–4",
    title: "L'Orfèvrerie du Studio",
    desc: "Design sur-mesure, rédaction stratégique et code pur sans template ni CMS lourd. Maquette privée livrée pour lecture.",
    deliverable: "Prototype fonctionnel sur URL privée",
    telemetry: "Code pur · Temps réponse < 0.3s",
    visualLines: [
      "TYPOGRAPHIE OPTIQUE & HIÉRARCHIE",
      "DÉVELOPPEMENT SUR-MESURE ZERO BLOAT",
      "OPTIMISATION MOBILE & SEO LOCAL",
    ],
  },
  {
    index: "03",
    day: "JOUR 5",
    title: "Validation ou 0 € Engagé",
    desc: "Nous ajustons chaque détail ensemble. Si vous êtes convaincu, mise en ligne directe à votre nom. Sinon, vous ne réglez rien.",
    deliverable: "Mise en ligne & transfert GitHub",
    telemetry: "100% Propriétaire · Liberté totale",
    visualLines: [
      "REVUE DETAIL PAR DETAIL AVEC LÉO",
      "TRANSFERT DÉPÔT GITHUB & DOMAINE",
      "DÉPLOIEMENT PRODUCTION SSL",
    ],
  },
];

export function ProcessChronographSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 50%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  const current = PHASES[activeIdx];

  return (
    <section
      id="processus"
      ref={containerRef}
      className="relative py-28 md:py-36 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.06]"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <AtelierReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <EyebrowBadge index="04">Chronographe · 5 Jours</EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
              Cinq jours{" "}
              <span className="text-[#0C0A08]/40 font-normal">de l&apos;esquisse à la mise en ligne.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3">
            <p className="text-[0.98rem] leading-[1.6] text-[#57534E]">
              Un protocole calibré au jour près. Pas de réunions interminables : chaque étape produit
              un livrable tangible.
            </p>
            {/* Fil de progression lié au scroll */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                PROGRESSION
              </span>
              <div className="flex-1 h-[2px] bg-[#0C0A08]/[0.08] overflow-hidden rounded-full">
                <motion.div
                  style={{ scaleX: smoothProgress, transformOrigin: "left center" }}
                  className="h-full w-full bg-[#ED5B04]"
                />
              </div>
            </div>
          </div>
        </AtelierReveal>

        {/* Chronographe Interactif Asymétrique (Zero 3-Box Clutter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Colonne Gauche : Séquences à filets fins */}
          <AtelierReveal delay={0.06} className="lg:col-span-6 flex flex-col justify-center">
            <div className="divide-y divide-[#0C0A08]/[0.08] border-y border-[#0C0A08]/[0.08]">
              {PHASES.map((phase, idx) => {
                const isSelected = activeIdx === idx;
                return (
                  <button
                    key={phase.index}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className="relative w-full text-left py-7 pl-6 pr-4 flex items-start gap-6 cursor-pointer group transition-colors"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="chronographActiveRail"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-[#ED5B04]"
                      />
                    )}

                    <span
                      className={`font-mono text-2xl sm:text-3xl font-light tracking-[-0.04em] tabular-nums transition-colors ${
                        isSelected ? "text-[#ED5B04]" : "text-[#0C0A08]/25 group-hover:text-[#0C0A08]/50"
                      }`}
                    >
                      {phase.index}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ED5B04]">
                          {phase.day}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-[#0C0A08]">
                        {phase.title}
                      </h3>
                      <p className="mt-2 text-[0.93rem] leading-[1.6] text-[#57534E]">
                        {phase.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </AtelierReveal>

          {/* Colonne Droite : Planche Technique / Blueprint Live */}
          <AtelierReveal delay={0.14} className="lg:col-span-6 flex">
            <SpecularPlate dark crosshairs className="w-full p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.index}
                  initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
                  transition={{ duration: 0.24, ease: ATELIER_EASE }}
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
                        PHASE {current.index} · {current.day}
                      </span>
                      <span className="font-mono text-[11px] text-white/45">
                        {current.telemetry}
                      </span>
                    </div>

                    <div className="mt-8">
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">
                        LIVRABLE DIRECT
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                        {current.deliverable}
                      </div>
                    </div>

                    {/* Schéma Opérationnel de la Phase */}
                    <div className="mt-8 space-y-3">
                      {current.visualLines.map((line, lineIdx) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: lineIdx * 0.07,
                            ease: ATELIER_EASE,
                          }}
                          className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5"
                        >
                          <span className="font-mono text-xs tracking-[0.06em] text-white/85">
                            {line}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#ED5B04] shadow-[0_0_8px_rgba(237,91,4,0.7)] shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-9 pt-5 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-white/40">
                    <span>ATELIER BOUBANE · PROTOCOLE CALIBRÉ</span>
                    <span>J+{current.index === "01" ? "1" : current.index === "02" ? "4" : "5"}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
