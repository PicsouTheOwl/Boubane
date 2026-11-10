"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { FolderSheet, HandwrittenNote } from "@/components/DraftingPrimitives";
import { ATELIER_EASE, cn } from "@/lib/utils";

interface Dossier {
  id: string;
  tag: string;
  client: string;
  url: string;
  liveUrl?: string;
  iframeSrc: string;
  metricValue: string;
  metricLabel: string;
  problem: string;
  architecture: string;
  impact: string;
}

const DOSSIERS: Dossier[] = [
  {
    id: "astra",
    tag: "PLANCHE A · TOURISME",
    client: "Astravacances",
    url: "astravacances.fr",
    liveUrl: "https://www.astravacances.fr/",
    iframeSrc: "/showcase-astra.html",
    metricValue: "0 %",
    metricLabel: "de commission prise par Booking ou Airbnb",
    problem:
      "Les plateformes prenaient jusqu'à 18 % sur chaque séjour et noyaient l'établissement au milieu de dizaines d'autres annonces.",
    architecture:
      "Un site sur mesure rapide (< 0,3 s) pensé pour rassurer le voyageur dès la première seconde et l'amener à réserver directement.",
    impact:
      "Les voyageurs réservent directement en ligne, sans marge cédée à un intermédiaire.",
  },
  {
    id: "artisanat",
    tag: "PLANCHE B · ARTISANAT & BTP",
    client: "Artisans du Haut-Anjou",
    url: "artisan-haut-anjou.fr",
    iframeSrc: "/showcase-votre-site.html",
    metricValue: "< 0,3 s",
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
      className="relative py-20 sm:py-28 bg-[#12161F] drafting-grid-dark text-[#FAF7F0] border-t border-white/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <AtelierReveal className="max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75 mb-3">
              <span className="px-2 py-0.5 bg-[#ED5B04] text-white font-semibold rounded-[2px]">
                03
              </span>
              <span>Planches tirées sur table lumineuse</span>
            </div>
            <h2 className="text-[clamp(2rem,4.4vw,3.3rem)] font-bold tracking-[-0.045em] leading-[1.04] text-white">
              Ce que ça donne{" "}
              <span className="text-white/45 font-normal">en ligne, pour de vrai.</span>
            </h2>
            <HandwrittenNote className="mt-2 text-[#EEF85A]">
              Pas des captures fixes : touchez la fenêtre ci-dessous pour naviguer dedans.
            </HandwrittenNote>
          </AtelierReveal>

          {/* Controls: Dossier switch + Desktop/Mobile preview toggle */}
          <AtelierReveal delay={0.05} className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Choisir un exemple"
              className="inline-flex p-1 rounded-[4px] bg-white/[0.06] border border-white/15"
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
                    className={cn(
                      "px-3.5 py-2 rounded-[3px] font-mono text-[11px] uppercase tracking-[0.08em] transition-colors cursor-pointer min-h-[40px]",
                      isSelected
                        ? "bg-[#FDFBF5] text-[#0C0A08] font-semibold"
                        : "text-white/65 hover:text-white"
                    )}
                  >
                    {d.client}
                  </button>
                );
              })}
            </div>

            <div className="inline-flex p-1 rounded-[4px] bg-white/[0.06] border border-white/15">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                aria-label="Aperçu ordinateur"
                className={cn(
                  "p-2 rounded-[3px] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center",
                  viewport === "desktop" ? "bg-[#ED5B04] text-white" : "text-white/60 hover:text-white"
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                aria-label="Aperçu téléphone"
                className={cn(
                  "p-2 rounded-[3px] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center",
                  viewport === "mobile" ? "bg-[#ED5B04] text-white" : "text-white/60 hover:text-white"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </AtelierReveal>
        </div>

        {/* Main Drafting Frame + Side Fiche */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* Interactive Browser Blueprint Specimen */}
          <div className="lg:col-span-8 flex justify-center">
            <div
              className={cn(
                "w-full rounded-md border border-white/20 bg-[#0B0D12] shadow-[6px_6px_0_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300",
                viewport === "mobile" ? "max-w-[360px]" : "max-w-full"
              )}
            >
              {/* Crisp Drafting Chrome Bar */}
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/15 bg-[#181D29]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ED5B04]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                </div>

                <div className="font-mono text-[11px] text-white/80 truncate px-3 py-0.5 rounded-[2px] bg-black/35 border border-white/10">
                  https://{current.url}
                </div>

                {current.liveUrl ? (
                  <a
                    href={current.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#EEF85A] hover:text-white shrink-0"
                  >
                    <span>Ouvrir</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="font-mono text-[10px] text-white/40 uppercase">DÉMO</span>
                )}
              </div>

              <div className="relative h-[380px] sm:h-[460px] bg-white">
                <iframe
                  key={current.iframeSrc}
                  src={current.iframeSrc}
                  title={`Aperçu interactif de ${current.client}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Technical Fiche Sheet */}
          <div className="lg:col-span-4 flex">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: ATELIER_EASE }}
                className="w-full flex"
              >
                <FolderSheet
                  tone="cream"
                  tabIndex={activeIdx === 0 ? "01" : "02"}
                  tabLabel={current.client}
                  registrationMarks
                  tiltClassName="w-full"
                  innerClassName="p-6 sm:p-7 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#ED5B04]">
                      {current.tag}
                    </div>

                    <div className="mt-4 pb-5 border-b border-dashed border-[#424242]/30">
                      <div className="font-mono text-[2.4rem] font-bold leading-none tracking-tight text-[#0C0A08] tabular-nums">
                        {current.metricValue}
                      </div>
                      <p className="text-[13px] font-medium text-[#57534E] mt-1.5">
                        {current.metricLabel}
                      </p>
                    </div>

                    <dl className="mt-5 space-y-4 text-[13.5px] leading-[1.6]">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#57534E]">
                          Ce qui bloquait avant
                        </dt>
                        <dd className="text-[#2A2622] mt-1">{current.problem}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#57534E]">
                          Ce qu&apos;on a dessiné
                        </dt>
                        <dd className="text-[#2A2622] mt-1">{current.architecture}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                          Résultat sur le terrain
                        </dt>
                        <dd className="text-[#0C0A08] font-medium mt-1">{current.impact}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed border-[#424242]/30 flex items-center justify-between font-mono text-[11px] text-[#57534E]">
                    <span>Livré sur-mesure</span>
                    <span className="text-[#0C0A08] font-semibold">0 € création</span>
                  </div>
                </FolderSheet>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
