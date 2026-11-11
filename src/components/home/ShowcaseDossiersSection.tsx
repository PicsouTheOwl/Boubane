"use client";

import React, { useState } from "react";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { cn } from "@/lib/utils";

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  liveUrl?: string;
  iframeSrc: string;
  stat: string;
}

const SHOWCASES: ShowcaseItem[] = [
  {
    id: "astra",
    title: "Astravacances",
    subtitle: "Tourisme · Réservations en direct sans commission Booking ni Airbnb.",
    url: "astravacances.fr",
    liveUrl: "https://www.astravacances.fr/",
    iframeSrc: "/showcase-astra.html",
    stat: "0 % de commission",
  },
  {
    id: "artisanat",
    title: "Artisans du Haut-Anjou",
    subtitle: "Artisanat & BTP · Photos de chantiers réelles et devis direct en deux clics.",
    url: "artisan-haut-anjou.fr",
    iframeSrc: "/showcase-votre-site.html",
    stat: "Ouvert en < 0,3 s",
  },
];

export function ShowcaseDossiersSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const current = SHOWCASES[activeIdx];

  return (
    <section
      id="realisations"
      className="relative py-24 sm:py-32 bg-[#FAF8F5] text-[#0C0A08] border-t border-[#0C0A08]/[0.07] overflow-hidden"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        {/* Top Row: Boubane Craft Mascot + Clear Positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 sm:mb-24">
          <AtelierReveal className="lg:col-span-6">
            <div className="relative flex items-center justify-center py-4">
              <img
                src="/images/cat-savoir-faire.png"
                alt="Mascotte chat Boubane avec lunettes dessinant une maquette de site web"
                width={720}
                height={720}
                className="relative z-10 w-60 sm:w-72 lg:w-80 h-auto object-contain drop-shadow-[0_18px_32px_rgba(237,91,4,0.14)]"
                loading="lazy"
              />
            </div>
          </AtelierReveal>

          <AtelierReveal delay={0.06} className="lg:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              Pensé pour le terrain
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Un site qui vous ressemble, avant même le premier appel.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-[1.68] text-[#57534E] max-w-[44ch]">
              Vos futurs clients cherchent quelqu&apos;un de sérieux près de chez eux. Une vitrine
              claire montre immédiatement votre savoir-faire, avec de vraies images et sans bla-bla.
            </p>
            <div className="mt-8 pt-6 border-t border-[#0C0A08]/[0.1] flex flex-wrap gap-8">
              <div>
                <div className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-[#0C0A08] tabular-nums">
                  &lt; 0,3 s
                </div>
                <div className="text-xs text-[#57534E] mt-0.5">Ouverture sur 4G</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-[#ED5B04] tabular-nums">
                  5 jours
                </div>
                <div className="text-xs text-[#57534E] mt-0.5">Pour la mise en ligne</div>
              </div>
            </div>
          </AtelierReveal>
        </div>

        {/* Bottom Row: Interactive Live Site Preview Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#57534E]">
              Démos interactives en direct
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
              {current.title}{" "}
              <span className="text-[#ED5B04] font-normal">— {current.stat}</span>
            </h3>
            <p className="mt-1.5 text-sm text-[#57534E]">{current.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Choisir une démonstration"
              className="inline-flex p-1 rounded-full bg-white border border-[#0C0A08]/[0.1]"
            >
              {SHOWCASES.map((item, idx) => (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={activeIdx === idx}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer min-h-[38px]",
                    activeIdx === idx
                      ? "bg-[#ED5B04] text-white"
                      : "text-[#57534E] hover:text-[#0C0A08]"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="inline-flex p-1 rounded-full bg-white border border-[#0C0A08]/[0.1]">
              <button
                type="button"
                aria-label="Aperçu ordinateur"
                onClick={() => setViewport("desktop")}
                className={cn(
                  "p-2 rounded-full transition-colors cursor-pointer",
                  viewport === "desktop" ? "bg-[#ED5B04] text-white" : "text-[#57534E] hover:text-[#0C0A08]"
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Aperçu téléphone"
                onClick={() => setViewport("mobile")}
                className={cn(
                  "p-2 rounded-full transition-colors cursor-pointer",
                  viewport === "mobile" ? "bg-[#ED5B04] text-white" : "text-[#57534E] hover:text-[#0C0A08]"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className={cn(
              "w-full rounded-2xl border border-[#0C0A08]/[0.1] bg-white overflow-hidden shadow-[0_24px_60px_-15px_rgba(12,10,8,0.1)] transition-all duration-300",
              viewport === "mobile" ? "max-w-[375px]" : "max-w-full"
            )}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#0C0A08]/[0.08] bg-[#FAF8F5]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0C0A08]/15" />
              </div>
              <span className="font-mono text-[11px] text-[#57534E] truncate">
                https://{current.url}
              </span>
              {current.liveUrl ? (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#ED5B04] hover:text-[#0C0A08] transition-colors shrink-0"
                >
                  <span>Visiter</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="font-mono text-[10px] text-[#0C0A08]/35">APERÇU</span>
              )}
            </div>

            <div className="h-[380px] sm:h-[480px] bg-white">
              <iframe
                key={current.iframeSrc}
                src={current.iframeSrc}
                title={`Site réel : ${current.title}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
