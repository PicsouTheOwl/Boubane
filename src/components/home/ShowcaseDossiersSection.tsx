"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

interface Dossier {
  id: string;
  tag: string;
  client: string;
  url: string;
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
    tag: "DOSSIER #01 · TOURISME & RÉSERVATION",
    client: "Astravacances",
    url: "astravacances.fr",
    iframeSrc: "/showcase-astra.html",
    metricValue: "0 %",
    metricLabel: "Commission OTA (Booking / Airbnb)",
    problem:
      "Jusqu'à 18 % de chiffre d'affaires captés à chaque séjour par les plateformes intermédiaires et une image diluée au milieu des concurrents.",
    architecture:
      "Vitrine sur-mesure ultra-rapide (< 0.3s) conçue pour déclencher la réservation directe sans friction, optimisée sur les requêtes géolocalisées.",
    impact:
      "100 % des réservations en direct sans intermédiaire, temps de chargement divisé par 6 et crédibilité immédiate auprès des voyageurs.",
  },
  {
    id: "artisanat",
    tag: "DOSSIER #02 · ARTISANAT & BTP",
    client: "Artisans du Haut-Anjou",
    url: "artisan-haut-anjou.fr",
    iframeSrc: "/showcase-votre-site.html",
    metricValue: "< 0.3s",
    metricLabel: "Affichage instantané sur mobile",
    problem:
      "Dépendance totale aux réseaux sociaux ou au bouche-à-oreille, aucune vitrine à la hauteur de la qualité réelle du travail sur chantier.",
    architecture:
      "Écrin digital haute précision mettant en valeur le savoir-faire artisanal, galerie de chantiers épurée et demande de devis qualifiée en 2 clics.",
    impact:
      "Fin de la guerre des prix : des demandes de devis qualifiées directement dans la boîte mail et une image d'artisan d'élite sur tout le 49/53.",
  },
];

export function ShowcaseDossiersSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = DOSSIERS[activeIdx];

  return (
    <section id="realisations" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-14">
          <AtelierReveal className="max-w-2xl">
            <EyebrowBadge index="03">Dossiers d&apos;Architecture</EyebrowBadge>
            <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Réalisations d&apos;élite &amp; impact mesurable
              <span className="text-[#ED5B04]">.</span>
            </h2>
          </AtelierReveal>

          {/* Segmented Tab Switcher à ressort physique (layoutId) */}
          <AtelierReveal delay={0.08}>
            <div
              role="tablist"
              aria-label="Sélection du dossier"
              className="inline-flex p-1.5 rounded-full bg-[#F1EDE4] border border-[#0C0A08]/[0.08] shadow-[inset_0_1px_2px_rgba(12,10,8,0.04)]"
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
                    className={`relative px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer active:scale-[0.97] ${
                      isSelected ? "text-[#FAF8F5]" : "text-[#0C0A08]/65 hover:text-[#0C0A08]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="dossierTabIndicator"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#0C0A08] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{d.client}</span>
                  </button>
                );
              })}
            </div>
          </AtelierReveal>
        </div>

        {/* Écrin Horizontal Interactif avec Crossfade Optique */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
            transition={{ duration: 0.28, ease: ATELIER_EASE }}
          >
            <SpecularPlate
              tilt={false}
              className="p-4 sm:p-6 md:p-8 bg-white border border-[#0C0A08]/[0.08]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Gauche : Châssis Matériel Interactif */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="group relative flex-1 min-h-[360px] sm:min-h-[430px] rounded-[18px] overflow-hidden border border-[#0C0A08]/[0.09] bg-[#FAF8F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_-12px_rgba(12,10,8,0.12)] flex flex-col">
                    {/* Barre Matérielle */}
                    <div className="h-9 px-3.5 bg-[#F6F4EF] border-b border-[#0C0A08]/[0.07] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
                      </div>
                      <span className="font-mono text-[11px] text-[#0C0A08]/60 bg-white/80 px-3 py-0.5 rounded-full border border-[#0C0A08]/[0.06]">
                        {current.url}
                      </span>
                      <a
                        href={current.iframeSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#0C0A08]/70 hover:text-[#ED5B04] transition-colors"
                      >
                        <span>Inspecter</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Viewport Iframe avec léger zoom optique au survol */}
                    <div className="relative flex-1 overflow-hidden bg-white">
                      <iframe
                        src={current.iframeSrc}
                        title={`Aperçu ${current.client}`}
                        loading="lazy"
                        className="w-[155%] h-[155%] origin-top-left scale-[0.645] border-none transition-transform duration-700 ease-out group-hover:scale-[0.665]"
                      />
                    </div>
                  </div>
                </div>

                {/* Droite : Fiche Technique 3 Blocs */}
                <div className="lg:col-span-5 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#0C0A08]/[0.07]">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                        {current.tag}
                      </span>
                      <Layers className="w-4 h-4 text-[#0C0A08]/35" strokeWidth={1.6} />
                    </div>

                    {/* Indicateur Cinétique Clé */}
                    <div className="mt-6 mb-7 flex items-baseline gap-4">
                      <span className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[#0C0A08] tabular-nums">
                        {current.metricValue}
                      </span>
                      <span className="text-sm font-medium text-[#57534E]">
                        {current.metricLabel}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45 mb-1">
                          01 · Problème initial
                        </div>
                        <p className="text-[0.9rem] leading-[1.6] text-[#57534E]">
                          {current.problem}
                        </p>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45 mb-1">
                          02 · Architecture Boubane
                        </div>
                        <p className="text-[0.9rem] leading-[1.6] text-[#0C0A08]">
                          {current.architecture}
                        </p>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ED5B04] mb-1">
                          03 · Impact direct
                        </div>
                        <p className="text-[0.9rem] leading-[1.6] text-[#57534E]">
                          {current.impact}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#0C0A08]/[0.07] flex items-center justify-between gap-4">
                    <a
                      href={current.iframeSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
                    >
                      <span>Ouvrir la vitrine en direct</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </SpecularPlate>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
