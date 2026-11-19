"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  PhoneIncoming,
  RotateCcw,
} from "lucide-react";
import { AUTOMATION_MODULES, formatAmount } from "@/data/automations";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { cn } from "@/lib/utils";

type DemoId =
  | "assistant-mails"
  | "facturation-relances"
  | "assistant-vocal"
  | "tableau-bord";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

interface DemoMeta {
  id: DemoId;
  tabLabel: string;
  headline: string;
  bullets: [string, string];
}

const DEMOS: DemoMeta[] = [
  {
    id: "assistant-mails",
    tabLabel: "Assistant mails",
    headline: "Vos réponses prêtes chaque matin.",
    bullets: [
      "Trie les demandes de devis et relances.",
      "Rédige le brouillon : rien ne part sans votre clic.",
    ],
  },
  {
    id: "facturation-relances",
    tabLabel: "Facturation",
    headline: "Du devis signé à l'encaissement.",
    bullets: [
      "Facture générée automatiquement à la signature.",
      "Relances courtoises programmées sans y penser.",
    ],
  },
  {
    id: "assistant-vocal",
    tabLabel: "Assistant vocal",
    headline: "Zéro appel perdu sur chantier.",
    bullets: [
      "Décroche avec une voix naturelle en 2 secondes.",
      "Transcrit l'urgence et vous l'envoie par SMS.",
    ],
  },
  {
    id: "tableau-bord",
    tabLabel: "Tableau de bord",
    headline: "Vos chiffres clés en un regard.",
    bullets: [
      "Relie banque, devis et factures automatiquement.",
      "Trésorerie et encours lisibles sans tableur.",
    ],
  },
];

const PIPELINE_STEPS = [
  { label: "Devis signé", time: "10:12" },
  { label: "Facture émise auto", time: "10:13" },
  { label: "Relance courtoise J+7", time: "J+7" },
  { label: "Encaissé & lettré", time: "J+9" },
] as const;

function MailInteractiveDemo({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full max-w-[490px] rounded-[16px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_12px_32px_-16px_rgba(12,10,8,0.12)] overflow-hidden">
      {/* Incoming message */}
      <div className="px-5 py-4 border-b border-[#0C0A08]/[0.06] bg-[#FAF8F5]/70">
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#78716C]">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#0C0A08]/60" />
            <span>Entrant · 08:42</span>
          </span>
          <span className="rounded-full bg-[#FFF2E8] px-2 py-0.5 text-[10px] font-semibold text-[#ED5B04]">
            Prioritaire
          </span>
        </div>
        <div className="mt-1.5 text-[13.5px] font-semibold text-[#0C0A08]">
          M. Laurent · Demande devis toiture à Segré
        </div>
        <p className="mt-0.5 text-[12.5px] text-[#57534E]">
          « Bonjour, nous souhaitons refaire ~85 m² d&apos;ardoises début mars. Êtes-vous disponible pour passer voir ? »
        </p>
      </div>

      {/* Prepared draft */}
      <div className="p-5">
        <div className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#A8A29E] mb-2">
          Brouillon préparé par l&apos;assistant
        </div>
        <div className="rounded-[12px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] p-3.5 text-[12.5px] leading-relaxed text-[#0C0A08]/85">
          Bonjour M. Laurent, avec plaisir pour votre toiture à Segré. Je peux passer mardi à 14h30 ou jeudi à 10h pour prendre les côtes et établir le devis sous 48h.
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              <motion.button
                key="send"
                type="button"
                onClick={() => setSent(true)}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reducedMotion
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : {
                        opacity: 0,
                        y: -4,
                        transition: { duration: 0.11, ease: EASE_IN },
                      }
                }
                transition={{ duration: 0.16, ease: EASE_OUT }}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white px-5 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.97] cursor-pointer"
              >
                <span>Valider et envoyer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.div
                key="sent"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="flex items-center justify-between w-full gap-3"
              >
                <span className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#E6F8EE] border border-[#0E7541]/20 px-4 py-2 text-[13px] font-semibold text-[#0E7541]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: reducedMotion ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    />
                  </svg>
                  <span>Réponse envoyée</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="min-h-[44px] px-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rejouer</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function InvoicingInteractiveDemo({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const [activeStep, setActiveStep] = useState(1);
  const isComplete = activeStep >= PIPELINE_STEPS.length - 1;

  return (
    <div className="w-full max-w-[490px] rounded-[16px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_12px_32px_-16px_rgba(12,10,8,0.12)] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 pb-4 border-b border-[#0C0A08]/[0.07]">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#A8A29E]">
            Dossier automatisé
          </div>
          <div className="mt-1 text-[14px] font-semibold text-[#0C0A08]">
            Devis #204 · Charpente Renou
          </div>
        </div>
        <div className="font-mono text-[14px] font-bold text-[#0C0A08] tabular-nums">
          3&nbsp;450&nbsp;€&nbsp;HT
        </div>
      </div>

      {/* Clickable 4-step pipeline */}
      <div className="py-4 divide-y divide-[#0C0A08]/[0.06]">
        {PIPELINE_STEPS.map((step, idx) => {
          const isReached = idx <= activeStep;
          const isCurrent = idx === activeStep;
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => setActiveStep(idx)}
              className="w-full min-h-[44px] py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer group"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 transition-colors duration-200",
                    isReached
                      ? isComplete && idx === PIPELINE_STEPS.length - 1
                        ? "bg-[#E6F8EE] text-[#0E7541]"
                        : "bg-[#0C0A08] text-white"
                      : "border border-[#0C0A08]/20 text-[#A8A29E] group-hover:border-[#0C0A08]/45"
                  )}
                >
                  {isReached ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[13px] transition-colors",
                    isCurrent
                      ? "font-semibold text-[#0C0A08]"
                      : isReached
                        ? "font-medium text-[#0C0A08]/85"
                        : "text-[#78716C] group-hover:text-[#0C0A08]"
                  )}
                >
                  {step.label}
                </span>
              </span>

              <span className="font-mono text-[11px] text-[#A8A29E] tabular-nums shrink-0">
                {step.time}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            setActiveStep((prev) =>
              prev >= PIPELINE_STEPS.length - 1 ? 0 : prev + 1
            )
          }
          className={cn(
            "min-h-[44px] inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] cursor-pointer",
            isComplete
              ? "bg-[#FAF8F5] border border-[#0C0A08]/[0.12] text-[#0C0A08] hover:border-[#0C0A08]"
              : "bg-[#ED5B04] hover:bg-[#D64E00] text-white"
          )}
        >
          {isComplete ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rejouer</span>
            </>
          ) : (
            <>
              <span>Avancer l&apos;étape</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {isComplete && !reducedMotion && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[12px] font-mono font-medium text-[#0E7541]"
          >
            Dossier soldé sans intervention
          </motion.span>
        )}
      </div>
    </div>
  );
}

function VocalInteractiveDemo({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="w-full max-w-[490px] rounded-[16px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_12px_32px_-16px_rgba(12,10,8,0.12)] overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-[10px] bg-[#FAF8F5] border border-[#0C0A08]/[0.08] flex items-center justify-center text-[#0C0A08]">
              <PhoneIncoming className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[12px] font-mono text-[#78716C]">
                Appel manqué · 14:22 — Chantier en cours
              </div>
              <div className="text-[14px] font-semibold text-[#0C0A08]">
                Mme Bernard · Rénovation salle de bain · Segré
              </div>
            </div>
          </div>
          <span className="font-mono text-[11px] text-[#78716C] shrink-0">
            01:18
          </span>
        </div>

        <div className="rounded-[10px] bg-[#E6F8EE] border border-[#0E7541]/15 px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12px] font-medium text-[#0E7541]">
          <span>Résumé transmis par SMS &amp; WhatsApp</span>
          <Check className="w-3.5 h-3.5 shrink-0" />
        </div>

        <div className="text-[13px] text-[#57534E] leading-relaxed">
          <strong className="text-[#0C0A08]">Motif :</strong> fuite sous receveur, recherche un devis pour remplacement douche cette semaine. Numéro vérifié.
        </div>

        <div className="pt-1 border-t border-[#0C0A08]/[0.07]">
          <button
            type="button"
            aria-expanded={showTranscript}
            onClick={() => setShowTranscript((prev) => !prev)}
            className="min-h-[44px] w-full flex items-center justify-between gap-2 text-[12.5px] font-semibold text-[#0C0A08] hover:text-[#ED5B04] transition-colors cursor-pointer"
          >
            <span>
              {showTranscript
                ? "Masquer la transcription"
                : "Voir la transcription"}
            </span>
            <motion.span
              animate={{ rotate: showTranscript ? 180 : 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: EASE_OUT }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {showTranscript && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                animate={
                  reducedMotion
                    ? { opacity: 1, transition: { duration: 0.1 } }
                    : {
                        opacity: 1,
                        height: "auto",
                        transition: { duration: 0.22, ease: EASE_OUT },
                      }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0, transition: { duration: 0.08 } }
                    : {
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.11, ease: EASE_IN },
                      }
                }
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 space-y-2 text-[12px] leading-relaxed text-[#57534E]">
                  <p>
                    <span className="font-mono font-semibold text-[#0C0A08]">
                      Assistant :
                    </span>{" "}
                    « Bonjour, Léo est sur un chantier. Quel est votre besoin ? Je lui transmets tout de suite. »
                  </p>
                  <p>
                    <span className="font-mono font-semibold text-[#0C0A08]">
                      Mme Bernard :
                    </span>{" "}
                    « Bonjour, j&apos;ai une fuite sous la douche à Segré et j&apos;aimerais un devis pour refaire le receveur. »
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const KPI_DATA = {
  "30d": {
    ca: "27 900 €",
    devis: "14 200 €",
    temps: "26 h",
    linePath: "M 0 66 C 45 60, 80 48, 125 46 C 170 44, 210 26, 255 24 C 295 22, 325 12, 360 8",
    areaPath:
      "M 0 66 C 45 60, 80 48, 125 46 C 170 44, 210 26, 255 24 C 295 22, 325 12, 360 8 L 360 80 L 0 80 Z",
  },
  q: {
    ca: "81 400 €",
    devis: "36 800 €",
    temps: "78 h",
    linePath: "M 0 70 C 50 64, 95 58, 140 38 C 185 20, 225 32, 270 18 C 310 6, 335 10, 360 4",
    areaPath:
      "M 0 70 C 50 64, 95 58, 140 38 C 185 20, 225 32, 270 18 C 310 6, 335 10, 360 4 L 360 80 L 0 80 Z",
  },
} as const;

function DashboardInteractiveDemo({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const [period, setPeriod] = useState<"30d" | "q">("30d");
  const data = KPI_DATA[period];

  return (
    <div className="w-full max-w-[490px] rounded-[16px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_12px_32px_-16px_rgba(12,10,8,0.12)] p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[13.5px] font-semibold text-[#0C0A08]">
            Cockpit d&apos;activité
          </div>
          <div className="text-[11.5px] text-[#78716C]">
            Synchronisé banque &amp; devis
          </div>
        </div>

        {/* Segmented Period Toggle */}
        <div
          role="tablist"
          aria-label="Période du tableau de bord"
          className="inline-flex p-1 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08]"
        >
          {[
            { key: "30d" as const, label: "30 jours" },
            { key: "q" as const, label: "Trimestre" },
          ].map((item) => {
            const active = period === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(item.key)}
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-colors cursor-pointer",
                  active ? "text-white" : "text-[#57534E] hover:text-[#0C0A08]"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="demoPeriodPill"
                    transition={
                      reducedMotion
                        ? { duration: 0.1 }
                        : { type: "spring", bounce: 0, duration: 0.28 }
                    }
                    className="absolute inset-0 rounded-full bg-[#0C0A08]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[12px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] p-3">
          <div className="text-[11px] text-[#78716C]">CA encaissé</div>
          <div className="mt-1 font-mono text-[15px] sm:text-[17px] font-bold text-[#0C0A08] tabular-nums">
            {data.ca}
          </div>
        </div>
        <div className="rounded-[12px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] p-3">
          <div className="text-[11px] text-[#78716C]">Devis en cours</div>
          <div className="mt-1 font-mono text-[15px] sm:text-[17px] font-bold text-[#0C0A08] tabular-nums">
            {data.devis}
          </div>
        </div>
        <div className="rounded-[12px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] p-3">
          <div className="text-[11px] text-[#78716C]">Temps gagné</div>
          <div className="mt-1 font-mono text-[15px] sm:text-[17px] font-bold text-[#0E7541] tabular-nums">
            {data.temps}
          </div>
        </div>
      </div>

      {/* Crisp SVG Trend Curve */}
      <div className="pt-1">
        <svg
          viewBox="0 0 360 80"
          className="w-full h-20 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cockpitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(237, 91, 4, 0.16)" />
              <stop offset="100%" stopColor="rgba(237, 91, 4, 0)" />
            </linearGradient>
          </defs>
          <motion.path
            d={data.areaPath}
            fill="url(#cockpitFill)"
            animate={{ d: data.areaPath }}
            transition={{ duration: reducedMotion ? 0.1 : 0.35, ease: EASE_OUT }}
          />
          <motion.path
            d={data.linePath}
            fill="none"
            stroke="#ED5B04"
            strokeWidth="2.25"
            strokeLinecap="round"
            animate={{ d: data.linePath }}
            transition={{ duration: reducedMotion ? 0.1 : 0.35, ease: EASE_OUT }}
          />
        </svg>
      </div>
    </div>
  );
}

export function AtelierLiveDemosSection() {
  const prefersReducedMotion = !!useReducedMotion();
  const [activeTab, setActiveTab] = useState<DemoId>("assistant-mails");
  const [addedFeedbackMap, setAddedFeedbackMap] = useState<
    Partial<Record<DemoId, boolean>>
  >({});

  const activeMeta = DEMOS.find((d) => d.id === activeTab) || DEMOS[0];
  const activeModule = AUTOMATION_MODULES.find((m) => m.id === activeTab);

  const handleAddToTicket = () => {
    window.dispatchEvent(
      new CustomEvent("boubane:select-module", { detail: { id: activeTab } })
    );
    setAddedFeedbackMap((prev) => ({ ...prev, [activeTab]: true }));

    document
      .getElementById("configurateur")
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      id="apercu"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <AtelierReveal className="max-w-2xl mb-10 sm:mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            APERÇU INTERACTIF
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.9rem,3.6vw,2.65rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Testez vos automatisations en direct.
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.65] text-[#57534E] max-w-[50ch]">
            Chaque brique se branche sur vos outils existants et reste entièrement sous votre contrôle.
          </p>
        </AtelierReveal>

        {/* Hairline Tab Navigation */}
        <div
          role="tablist"
          aria-label="Aperçu des automatisations IA"
          className="flex flex-wrap items-center gap-1 sm:gap-6 border-b border-[#0C0A08]/[0.09]"
        >
          {DEMOS.map((demo) => {
            const active = activeTab === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(demo.id)}
                className={cn(
                  "min-h-[44px] relative px-2 sm:px-0 py-3 text-[13.5px] sm:text-[14px] font-medium cursor-pointer transition-colors",
                  active
                    ? "text-[#0C0A08]"
                    : "text-[#78716C] hover:text-[#0C0A08]"
                )}
              >
                <span>{demo.tabLabel}</span>
                {active && (
                  <motion.span
                    layoutId="liveDemoUnderline"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: "spring", bounce: 0, duration: 0.3 }
                    }
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[#0C0A08]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Single Clean Framed Stage */}
        <div className="mt-8 rounded-[22px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_20px_50px_-24px_rgba(12,10,8,0.1)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Explanation Column */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFDF9] border-b lg:border-b-0 lg:border-r border-[#0C0A08]/[0.07]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#78716C]">
                {activeModule ? formatAmount(activeModule.price) : "390"}&nbsp;€ · Prix fixe
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-jakarta)] text-[1.4rem] sm:text-[1.55rem] font-bold tracking-[-0.03em] leading-[1.15] text-[#0C0A08]">
                {activeMeta.headline}
              </h3>
              <ul className="mt-5 space-y-2.5 text-[13.5px] text-[#57534E]">
                {activeMeta.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#0C0A08]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-[#0C0A08]/[0.07]">
              <button
                type="button"
                onClick={handleAddToTicket}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0C0A08] hover:bg-[#ED5B04] text-white px-5 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.97] cursor-pointer"
              >
                {addedFeedbackMap[activeTab] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté au ticket</span>
                  </>
                ) : (
                  <>
                    <span>Ajouter à mon ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Interactive Sandbox */}
          <div className="lg:col-span-8 p-5 sm:p-8 lg:p-10 bg-[#FAF8F5]/60 flex items-center justify-center min-h-[340px] sm:min-h-[370px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8 }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: prefersReducedMotion ? 0.1 : 0.22,
                    ease: EASE_OUT,
                  },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.08 } }
                    : {
                        opacity: 0,
                        y: -6,
                        transition: { duration: 0.11, ease: EASE_IN },
                      }
                }
                className="w-full flex justify-center"
              >
                {activeTab === "assistant-mails" && (
                  <MailInteractiveDemo reducedMotion={prefersReducedMotion} />
                )}
                {activeTab === "facturation-relances" && (
                  <InvoicingInteractiveDemo
                    reducedMotion={prefersReducedMotion}
                  />
                )}
                {activeTab === "assistant-vocal" && (
                  <VocalInteractiveDemo reducedMotion={prefersReducedMotion} />
                )}
                {activeTab === "tableau-bord" && (
                  <DashboardInteractiveDemo
                    reducedMotion={prefersReducedMotion}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
