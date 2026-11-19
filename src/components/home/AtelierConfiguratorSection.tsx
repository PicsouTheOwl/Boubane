"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Check,
  Globe,
  Mail,
  PhoneCall,
  Plus,
  Receipt,
  Users,
} from "lucide-react";
import {
  AUTOMATION_MODULES,
  formatAmount,
  type AutomationModule,
} from "@/data/automations";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Globe,
  Mail,
  Receipt,
  BarChart3,
  PhoneCall,
  Users,
} as const;

function ModuleRowContent({
  mod,
  isBase,
  isSelected,
}: {
  mod: AutomationModule;
  isBase: boolean;
  isSelected: boolean;
}) {
  const Icon = ICON_MAP[mod.iconName];

  return (
    <>
      <span
        className={cn(
          "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors duration-150",
          isBase
            ? "bg-[#E6F8EE] text-[#0E7541]"
            : isSelected
              ? "bg-[#0C0A08] text-white"
              : "bg-[#FAF8F5] border border-[#0C0A08]/[0.08] text-[#57534E] group-hover:text-[#0C0A08]"
        )}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={1.9} />
      </span>

      <span className="min-w-0 flex-1 block">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="font-[family-name:var(--font-jakarta)] text-[15px] sm:text-[15.5px] font-semibold tracking-[-0.02em] text-[#0C0A08]">
            {mod.name}
          </span>
          <span className="hidden sm:inline text-[12px] text-[#78716C]">
            &middot; {mod.metric}
          </span>
        </span>
        <span className="block mt-0.5 text-[13px] sm:text-[13.5px] text-[#57534E] leading-snug">
          {mod.description}
        </span>
      </span>

      <span className="text-right shrink-0 pl-1 block">
        {isBase ? (
          <>
            <span className="block font-mono text-[14px] font-bold text-[#0E7541] tabular-nums">
              0&nbsp;€
            </span>
            <span className="block text-[11px] text-[#0E7541]/80">Offert</span>
          </>
        ) : (
          <>
            <span className="block font-mono text-[14.5px] font-bold text-[#0C0A08] tabular-nums">
              {formatAmount(mod.price)}&nbsp;€
            </span>
            <span className="block font-mono text-[11px] line-through text-[#A8A29E] tabular-nums">
              {formatAmount(mod.marketPrice)}&nbsp;€
            </span>
          </>
        )}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150",
          isBase
            ? "bg-[#E6F8EE] text-[#0E7541]"
            : isSelected
              ? "bg-[#0C0A08] text-white"
              : "border border-[#0C0A08]/20 text-[#0C0A08]/45 group-hover:border-[#0C0A08]/60 group-hover:text-[#0C0A08]"
        )}
      >
        {isBase || isSelected ? (
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
        ) : (
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        )}
      </span>
    </>
  );
}

export function AtelierConfiguratorSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "site-web",
    "assistant-mails",
  ]);

  const toggleModule = (id: string) => {
    if (id === "site-web") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectedModules = AUTOMATION_MODULES.filter((m) =>
    selectedIds.includes(m.id)
  );

  const queryParams = selectedIds
    .filter((id) => id !== "site-web")
    .join(",");
  const orderUrl = queryParams
    ? `/commander?modules=${encodeURIComponent(queryParams)}`
    : "/commander";

  return (
    <section
      id="configurateur"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        {/* Calm Editorial Header */}
        <AtelierReveal className="max-w-2xl mb-10 sm:mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            AUTOMATISATIONS &amp; IA
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.9rem,3.6vw,2.65rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Le site reste à 0&nbsp;€. Ajoutez l&apos;IA à prix fixe.
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.65] text-[#57534E] max-w-[50ch]">
            Composez vos modules selon vos besoins. Sans abonnement imposé, installé à votre nom.
          </p>
        </AtelierReveal>

        {/* Main 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Clean 4-element rows (7 cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            {AUTOMATION_MODULES.map((mod) => {
              const isSelected = selectedIds.includes(mod.id);
              const isBase = mod.id === "site-web";
              const baseRowClasses =
                "rounded-[18px] px-4 py-4 sm:px-5 sm:py-4 flex items-center gap-3.5 sm:gap-4";

              if (isBase) {
                return (
                  <div
                    key={mod.id}
                    className={cn(
                      baseRowClasses,
                      "cursor-default bg-white/80 border border-[#0C0A08]/[0.08]"
                    )}
                  >
                    <ModuleRowContent
                      mod={mod}
                      isBase={true}
                      isSelected={true}
                    />
                  </div>
                );
              }

              return (
                <button
                  key={mod.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleModule(mod.id)}
                  className={cn(
                    baseRowClasses,
                    "group w-full text-left cursor-pointer active:scale-[0.992] transition-all duration-150",
                    isSelected
                      ? "bg-white border border-[#0C0A08]/35 shadow-[0_6px_20px_-10px_rgba(12,10,8,0.1)]"
                      : "bg-white/60 hover:bg-white border border-[#0C0A08]/[0.08] hover:border-[#0C0A08]/20"
                  )}
                >
                  <ModuleRowContent
                    mod={mod}
                    isBase={false}
                    isSelected={isSelected}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Simplified Printer Cap + Airy Hanging Receipt (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <AtelierProjectSummary
              mode="configurator"
              selectedModules={selectedModules}
              orderUrl={orderUrl}
              onRemoveModule={toggleModule}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
