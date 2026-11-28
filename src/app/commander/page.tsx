"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Hammer,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SlidersHorizontal,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { AtelierModuleList } from "@/components/AtelierModuleList";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";
import { ATELIER_SPRING } from "@/lib/utils";
import { AUTOMATION_MODULES, formatAmount } from "@/data/automations";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

const TRADES = [
  {
    short: "Artisan & BTP",
    value: "Artisan / BTP (Menuisier, Couvreur, Maçon…)",
    icon: Hammer,
  },
  {
    short: "Tourisme & Gîte",
    value: "Tourisme / Gîte / Hôtellerie",
    icon: BedDouble,
  },
  {
    short: "Cabinet & Libéral",
    value: "Profession Libérale / Cabinet",
    icon: Briefcase,
  },
  {
    short: "Commerce & Table",
    value: "Commerce Local / Domaine / Table",
    icon: Store,
  },
  {
    short: "PME & Services",
    value: "PME Industrielle / Services B2B",
    icon: Building2,
  },
  {
    short: "Autre activité",
    value: "Autre activité locale ou indépendante",
    icon: Sparkles,
  },
] as const;

const SITUATIONS = [
  {
    short: "Pas encore de site",
    value: "Je n'ai pas encore de site web",
  },
  {
    short: "Site vieillissant",
    value: "Mon site actuel est lent ou vieillissant",
  },
  {
    short: "Agence trop chère",
    value: "Je paye trop cher une agence / un abonnement",
  },
  {
    short: "Nouvelle activité",
    value: "Je veux lancer une nouvelle activité",
  },
] as const;

const STEPS_META = [
  { id: 1 as const, label: "Activité" },
  { id: 2 as const, label: "Coordonnées" },
  { id: 3 as const, label: "Validation" },
];

const VALID_OPTIONAL_MODULE_IDS = new Set(
  AUTOMATION_MODULES.filter((m) => m.id !== "site-web").map((m) => m.id)
);

function parseModulesFromParams(rawModules: string | null): string[] {
  if (!rawModules) return ["site-web"];
  const seen = new Set<string>();
  const matched: string[] = [];
  for (const part of rawModules.split(",")) {
    const id = part.trim();
    if (VALID_OPTIONAL_MODULE_IDS.has(id) && !seen.has(id)) {
      seen.add(id);
      matched.push(id);
    }
  }
  return ["site-web", ...matched];
}

type StepTransitionCustom = {
  direction: number;
  reduced: boolean;
};

const STEP_VARIANTS = {
  enter: ({ direction, reduced }: StepTransitionCustom) =>
    reduced ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 14 : -14 },
  center: ({ reduced }: StepTransitionCustom) => ({
    opacity: 1,
    x: 0,
    transition: reduced
      ? { duration: 0.1 }
      : { duration: 0.2, ease: EASE_OUT },
  }),
  exit: ({ direction, reduced }: StepTransitionCustom) =>
    reduced
      ? { opacity: 0, transition: { duration: 0.08 } }
      : {
          opacity: 0,
          x: direction > 0 ? -14 : 14,
          transition: { duration: 0.1, ease: EASE_IN },
        },
};

declare global {
  interface Window {
    boubaneRegisterLead?: (lead: {
      name: string;
      email: string;
      message: string;
    }) => void;
    BoubaneAnalytics?: {
      track: (name: string, details?: Record<string, unknown>) => void;
    };
  }
}

function CommanderContent() {
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() =>
    parseModulesFromParams(searchParams.get("modules"))
  );
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  const [trade, setTrade] = useState<string>(TRADES[0].value);
  const [situation, setSituation] = useState<string>(SITUATIONS[0].value);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedModuleIds(parseModulesFromParams(searchParams.get("modules")));
  }, [searchParams]);

  useEffect(() => {
    if (!isModuleModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModuleModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModuleModalOpen]);

  const toggleModule = (id: string) => {
    if (id === "site-web") return;
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectedModules = AUTOMATION_MODULES.filter((m) =>
    selectedModuleIds.includes(m.id)
  );
  const totalPrice = selectedModules.reduce((acc, m) => acc + m.price, 0);

  const selectedTradeShort =
    TRADES.find((t) => t.value === trade)?.short ?? trade;
  const selectedSituationShort =
    SITUATIONS.find((s) => s.value === situation)?.short ?? situation;

  const goToStep = (next: 1 | 2 | 3) => {
    setErrorMsg("");
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNextFromStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    if (!name.trim() || !company.trim() || (!cleanEmail && !cleanPhone)) {
      setErrorMsg(
        "Indiquez votre nom, votre entreprise et un e-mail ou téléphone."
      );
      return;
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("L'adresse e-mail saisie semble invalide.");
      return;
    }
    setErrorMsg("");
    goToStep(3);
  };

  const buildBriefText = () => {
    const modulesText = selectedModules
      .map(
        (m) =>
          `  • ${m.name} (${m.price === 0 ? "0 € - Offert" : `${formatAmount(m.price)} € HT`})`
      )
      .join("\n");

    return `[PROJET ATELIER BOUBANE]\n• Entreprise : ${company}${city ? ` (${city})` : ""}\n• Profil : ${trade}\n• Situation : ${situation}\n• Modules retenus :\n${modulesText}\n• Total investissement : ${formatAmount(totalPrice)} € HT\n• Téléphone : ${
      phone || "Non renseigné"
    }\n• Email : ${email || "Non renseigné"}\n• Message : ${
      details || "Aucun détail supplémentaire"
    }`;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const fullMessage = buildBriefText();

    if (
      typeof window !== "undefined" &&
      typeof window.boubaneRegisterLead === "function"
    ) {
      window.boubaneRegisterLead({
        name: `${name} (${company})`,
        email: email || `${phone}@whatsapp.boubane.com`,
        message: fullMessage,
      });
    }

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "commande",
          name,
          company,
          email,
          phone,
          city,
          craft: trade,
          situation,
          modules: selectedModules.map((m) => m.name),
          totalPrice,
          message: fullMessage,
          website: honeypot,
        }),
      });
    } catch {
      // Direct confirmation links remain available on completion screen
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const whatsappBriefUrl = `https://wa.me/33778310346?text=${encodeURIComponent(
    `Bonjour Léo, voici mon brief configuré sur Boubane :\nNom : ${name}\nEntreprise : ${company}${
      city ? ` (${city})` : ""
    }\nModules : ${selectedModules.map((m) => m.name).join(", ")}\nTotal estimé : ${formatAmount(totalPrice)} € HT\nSecteur : ${selectedTradeShort}${
      details ? `\nPrécisions : ${details}` : ""
    }`
  )}`;

  const mailtoBriefUrl = `mailto:leo@boubane.com?subject=${encodeURIComponent(
    `Demande de projet Boubane — ${company || name}`
  )}&body=${encodeURIComponent(buildBriefText())}`;

  const stepCustom: StepTransitionCustom = {
    direction,
    reduced: prefersReducedMotion,
  };

  return (
    <div className="min-h-[100svh] lg:h-[100dvh] lg:overflow-y-auto flex flex-col justify-between bg-[#FAF8F5] text-[#0C0A08]">
      {/* Slim Zero-Scroll Checkout Top Bar */}
      <header className="relative z-20 shrink-0 border-b border-[#0C0A08]/[0.07] bg-[#FAF8F5]/90 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto max-w-[1120px] h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/#configurateur"
              className="min-h-[44px] px-2.5 -ml-2 rounded-full inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#57534E] hover:text-[#0C0A08] hover:bg-[#0C0A08]/[0.04] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <span
              aria-hidden="true"
              className="h-4 w-px bg-[#0C0A08]/[0.1] hidden sm:block"
            />
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center gap-2 font-extrabold tracking-[-0.03em] text-[0.95rem] text-[#0C0A08]"
            >
              <img
                src="/assets/boubane-logo.png"
                alt="Boubane"
                width={22}
                height={22}
                className="w-[22px] h-[22px] rounded-[6px] object-contain"
              />
              <span className="hidden sm:inline">BOUBANE</span>
            </Link>
          </div>

          {/* Inline Minimalist Stepper */}
          {!submitted ? (
            <nav
              aria-label="Progression"
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-white border border-[#0C0A08]/[0.08] rounded-full p-1 shadow-[0_1px_2px_rgba(12,10,8,0.03)]"
            >
              {STEPS_META.map((item) => {
                const isActive = step === item.id;
                const isDone = step > item.id;
                const canClick = item.id < step;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!canClick}
                    onClick={() => canClick && goToStep(item.id)}
                    className={`relative min-h-[30px] px-2.5 sm:px-3.5 rounded-full text-[11.5px] font-medium transition-colors flex items-center gap-1.5 ${
                      canClick ? "cursor-pointer" : "cursor-default"
                    } ${
                      isActive
                        ? "text-white font-semibold"
                        : isDone
                          ? "text-[#0C0A08] hover:text-[#ED5B04]"
                          : "text-[#A8A29E]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="checkoutHeaderStepPill"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.1 }
                            : { type: "spring", bounce: 0, duration: 0.28 }
                        }
                        className="absolute inset-0 rounded-full bg-[#0C0A08]"
                      />
                    )}
                    <span className="relative z-10 font-mono text-[10px] opacity-75">
                      0{item.id}
                    </span>
                    <span
                      className={`relative z-10 ${
                        isActive ? "inline" : "hidden sm:inline"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          ) : (
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0E7541]">
              Demande confirmée
            </span>
          )}

          {/* Direct Reassurance / Help */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline font-mono text-[11px] text-[#78716C]">
              Sans acompte
            </span>
            <Link
              href="/rdv"
              className="min-h-[36px] px-3 rounded-full border border-[#0C0A08]/[0.1] bg-white hover:border-[#0C0A08]/30 text-[12px] font-medium text-[#0C0A08] inline-flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
              <span className="hidden sm:inline">Besoin d&apos;aide ?</span>
              <span className="sm:hidden">RDV</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Workspace */}
      <main className="relative z-10 flex-1 flex items-center py-3 sm:py-5 lg:py-4">
        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* Mobile Compact Ticket Pill (replaces tall receipt stack on phones for zero scroll) */}
          {!submitted && (
            <div className="mb-3 lg:hidden rounded-2xl bg-white border border-[#0C0A08]/[0.08] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_-6px_rgba(12,10,8,0.06)]">
              <div className="min-w-0 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                <span className="text-[12.5px] font-medium text-[#0C0A08] truncate">
                  {selectedModules.length === 1
                    ? "Site vitrine"
                    : `Site + ${selectedModules.length - 1} option${
                        selectedModules.length > 2 ? "s" : ""
                      }`}
                </span>
                <span className="font-mono text-[12.5px] font-bold text-[#0C0A08] tabular-nums shrink-0">
                  · {totalPrice === 0 ? "0 €" : `${formatAmount(totalPrice)} € HT`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(true)}
                className="min-h-[40px] -my-0.5 px-3 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.09] text-[11.5px] font-semibold text-[#0C0A08] inline-flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#ED5B04]" />
                <span>Options</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Focused Step Card */}
            <div className={submitted ? "lg:col-span-12 max-w-xl mx-auto w-full" : "lg:col-span-7"}>
              <div className="rounded-[24px] border border-[#0C0A08]/[0.08] bg-white p-5 sm:p-7 shadow-[0_18px_44px_-20px_rgba(12,10,8,0.09)] overflow-hidden">
                {!submitted ? (
                  <div className="relative overflow-hidden">
                    <AnimatePresence
                      mode="popLayout"
                      custom={stepCustom}
                      initial={false}
                    >
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          custom={stepCustom}
                          variants={STEP_VARIANTS}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="space-y-5"
                        >
                          <div>
                            <h1 className="font-[family-name:var(--font-jakarta)] text-[1.4rem] sm:text-[1.65rem] font-extrabold tracking-[-0.035em] leading-[1.12] text-[#0C0A08]">
                              Parlez-nous de votre activité
                              <span className="text-[#ED5B04]">.</span>
                            </h1>
                            <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#57534E]">
                              Deux clics pour adapter votre projet. Réponse directe sous 24h.
                            </p>
                          </div>

                          {/* Secteur (Compact 3x2 Desktop / 2x3 Mobile) */}
                          <div>
                            <label className="block text-[12px] font-semibold text-[#57534E] mb-2">
                              Votre secteur
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {TRADES.map((item) => {
                                const Icon = item.icon;
                                const selected = trade === item.value;
                                return (
                                  <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setTrade(item.value)}
                                    className={`group min-h-[46px] px-3 py-2.5 rounded-xl border text-left text-[13px] font-medium transition-all duration-150 cursor-pointer active:scale-[0.98] flex items-center gap-2.5 ${
                                      selected
                                        ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                        : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/75 text-[#0C0A08] hover:border-[#0C0A08]/25 hover:bg-white"
                                    }`}
                                  >
                                    <Icon
                                      className={`w-4 h-4 shrink-0 transition-colors ${
                                        selected
                                          ? "text-[#ED5B04]"
                                          : "text-[#78716C] group-hover:text-[#0C0A08]"
                                      }`}
                                      strokeWidth={1.8}
                                    />
                                    <span className="truncate leading-tight">
                                      {item.short}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Situation (Compact 2x2) */}
                          <div>
                            <label className="block text-[12px] font-semibold text-[#57534E] mb-2">
                              Situation actuelle
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {SITUATIONS.map((item) => {
                                const selected = situation === item.value;
                                return (
                                  <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setSituation(item.value)}
                                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-left text-[13px] font-medium transition-all duration-150 cursor-pointer active:scale-[0.98] flex items-center justify-between gap-2 ${
                                      selected
                                        ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                        : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/75 text-[#0C0A08]/85 hover:border-[#0C0A08]/25 hover:bg-white"
                                    }`}
                                  >
                                    <span className="truncate leading-tight">
                                      {item.short}
                                    </span>
                                    {selected && (
                                      <Check
                                        className="w-3.5 h-3.5 shrink-0 text-[#ED5B04]"
                                        strokeWidth={2.5}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#0C0A08]/[0.07] flex items-center justify-between gap-3">
                            <span className="text-[12px] text-[#78716C] hidden sm:inline">
                              Sans engagement · Code 100 % à vous
                            </span>
                            <button
                              type="button"
                              onClick={() => goToStep(2)}
                              className="w-full sm:w-auto sm:ml-auto justify-center inline-flex items-center gap-2 rounded-full bg-[#0C0A08] hover:bg-[#1E1A16] text-white min-h-[44px] px-6 py-2.5 text-[13.5px] font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer"
                            >
                              <span>Continuer</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.form
                          key="step2"
                          custom={stepCustom}
                          variants={STEP_VARIANTS}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          onSubmit={handleNextFromStep2}
                          className="space-y-4"
                        >
                          <div>
                            <h1 className="font-[family-name:var(--font-jakarta)] text-[1.4rem] sm:text-[1.65rem] font-extrabold tracking-[-0.035em] leading-[1.12] text-[#0C0A08]">
                              Où vous recontacter
                              <span className="text-[#ED5B04]"> ?</span>
                            </h1>
                            <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#57534E]">
                              Léo vous répond personnellement sous 24h ouvrées.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label
                                htmlFor="commander-name"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Votre nom *
                              </label>
                              <input
                                id="commander-name"
                                type="text"
                                autoComplete="name"
                                enterKeyHint="next"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jean Dupont"
                                className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="commander-company"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Entreprise *
                              </label>
                              <input
                                id="commander-company"
                                type="text"
                                autoComplete="organization"
                                enterKeyHint="next"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Atelier Dupont"
                                className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label
                                htmlFor="commander-email"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Email professionnel *
                              </label>
                              <input
                                id="commander-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect="off"
                                enterKeyHint="next"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="contact@entreprise.fr"
                                className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="commander-phone"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Téléphone direct
                              </label>
                              <input
                                id="commander-phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                enterKeyHint="next"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="06 00 00 00 00"
                                className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label
                                htmlFor="commander-city"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Ville (facultatif)
                              </label>
                              <div className="relative">
                                <MapPin className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  id="commander-city"
                                  type="text"
                                  autoComplete="address-level2"
                                  enterKeyHint="next"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  placeholder="Segré, Angers..."
                                  className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 pl-9 pr-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="commander-details"
                                className="block text-[11.5px] font-medium text-[#57534E] mb-1"
                              >
                                Outils ou note (facultatif)
                              </label>
                              <input
                                id="commander-details"
                                type="text"
                                enterKeyHint="done"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Outlook, Gmail, Pennylane..."
                                className="w-full h-[44px] rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-3.5 text-base sm:text-[14px] text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                              />
                              <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                className="hidden"
                                aria-hidden="true"
                              />
                            </div>
                          </div>

                          {errorMsg && (
                            <div className="rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/20 px-3.5 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                              {errorMsg}
                            </div>
                          )}

                          <div className="pt-3 border-t border-[#0C0A08]/[0.07] flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => goToStep(1)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] min-h-[44px] px-4 py-2 text-[13px] font-semibold hover:border-[#0C0A08] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Retour</span>
                            </button>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] hover:bg-[#1E1A16] text-white min-h-[44px] px-6 py-2.5 text-[13.5px] font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer"
                            >
                              <span>Vérifier</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          custom={stepCustom}
                          variants={STEP_VARIANTS}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="space-y-4"
                        >
                          <div>
                            <h1 className="font-[family-name:var(--font-jakarta)] text-[1.4rem] sm:text-[1.65rem] font-extrabold tracking-[-0.035em] leading-[1.12] text-[#0C0A08]">
                              Prêt à lancer votre projet
                              <span className="text-[#ED5B04]">.</span>
                            </h1>
                            <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#57534E]">
                              Aucun paiement aujourd&apos;hui. Appel de cadrage de 15 min sous 24h.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[#FAF8F5]/85 border border-[#0C0A08]/[0.08] p-4 space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                              <div className="min-w-0">
                                <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#78716C]">
                                  Contact
                                </div>
                                <div className="font-semibold text-[#0C0A08] truncate mt-0.5">
                                  {name} · {company}
                                  {city ? ` (${city})` : ""}
                                </div>
                                <div className="text-[12px] text-[#57534E] truncate">
                                  {[email, phone].filter(Boolean).join(" · ")}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#78716C]">
                                  Activité
                                </div>
                                <div className="font-semibold text-[#0C0A08] truncate mt-0.5">
                                  {selectedTradeShort}
                                </div>
                                <div className="text-[12px] text-[#57534E] truncate">
                                  {selectedSituationShort}
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#0C0A08]/[0.07] flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12.5px] font-semibold text-[#0C0A08]">
                                    {selectedModules.length} module
                                    {selectedModules.length > 1 ? "s" : ""} retenu
                                    {selectedModules.length > 1 ? "s" : ""}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setIsModuleModalOpen(true)}
                                    className="text-[11.5px] font-medium text-[#57534E] hover:text-[#0C0A08] underline underline-offset-2 cursor-pointer"
                                  >
                                    Modifier
                                  </button>
                                </div>
                                <div className="text-[12px] text-[#57534E] truncate mt-0.5">
                                  {selectedModules.map((m) => m.name).join(" · ")}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="font-mono text-[19px] font-extrabold tracking-[-0.02em] text-[#0C0A08] tabular-nums">
                                  {totalPrice === 0
                                    ? "0 €"
                                    : `${formatAmount(totalPrice)} € HT`}
                                </div>
                                <div className="text-[10.5px] text-[#0E7541] font-medium">
                                  Sans abonnement
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Compact 3-pill timeline */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-[#FAF8F5] border border-[#0C0A08]/[0.06] px-2 py-2">
                              <div className="font-mono text-[11px] font-bold text-[#0C0A08]">
                                Sous 24h
                              </div>
                              <div className="text-[11px] text-[#57534E] truncate">
                                Cadrage 15 min
                              </div>
                            </div>
                            <div className="rounded-xl bg-[#FAF8F5] border border-[#0C0A08]/[0.06] px-2 py-2">
                              <div className="font-mono text-[11px] font-bold text-[#0C0A08]">
                                5 jours
                              </div>
                              <div className="text-[11px] text-[#57534E] truncate">
                                Mise en ligne
                              </div>
                            </div>
                            <div className="rounded-xl bg-[#FAF8F5] border border-[#0C0A08]/[0.06] px-2 py-2">
                              <div className="font-mono text-[11px] font-bold text-[#0E7541]">
                                100 %
                              </div>
                              <div className="text-[11px] text-[#57534E] truncate">
                                Code à vous
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#0C0A08]/[0.07] flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => goToStep(2)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] min-h-[44px] px-4 py-2 text-[13px] font-semibold hover:border-[#0C0A08] active:scale-[0.98] transition-all duration-150 cursor-pointer shrink-0"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Retour</span>
                            </button>
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={handleSubmit}
                              className="flex-1 sm:flex-initial justify-center inline-flex items-center gap-2 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white min-h-[46px] px-6 sm:px-7 py-2.5 text-[13.5px] font-bold shadow-[0_10px_26px_rgba(237,91,4,0.28)] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
                            >
                              <span>
                                {submitting
                                  ? "Envoi..."
                                  : totalPrice === 0
                                    ? "Réserver mon site (0 €)"
                                    : `Envoyer ma demande (${formatAmount(totalPrice)} € HT)`}
                              </span>
                              <Check className="w-4 h-4 shrink-0" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={
                      prefersReducedMotion ? { duration: 0.14 } : ATELIER_SPRING
                    }
                    className="py-4 sm:py-6 text-center space-y-4"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#E6F8EE] text-[#0E7541] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={
                            prefersReducedMotion
                              ? { pathLength: 1 }
                              : { pathLength: 0 }
                          }
                          animate={{ pathLength: 1 }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { duration: 0.38, ease: EASE_OUT }
                          }
                        />
                      </svg>
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                      DEMANDE ENREGISTRÉE
                    </div>
                    <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-[-0.03em] text-[#0C0A08]">
                      Merci {name}, votre projet est entre mes mains.
                    </h2>
                    <p className="text-[#57534E] max-w-[46ch] mx-auto text-[13.5px] leading-relaxed">
                      Je vous recontacte sous 24h ouvrées pour lancer votre site et vos modules (
                      {selectedModules.map((m) => m.name).join(", ")}).
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                      <a
                        href={whatsappBriefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0E7541] hover:bg-[#0B5E34] text-white px-5 py-2.5 text-[13px] font-semibold transition-colors active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Confirmer sur WhatsApp</span>
                      </a>
                      <Link
                        href="/rdv"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-[#ED5B04] transition-colors active:scale-[0.98]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Choisir un créneau</span>
                      </Link>
                      <a
                        href={mailtoBriefUrl}
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-4 py-2.5 text-[13px] font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Copie e-mail</span>
                      </a>
                      <a
                        href="tel:+33778310346"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] text-[#0C0A08] px-4 py-2.5 text-[13px] font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <Phone className="w-4 h-4 text-[#ED5B04]" />
                        <span>07 78 31 03 46</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column: Live Thermal Receipt (Desktop Zero-Scroll Companion) */}
            {!submitted && (
              <div className="hidden lg:block lg:col-span-5">
                <AtelierProjectSummary
                  mode="checkout"
                  selectedModules={selectedModules}
                  onRemoveModule={toggleModule}
                />

                <div className="mt-3 flex items-center justify-center gap-3 text-[12px] text-[#78716C]">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(true)}
                    className="min-h-[36px] px-2 inline-flex items-center gap-1.5 font-medium text-[#57534E] hover:text-[#0C0A08] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>Modifier les options</span>
                  </button>
                  <span aria-hidden="true" className="text-[#0C0A08]/20">
                    ·
                  </span>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-2 inline-flex items-center gap-1.5 font-medium text-[#57534E] hover:text-[#0E7541] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp direct</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Ultra-Slim Checkout Reassurance Footer */}
      <footer className="relative z-10 shrink-0 border-t border-[#0C0A08]/[0.06] py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] px-4 sm:px-6">
        <div className="mx-auto max-w-[1120px] flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#78716C]">
          <span>
            Boubane · Léo Saillour ·{" "}
            <a
              href="tel:+33778310346"
              className="font-mono hover:text-[#0C0A08] transition-colors"
            >
              07 78 31 03 46
            </a>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Zéro acompte · Code 100 % à votre nom
            </span>
            <Link
              href="/mentions-legales"
              className="hover:text-[#0C0A08] transition-colors"
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>

      {/* Secondary Module Adjustment Modal / Mobile Bottom-Sheet */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: prefersReducedMotion ? 0.1 : 0.18 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: prefersReducedMotion ? 0.08 : 0.11 },
            }}
            onClick={() => setIsModuleModalOpen(false)}
            className="fixed inset-0 z-50 bg-[#0C0A08]/35 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="module-editor-title"
              onClick={(e) => e.stopPropagation()}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18, scale: 0.99 }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: prefersReducedMotion
                  ? { duration: 0.12 }
                  : { duration: 0.22, ease: EASE_OUT },
              }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0, transition: { duration: 0.1 } }
                  : {
                      opacity: 0,
                      y: 12,
                      scale: 0.99,
                      transition: { duration: 0.11, ease: EASE_IN },
                    }
              }
              className="w-full max-w-[600px] rounded-t-[24px] sm:rounded-[24px] bg-[#FAF8F5] border border-[#0C0A08]/[0.08] shadow-[0_24px_64px_rgba(12,10,8,0.18)] overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="module-editor-title"
                    className="font-[family-name:var(--font-jakarta)] text-lg font-bold tracking-[-0.02em] text-[#0C0A08]"
                  >
                    Ajuster vos modules
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-[#57534E]">
                    Site vitrine inclus à 0&nbsp;€ · Options à prix fixe
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 inline-flex items-center justify-center rounded-full text-[#78716C] hover:text-[#0C0A08] hover:bg-[#0C0A08]/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[72dvh] sm:max-h-[60vh] overflow-y-auto overscroll-contain px-5 sm:px-6 py-2 bg-white border-y border-[#0C0A08]/[0.07]">
                <AtelierModuleList
                  selectedIds={selectedModuleIds}
                  onToggle={toggleModule}
                  compact
                />
              </div>

              <div className="px-5 sm:px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-4 flex items-center justify-between gap-4">
                <div className="text-[13px] text-[#57534E]">
                  Total estimé :{" "}
                  <span className="font-mono font-bold text-[#0C0A08] tabular-nums">
                    {totalPrice === 0
                      ? "0 €"
                      : `${formatAmount(totalPrice)} € HT`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="bg-[#0C0A08] hover:bg-[#1E1A16] text-white rounded-full min-h-[44px] px-6 text-sm font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  Terminer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-[#FAF8F5]" />}>
      <CommanderContent />
    </Suspense>
  );
}
