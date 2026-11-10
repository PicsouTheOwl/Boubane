"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_SPRING } from "@/lib/utils";

const LEGACY_ITEMS = [
  { label: "Honoraires de conception", value: "3 500 € à 6 000 €", note: "70% pour payer commerciaux & locaux" },
  { label: "Architecture logicielle", value: "WordPress lourd (~4s)", note: "Extensions fragiles et failles de sécurité" },
  { label: "Contrat & rétention", value: "150 € / mois captif", note: "Code verrouillé chez le prestataire" },
  { label: "Interlocuteur", value: "Commercial / sous-traitance", note: "Perte d'information et délais à rallonge" },
];

const BOUBANE_ITEMS = [
  { label: "Honoraires de conception", value: "0 € ferme", note: "100% du design et du code offerts" },
  { label: "Architecture logicielle", value: "Code sur-mesure (< 0.3s)", note: "Score performance 99/100 natif" },
  { label: "Propriété & hébergement", value: "~5 € / mois direct", note: "Nom de domaine & dépôt GitHub à votre nom" },
  { label: "Interlocuteur", value: "Artisan développeur direct", note: "Échange sans filtre de A à Z" },
];

export function ComparisonSection() {
  const [legacyHovered, setLegacyHovered] = useState(false);

  return (
    <section
      id="comparatif"
      className="relative py-24 md:py-32 bg-[#F5F2EC] border-y border-[#0C0A08]/[0.06]"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <AtelierReveal className="max-w-3xl mb-14 md:mb-16">
          <EyebrowBadge index="02">Le Grand Face-à-Face</EyebrowBadge>
          <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
            Agence classique <span className="text-[#0C0A08]/35 font-normal">vs</span> Atelier Boubane
            <span className="text-[#ED5B04]">.</span>
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.25vw,1.16rem)] leading-[1.6] text-[#57534E] max-w-[54ch]">
            Deux philosophies diamétralement opposées. D&apos;un côté l&apos;inertie d&apos;un
            modèle facturant ses propres coûts de structure ; de l&apos;autre, le circuit court pur.
          </p>
        </AtelierReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Gauche : L'Agence Classique (Facture Jaunie / Tampon Obsolète) */}
          <AtelierReveal delay={0.05} className="lg:col-span-6">
            <motion.div
              onMouseEnter={() => setLegacyHovered(true)}
              onMouseLeave={() => setLegacyHovered(false)}
              whileHover={{ rotate: -0.4 }}
              transition={ATELIER_SPRING}
              className="relative rounded-[24px] bg-[#EFEAE0] border border-[#0C0A08]/[0.09] p-8 md:p-10 -rotate-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_30px_-14px_rgba(12,10,8,0.12)]"
            >
              {/* Tampon mécanique rouge/gris qui s'abat au survol */}
              <motion.div
                initial={false}
                animate={{
                  opacity: legacyHovered ? 1 : 0.25,
                  scale: legacyHovered ? 1 : 1.08,
                  rotate: -11,
                }}
                transition={ATELIER_SPRING}
                className="pointer-events-none absolute top-7 right-7 rounded-md border-2 border-[#B91C1C]/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#B91C1C]/80 select-none"
              >
                MODÈLE OBSOLÈTE
              </motion.div>

              <div className="pb-5 border-b border-[#0C0A08]/[0.09]">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                  MODÈLE TRADITIONNEL
                </span>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#0C0A08]/80">
                  L&apos;Agence Web Classique
                </h3>
              </div>

              <div className="mt-6 space-y-5">
                {LEGACY_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3.5 pb-4 border-b border-dashed border-[#0C0A08]/[0.08] last:border-none last:pb-0"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C0A08]/[0.06] text-[#0C0A08]/45">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-xs font-mono uppercase tracking-[0.06em] text-[#0C0A08]/50">
                          {item.label}
                        </span>
                        <span className="font-mono text-sm font-medium text-[#0C0A08]/65 line-through decoration-[#B91C1C]/60">
                          {item.value}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#57534E]/80">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AtelierReveal>

          {/* Droite : L'Atelier Boubane (Écrin Pur Surélevé avec liseré conique subtil) */}
          <AtelierReveal delay={0.14} className="lg:col-span-6">
            <div className="relative rounded-[26px] p-[1.5px] overflow-hidden lg:-translate-y-3 shadow-[0_32px_70px_-16px_rgba(12,10,8,0.14),0_8px_20px_-6px_rgba(237,91,4,0.12)]">
              {/* Bordure lumineuse rotative haute facture */}
              <div
                aria-hidden="true"
                className="atelier-rim-conic pointer-events-none absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(237,91,4,0.55)_325deg,transparent_360deg)]"
              />

              <SpecularPlate className="relative rounded-[24.5px] p-8 md:p-10 bg-white border-none shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#0C0A08]/[0.08]">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                      ATELIER BOUBANE
                    </span>
                    <h3 className="mt-1.5 text-xl font-bold tracking-[-0.025em] text-[#0C0A08]">
                      L&apos;Ingénierie en Circuit Court
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#0C0A08]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ED5B04] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ED5B04]" />
                    </span>
                    Circuit Court
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  {BOUBANE_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3.5 pb-4 border-b border-[#0C0A08]/[0.06] last:border-none last:pb-0"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ED5B04]/10 text-[#ED5B04]">
                        <Check className="w-3 h-3" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-xs font-mono uppercase tracking-[0.06em] text-[#0C0A08]/55">
                            {item.label}
                          </span>
                          <span className="font-mono text-sm font-bold text-[#0C0A08] tabular-nums">
                            {item.value}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#57534E]">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SpecularPlate>
            </div>
          </AtelierReveal>
        </div>
      </div>
    </section>
  );
}
