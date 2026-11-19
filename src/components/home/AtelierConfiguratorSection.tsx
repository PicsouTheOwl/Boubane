"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Mail,
  Minus,
  PhoneCall,
  Plus,
  Receipt,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AUTOMATION_MODULES, type AutomationModule } from "@/data/automations";
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

  const totalPrice = selectedModules.reduce((sum, m) => sum + m.price, 0);
  const totalMarketPrice = selectedModules.reduce(
    (sum, m) => sum + m.marketPrice,
    0
  );
  const totalEconomy = totalMarketPrice - totalPrice;

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

          {/* Right Thermal Receipt Machine & Ticket (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            {/* The Machine Top */}
            <div className="rounded-2xl bg-[#1C1917] border border-[#292524] p-5 sm:p-6 text-white shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/80 font-bold">
                    IMPRIMANTE ATELIER BOUBANE
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
                  MODÈLE B-2026
                </span>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{selectedModules.length} module{selectedModules.length > 1 ? "s" : ""} imprimé{selectedModules.length > 1 ? "s" : ""}</span>
                <span className="text-[#ED5B04] font-mono font-semibold">Devis temps réel</span>
              </div>

              {/* The Paper Ejection Slot */}
              <div className="w-full h-3 bg-black rounded-full border border-white/10 shadow-inner relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>

              {/* Thermal Receipt Paper */}
              <div className="relative bg-[#FFFDF9] text-[#0C0A08] rounded-t-xl p-5 sm:p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] border-x border-t border-[#E7E3DC] font-mono text-xs">
                {/* Stamp */}
                <div className="text-center pb-3 border-b border-dashed border-[#0C0A08]/20 space-y-1">
                  <div className="font-black text-sm tracking-wider text-[#0C0A08]">
                    ATELIER BOUBANE
                  </div>
                  <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
                    ARTISAN NUMÉRIQUE · PRIX FIXES DIRECTS
                  </div>
                  <div className="text-[10px] text-[#78716C]">
                    REÇU PROVISOIRE · SANS ACOMPTE
                  </div>
                </div>

                {/* Line Items */}
                <div className="py-4 space-y-2 border-b border-dashed border-[#0C0A08]/20">
                  {selectedModules.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-baseline justify-between gap-2 text-xs"
                    >
                      <span className="truncate text-[#0C0A08] font-medium">
                        {m.name}
                      </span>
                      <span className="shrink-0 font-bold text-[#0C0A08]">
                        {m.price === 0 ? "0.00 € (OFFERT)" : `${m.price.toFixed(2)} €`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="py-3 space-y-1.5 border-b border-dashed border-[#0C0A08]/20 text-[11px]">
                  <div className="flex items-center justify-between text-[#78716C]">
                    <span>TARIF AGENCES (TYPE MUSHROOMS)</span>
                    <span className="line-through">{totalMarketPrice.toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex items-center justify-between text-[#0E7541] font-bold">
                    <span>ÉCONOMIE ATELIER RÉALISÉE</span>
                    <span>- {totalEconomy.toLocaleString("fr-FR")} € HT</span>
                  </div>
                </div>

                {/* Big Total */}
                <div className="pt-3 pb-2 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#0C0A08] uppercase">
                    TOTAL ESTIMÉ HT
                  </span>
                  <span className="font-mono text-2xl font-black text-[#ED5B04]">
                    {totalPrice.toLocaleString("fr-FR")} €
                  </span>
                </div>

                <div className="text-[10px] text-[#78716C] text-center pt-2">
                  Code source 100 % à vous · Hébergement direct à votre nom
                </div>

                {/* Barcode SVG Deco */}
                <div className="pt-3 flex flex-col items-center">
                  <div className="w-48 h-8 flex items-center justify-between opacity-70">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <span
                        key={i}
                        className={`bg-[#0C0A08] h-full ${
                          i % 3 === 0 ? "w-1" : i % 2 === 0 ? "w-0.5" : "w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] tracking-[0.2em] text-[#78716C] mt-1">
                    BOUBANE-2026-VALEUR-DIRECTE
                  </span>
                </div>

                {/* Sawtooth / Zig-Zag Bottom Edge */}
                <div className="absolute -bottom-3 left-0 right-0 h-3 overflow-hidden leading-none pointer-events-none">
                  <svg
                    className="w-full h-full text-[#FFFDF9] fill-current"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <polygon points="0,0 5,12 10,0 15,12 20,0 25,12 30,0 35,12 40,0 45,12 50,0 55,12 60,0 65,12 70,0 75,12 80,0 85,12 90,0 95,12 100,0 105,12 110,0 115,12 120,0 125,12 130,0 135,12 140,0 145,12 150,0 155,12 160,0 165,12 170,0 175,12 180,0 185,12 190,0 195,12 200,0" />
                  </svg>
                </div>
              </div>

              {/* Action Buttons inside the Printer */}
              <div className="pt-2 space-y-2.5">
                <Link
                  href={orderUrl}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#ED5B04] text-white py-4 text-sm font-bold hover:bg-[#D64E00] active:scale-[0.98] transition-all shadow-[0_10px_28px_rgba(237,91,4,0.35)] cursor-pointer"
                >
                  <span>Commander mon projet ({totalPrice} € HT)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://rdv.boubane.com/boubane/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 text-white py-3 text-xs font-semibold hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <span>Valider ces choix en visio de 30 min</span>
                </a>
              </div>
            </div>

            {/* Reassurance note */}
            <div className="rounded-xl border border-[#E7E3DC] bg-white p-4 text-xs text-[#57534E] leading-relaxed shadow-sm">
              <strong className="text-[#0C0A08]">Zéro mauvaise surprise :</strong>{" "}
              Le montant total est garanti avant le début des travaux. Pas d&apos;acompte demandé à la commande, vous validez tout sur maquette.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
