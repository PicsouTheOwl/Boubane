"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Code2,
  Globe,
  Lock,
  Mail,
  PhoneCall,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { type AutomationModule } from "@/data/automations";
import { cn, ATELIER_EASE } from "@/lib/utils";

const MODULE_ICON_MAP = {
  Globe,
  Mail,
  Receipt,
  BarChart3,
  PhoneCall,
  Users,
} as const;

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
 * Warm Atelier hardware-inspired live project summary console.
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
  const savingsPercent =
    totalMarketPrice > 0
      ? Math.round((totalEconomy / totalMarketPrice) * 100)
      : 100;

  const costRatio =
    totalMarketPrice > 0
      ? Math.max(
          totalPrice === 0 ? 0.03 : 0.06,
          Math.min(1, totalPrice / totalMarketPrice)
        )
      : 0.03;

  return (
    <div className="rounded-[28px] p-1.5 bg-[#EFEAE1]/95 border border-[#0C0A08]/[0.08] shadow-[0_1px_2px_rgba(12,10,8,0.04),0_24px_56px_-18px_rgba(12,10,8,0.13),inset_0_1px_0_rgba(255,255,255,0.88)]">
      {/* Inner white porcelain card */}
      <div className="rounded-[22px] bg-white border border-[#0C0A08]/[0.06] shadow-[0_2px_8px_-2px_rgba(12,10,8,0.04),inset_0_1px_0_#FFFFFF] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[11px] bg-[#FAF8F5] border border-[#0C0A08]/[0.08] shadow-[inset_0_1px_0_#fff] flex items-center justify-center shrink-0">
              <img
                src="/assets/boubane-logo.png"
                alt="Logo Boubane"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-jakarta)] text-[15px] font-bold tracking-[-0.025em] text-[#0C0A08] leading-tight truncate">
                Votre configuration
              </div>
              <div className="text-[12px] text-[#78716C] mt-0.5 truncate">
                Devis en direct · Sans acompte
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] px-2.5 py-1 font-mono text-[11px] font-medium text-[#0C0A08]/80 tabular-nums shrink-0">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-65" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <span>
              {selectedModules.length} module
              {selectedModules.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Recessed Pricing Display */}
        <div className="mx-4 rounded-[16px] bg-gradient-to-b from-[#FAF8F5] to-[#F4EFE7] border border-[#0C0A08]/[0.06] p-4 sm:p-5 shadow-[inset_0_1px_2px_rgba(12,10,8,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-[#78716C] font-semibold">
              Investissement fixe
            </span>
            {totalEconomy > 0 && (
              <span className="rounded-full bg-[#E6F8EE] border border-[#0E7541]/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0E7541] tabular-nums">
                &minus;{savingsPercent}&nbsp;% vs agence
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <RollingNumber
              value={totalPrice}
              className="font-[family-name:var(--font-jakarta)] text-[2.35rem] sm:text-[2.6rem] font-extrabold tracking-[-0.045em] text-[#0C0A08]"
            />
            <span className="font-mono text-[13px] font-semibold text-[#78716C]">
              € HT
            </span>
            {totalPrice === 0 && (
              <span className="rounded-md bg-[#ED5B04]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#ED5B04]">
                Site offert
              </span>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#0C0A08]/[0.06] space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11.5px] tabular-nums">
              <span className="text-[#78716C]">
                Moyenne agences
                <span className="line-through font-mono text-[#A8A29E] ml-1">
                  {formatAmount(totalMarketPrice)}&nbsp;€
                </span>
              </span>
              <span className="font-mono font-semibold text-[#0E7541]">
                Économie&nbsp;: {formatAmount(totalEconomy)}&nbsp;€
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#0C0A08]/[0.08] overflow-hidden">
              <motion.div
                initial={false}
                animate={{ scaleX: costRatio }}
                transition={{ type: "spring", bounce: 0, duration: 0.45 }}
                style={{ transformOrigin: "left center" }}
                className="h-full w-full rounded-full bg-gradient-to-r from-[#ED5B04] to-[#FF7A29]"
              />
            </div>
          </div>
        </div>

        {/* Selected Modules List */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A8A29E] font-semibold">
              Inclus dans votre projet
            </span>
            {selectedModules.length === 1 && (
              <span className="text-[11px] text-[#A8A29E]">
                Options IA à gauche
              </span>
            )}
          </div>

          <AnimatePresence initial={false}>
            {selectedModules.map((m) => {
              const Icon = MODULE_ICON_MAP[m.iconName];
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
                  <div className="py-2.5 flex items-center justify-between gap-3 border-b border-[#0C0A08]/[0.05]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0",
                          isFree
                            ? "bg-[#E6F8EE] text-[#0E7541]"
                            : "bg-[#FFF2E8] text-[#ED5B04]"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.1} />
                      </span>
                      <span className="text-[13px] font-medium text-[#0C0A08] truncate">
                        {m.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isFree ? (
                        <span className="rounded-md bg-[#E6F8EE] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0E7541]">
                          Offert
                        </span>
                      ) : (
                        <>
                          <span className="font-mono text-[13px] font-semibold text-[#0C0A08] tabular-nums">
                            {formatAmount(m.price)}&nbsp;€
                          </span>
                          {onRemoveModule && (
                            <button
                              type="button"
                              onClick={() => onRemoveModule(m.id)}
                              aria-label={`Retirer ${m.name}`}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#A8A29E] hover:text-[#DC2626] hover:bg-[#FEF2F2] active:scale-90 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mode-Specific Footer inside porcelain card */}
        <div className="px-5 pt-3 pb-5">
          {mode === "configurator" ? (
            <>
              <Link
                href={orderUrl || "/commander"}
                className="group w-full inline-flex items-center justify-between gap-3 rounded-[14px] bg-[#ED5B04] hover:bg-[#D64E00] text-white px-4 py-3 text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_28px_-8px_rgba(237,91,4,0.45)] cursor-pointer"
              >
                <span>
                  {totalPrice === 0
                    ? "Lancer mon site offert"
                    : "Commander ce projet"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-black/15 px-2.5 py-1 font-mono text-[12px] font-bold tabular-nums">
                  <span>
                    {totalPrice === 0 ? "0 €" : `${formatAmount(totalPrice)} €`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </Link>

              <a
                href="https://rdv.boubane.com/boubane/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#0C0A08]/[0.09] text-[#0C0A08] px-4 py-3 text-[13px] font-semibold transition-colors active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                <span>Valider en visio (30 min)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C]" />
              </a>
            </>
          ) : (
            <div className="rounded-[14px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] p-3.5 space-y-2 text-[12px] text-[#57534E]">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#ED5B04] mt-0.5 shrink-0" />
                <span>Site vitrine offert (0 €) sans acompte.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-[#ED5B04] mt-0.5 shrink-0" />
                <span>Code source et hébergement 100 % à vous.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ED5B04] mt-0.5 shrink-0" />
                <span>Livré en 5 jours ouvrés avec Léo Saillour.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outer Ceramic Bezel Bottom Strip */}
      <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between gap-2 text-[11px] font-medium text-[#57534E]">
        <span className="inline-flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-[#ED5B04] shrink-0" />
          <span>Code à vous</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#ED5B04] shrink-0" />
          <span>Livré en 5j</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ED5B04] shrink-0" />
          <span>0 € d&apos;abonnement</span>
        </span>
      </div>
    </div>
  );
}
