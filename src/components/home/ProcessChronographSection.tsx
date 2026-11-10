"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";

const PHASES = [
  {
    day: "JOUR 1",
    index: "01",
    title: "Brief Express 10 min",
    desc: "Vous remplissez l'essentiel ou nous échangeons 10 minutes par téléphone. Aucun cahier des charges indigeste.",
  },
  {
    day: "JOURS 2–4",
    index: "02",
    title: "L'Orfèvrerie du Studio",
    desc: "Design sur-mesure, rédaction stratégique et développement pur sans template ni CMS lourd. Maquette privée livrée pour lecture.",
  },
  {
    day: "JOUR 5",
    index: "03",
    title: "Validation ou 0 € Engagé",
    desc: "Nous ajustons chaque détail ensemble. Si vous êtes convaincu, mise en ligne directe à votre nom. Sinon, vous ne réglez rien.",
  },
];

export function ProcessChronographSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 55%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <section
      id="processus"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.06]"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <AtelierReveal className="max-w-3xl mb-14 md:mb-16">
          <EyebrowBadge index="04">Chronographe · 5 Jours</EyebrowBadge>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
            Cinq jours de l&apos;esquisse à la mise en ligne
            <span className="text-[#ED5B04]">.</span>
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.25vw,1.16rem)] leading-[1.6] text-[#57534E] max-w-[54ch]">
            Un protocole chronométré, sans réunion inutile ni tunnel interminable. Vous savez
            toujours exactement où se trouve votre vitrine.
          </p>
        </AtelierReveal>

        {/* Fil Conducteur Horizontal Cinétique lié au Scroll */}
        <div className="hidden lg:block relative mb-8 h-3">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#0C0A08]/[0.08]" />
          <motion.div
            style={{ scaleX: smoothProgress, transformOrigin: "left center" }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#ED5B04]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PHASES.map((phase, idx) => (
            <AtelierReveal key={phase.index} delay={idx * 0.08} className="flex">
              <SpecularPlate className="w-full p-7 md:p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between gap-3 pb-5 border-b border-[#0C0A08]/[0.07]">
                    <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#ED5B04]">
                      {phase.day}
                    </span>
                    <span className="font-mono text-xs text-[#0C0A08]/35 tabular-nums">
                      ÉTAPE {phase.index}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-[#0C0A08]">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-[0.94rem] leading-[1.65] text-[#57534E]">
                    {phase.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0C0A08]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED5B04]/60" />
                  <span>LIGNE DIRECTE ATELIER</span>
                </div>
              </SpecularPlate>
            </AtelierReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
