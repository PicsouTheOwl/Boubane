"use client";

import React from "react";
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
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Globe,
  Mail,
  Receipt,
  BarChart3,
  PhoneCall,
  Users,
} as const;

export interface AtelierModuleListProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  compact?: boolean;
}

function RowContent({
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
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
          isBase
            ? "text-[#0E7541]"
            : isSelected
              ? "text-[#0C0A08]"
              : "text-[#78716C] group-hover:text-[#0C0A08]"
        )}
        strokeWidth={1.65}
      />

      <span className="min-w-0 flex-1 block">
        <span
          className={cn(
            "block font-[family-name:var(--font-jakarta)] text-[15px] sm:text-[15.5px] font-semibold tracking-[-0.02em] transition-colors",
            isBase || isSelected
              ? "text-[#0C0A08]"
              : "text-[#0C0A08]/80 group-hover:text-[#0C0A08]"
          )}
        >
          {mod.name}
        </span>
        <span className="block mt-0.5 text-[13px] sm:text-[13.5px] text-[#57534E] leading-snug">
          {mod.description}
        </span>
      </span>

      <span className="shrink-0 text-right font-mono tabular-nums">
        {isBase ? (
          <span className="text-[14px] font-semibold text-[#0E7541]">
            0&nbsp;€
          </span>
        ) : (
          <span
            className={cn(
              "text-[14px] font-semibold transition-colors",
              isSelected
                ? "text-[#0C0A08]"
                : "text-[#0C0A08]/65 group-hover:text-[#0C0A08]"
            )}
          >
            {formatAmount(mod.price)}&nbsp;€
          </span>
        )}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-150",
          isBase
            ? "text-[#0E7541]"
            : isSelected
              ? "bg-[#0C0A08] text-white"
              : "border border-[#0C0A08]/20 text-[#0C0A08]/40 group-hover:border-[#0C0A08]/55 group-hover:text-[#0C0A08]"
        )}
      >
        {isBase ? (
          <Check className="w-4 h-4" strokeWidth={2.2} />
        ) : isSelected ? (
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
        ) : (
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        )}
      </span>
    </>
  );
}

/**
 * Pure Swiss-editorial hairline selector shared by the homepage configurator and Step 1 of /commander.
 */
export function AtelierModuleList({
  selectedIds,
  onToggle,
  compact = false,
}: AtelierModuleListProps) {
  const rowLayout = cn(
    "w-full text-left flex items-center gap-3.5 sm:gap-4 transition-colors duration-150",
    compact ? "py-3.5 px-1.5" : "py-4 sm:py-5 px-2"
  );

  return (
    <div className="divide-y divide-[#0C0A08]/[0.09] border-t border-b border-[#0C0A08]/[0.09]">
      {AUTOMATION_MODULES.map((mod) => {
        const isBase = mod.id === "site-web";
        const isSelected = selectedIds.includes(mod.id);

        if (isBase) {
          return (
            <div key={mod.id} className={rowLayout}>
              <RowContent mod={mod} isBase={true} isSelected={true} />
            </div>
          );
        }

        return (
          <button
            key={mod.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(mod.id)}
            className={cn(
              rowLayout,
              "group cursor-pointer hover:bg-[#0C0A08]/[0.02] active:scale-[0.996]"
            )}
          >
            <RowContent mod={mod} isBase={false} isSelected={isSelected} />
          </button>
        );
      })}
    </div>
  );
}
