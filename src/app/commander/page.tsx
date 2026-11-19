"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Hammer,
  MapPin,
  MessageCircle,
  Sparkles,
  Store,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { AtelierModuleList } from "@/components/AtelierModuleList";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";
import { ATELIER_EASE, ATELIER_SPRING } from "@/lib/utils";
import { AUTOMATION_MODULES } from "@/data/automations";

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
  { id: 1 as const, label: "Modules & Activité" },
  { id: 2 as const, label: "Coordonnées Directes" },
  { id: 3 as const, label: "Validation Finale" },
];

declare global {
  interface Window {
    boubaneRegisterLead?: (lead: { name: string; email: string; message: string }) => void;
    BoubaneAnalytics?: { track: (name: string, details?: Record<string, unknown>) => void };
  }
}

const STEP_VARIANTS = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
    filter: "blur(3px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    filter: "blur(3px)",
  }),
};

function CommanderContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "site-web",
    "assistant-mails",
  ]);
  const [trade, setTrade] = useState<string>(TRADES[0].label);
  const [situation, setSituation] = useState<string>(SITUATIONS[0]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialisation via query param
  useEffect(() => {
    const rawModules = searchParams.get("modules");
    if (rawModules) {
      const parsed = rawModules.split(",").map((s) => s.trim());
      const validIds = AUTOMATION_MODULES.map((m) => m.id);
      const matched = parsed.filter((id) => validIds.includes(id));
      setSelectedModuleIds(["site-web", ...matched.filter((id) => id !== "site-web")]);
    }
  }, [searchParams]);

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
      .map((m) => `  • ${m.name} (${m.price === 0 ? "0 € - Offert" : `${m.price} € HT`})`)
      .join("\n");

    return `[PROJET ATELIER BOUBANE]\n• Entreprise : ${company}${city ? ` (${city})` : ""}\n• Profil : ${trade}\n• Situation : ${situation}\n• Modules retenus :\n${modulesText}\n• Total investissement : ${totalPrice} € HT\n• Téléphone : ${
      phone || "Non renseigné"
    }\n• Email : ${email || "Non renseigné"}\n• Message : ${
      details || "Aucun détail supplémentaire"
    }`;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const fullMessage = buildBriefText();

    if (typeof window !== "undefined" && typeof window.boubaneRegisterLead === "function") {
      window.boubaneRegisterLead({
        name: `${name} (${company})`,
        email: email || `${phone}@whatsapp.boubane.com`,
        message: fullMessage,
      });
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 450);
  };

  const whatsappBriefUrl = `https://wa.me/33778310346?text=${encodeURIComponent(
    `Bonjour Léo, voici mon brief configuré sur Boubane :\nNom : ${name}\nEntreprise : ${company}${
      city ? ` (${city})` : ""
    }\nModules : ${selectedModules.map((m) => m.name).join(", ")}\nTotal estimé : ${totalPrice} € HT\nSecteur : ${trade}${
      details ? `\nPrécisions : ${details}` : ""
    }`
  )}`;

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-14 pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
          <AtelierReveal className="max-w-3xl mb-10 sm:mb-12">
            <h1 className="font-[family-name:var(--font-jakarta)] text-[clamp(2.1rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Configurez votre projet d&apos;atelier
              <span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.03rem] leading-[1.6] text-[#57534E] max-w-[58ch]">
              Votre vitrine web reste à 0 € d&apos;honoraires. Choisissez librement vos automatisations IA au tarif le plus bas, installé à votre nom sans abonnement imposé.
            </p>
          </AtelierReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-[#E7E3DC] bg-white p-6 sm:p-10 shadow-[0_18px_45px_rgba(12,10,8,0.06)] overflow-hidden">
                {!submitted ? (
                  <>
                    {/* Stepper header */}
                    <div className="mb-8 sm:mb-9">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.1em] text-[#0C0A08]/55 mb-3">
                        <span>Étape 0{step} / 03</span>
                        <span className="text-[#ED5B04] font-semibold">
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
                              className={`text-left group ${
                                canJump ? "cursor-pointer" : "cursor-default"
                              }`}
                            >
                              <div className="h-1.5 rounded-full bg-[#0C0A08]/[0.07] overflow-hidden">
                                <motion.div
                                  initial={false}
                                  animate={{ scaleX: isDone || isActive ? 1 : 0 }}
                                  transition={{ duration: 0.35, ease: ATELIER_EASE }}
                                  style={{ transformOrigin: "left center" }}
                                  className={`h-full w-full ${
                                    isDone ? "bg-[#0C0A08]" : "bg-[#ED5B04]"
                                  }`}
                                />
                              </div>
                              <div
                                className={`mt-2 hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                                  isActive
                                    ? "text-[#0C0A08] font-semibold"
                                    : isDone
                                    ? "text-[#0C0A08]/60 group-hover:text-[#ED5B04]"
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
                      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            custom={direction}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.28, ease: ATELIER_EASE }}
                            className="space-y-8"
                          >
                            {/* Choix des Modules */}
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 font-semibold">
                                  01. Choisissez vos modules
                                </label>
                                <span className="font-mono text-[11px] text-[#78716C]">
                                  Site à 0&nbsp;€ · Options à prix fixe
                                </span>
                              </div>

                              <AtelierModuleList
                                selectedIds={selectedModuleIds}
                                onToggle={toggleModule}
                                compact
                              />
                            </div>

                            {/* Secteur */}
                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 mb-3 font-semibold">
                                02. Votre secteur d&apos;activité
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
                                      className={`group relative flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#0C0A08] bg-[#0C0A08] text-white shadow-[0_8px_20px_rgba(12,10,8,0.14)]"
                                          : "border-[#E7E3DC] bg-[#FAF8F5] text-[#0C0A08] hover:border-[#0C0A08]/30 hover:bg-white"
                                      }`}
                                    >
                                      <span className="flex items-center gap-3 min-w-0">
                                        <span
                                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                            selected
                                              ? "bg-[#ED5B04] text-white"
                                              : "bg-white border border-[#E7E3DC] text-[#57534E] group-hover:text-[#0C0A08]"
                                          }`}
                                        >
                                          <Icon className="w-4 h-4" />
                                        </span>
                                        <span className="leading-snug">{item.label}</span>
                                      </span>
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                          selected
                                            ? "border-[#ED5B04] bg-[#ED5B04] text-white"
                                            : "border-[#0C0A08]/20 bg-white text-transparent"
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
                              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 mb-3 font-semibold">
                                03. Votre situation actuelle
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {SITUATIONS.map((item) => {
                                  const selected = situation === item;
                                  return (
                                    <button
                                      key={item}
                                      type="button"
                                      onClick={() => setSituation(item)}
                                      className={`flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#ED5B04] bg-[#FFF2E8] text-[#0C0A08] shadow-[0_6px_16px_rgba(237,91,4,0.1)]"
                                          : "border-[#E7E3DC] bg-[#FAF8F5] text-[#0C0A08]/80 hover:border-[#0C0A08]/30 hover:bg-white"
                                      }`}
                                    >
                                      <span className="leading-snug">{item}</span>
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                          selected
                                            ? "border-[#ED5B04] bg-[#ED5B04] text-white"
                                            : "border-[#0C0A08]/20 bg-white text-transparent"
                                        }`}
                                      >
                                        <Check className="w-3 h-3" strokeWidth={2.5} />
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#0C0A08]/[0.08]">
                              <div className="text-xs text-[#57534E]">
                                Montant calculé :{" "}
                                <span className="font-mono font-bold text-[#0C0A08]">
                                  {totalPrice === 0 ? "0.00 € (Offert)" : `${totalPrice} € HT`}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all cursor-pointer shrink-0 shadow-sm"
                              >
                                <span>Continuer vers mes coordonnées</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step2"
                            custom={direction}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.28, ease: ATELIER_EASE }}
                            className="space-y-5"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                  Votre Nom *
                                </label>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Jean Dupont"
                                  className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                  Nom de l&apos;entreprise *
                                </label>
                                <input
                                  type="text"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                                  placeholder="Atelier Dupont"
                                  className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                  Email professionnel *
                                </label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="contact@entreprise.fr"
                                  className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                  Téléphone direct
                                </label>
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="06 00 00 00 00"
                                  className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                Ville / Zone d&apos;intervention
                              </label>
                              <div className="relative">
                                <MapPin className="w-4 h-4 text-[#0C0A08]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  placeholder="Ex : Segré, Angers, Haut-Anjou..."
                                  className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] pl-10 pr-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5 font-semibold">
                                Notes ou précisions (facultatif)
                              </label>
                              <textarea
                                rows={3}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Ex : Outils déjà utilisés (Pennylane, Gmail, WhatsApp...), calendrier souhaité..."
                                className="w-full rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
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
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E7E3DC] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour aux modules</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleNextFromStep2}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <span>Vérifier mon projet</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step3"
                            custom={direction}
                            variants={STEP_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.28, ease: ATELIER_EASE }}
                            className="space-y-6"
                          >
                            <div className="rounded-2xl bg-[#FFFDF9] border border-[#E7E3DC] p-6 space-y-5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                                  RÉCAPITULATIF DE VOTRE COMMANDE ATELIER
                                </div>
                                <span className="font-mono text-[11px] rounded-full bg-[#E6F8EE] border border-[#0E7541]/20 px-2.5 py-0.5 text-[#0E7541] font-semibold">
                                  Sans acompte préalable
                                </span>
                              </div>

                              <div className="space-y-3 pt-1">
                                <div className="text-[#0C0A08]/50 font-mono text-[11px] uppercase font-semibold">
                                  MODULES SÉLECTIONNÉS ({selectedModules.length})
                                </div>
                                <div className="space-y-2">
                                  {selectedModules.map((m) => (
                                    <div
                                      key={m.id}
                                      className="flex items-center justify-between text-sm py-1 border-b border-[#0C0A08]/[0.05]"
                                    >
                                      <span className="font-semibold text-[#0C0A08]">{m.name}</span>
                                      <span className="font-mono font-bold text-[#0C0A08]">
                                        {m.price === 0 ? "0.00 € (Offert)" : `${m.price} € HT`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    SECTEUR &amp; CONTEXTE
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-0.5">{trade}</div>
                                  <div className="text-xs text-[#57534E] mt-0.5">{situation}</div>
                                </div>
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    CONTACT DIRECT
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-0.5">
                                    {name} · {company}
                                    {city ? ` (${city})` : ""}
                                  </div>
                                  <div className="text-xs text-[#57534E] mt-0.5">
                                    {[email, phone].filter(Boolean).join(" · ")}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-[#0C0A08]/[0.08] flex items-baseline justify-between">
                                <div>
                                  <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/55 font-semibold">
                                    TOTAL FORFAIT FIXE ATELIER
                                  </div>
                                  <div className="text-xs text-[#57534E]">
                                    Sans abonnement récurrent · Code source 100 % à vous
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono text-2xl font-black text-[#ED5B04]">
                                    {totalPrice.toLocaleString("fr-FR")} € HT
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* What happens next */}
                            <div className="rounded-2xl border border-[#E7E3DC] bg-white p-5 shadow-sm">
                              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/55 mb-3 font-semibold">
                                DÉROULEMENT APRÈS COMMANDE
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E7E3DC]">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    Sous 24h
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Appel de 15 min avec Léo pour cadrer vos accès
                                  </div>
                                </div>
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E7E3DC]">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    En 5 jours
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Création du site et configuration de vos agents
                                  </div>
                                </div>
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E7E3DC]">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    Livraison
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Mise en ligne, tests mutuels et code 100 % à vous
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E7E3DC] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Modifier</span>
                              </button>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2.5 rounded-full bg-[#ED5B04] text-white px-8 py-4 text-sm font-bold shadow-[0_10px_28px_rgba(237,91,4,0.28)] hover:bg-[#D64E00] active:scale-[0.97] transition-all cursor-pointer disabled:opacity-60"
                              >
                                <span>
                                  {submitting
                                    ? "Transmission en cours..."
                                    : totalPrice === 0
                                    ? "Réserver mon site offert (0 €)"
                                    : `Commander mon projet (${totalPrice} € HT)`}
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
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={ATELIER_SPRING}
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
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.45, ease: ATELIER_EASE }}
                        />
                      </svg>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                      COMMANDE ENREGISTRÉE AVEC SUCCÈS
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                      Merci {name}, votre projet est entre mes mains.
                    </h2>
                    <p className="text-[#57534E] max-w-[48ch] mx-auto text-sm leading-relaxed">
                      Je vous recontacte sous 24h ouvrées pour préparer le lancement de votre site et le déploiement de vos modules ({selectedModules.map((m) => m.name).join(", ")}).
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href="https://rdv.boubane.com/boubane/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold hover:bg-[#ED5B04] transition-colors active:scale-[0.97]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Réserver un créneau de cadrage (30 min)</span>
                      </a>
                      <a
                        href={whatsappBriefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#E6F8EE] border border-[#0E7541]/20 text-[#0E7541] px-6 py-3 text-sm font-semibold hover:bg-[#D5F2E2] transition-colors active:scale-[0.97]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Envoyer le brief sur WhatsApp</span>
                      </a>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] text-[#0C0A08] px-6 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.97]"
                      >
                        <span>Retour à l&apos;accueil</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar Sticky Estimate Console */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              <AtelierProjectSummary
                mode="checkout"
                selectedModules={selectedModules}
                onRemoveModule={toggleModule}
              />

              {/* Direct exchange */}
              <div className="rounded-2xl border border-[#E7E3DC] bg-white p-5 space-y-3 shadow-sm">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45 font-semibold">
                  BESOIN D&apos;UN ÉCHANGE DIRECT ?
                </div>
                <p className="text-xs text-[#57534E]">
                  Vous hésitez sur les modules adaptés à votre activité ? Parlons-en de vive voix.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="https://rdv.boubane.com/boubane/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>Appel découverte 30 min</span>
                  </a>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp · 07 78 31 03 46</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
