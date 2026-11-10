"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Lock, Server, ShieldCheck } from "lucide-react";
import { AtelierReveal, Crosshair, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

type SpecimenTab = "conception" | "infra" | "propriete";

const TABS: Array<{ id: SpecimenTab; code: string; label: string }> = [
  { id: "conception", code: "01", label: "Conception" },
  { id: "infra", code: "02", label: "Serveur" },
  { id: "propriete", code: "03", label: "Propriété" },
];

export function ManifestoSection() {
  const [activeTab, setActiveTab] = useState<SpecimenTab>("conception");
  const [sealHovered, setSealHovered] = useState(false);

  return (
    <section id="modele" className="relative py-28 md:py-36 border-t border-[#0C0A08]/[0.06]">
      <div className="mx-auto max-w-[1200px] px-6">
        <AtelierReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <EyebrowBadge index="01">Le Manifeste du 0 €</EyebrowBadge>
            <h2 className="mt-6 text-[clamp(2.3rem,5vw,4rem)] font-bold tracking-[-0.045em] leading-[1.02] text-[#0C0A08]">
              La rupture{" "}
              <span className="text-[#0C0A08]/40 font-normal">commerciale.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[1.02rem] leading-[1.65] text-[#57534E]">
              Pourquoi payer 4 500 € pour financer des bureaux et des commerciaux ? Nous supprimons
              tout l&apos;appareil d&apos;agence pour vous livrer une vitrine d&apos;orfèvre
              directement à votre nom.
            </p>
          </div>
        </AtelierReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <AtelierReveal delay={0.04} className="lg:col-span-7">
            <SpecularPlate dark crosshairs className="p-8 sm:p-11">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                  SPÉCIMEN ATELIER · N° 01
                </span>

                <div
                  role="tablist"
                  aria-label="Inspecter le modèle Boubane"
                  className="inline-flex p-1 rounded-full bg-white/[0.05] border border-white/[0.08]"
                >
                  {TABS.map((t) => {
                    const selected = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        role="tab"
                        type="button"
                        aria-selected={selected}
                        onClick={() => setActiveTab(t.id)}
                        className={`relative px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] transition-colors cursor-pointer active:scale-[0.97] ${
                          selected ? "text-[#0C0A08]" : "text-white/55 hover:text-white"
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="manifestoTabPill"
                            transition={ATELIER_SNAPPY_SPRING}
                            className="absolute inset-0 rounded-full bg-[#FAF8F5]"
                          />
                        )}
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {activeTab === "conception" && (
                    <motion.div
                      key="conception"
                      initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
                      transition={{ duration: 0.24, ease: ATELIER_EASE }}
                      className="pt-9"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 pb-8 border-b border-white/[0.08]">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">
                            Facture d&apos;agence classique
                          </div>
                          <div className="relative inline-block font-mono text-2xl sm:text-3xl text-white/40 tabular-nums">
                            <span>4 500 €</span>
                            <motion.svg
                              viewBox="0 0 120 24"
                              className="pointer-events-none absolute -inset-x-1 top-1/2 -translate-y-1/2 w-[calc(100%+8px)] h-6 overflow-visible"
                              aria-hidden="true"
                            >
                              <motion.path
                                d="M 2 18 C 35 12, 78 9, 118 5"
                                fill="none"
                                stroke="#ED5B04"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.65, delay: 0.08, ease: ATELIER_EASE }}
                              />
                            </motion.svg>
                          </div>
                        </div>

                        <ArrowRight className="hidden sm:block w-5 h-5 text-white/25 mb-3" />

                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ED5B04] mb-1">
                            Honoraires Atelier Boubane
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-[clamp(4rem,7vw,5.8rem)] font-bold leading-[0.9] tracking-[-0.055em] text-[#FAF8F5] tabular-nums">
                              0 €
                            </span>
                            <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/45">
                              net HT
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Anatomie des 4 500 € supprimés */}
                      <div className="mt-6 grid grid-cols-3 gap-2.5 text-left">
                        {[
                          { label: "Commerciaux", cost: "1 800 €" },
                          { label: "Chefs de projet", cost: "1 200 €" },
                          { label: "Frais de structure", cost: "1 500 €" },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5"
                          >
                            <div className="font-mono text-[10px] text-white/40 truncate">
                              {row.label}
                            </div>
                            <div className="font-mono text-xs text-white/60 line-through mt-0.5 tabular-nums">
                              {row.cost}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 space-y-2.5">
                        <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                          100 % du design et du code offerts à nos frais.
                        </h3>
                        <p className="text-[0.94rem] leading-[1.65] text-white/65 max-w-[52ch]">
                          Vous travaillez en circuit court avec le concepteur. Aucun acompte, aucune
                          facture surprise.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "infra" && (
                    <motion.div
                      key="infra"
                      initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
                      transition={{ duration: 0.24, ease: ATELIER_EASE }}
                      className="pt-9"
                    >
                      <div className="rounded-2xl bg-white/[0.035] border border-white/[0.08] p-6 mb-7">
                        <div className="flex items-center justify-between gap-3 font-mono text-xs">
                          <div className="px-3.5 py-2 rounded-lg bg-white text-[#0C0A08] font-bold">
                            VOTRE ENTREPRISE
                          </div>
                          <div className="flex-1 relative h-8 flex items-center">
                            <svg
                              viewBox="0 0 160 28"
                              className="w-full h-7 overflow-visible"
                              aria-hidden="true"
                            >
                              <line
                                x1="0"
                                y1="14"
                                x2="160"
                                y2="14"
                                stroke="rgba(255,255,255,0.14)"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                              />
                              <motion.line
                                x1="0"
                                y1="14"
                                x2="160"
                                y2="14"
                                stroke="#ED5B04"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.65, ease: ATELIER_EASE }}
                              />
                              <motion.circle
                                r="3.5"
                                cy="14"
                                fill="#ED5B04"
                                animate={{ cx: [6, 154] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </svg>
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ED5B04] bg-[#161513] px-2">
                              ~5 € / mois direct
                            </span>
                          </div>
                          <div className="px-3.5 py-2 rounded-lg bg-[#ED5B04] text-white font-bold">
                            OVH / VERCEL
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                          Hébergement au coût réel, sans intermédiaire.
                        </h3>
                        <p className="text-[0.95rem] leading-[1.65] text-white/65 max-w-[52ch]">
                          Votre nom de domaine et votre serveur sont ouverts directement à votre nom.
                          Fini les rentes mensuelles de 150 €/mois pour un simple hébergement
                          mutualisé.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "propriete" && (
                    <motion.div
                      key="propriete"
                      initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
                      transition={{ duration: 0.24, ease: ATELIER_EASE }}
                      className="pt-9"
                    >
                      <div
                        className="flex flex-col sm:flex-row items-center gap-7 pb-8 border-b border-white/[0.08]"
                        onMouseEnter={() => setSealHovered(true)}
                        onMouseLeave={() => setSealHovered(false)}
                      >
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <motion.svg
                            viewBox="0 0 100 100"
                            className="w-full h-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: sealHovered ? 6 : 22,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            aria-hidden="true"
                          >
                            <defs>
                              <path
                                id="sealCircleDark"
                                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                              />
                            </defs>
                            <circle
                              cx="50"
                              cy="50"
                              r="46"
                              fill="none"
                              stroke="rgba(255,255,255,0.16)"
                              strokeWidth="1"
                              strokeDasharray="2 3"
                            />
                            <text
                              fill="#FAF8F5"
                              fontSize="7.4"
                              fontFamily="monospace"
                              fontWeight="700"
                              letterSpacing="2.1"
                            >
                              <textPath href="#sealCircleDark">
                                100% PROPRIÉTAIRE • CODE &amp; DOMAINE •
                              </textPath>
                            </text>
                          </motion.svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#ED5B04]">
                              <Lock className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                            PATRIMOINE NUMÉRIQUE
                          </div>
                          <div className="mt-1 text-2xl font-bold text-white tracking-[-0.025em]">
                            Dépôt GitHub privé &amp; code pur
                          </div>
                        </div>
                      </div>

                      <div className="pt-7">
                        <p className="text-[0.95rem] leading-[1.65] text-white/65 max-w-[52ch]">
                          Le code source complet vous appartient juridiquement dès la mise en ligne.
                          Vous restez libre à vie de faire évoluer ou migrer votre vitrine.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-9 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.1em] text-white/50">
                <span>AUCUN ACOMPTE · ZÉRO ENGAGEMENT</span>
                <span className="text-white/80 tabular-nums">LIVRAISON 5 JOURS</span>
              </div>
            </SpecularPlate>
          </AtelierReveal>

          <AtelierReveal delay={0.1} className="lg:col-span-5">
            <div className="divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09]">
              <div className="py-7 flex items-start gap-5 group">
                <span className="font-mono text-xs text-[#ED5B04] font-semibold pt-1">01</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0C0A08]">
                      Zéro frais cachés
                    </h3>
                    <ShieldCheck
                      className="w-4 h-4 text-[#0C0A08]/35 group-hover:text-[#ED5B04] transition-colors"
                      strokeWidth={1.6}
                    />
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-[1.6] text-[#57534E]">
                    Aucune facture d&apos;honoraires à la commande ni à la livraison. Si la maquette
                    ne vous convainc pas, vous repartez libre sans débourser un centime.
                  </p>
                </div>
              </div>

              <div className="py-7 flex items-start gap-5 group">
                <span className="font-mono text-xs text-[#ED5B04] font-semibold pt-1">02</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0C0A08]">
                      Serveur à votre nom (~5 €/mois)
                    </h3>
                    <Server
                      className="w-4 h-4 text-[#0C0A08]/35 group-hover:text-[#ED5B04] transition-colors"
                      strokeWidth={1.6}
                    />
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-[1.6] text-[#57534E]">
                    Ouverture directe chez OVH, Hostinger ou Vercel — ou Pass Clé en Main à 15 €/an
                    sans engagement si vous préférez ne rien configurer.
                  </p>
                </div>
              </div>

              <div className="py-7 flex items-start gap-5 group">
                <span className="font-mono text-xs text-[#ED5B04] font-semibold pt-1">03</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0C0A08]">
                      Souveraineté juridique totale
                    </h3>
                    <Lock
                      className="w-4 h-4 text-[#0C0A08]/35 group-hover:text-[#ED5B04] transition-colors"
                      strokeWidth={1.6}
                    />
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-[1.6] text-[#57534E]">
                    Code sur-mesure sur votre dépôt privé, domaine enregistré à votre identité,
                    performance instantanée sous 0.3 seconde.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#0C0A08]/35">
              <div className="flex items-center gap-2">
                <Crosshair />
                <span>COTE ATELIER · 0.00 € HT</span>
              </div>
              <span>CIRCUIT COURT</span>
            </div>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
