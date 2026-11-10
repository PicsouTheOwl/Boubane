"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

const PHASES = [
  {
    index: "01",
    day: "JOUR 1",
    title: "On fait le point en 10 min",
    desc: "Vous me donnez l'essentiel sur votre activité par écrit ou au téléphone. Pas besoin de préparer un dossier de trente pages.",
    deliverable: "Structure du site posée",
    telemetry: "10 min · 0 € d'acompte",
    visualLines: [
      "Votre métier et votre zone géographique",
      "Les photos et chantiers à mettre en avant",
      "La façon dont vos clients vous contactent",
    ],
  },
  {
    index: "02",
    day: "JOURS 2–4",
    title: "Je construis votre site",
    desc: "Design, rédaction et code propre sans thème préfabriqué. Vous recevez un lien privé pour regarder le résultat sur votre téléphone.",
    deliverable: "Première version en ligne sur lien privé",
    telemetry: "Code léger · Ouverture < 0,3s",
    visualLines: [
      "Mise en page sur mesure et textes clairs",
      "Optimisation pour Google sur votre secteur",
      "Affichage rapide sur smartphone",
    ],
  },
  {
    index: "03",
    day: "JOUR 5",
    title: "On valide ou on arrête là",
    desc: "On ajuste ensemble ce qui doit l'être. Si le résultat vous plaît, je le publie sur votre nom de domaine. Sinon, vous ne me devez rien.",
    deliverable: "Mise en ligne à votre nom",
    telemetry: "100 % à vous · Sans engagement",
    visualLines: [
      "Relecture et retouches en direct avec vous",
      "Envoi de tout le code sur votre GitHub",
      "Publication en ligne avec cadenas HTTPS",
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
            <EyebrowBadge index="04">En 5 jours</EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
              De notre premier échange{" "}
              <span className="text-[#0C0A08]/40 font-normal">à la mise en ligne.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3">
            <p className="text-[0.98rem] leading-[1.6] text-[#57534E]">
              Pas de tunnel interminable ni de réunions qui s&apos;étirent sur trois mois : en cinq
              jours ouvrés, votre site est prêt.
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                AVANCEMENT
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
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
                        isSelected
                          ? "text-[#ED5B04]"
                          : "text-[#0C0A08]/25 group-hover:text-[#0C0A08]/50"
                      }`}
                    >
                      {phase.index}
                    </span>

                    <div className="flex-1">
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ED5B04]">
                        {phase.day}
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

          <AtelierReveal delay={0.14} className="lg:col-span-6 flex">
            <SpecularPlate
              dark
              crosshairs
              className="w-full p-8 sm:p-10 flex flex-col justify-between overflow-hidden"
            >
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
                        ÉTAPE {current.index} · {current.day}
                      </span>
                      <span className="font-mono text-[11px] text-white/45">{current.telemetry}</span>
                    </div>

                    <div className="mt-8">
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">
                        CE QUE VOUS RECEVEZ
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                        {current.deliverable}
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      {current.visualLines.map((line, lineIdx) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.28,
                            delay: lineIdx * 0.06,
                            ease: ATELIER_EASE,
                          }}
                          className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5"
                        >
                          <span className="text-sm text-white/85">{line}</span>
                          <span className="w-2 h-2 rounded-full bg-[#ED5B04] shadow-[0_0_8px_rgba(237,91,4,0.7)] shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-9 pt-5 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-white/40">
                    <span>SUIVI EN DIRECT AVEC LÉO</span>
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
