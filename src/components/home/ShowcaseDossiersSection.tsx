"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import { AtelierReveal, EyebrowBadge } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SPRING, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

interface Dossier {
  id: string;
  tag: string;
  client: string;
  url: string;
  iframeSrc: string;
  accentColor: string;
  metricValue: string;
  metricLabel: string;
  problem: string;
  architecture: string;
  impact: string;
}

const DOSSIERS: Dossier[] = [
  {
    id: "astra",
    tag: "EXEMPLE 01 · TOURISME",
    client: "Astravacances",
    url: "astravacances.fr",
    iframeSrc: "/showcase-astra.html",
    accentColor: "rgba(43, 155, 189, 0.16)",
    metricValue: "0 %",
    metricLabel: "de commission prise par Booking ou Airbnb",
    problem:
      "Les plateformes prenaient jusqu'à 18 % sur chaque séjour et noyaient l'établissement au milieu de dizaines d'autres annonces.",
    architecture:
      "Un site sur mesure rapide (< 0,3s) pensé pour rassurer le voyageur dès la première seconde et l'amener à réserver directement.",
    impact:
      "Toutes les réservations passent désormais en direct, sans marge cédée à un intermédiaire.",
  },
  {
    id: "artisanat",
    tag: "EXEMPLE 02 · ARTISANAT & BTP",
    client: "Artisans du Haut-Anjou",
    url: "artisan-haut-anjou.fr",
    iframeSrc: "/showcase-votre-site.html",
    accentColor: "rgba(237, 91, 4, 0.16)",
    metricValue: "< 0,3s",
    metricLabel: "pour ouvrir la page sur téléphone",
    problem:
      "Trop d'artisans dépendent d'une vieille page Facebook qui ne reflète pas le soin apporté à leurs chantiers.",
    architecture:
      "Une vitrine claire qui montre de vraies photos de réalisations et permet au particulier de demander un devis en deux clics.",
    impact:
      "Des demandes plus sérieuses de la part de clients locaux qui choisissent la qualité plutôt que le devis le moins cher.",
  },
];

export function ShowcaseDossiersSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const current = DOSSIERS[activeIdx];

  return (
    <section
      id="realisations"
      className="relative py-28 md:py-36 bg-[#0B0A09] text-[#FAF8F5] overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        animate={{ background: `radial-gradient(ellipse at center, ${current.accentColor} 0%, transparent 68%)` }}
        transition={{ duration: 0.6, ease: ATELIER_EASE }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <AtelierReveal className="max-w-2xl">
            <EyebrowBadge dark index="03">
              Exemples réels
            </EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold tracking-[-0.045em] leading-[1.03] text-white">
              Ce que ça donne{" "}
              <span className="text-white/40 font-normal">en ligne.</span>
            </h2>
          </AtelierReveal>

          <AtelierReveal delay={0.06} className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Choisir un exemple"
              className="inline-flex p-1.5 rounded-full bg-white/[0.06] border border-white/[0.1]"
            >
              {DOSSIERS.map((d, i) => {
                const isSelected = activeIdx === i;
                return (
                  <button
                    key={d.id}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setActiveIdx(i)}
                    className={`relative px-5 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer active:scale-[0.97] ${
                      isSelected ? "text-[#0C0A08]" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="darkDossierTab"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#FAF8F5]"
                      />
                    )}
                    <span className="relative z-10">{d.client}</span>
                  </button>
                );
              })}
            </div>
          </AtelierReveal>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
            transition={{ duration: 0.28, ease: ATELIER_EASE }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            <div className="lg:col-span-7 flex flex-col">
              <div className="rounded-[24px] bg-[#141311] border border-white/[0.1] p-3 sm:p-4 shadow-[0_36px_90px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 px-2 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>

                  <span className="font-mono text-[11px] text-white/65 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.08]">
                    {current.url}
                  </span>

                  <div className="inline-flex items-center p-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    <button
                      type="button"
                      aria-label="Vue ordinateur"
                      onClick={() => setViewport("desktop")}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer active:scale-[0.95] ${
                        viewport === "desktop"
                          ? "bg-white text-[#0C0A08]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Vue smartphone"
                      onClick={() => setViewport("mobile")}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer active:scale-[0.95] ${
                        viewport === "mobile"
                          ? "bg-white text-[#0C0A08]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-[380px] sm:min-h-[450px] flex items-center justify-center rounded-[16px] bg-[#0B0A09] overflow-hidden p-2">
                  <motion.div
                    layout
                    transition={ATELIER_SPRING}
                    className={`h-[430px] rounded-[12px] overflow-hidden bg-white shadow-2xl border border-white/10 ${
                      viewport === "mobile" ? "w-[310px]" : "w-full"
                    }`}
                  >
                    <iframe
                      src={current.iframeSrc}
                      title={`Aperçu ${current.client}`}
                      loading="lazy"
                      className={`border-none origin-top-left ${
                        viewport === "mobile"
                          ? "w-full h-full"
                          : "w-[155%] h-[155%] scale-[0.645]"
                      }`}
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between py-2">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
                  {current.tag}
                </div>

                <div className="mt-6 pb-8 border-b border-white/[0.1] flex items-baseline gap-4">
                  <span className="text-[clamp(3rem,5vw,4.2rem)] font-bold leading-none tracking-[-0.045em] text-white tabular-nums">
                    {current.metricValue}
                  </span>
                  <span className="text-sm text-white/60 leading-snug">{current.metricLabel}</span>
                </div>

                <div className="mt-7 space-y-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1.5">
                      Avant
                    </div>
                    <p className="text-[0.94rem] leading-[1.65] text-white/65">{current.problem}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1.5">
                      Ce que j&apos;ai fait
                    </div>
                    <p className="text-[0.94rem] leading-[1.65] text-white/90">
                      {current.architecture}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ED5B04] mb-1.5">
                      Résultat
                    </div>
                    <p className="text-[0.94rem] leading-[1.65] text-white/65">{current.impact}</p>
                  </div>
                </div>
              </div>

              <div className="mt-9 pt-6 border-t border-white/[0.1]">
                <a
                  href={current.iframeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#FAF8F5] text-[#0C0A08] px-6 py-3 text-sm font-semibold hover:bg-white active:scale-[0.97] transition-all"
                >
                  <span>Ouvrir ce site en grand</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
