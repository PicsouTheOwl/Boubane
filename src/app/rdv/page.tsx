"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";

type CalFn = ((...args: unknown[]) => void) & {
  q?: unknown[];
  ns?: Record<string, CalFn>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

export default function RdvPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [embedReady, setEmbedReady] = useState(false);

  useEffect(() => {
    const win = window;
    const calOrigin = "https://rdv.boubane.com";
    const scriptSrc = `${calOrigin}/embed/embed.js`;

    const initCal = () => {
      if (!win.Cal) {
        const cal: CalFn = (...args: unknown[]) => {
          cal.q = cal.q || [];
          cal.q.push(args);
        };
        cal.ns = {};
        cal.q = [];
        win.Cal = cal;
      }

      if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.async = true;
        script.onload = () => setEmbedReady(true);
        document.head.appendChild(script);
      } else {
        setEmbedReady(true);
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      win.Cal("init", "boubane-rdv", { origin: calOrigin });
      win.Cal.ns?.["boubane-rdv"]?.("inline", {
        elementOrSelector: "#boubane-cal-embed",
        calLink: "boubane",
        config: {
          layout: "month_view",
          theme: "light",
        },
      });
      win.Cal.ns?.["boubane-rdv"]?.("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#ED5B04",
            "cal-brand-emphasis": "#D64E00",
            "cal-brand-text": "#FFFFFF",
            "cal-text": "#0C0A08",
            "cal-text-emphasis": "#0C0A08",
            "cal-bg": "#FFFFFF",
            "cal-bg-emphasis": "#FAF8F5",
            "cal-border": "#E7E3DC",
          },
        },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    };

    initCal();
    const fallbackTimer = window.setTimeout(() => setEmbedReady(true), 1800);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-14 pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
          <AtelierReveal className="max-w-3xl mb-10 sm:mb-12">
            <EyebrowBadge index="RENDEZ-VOUS">Appel Découverte · 10 min</EyebrowBadge>
            <h1 className="mt-5 font-[family-name:var(--font-jakarta)] text-[clamp(2.1rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Choisissez votre créneau en direct
              <span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.03rem] leading-[1.6] text-[#57534E] max-w-[56ch]">
              Un échange court et concret avec Léo Saillour pour faire le point sur votre
              activité et lancer votre maquette sur-mesure sous 5 jours ouvrés.
            </p>
          </AtelierReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Atelier Info Column */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <SpecularPlate dark className="p-7 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/images/leo-artisan-desk.jpg"
                    alt="Léo Saillour — Studio Boubane"
                    width={160}
                    height={160}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15 shrink-0"
                  />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
                      STUDIO BOUBANE
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">Léo Saillour</div>
                    <div className="text-xs text-white/60">Concepteur web · Haut-Anjou</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/60">
                      <Clock className="w-3.5 h-3.5 text-[#ED5B04]" />
                      <span>DURÉE</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">10 minutes</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/60">
                      <Video className="w-3.5 h-3.5 text-[#ED5B04]" />
                      <span>FORMAT</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">Tél ou Visio</div>
                  </div>
                </div>

                <div className="space-y-3 pt-1 border-t border-white/[0.08]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                    AU PROGRAMME
                  </div>
                  <ul className="space-y-2.5 text-xs text-white/80">
                    <li className="flex items-start gap-2.5">
                      <span className="font-mono text-[#ED5B04] font-semibold">01</span>
                      <span>Votre métier, votre zone et vos clients cibles</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-mono text-[#ED5B04] font-semibold">02</span>
                      <span>Structure et style de votre future vitrine (0 €)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-mono text-[#ED5B04] font-semibold">03</span>
                      <span>Planning de livraison sous 5 jours ouvrés</span>
                    </li>
                  </ul>
                </div>
              </SpecularPlate>

              <SpecularPlate tilt={false} className="p-6 bg-white space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                  CONTACT DIRECT
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+33778310346"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>07 78 31 03 46</span>
                  </a>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp direct</span>
                  </a>
                  <a
                    href="mailto:leo@boubane.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0C0A08]/70" />
                    <span>leo@boubane.com</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-[#0C0A08]/[0.06] flex items-center justify-between text-[11px] text-[#57534E]">
                  <Link
                    href="/commander"
                    className="inline-flex items-center gap-1 hover:text-[#0C0A08] transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Brief express</span>
                  </Link>
                  <a
                    href="https://rdv.boubane.com/boubane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#ED5B04] transition-colors"
                  >
                    <span>Ouvrir plein écran</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </SpecularPlate>
            </div>

            {/* Right Cal.com Embedded Calendar */}
            <div className="lg:col-span-8">
              <SpecularPlate tilt={false} crosshairs className="p-4 sm:p-6 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#0C0A08]/[0.07]">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60">
                    <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>AGENDA EN TEMPS RÉEL · FUSEAU EUROPE/PARIS</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] px-3 py-1 font-mono text-[11px] text-[#0C0A08]">
                    <Sparkles className="w-3 h-3 text-[#ED5B04]" />
                    <span>Créneau offert</span>
                  </span>
                </div>

                {!embedReady && (
                  <div className="py-20 text-center space-y-3">
                    <div className="mx-auto w-8 h-8 rounded-full border-2 border-[#0C0A08]/15 border-t-[#ED5B04] animate-spin" />
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#57534E]">
                      Chargement des disponibilités...
                    </p>
                  </div>
                )}

                <div
                  id="boubane-cal-embed"
                  ref={containerRef}
                  className="w-full min-h-[560px] rounded-xl overflow-hidden"
                />
              </SpecularPlate>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

