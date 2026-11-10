"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock, Server, ShieldCheck } from "lucide-react";
import { AtelierReveal, Crosshair, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE } from "@/lib/utils";

export function ManifestoSection() {
  const [sealHovered, setSealHovered] = useState(false);

  return (
    <section id="modele" className="relative py-24 md:py-32 border-t border-[#0C0A08]/[0.06]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header Editorial Calme & Chirurgical */}
        <AtelierReveal className="max-w-3xl mb-14 md:mb-16">
          <EyebrowBadge index="01">Le Manifeste du 0 €</EyebrowBadge>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
            La Rupture Commerciale<span className="text-[#ED5B04]">.</span>
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.25vw,1.16rem)] leading-[1.6] text-[#57534E] max-w-[54ch]">
            Pourquoi payer 4 500 € pour du vent ? Nous supprimons tout le superflu d&apos;agence
            pour vous livrer une vitrine d&apos;orfèvre directement à votre nom.
          </p>
        </AtelierReveal>

        {/* Bento Asymétrique d'Architecte */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Pièce Maîtresse Gauche : Le Monolithe 0 € */}
          <AtelierReveal delay={0.05} className="lg:col-span-7 flex">
            <SpecularPlate dark crosshairs className="w-full p-8 md:p-11 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                    COTE TECHNIQUE #01 · HONORAIRES STUDIO
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#ED5B04] px-2.5 py-1 rounded-full bg-[#ED5B04]/10 border border-[#ED5B04]/25">
                    0.00 € HT
                  </span>
                </div>

                {/* Démonstration Sculpturale : 4 500 € rayé au laser ➔ 0 € */}
                <div className="mt-9 mb-8 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 mb-1.5">
                      Facture agence classique
                    </div>
                    <div className="relative inline-block font-mono text-2xl sm:text-3xl font-medium text-white/45 tabular-nums">
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
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.85, delay: 0.25, ease: ATELIER_EASE }}
                        />
                      </motion.svg>
                    </div>
                  </div>

                  <div className="hidden sm:block pb-2 text-white/25" aria-hidden="true">
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#ED5B04] mb-1">
                      Atelier Boubane
                    </div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[clamp(3.6rem,6vw,5.2rem)] font-bold leading-none tracking-[-0.05em] text-[#FAF8F5] tabular-nums">
                        0 €
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/50">
                        ferme
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-white">
                  Zéro frais de conception studio.
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-white/65 max-w-[52ch]">
                  Les agences traditionnelles vous facturent leurs commerciaux, leurs chefs de
                  projet et leurs loyers. Chez Boubane, vous échangez en direct avec le concepteur :
                  100 % du design, de l&apos;architecture et du code sont offerts à nos frais.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap gap-3">
                {["Aucun acompte", "Zéro frais cachés", "Sans engagement"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-white/75"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#ED5B04]" />
                    {item}
                  </span>
                ))}
              </div>
            </SpecularPlate>
          </AtelierReveal>

          {/* Colonne Droite : 2 Plaques Techniques Empilées */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Carte 2 : Circuit Direct Serveur */}
            <AtelierReveal delay={0.12} className="flex-1 flex">
              <SpecularPlate className="w-full p-7 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#0C0A08]/[0.07]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                      COTE #02 · CIRCUIT DIRECT
                    </span>
                    <Server className="w-4 h-4 text-[#0C0A08]/40" strokeWidth={1.6} />
                  </div>

                  {/* Schéma Optique Sans Parasite */}
                  <div className="my-6 rounded-2xl bg-[#FAF8F5] border border-[#0C0A08]/[0.06] px-4 py-5">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="rounded-lg bg-white border border-[#0C0A08]/10 px-3 py-2 font-semibold text-[#0C0A08] shadow-xs">
                        VOUS
                      </div>

                      <div className="flex-1 relative h-6 flex items-center justify-center">
                        <svg
                          viewBox="0 0 120 24"
                          className="w-full h-6 overflow-visible"
                          aria-hidden="true"
                        >
                          <line
                            x1="0"
                            y1="12"
                            x2="120"
                            y2="12"
                            stroke="rgba(12,10,8,0.12)"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                          <motion.line
                            x1="0"
                            y1="12"
                            x2="120"
                            y2="12"
                            stroke="#ED5B04"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.9, delay: 0.3, ease: ATELIER_EASE }}
                          />
                          <motion.circle
                            r="3"
                            cy="12"
                            fill="#ED5B04"
                            animate={{ cx: [6, 114] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </svg>
                        <span className="absolute -top-2.5 text-[9px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold bg-[#FAF8F5] px-1.5">
                          Flux direct · ~5 €/mois
                        </span>
                      </div>

                      <div className="rounded-lg bg-[#0C0A08] text-white px-3 py-2 font-semibold">
                        OVH / Vercel
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0C0A08]">
                    Hébergement au coût réel, à votre nom.
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#57534E]">
                    Aucune marge cachée sur vos serveurs. Votre compte est ouvert en direct chez
                    l&apos;hébergeur de votre choix.
                  </p>
                </div>
              </SpecularPlate>
            </AtelierReveal>

            {/* Carte 3 : Souveraineté Juridique */}
            <AtelierReveal delay={0.18} className="flex-1 flex">
              <div
                className="w-full flex"
                onMouseEnter={() => setSealHovered(true)}
                onMouseLeave={() => setSealHovered(false)}
              >
                <SpecularPlate className="w-full p-7 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#0C0A08]/[0.07]">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                        COTE #03 · PROPRIÉTÉ
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#0C0A08]/40" strokeWidth={1.6} />
                    </div>

                    <div className="mt-6 flex items-center gap-5">
                      {/* Sceau Horloger Rotatif SVG */}
                      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                        <motion.svg
                          viewBox="0 0 100 100"
                          className="w-full h-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: sealHovered ? 7 : 24,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          aria-hidden="true"
                        >
                          <defs>
                            <path
                              id="sealCirclePath"
                              d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                            />
                          </defs>
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="rgba(12,10,8,0.1)"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                          />
                          <text
                            fill="#0C0A08"
                            fontSize="7.5"
                            fontFamily="monospace"
                            fontWeight="700"
                            letterSpacing="2.2"
                          >
                            <textPath href="#sealCirclePath">
                              100% PROPRIÉTAIRE • CODE &amp; DOMAINE •
                            </textPath>
                          </text>
                        </motion.svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/10 flex items-center justify-center text-[#ED5B04]">
                            <Lock className="w-3.5 h-3.5" strokeWidth={1.8} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0C0A08]">
                          Souveraineté juridique &amp; code pur.
                        </h3>
                        <p className="mt-1.5 text-[0.88rem] leading-[1.58] text-[#57534E]">
                          Dépôt GitHub privé à votre nom. Le code source vous appartient dès le
                          premier jour, sans abonnement captif.
                        </p>
                      </div>
                    </div>
                  </div>
                </SpecularPlate>
              </div>
            </AtelierReveal>
          </div>
        </div>

        {/* Repère de coupe architectural discret */}
        <div className="mt-12 flex items-center justify-between text-[10px] font-mono text-[#0C0A08]/30 select-none">
          <div className="flex items-center gap-2">
            <Crosshair />
            <span>PLAN ATELIER · RUPTURE TARIFAIRE</span>
          </div>
          <div className="hidden sm:block h-px flex-1 mx-6 bg-[#0C0A08]/[0.06]" />
          <span>0.00 € HONORAIRES</span>
        </div>
      </div>
    </section>
  );
}
