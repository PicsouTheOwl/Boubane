"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { type AutomationModule } from "@/data/automations";
import { cn, ATELIER_EASE } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * Deterministic currency formatting (avoids Node vs browser locale space mismatch during hydration).
 */
function formatAmount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

function RollingNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const formatted = formatAmount(value);
  const chars = formatted.split("");

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{formatted} €</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {chars.map((char, idx) => {
          const slotFromRight = chars.length - 1 - idx;
          if (!/^\d$/.test(char)) {
            return (
              <span
                key={`sep-${slotFromRight}`}
                className="inline-block w-[0.26em]"
              >
                {char}
              </span>
            );
          }

          return (
            <span
              key={`digit-${slotFromRight}`}
              className="inline-block relative overflow-hidden align-bottom leading-[1.08] tabular-nums"
            >
              <span className="invisible select-none">0</span>
              <motion.span
                initial={false}
                animate={{ y: `-${Number(char) * 10}%` }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                  mass: 0.8,
                }}
                className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
              >
                {DIGITS.map((d) => (
                  <span
                    key={d}
                    className="h-[1.08em] leading-[1.08] flex items-center justify-center"
                  >
                    {d}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export interface AtelierProjectSummaryProps {
  selectedModules: AutomationModule[];
  mode: "configurator" | "checkout";
  orderUrl?: string;
  onRemoveModule?: (id: string) => void;
}

/**
 * Compact Warm Atelier thermal printer unit with a clean, airy hanging paper receipt.
 */
export function AtelierProjectSummary({
  selectedModules,
  mode,
  orderUrl = "/commander",
  onRemoveModule,
}: AtelierProjectSummaryProps) {
  const totalPrice = selectedModules.reduce((sum, m) => sum + m.price, 0);
  const totalMarketPrice = selectedModules.reduce(
    (sum, m) => sum + m.marketPrice,
    0
  );
  const totalEconomy = Math.max(0, totalMarketPrice - totalPrice);

  return (
    <div className="w-full max-w-[400px] mx-auto lg:ml-auto lg:mr-0">
      {/* Layer 1: Compact Printer Hardware Unit */}
      <div className="relative z-10 rounded-[24px] p-3.5 pb-6 bg-gradient-to-b from-[#F5F2EC] via-[#ECE7DE] to-[#E3DDD2] border border-[#0C0A08]/[0.1] shadow-[0_1px_2px_rgba(12,10,8,0.05),0_18px_38px_-18px_rgba(12,10,8,0.18),inset_0_1px_0_rgba(255,255,255,0.92)]">
        {/* Top Hardware Header */}
        <div className="flex items-center justify-between gap-3 pb-3 px-0.5">
          <div className="w-9 h-9 rounded-[11px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_1px_2px_rgba(12,10,8,0.06),inset_0_1px_0_#fff] flex items-center justify-center shrink-0">
            <img
              src="/assets/boubane-logo.png"
              alt="Boubane"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
          </div>

          {mode === "configurator" ? (
            <Link
              href={orderUrl || "/commander"}
              className="group inline-flex items-center gap-2 rounded-[12px] bg-[#ED5B04] hover:bg-[#D64E00] text-white pl-4 pr-2.5 py-2 text-[13px] font-semibold transition-all duration-150 active:translate-y-[1px] active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_0_#B84400,0_10px_20px_-8px_rgba(237,91,4,0.48)]"
            >
              <span>{totalPrice === 0 ? "Lancer à 0 €" : "Commander"}</span>
              <span className="w-6 h-6 rounded-[8px] bg-black/15 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[#0C0A08]/[0.08] px-2.5 py-1 font-mono text-[11px] text-[#0C0A08]/75">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-65" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
              </span>
              <span>En direct</span>
            </div>
          )}
        </div>

        {/* Compact Recessed LCD Screen */}
        <div className="rounded-[14px] bg-white border border-[#0C0A08]/[0.08] px-4 py-3 shadow-[inset_0_1px_3px_rgba(12,10,8,0.07),0_1px_0_rgba(255,255,255,0.85)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold tracking-[-0.02em] text-[#0C0A08] leading-tight truncate">
                Votre projet
              </div>
              <div className="text-[12px] text-[#78716C] mt-0.5 tabular-nums">
                {selectedModules.length} module
                {selectedModules.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.08em] text-[#A8A29E] leading-tight">
                Total HT
              </div>
              <div className="mt-0.5 flex items-baseline justify-end">
                <RollingNumber
                  value={totalPrice}
                  className="font-mono text-[1.35rem] font-bold tracking-[-0.03em] text-[#0C0A08]"
                />
                <span className="font-mono text-[1.1rem] font-bold text-[#0C0A08] ml-1">
                  €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recessed Paper Ejection Slot */}
        <div
          aria-hidden="true"
          className="absolute bottom-2.5 inset-x-5 h-2 rounded-full bg-[#151311] shadow-[inset_0_1px_3px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.75)]"
        />
      </div>

      {/* Layer 2: Airy Minimal Thermal Receipt Paper */}
      <div className="relative z-20 w-[86%] mx-auto -mt-3 [filter:drop-shadow(0_16px_22px_rgba(12,10,8,0.11))_drop-shadow(0_2px_4px_rgba(12,10,8,0.05))]">
        <div className="relative bg-[#FFFDF9] text-[#0C0A08] border-x border-[#0C0A08]/[0.06] px-5 pt-6 pb-5">
          {/* Realistic slot exit shadow strip */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-3.5 bg-gradient-to-b from-[#0C0A08]/[0.13] via-[#0C0A08]/[0.03] to-transparent"
          />

          {/* Minimal Header */}
          <div className="flex items-baseline justify-between pb-4 border-b border-dashed border-[#0C0A08]/15">
            <span className="font-[family-name:var(--font-jakarta)] text-[14px] font-bold tracking-[-0.02em] text-[#0C0A08]">
              Boubane
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#A8A29E]">
              Prix fixes
            </span>
          </div>

          {/* Spacious Line Items */}
          <div className="py-4 border-b border-dashed border-[#0C0A08]/15">
            <AnimatePresence initial={false}>
              {selectedModules.map((m) => {
                const isFree = m.price === 0;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: ATELIER_EASE }}
                    className="overflow-hidden"
                  >
                    <div className="py-1.5 flex items-center justify-between gap-3 group">
                      <span className="text-[12.5px] text-[#0C0A08]/90 truncate">
                        {m.name}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[12.5px] tabular-nums">
                          {isFree ? (
                            <span className="font-semibold text-[#0E7541]">
                              0 €
                            </span>
                          ) : (
                            <span className="font-semibold text-[#0C0A08]">
                              {formatAmount(m.price)} €
                            </span>
                          )}
                        </span>

                        {!isFree && onRemoveModule && (
                          <button
                            type="button"
                            onClick={() => onRemoveModule(m.id)}
                            aria-label={`Retirer ${m.name}`}
                            className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[#A8A29E] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Clean Minimal Totals */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-[12px] text-[#78716C]">
              <span>Livraison</span>
              <span className="font-mono text-[#0C0A08]/80">5 jours</span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-[13px] font-semibold text-[#0C0A08]">
                Total HT
              </span>
              <span className="font-mono text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#ED5B04] tabular-nums">
                {formatAmount(totalPrice)}&nbsp;€
              </span>
            </div>

            {totalEconomy > 0 && (
              <div className="flex items-center justify-between text-[11px] font-mono text-[#0E7541] pt-0.5 tabular-nums">
                <span>vs agences ({formatAmount(totalMarketPrice)} €)</span>
                <span>&minus;{formatAmount(totalEconomy)} €</span>
              </div>
            )}
          </div>

          {/* Minimal 1-line Footer */}
          <div className="mt-5 pt-3.5 border-t border-dashed border-[#0C0A08]/12 text-center font-mono text-[10.5px] text-[#A8A29E]">
            Sans acompte · Code 100 % à vous
          </div>
        </div>

        {/* Crisp Serrated Zig-Zag Paper Bottom Edge */}
        <div
          aria-hidden="true"
          className="h-3 w-full overflow-hidden leading-none pointer-events-none"
        >
          <svg
            className="block w-full h-full text-[#FFFDF9] fill-current"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 105,10 110,0 115,10 120,0 125,10 130,0 135,10 140,0 145,10 150,0 155,10 160,0 165,10 170,0 175,10 180,0 185,10 190,0 195,10 200,0" />
          </svg>
        </div>
      </div>

      {/* Subtle Secondary Visio Link below the hanging receipt */}
      {mode === "configurator" && (
        <div className="mt-5 text-center">
          <a
            href="https://rdv.boubane.com/boubane/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors"
          >
            <span>Ou valider en visio (30 min)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
