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
import { AUTOMATION_MODULES } from "@/data/automations";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";

const ICON_MAP = {
  Globe,
  Mail,
  Receipt,
  BarChart3,
  PhoneCall,
  Users,
};

export function AtelierConfiguratorSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "site-web",
    "assistant-mails",
  ]);

  const toggleModule = (id: string) => {
    // Le site web est toujours inclus
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
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.08]"
    >
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
        {/* Stepper indicator pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs font-mono">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E3DC] shadow-sm text-[#0C0A08]">
            <span className="w-5 h-5 rounded-full bg-[#ED5B04] text-white flex items-center justify-center text-[10px] font-bold">
              01
            </span>
            <span className="font-semibold">Composer votre projet</span>
          </div>
          <span className="text-[#0C0A08]/25 hidden sm:inline">———</span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] text-[#57534E]">
            <span className="w-5 h-5 rounded-full bg-[#0C0A08]/10 text-[#0C0A08] flex items-center justify-center text-[10px] font-bold">
              02
            </span>
            <span>Échange direct (30 min)</span>
          </div>
          <span className="text-[#0C0A08]/25 hidden sm:inline">———</span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] text-[#57534E]">
            <span className="w-5 h-5 rounded-full bg-[#0C0A08]/10 text-[#0C0A08] flex items-center justify-center text-[10px] font-bold">
              03
            </span>
            <span>Livré en 5j à votre nom</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            CONFIGURATEUR D&apos;ATELIER &amp; AGENTS IA
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(2.1rem,4.2vw,3.15rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0C0A08]">
            Le site web reste à 0 €.
            <br />
            <span className="text-[#ED5B04]">
              Vos automatisations au prix le plus juste du marché.
            </span>
          </h2>
          <p className="mt-4 text-[1.05rem] leading-[1.62] text-[#57534E] max-w-[56ch]">
            Les agences facturent ces agents entre 1 800 € et 3 900 € avec abonnement imposé.
            À l&apos;Atelier Boubane, vous obtenez votre vitrine offerte et vous ajoutez vos modules sur-mesure dès 390 €, sans intermédiaire.
          </p>
        </div>

        {/* Main 2-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Cards List (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#78716C] font-semibold">
                6 MODULES DISPONIBLES · PRIX FIXES GARANTIS
              </span>
              <span className="text-xs font-mono text-[#0E7541] font-medium bg-[#E6F8EE] border border-[#0E7541]/20 px-2 py-0.5 rounded-full">
                Sans abonnement mensuel forcé
              </span>
            </div>

            {AUTOMATION_MODULES.map((mod) => {
              const isSelected = selectedIds.includes(mod.id);
              const isBase = mod.id === "site-web";
              const Icon = ICON_MAP[mod.iconName];

              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleModule(mod.id);
                    }
                  }}
                  className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "bg-white border-[#ED5B04] shadow-[0_14px_34px_rgba(237,91,4,0.12)] ring-1 ring-[#ED5B04]"
                      : "bg-[#FAF8F5] border-[#E7E3DC] hover:bg-white hover:border-[#0C0A08]/30 hover:shadow-[0_8px_24px_rgba(12,10,8,0.06)]"
                  } ${isBase ? "border-[#0C0A08]/20 bg-[#FFFDF9]" : ""}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)_auto] gap-4 sm:gap-5 items-start">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#ED5B04] text-white shadow-[0_6px_16px_rgba(237,91,4,0.28)]"
                          : "bg-white border border-[#E7E3DC] text-[#57534E] group-hover:text-[#0C0A08]"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>

                    {/* Middle Info */}
                    <div className="min-w-0">
                      <div className="text-xs font-mono italic text-[#78716C] mb-1">
                        {mod.hook}
                      </div>
                      <h3 className="font-[family-name:var(--font-jakarta)] text-[1.28rem] sm:text-[1.42rem] font-bold text-[#0C0A08] leading-tight mb-2 tracking-[-0.025em]">
                        {mod.name}
                      </h3>
                      <p className="text-xs sm:text-[0.88rem] text-[#57534E] leading-relaxed mb-3">
                        {mod.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[11px] font-medium bg-[#F5F2EC] text-[#0C0A08] border border-[#E7E3DC]">
                          {mod.metric}
                        </span>
                        {isBase && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[11px] font-bold bg-[#E6F8EE] text-[#0E7541] border border-[#0E7541]/20">
                            Offert Boubane (0 €)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Price & Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#0C0A08]/[0.06] shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[#78716C]">
                          {isBase ? "Honoraires" : "Prix fixe atelier"}
                        </span>
                        <div className="font-mono text-xl sm:text-2xl font-black text-[#0C0A08] leading-none mt-0.5">
                          {isBase ? "0 €" : `${mod.price} €`}
                        </div>
                        {!isBase && (
                          <span className="block font-mono text-[11px] line-through text-[#A8A29E] mt-0.5">
                            Agence : {mod.marketPrice} €
                          </span>
                        )}
                      </div>

                      <div className="shrink-0 mt-1">
                        {isBase ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F8EE] text-[#0E7541] text-xs font-mono font-bold">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Inclus
                          </span>
                        ) : isSelected ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ED5B04] text-white text-xs font-semibold shadow-sm hover:bg-[#D64E00] transition-colors"
                          >
                            <span>Ajouté</span>
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E7E3DC] text-[#0C0A08] group-hover:border-[#0C0A08] text-xs font-semibold transition-colors"
                          >
                            <span>Ajouter</span>
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Live Atelier Estimate Console (5 cols) */}
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
