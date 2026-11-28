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
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierModuleList } from "@/components/AtelierModuleList";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";
import { ATELIER_SPRING } from "@/lib/utils";
import { AUTOMATION_MODULES, formatAmount } from "@/data/automations";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

const TRADES = [
  { label: "Artisan / BTP (Menuisier, Couvreur, Maçon…)", icon: Hammer },
  { label: "Tourisme / Gîte / Hôtellerie", icon: BedDouble },
  { label: "Profession Libérale / Cabinet", icon: Briefcase },
  { label: "Commerce Local / Domaine / Table", icon: Store },
  { label: "PME Industrielle / Services B2B", icon: Building2 },
  { label: "Autre activité locale ou indépendante", icon: Sparkles },
] as const;

const SITUATIONS = [
  "Je n'ai pas encore de site web",
  "Mon site actuel est lent ou vieillissant",
  "Je paye trop cher une agence / un abonnement",
  "Je veux lancer une nouvelle activité",
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
    reduced
      ? { opacity: 0 }
      : { opacity: 0, x: direction > 0 ? 16 : -16 },
  center: ({ reduced }: StepTransitionCustom) => ({
    opacity: 1,
    x: 0,
    transition: reduced
      ? { duration: 0.12 }
      : { duration: 0.22, ease: EASE_OUT },
  }),
  exit: ({ direction, reduced }: StepTransitionCustom) =>
    reduced
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          opacity: 0,
          x: direction > 0 ? -16 : 16,
          transition: { duration: 0.11, ease: EASE_IN },
        },
};

declare global {
  interface Window {
    boubaneRegisterLead?: (lead: { name: string; email: string; message: string }) => void;
    BoubaneAnalytics?: { track: (name: string, details?: Record<string, unknown>) => void };
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

  const [trade, setTrade] = useState<string>(TRADES[0].label);
  const [situation, setSituation] = useState<string>(SITUATIONS[0]);
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

  const goToStep = (next: 1 | 2 | 3) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNextFromStep2 = () => {
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    if (!name.trim() || !company.trim() || (!cleanEmail && !cleanPhone)) {
      setErrorMsg(
        "Merci de renseigner votre nom, votre entreprise et un e-mail ou numéro de téléphone."
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

    if (typeof window !== "undefined" && typeof window.boubaneRegisterLead === "function") {
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
      // Fallback links (WhatsApp / Email / Phone) remain available on confirmation screen
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const whatsappBriefUrl = `https://wa.me/33778310346?text=${encodeURIComponent(
    `Bonjour Léo, voici mon brief configuré sur Boubane :\nNom : ${name}\nEntreprise : ${company}${
      city ? ` (${city})` : ""
    }\nModules : ${selectedModules.map((m) => m.name).join(", ")}\nTotal estimé : ${formatAmount(totalPrice)} € HT\nSecteur : ${trade}${
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
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-12 pb-28">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <Link
              href="/#configurateur"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors mb-3 min-h-[44px] -ml-1 px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au configurateur</span>
            </Link>

            <h1 className="font-[family-name:var(--font-jakarta)] text-[clamp(2rem,4.4vw,3.1rem)] font-extrabold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Finalisez votre demande<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-3 text-[0.98rem] leading-[1.6] text-[#57534E] max-w-[52ch]">
              Quelques infos sur votre activité et vos coordonnées. Réponse directe sous 24h, sans acompte.
            </p>
          </div>

          {!submitted && (
            <div className="mb-5 lg:hidden border-y border-[#0C0A08]/[0.08] py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-[#0C0A08] truncate">
                  {selectedModules.map((m) => m.name).join(" · ")}
                </div>
                <div className="mt-0.5 font-mono text-[11.5px] font-semibold text-[#57534E] tabular-nums">
                  {totalPrice === 0 ? "0 €" : `${formatAmount(totalPrice)} € HT`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(true)}
                className="min-h-[44px] px-2 text-[12.5px] font-medium text-[#57534E] hover:text-[#0C0A08] underline underline-offset-4 decoration-[#0C0A08]/25 cursor-pointer shrink-0 transition-colors"
              >
                Modifier
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-[#0C0A08]/[0.08] bg-white p-6 sm:p-10 shadow-[0_14px_40px_-18px_rgba(12,10,8,0.08)] overflow-hidden">
                {!submitted ? (
                  <>
                    {/* Minimalist Stepper */}
                    <div className="mb-7 sm:mb-8">
                      <div className="sm:hidden flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-[#57534E] mb-2.5">
                        <span>0{step} / 03</span>
                        <span className="text-[#0C0A08] font-semibold">
                          {STEPS_META[step - 1].label}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {STEPS_META.map((item) => {
                          const isDone = step > item.id;
                          const isActive = step === item.id;
                          const canJump = item.id < step;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={!canJump}
                              onClick={() => canJump && goToStep(item.id)}
                              className={`min-h-[44px] flex flex-col justify-start text-left group pt-1 ${
                                canJump ? "cursor-pointer" : "cursor-default"
                              }`}
                            >
                              <div className="w-full h-[3px] rounded-full bg-[#0C0A08]/[0.08] overflow-hidden">
                                <motion.div
                                  initial={false}
                                  animate={{ scaleX: isDone || isActive ? 1 : 0 }}
                                  transition={
                                    prefersReducedMotion
                                      ? { duration: 0.1 }
                                      : { duration: 0.25, ease: EASE_OUT }
                                  }
                                  style={{ transformOrigin: "left center" }}
                                  className={`h-full w-full ${
                                    isDone ? "bg-[#0C0A08]" : "bg-[#ED5B04]"
                                  }`}
                                />
                              </div>
                              <div
                                className={`mt-2 hidden sm:flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors ${
                                  isActive
                                    ? "text-[#0C0A08] font-semibold"
                                    : isDone
                                      ? "text-[#0C0A08]/60 group-hover:text-[#0C0A08]"
                                      : "text-[#0C0A08]/35"
                                }`}
                              >
                                <span>0{item.id}.</span>
                                <span className="truncate">{item.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="relative overflow-hidden">
                      <AnimatePresence mode="popLayout" custom={stepCustom} initial={false}>
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            custom={stepCustom}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-8"
                          >
                            {/* Secteur */}
                            <div>
                              <label className="block text-[13px] font-semibold text-[#0C0A08] mb-3">
                                Votre secteur d&apos;activité
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {TRADES.map((item) => {
                                  const Icon = item.icon;
                                  const selected = trade === item.label;
                                  return (
                                    <button
                                      key={item.label}
                                      type="button"
                                      onClick={() => setTrade(item.label)}
                                      className={`group min-h-[52px] flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border text-[13.5px] sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                          : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/70 text-[#0C0A08] hover:border-[#0C0A08]/25 hover:bg-white"
                                      }`}
                                    >
                                      <span className="flex items-center gap-3 min-w-0">
                                        <Icon
                                          className={`w-4 h-4 shrink-0 transition-colors ${
                                            selected
                                              ? "text-white/85"
                                              : "text-[#78716C] group-hover:text-[#0C0A08]"
                                          }`}
                                          strokeWidth={1.75}
                                        />
                                        <span className="leading-snug">{item.label}</span>
                                      </span>
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                          selected
                                            ? "bg-white/15 text-white"
                                            : "border border-[#0C0A08]/15 text-transparent"
                                        }`}
                                      >
                                        <Check className="w-3 h-3" strokeWidth={2.5} />
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Situation */}
                            <div>
                              <label className="block text-[13px] font-semibold text-[#0C0A08] mb-3">
                                Votre situation actuelle
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {SITUATIONS.map((item) => {
                                  const selected = situation === item;
                                  return (
                                    <button
                                      key={item}
                                      type="button"
                                      onClick={() => setSituation(item)}
                                      className={`group min-h-[52px] flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border text-[13.5px] sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                          : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/70 text-[#0C0A08]/85 hover:border-[#0C0A08]/25 hover:bg-white"
                                      }`}
                                    >
                                      <span className="leading-snug">{item}</span>
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                          selected
                                            ? "bg-white/15 text-white"
                                            : "border border-[#0C0A08]/15 text-transparent"
                                        }`}
                                      >
                                        <Check className="w-3 h-3" strokeWidth={2.5} />
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C0A08]/[0.08]">
                              <span className="text-[12.5px] text-[#78716C]">
                                Sans acompte · Réponse sous 24h
                              </span>
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full bg-[#0C0A08] hover:bg-[#1E1A16] text-white min-h-[44px] px-7 py-3 text-sm font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer shrink-0"
                              >
                                <span>Continuer</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step2"
                            custom={stepCustom}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-5"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="commander-name"
                                  className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
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
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="commander-company"
                                  className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
                                >
                                  Nom de l&apos;entreprise *
                                </label>
                                <input
                                  id="commander-company"
                                  type="text"
                                  autoComplete="organization"
                                  enterKeyHint="next"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                                  placeholder="Atelier Dupont"
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="commander-email"
                                  className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
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
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="commander-phone"
                                  className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
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
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="commander-city"
                                className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
                              >
                                Ville / Zone d&apos;intervention
                              </label>
                              <div className="relative">
                                <MapPin className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  id="commander-city"
                                  type="text"
                                  autoComplete="address-level2"
                                  enterKeyHint="next"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  placeholder="Ex : Segré, Angers, Haut-Anjou..."
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 pl-10 pr-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="commander-details"
                                className="block text-[12.5px] font-medium text-[#57534E] mb-1.5"
                              >
                                Notes ou précisions (facultatif)
                              </label>
                              <textarea
                                id="commander-details"
                                rows={3}
                                enterKeyHint="done"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Ex : Outils déjà utilisés (Pennylane, Gmail, WhatsApp...), calendrier souhaité..."
                                className="w-full rounded-xl border border-[#0C0A08]/[0.11] bg-[#FAF8F5]/70 px-4 py-3 text-base text-[#0C0A08] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#0C0A08] focus:outline-none transition-colors"
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

                            {errorMsg && (
                              <div className="rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/20 px-4 py-3 text-sm font-medium text-[#B91C1C]">
                                {errorMsg}
                              </div>
                            )}

                            <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#0C0A08]/[0.08]">
                              <button
                                type="button"
                                onClick={() => goToStep(1)}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] min-h-[44px] px-5 py-2.5 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleNextFromStep2}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] hover:bg-[#1E1A16] text-white min-h-[44px] px-7 py-3 text-sm font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer"
                              >
                                <span>Vérifier ma demande</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step3"
                            custom={stepCustom}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div className="rounded-2xl bg-[#FAF8F5]/70 border border-[#0C0A08]/[0.08] p-5 sm:p-6 space-y-5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-[13px] font-semibold text-[#0C0A08]">
                                  Votre sélection ({selectedModules.length})
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsModuleModalOpen(true)}
                                  className="min-h-[44px] -my-2 px-2 text-[12.5px] font-medium text-[#57534E] hover:text-[#0C0A08] underline underline-offset-4 decoration-[#0C0A08]/25 cursor-pointer transition-colors"
                                >
                                  Modifier
                                </button>
                              </div>

                              <div className="divide-y divide-[#0C0A08]/[0.06] border-t border-b border-[#0C0A08]/[0.06]">
                                {selectedModules.map((m) => (
                                  <div
                                    key={m.id}
                                    className="flex items-center justify-between text-sm py-2.5"
                                  >
                                    <span className="font-medium text-[#0C0A08]">{m.name}</span>
                                    <span
                                      className={`font-mono text-[13px] font-semibold tabular-nums ${
                                        m.price === 0 ? "text-[#0E7541]" : "text-[#0C0A08]"
                                      }`}
                                    >
                                      {m.price === 0
                                        ? "0 €"
                                        : `${formatAmount(m.price)} € HT`}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-[12px] font-medium text-[#78716C]">
                                    Secteur &amp; contexte
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-1">
                                    {trade}
                                  </div>
                                  <div className="text-[13px] text-[#57534E] mt-0.5">
                                    {situation}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[12px] font-medium text-[#78716C]">
                                    Contact direct
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-1">
                                    {name} · {company}
                                    {city ? ` (${city})` : ""}
                                  </div>
                                  <div className="text-[13px] text-[#57534E] mt-0.5">
                                    {[email, phone].filter(Boolean).join(" · ")}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-[#0C0A08]/[0.08] flex items-baseline justify-between gap-4">
                                <div>
                                  <div className="text-[13px] font-semibold text-[#0C0A08]">
                                    Total forfait fixe
                                  </div>
                                  <div className="text-[12px] text-[#57534E]">
                                    Sans abonnement · Code source 100 % à vous
                                  </div>
                                </div>
                                <div className="font-mono text-[22px] font-extrabold tracking-[-0.02em] text-[#0C0A08] tabular-nums shrink-0">
                                  {totalPrice === 0
                                    ? "0 €"
                                    : `${formatAmount(totalPrice)} € HT`}
                                </div>
                              </div>
                            </div>

                            {/* Clean Hairline Timeline */}
                            <div className="pt-5 border-t border-[#0C0A08]/[0.07]">
                              <div className="text-[12px] font-medium text-[#78716C] mb-3.5">
                                Déroulement après envoi
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
                                <div>
                                  <div className="font-mono text-[11.5px] font-semibold text-[#0C0A08]">
                                    Sous 24h
                                  </div>
                                  <div className="mt-1 text-[#57534E] leading-snug">
                                    Appel de 15 min avec Léo pour cadrer vos accès
                                  </div>
                                </div>
                                <div>
                                  <div className="font-mono text-[11.5px] font-semibold text-[#0C0A08]">
                                    En 5 jours
                                  </div>
                                  <div className="mt-1 text-[#57534E] leading-snug">
                                    Création du site et configuration de vos modules
                                  </div>
                                </div>
                                <div>
                                  <div className="font-mono text-[11.5px] font-semibold text-[#0C0A08]">
                                    Livraison
                                  </div>
                                  <div className="mt-1 text-[#57534E] leading-snug">
                                    Mise en ligne et remise de vos accès complets
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-[#0C0A08]/[0.08] flex flex-wrap items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] min-h-[44px] px-5 py-2.5 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour</span>
                              </button>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white min-h-[48px] px-8 py-3.5 text-sm font-bold shadow-[0_10px_28px_rgba(237,91,4,0.28)] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
                              >
                                <span>
                                  {submitting
                                    ? "Transmission en cours..."
                                    : totalPrice === 0
                                      ? "Réserver mon site (0 €)"
                                      : `Envoyer ma demande (${formatAmount(totalPrice)} € HT)`}
                                </span>
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={
                      prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={
                      prefersReducedMotion ? { duration: 0.14 } : ATELIER_SPRING
                    }
                    className="py-10 text-center space-y-5"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#E6F8EE] text-[#0E7541] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={
                            prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }
                          }
                          animate={{ pathLength: 1 }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { duration: 0.4, ease: EASE_OUT }
                          }
                        />
                      </svg>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                      DEMANDE ENREGISTRÉE
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                      Merci {name}, votre projet est entre mes mains.
                    </h2>
                    <p className="text-[#57534E] max-w-[48ch] mx-auto text-sm leading-relaxed">
                      Je vous recontacte sous 24h ouvrées pour préparer le lancement de votre site et le déploiement de vos modules ({selectedModules.map((m) => m.name).join(", ")}).
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href={whatsappBriefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0E7541] hover:bg-[#0B5E34] text-white px-6 py-3 text-sm font-semibold transition-colors active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Confirmer en 1 clic sur WhatsApp</span>
                      </a>
                      <Link
                        href="/rdv"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold hover:bg-[#ED5B04] transition-colors active:scale-[0.98]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Choisir un créneau d&apos;appel</span>
                      </Link>
                      <a
                        href={mailtoBriefUrl}
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Copie par e-mail</span>
                      </a>
                      <a
                        href="tel:+33778310346"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <Phone className="w-4 h-4 text-[#ED5B04]" />
                        <span>07 78 31 03 46</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar Sticky Receipt Console */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <AtelierProjectSummary
                mode="checkout"
                selectedModules={selectedModules}
                onRemoveModule={!submitted ? toggleModule : undefined}
              />

              {!submitted && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(true)}
                    className="min-h-[44px] px-4 inline-flex items-center gap-2 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Modifier les modules</span>
                  </button>
                </div>
              )}

              <div className="pt-5 border-t border-[#0C0A08]/[0.07] text-center">
                <p className="text-[12.5px] text-[#78716C] mb-1">
                  Une question avant d&apos;envoyer ?
                </p>
                <div className="inline-flex items-center justify-center gap-4 flex-wrap">
                  <Link
                    href="/rdv"
                    className="min-h-[44px] px-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#0C0A08] hover:text-[#ED5B04] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>Appel 30 min</span>
                  </Link>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#0C0A08] hover:text-[#0E7541] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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

      <SiteFooter />
    </>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <CommanderContent />
    </Suspense>
  );
}
