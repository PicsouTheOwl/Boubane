"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Mail,
  PhoneCall,
  Plus,
  Receipt,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AUTOMATION_MODULES, type AutomationModule } from "@/data/automations";
import { AtelierReveal, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SPRING } from "@/lib/utils";

const ICON_MAP = {
  Globe,
  Mail,
  Receipt,
  BarChart3,
  PhoneCall,
  Users,
};

export function AtelierConfiguratorSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["site-web"]);

  const toggleModule = (id: string) => {
    // Le site web reste toujours sélectionné (c'est l'offre d'appel à 0 €)
    if (id === "site-web") return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectedModules = AUTOMATION_MODULES.filter((m) =>
    selectedIds.includes(m.id)
  );

  const totalPrice = selectedModules.reduce((sum, m) => sum + m.price, 0);
  const totalMarketPrice = selectedModules.reduce((sum, m) => sum + m.marketPrice, 0);
  const totalEconomy = totalMarketPrice - totalPrice;

  const commanderQuery = selectedIds.filter((id) => id !== "site-web").join(",");
  const commanderHref = commanderQuery
    ? `/commander?modules=${encodeURIComponent(commanderQuery)}`
    : "/commander";

  return (
    <section
      id="configurateur"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            CONFIGURATEUR ATELIER &amp; AUTOMATISATIONS IA
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.95rem,4vw,2.9rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Le site web reste à 0 €.
            <br />
            <span className="text-[#ED5B04]">Ajoutez vos automatisations au prix le plus juste.</span>
          </h2>
          <p className="mt-4 text-[1.02rem] leading-[1.65] text-[#57534E] max-w-[58ch]">
            Les agences facturent ces agents et automatisations entre 1 800 € et 3 900 € pièce.
            À l&apos;Atelier Boubane, vous réglez un prix fixe sans abonnement récurrent imposé, installé directement sur votre serveur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Modules Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUTOMATION_MODULES.map((mod) => {
              const isSelected = selectedIds.includes(mod.id);
              const isBase = mod.id === "site-web";
              const Icon = ICON_MAP[mod.iconName];

              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#ED5B04] shadow-[0_12px_28px_rgba(237,91,4,0.1)]"
                      : "bg-[#FAF8F5] border-[#0C0A08]/[0.08] hover:bg-white hover:border-[#0C0A08]/25"
                  } ${isBase ? "sm:col-span-2 bg-[#FFFDF9] border-[#0C0A08]/15" : ""}`}
                >
                  <div>
                    {/* Top Hook & Status */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[11px] font-mono italic text-[#57534E] truncate">
                        {mod.hook}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? "bg-[#ED5B04] border-[#ED5B04] text-white"
                            : "bg-white border-[#0C0A08]/20 text-transparent group-hover:border-[#0C0A08]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#ED5B04] text-white"
                            : "bg-white border border-[#0C0A08]/[0.09] text-[#0C0A08]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-[#0C0A08] leading-snug">
                        {mod.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                      {mod.description}
                    </p>
                  </div>

                  {/* Bottom Metric & Price */}
                  <div className="pt-3 border-t border-[#0C0A08]/[0.06] flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-[#0C0A08]/65">
                      {mod.metric}
                    </span>

                    <div className="text-right">
                      {mod.isFree ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E6F8EE] border border-[#0E7541]/20 font-mono text-xs font-bold text-[#0E7541]">
                          <span>0 €</span>
                          <span className="text-[10px] font-normal uppercase">Offert</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-end gap-1.5 font-mono">
                          <span className="text-xs text-[#0C0A08]/35 line-through">
                            {mod.marketPrice} €
                          </span>
                          <span className="text-sm font-bold text-[#0C0A08]">
                            {mod.price} €
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Interactive Ticket (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <SpecularPlate dark className="p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
                    TICKET DE VOTRE PROJET
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {selectedModules.length} module{selectedModules.length > 1 ? "s" : ""} sélectionné{selectedModules.length > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              </div>

              {/* Selected List */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {selectedModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between text-xs text-white/85"
                  >
                    <span className="truncate pr-2 font-medium">{mod.name}</span>
                    <span className="font-mono shrink-0 font-semibold text-white">
                      {mod.price === 0 ? "0 € (Offert)" : `${mod.price} €`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Comparison */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/55">
                  <span>Tarif agences (ex : Mushrooms)</span>
                  <span className="font-mono line-through text-white/45">
                    {totalMarketPrice.toLocaleString("fr-FR")} €
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-medium text-white">Total Atelier :</span>
                  <span className="font-mono text-2xl font-extrabold text-[#ED5B04]">
                    {totalPrice.toLocaleString("fr-FR")} € HT
                  </span>
                </div>

                {totalEconomy > 0 && (
                  <div className="text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg px-2.5 py-1 text-center font-medium">
                    Vous économisez {totalEconomy.toLocaleString("fr-FR")} € sur votre installation
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={commanderHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#ED5B04] text-white py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.98] transition-all shadow-[0_10px_28px_rgba(237,91,4,0.3)] cursor-pointer"
                >
                  <span>Commander avec ces modules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://rdv.boubane.com/boubane/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 text-white py-3 text-xs font-semibold hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <span>Valider les besoins en visio (30 min)</span>
                </a>
              </div>
            </SpecularPlate>

            <div className="rounded-xl border border-[#0C0A08]/[0.08] bg-white p-4 text-[11px] text-[#57534E] leading-relaxed">
              <span className="font-semibold text-[#0C0A08]">Sans abonnement forcé :</span>{" "}
              Votre site et vos automatisations sont installés à votre nom. Le code et les accès vous appartiennent à 100 %.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
