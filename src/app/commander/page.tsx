"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SPRING } from "@/lib/utils";

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
  { id: 1 as const, label: "Activité & Contexte" },
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

export default function CommanderPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
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

  const buildBriefText = () =>
    `[PROJET SITE OFFERT]\n• Entreprise : ${company}${city ? ` (${city})` : ""}\n• Profil : ${trade}\n• Situation : ${situation}\n• Téléphone : ${
      phone || "Non renseigné"
    }\n• Email : ${email || "Non renseigné"}\n• Message : ${
      details || "Aucun détail supplémentaire"
    }`;

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
    `Bonjour Léo, voici mon brief pour un site vitrine Boubane :\nNom : ${name}\nEntreprise : ${company}${
      city ? ` (${city})` : ""
    }\nSecteur : ${trade}\nSituation : ${situation}${
      details ? `\nPrécisions : ${details}` : ""
    }`
  )}`;

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-14 pb-28">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <AtelierReveal className="max-w-3xl mb-10 sm:mb-12">
            <h1 className="font-[family-name:var(--font-jakarta)] text-[clamp(2.1rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Commandez votre vitrine sur-mesure
              <span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.03rem] leading-[1.6] text-[#57534E] max-w-[56ch]">
              Dites-moi en trois étapes rapides ce que vous faites. Je m&apos;occupe du reste et
              je vous prépare une maquette sous 5 jours ouvrés, sans acompte.
            </p>
          </AtelierReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <SpecularPlate tilt={false} crosshairs className="p-6 sm:p-10 bg-white overflow-hidden">
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
                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 mb-3">
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
                                      className={`group relative flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#0C0A08] bg-[#0C0A08] text-white shadow-[0_8px_20px_rgba(12,10,8,0.14)]"
                                          : "border-[#0C0A08]/[0.09] bg-[#FAF8F5] text-[#0C0A08] hover:border-[#0C0A08]/30 hover:bg-white"
                                      }`}
                                    >
                                      <span className="flex items-center gap-3 min-w-0">
                                        <span
                                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                            selected
                                              ? "bg-[#ED5B04] text-white"
                                              : "bg-white border border-[#0C0A08]/[0.08] text-[#57534E] group-hover:text-[#0C0A08]"
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

                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 mb-3">
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
                                      className={`flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.985] ${
                                        selected
                                          ? "border-[#ED5B04] bg-[#FFF2E8] text-[#0C0A08] shadow-[0_6px_16px_rgba(237,91,4,0.1)]"
                                          : "border-[#0C0A08]/[0.09] bg-[#FAF8F5] text-[#0C0A08]/80 hover:border-[#0C0A08]/30 hover:bg-white"
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

                            <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#0C0A08]/[0.07]">
                              <span className="text-xs text-[#57534E]">
                                Aucun engagement · Réponse sous 24h ouvrées
                              </span>
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all cursor-pointer shrink-0"
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
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                  Votre Nom *
                                </label>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Jean Dupont"
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                  Nom de l&apos;entreprise *
                                </label>
                                <input
                                  type="text"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                                  placeholder="Atelier Dupont"
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                  Email professionnel *
                                </label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="contact@entreprise.fr"
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                  Téléphone direct
                                </label>
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="06 00 00 00 00"
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                Ville / Zone d&apos;intervention
                              </label>
                              <div className="relative">
                                <MapPin className="w-4 h-4 text-[#0C0A08]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  placeholder="Ex : Segré, Angers, Haut-Anjou..."
                                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] pl-10 pr-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#0C0A08]/60 mb-1.5">
                                Notes sur votre projet (facultatif)
                              </label>
                              <textarea
                                rows={3}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Ex : Site actuel à refaire, couleurs souhaitées, services principaux à mettre en avant..."
                                className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                              />
                            </div>

                            {errorMsg && (
                              <div className="rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/20 px-4 py-3 text-sm font-medium text-[#B91C1C]">
                                {errorMsg}
                              </div>
                            )}

                            <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#0C0A08]/[0.07]">
                              <button
                                type="button"
                                onClick={() => goToStep(1)}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleNextFromStep2}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <span>Vérifier ma commande</span>
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
                            <div className="rounded-2xl bg-[#FAF8F5] border border-[#0C0A08]/[0.08] p-6 space-y-5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                                  RÉCAPITULATIF DE VOTRE RÉSERVATION
                                </div>
                                <span className="font-mono text-[11px] rounded-full bg-white border border-[#0C0A08]/[0.08] px-2.5 py-0.5 text-[#0C0A08]">
                                  Sans acompte
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    SECTEUR
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-0.5">{trade}</div>
                                </div>
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    CONTEXTE
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-0.5">
                                    {situation}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    CONTACT
                                  </div>
                                  <div className="font-semibold text-[#0C0A08] mt-0.5">
                                    {name} · {company}
                                    {city ? ` (${city})` : ""}
                                  </div>
                                  <div className="text-[#57534E]">
                                    {[email, phone].filter(Boolean).join(" · ")}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    HONORAIRES STUDIO
                                  </div>
                                  <div className="font-mono text-lg font-bold text-[#0C0A08] mt-0.5">
                                    0.00 € HT
                                  </div>
                                  <div className="text-xs text-[#57534E]">
                                    Domaine & hébergement directs uniquement
                                  </div>
                                </div>
                              </div>

                              {details && (
                                <div className="pt-3 border-t border-[#0C0A08]/[0.07] text-sm">
                                  <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                    PRÉCISIONS
                                  </div>
                                  <div className="text-[#0C0A08]/85 mt-1 leading-relaxed">
                                    {details}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* What happens next */}
                            <div className="rounded-2xl border border-[#0C0A08]/[0.08] bg-white p-5">
                              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/55 mb-3">
                                LA SUITE EN 3 TEMPS
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    Sous 24h
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Échange rapide & récupération de vos photos
                                  </div>
                                </div>
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    J+1 à J+4
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Création de votre maquette sur-mesure
                                  </div>
                                </div>
                                <div className="rounded-xl bg-[#FAF8F5] p-3.5">
                                  <div className="font-mono font-semibold text-[#ED5B04]">
                                    J+5
                                  </div>
                                  <div className="mt-1 font-medium text-[#0C0A08]">
                                    Validation & mise en ligne à votre nom
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Modifier</span>
                              </button>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2.5 rounded-full bg-[#ED5B04] text-white px-8 py-4 text-sm font-semibold shadow-[0_10px_28px_rgba(237,91,4,0.28)] hover:bg-[#D64E00] active:scale-[0.97] transition-all cursor-pointer disabled:opacity-60"
                              >
                                <span>
                                  {submitting
                                    ? "Transmission en cours..."
                                    : "Réserver mon créneau offert (0 €)"}
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
                      CRÉNEAU RÉSERVÉ AVEC SUCCÈS
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                      Merci {name}, votre demande est entre mes mains.
                    </h2>
                    <p className="text-[#57534E] max-w-[46ch] mx-auto">
                      Je vous réponds personnellement sous 24h ouvrées pour lancer votre esquisse
                      gratuite. Vous pouvez aussi bloquer un créneau de 10 min ou m&apos;envoyer
                      votre brief en direct sur WhatsApp.
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <Link
                        href="/rdv"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold hover:bg-[#ED5B04] transition-colors active:scale-[0.97]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Réserver mon créneau (10 min)</span>
                      </Link>
                      <a
                        href={whatsappBriefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#E6F8EE] border border-[#0E7541]/20 text-[#0E7541] px-6 py-3 text-sm font-semibold hover:bg-[#D5F2E2] transition-colors active:scale-[0.97]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Envoyer sur WhatsApp</span>
                      </a>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.12] text-[#0C0A08] px-6 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.97]"
                      >
                        <span>Retour à l&apos;accueil</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </SpecularPlate>
            </div>

            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <SpecularPlate dark className="p-7 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                    CE QUI EST GARANTI
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/65">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Dispo cette semaine
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#ED5B04] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">0 € de conception</div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Aucun acompte. Vous ne réglez rien avant la mise en ligne finale.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-[#ED5B04] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Code source 100 % à vous
                      </div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Le code reste intégralement entre vos mains, sans location ni verrouillage.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#ED5B04] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">Livré en 5 jours ouvrés</div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Validation étape par étape en direct avec Léo Saillour.
                      </div>
                    </div>
                  </div>
                </div>
              </SpecularPlate>

              <SpecularPlate tilt={false} className="p-6 bg-white space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                  BESOIN D&apos;UN ÉCHANGE DIRECT ?
                </div>
                <p className="text-sm text-[#57534E]">
                  Préférez parler de vive voix avant de commander ?
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/rdv"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>Appel découverte 10 min</span>
                  </Link>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp · 07 78 31 03 46</span>
                  </a>
                  <a
                    href="mailto:leo@boubane.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0C0A08]/70" />
                    <span>leo@boubane.com</span>
                  </a>
                </div>
              </SpecularPlate>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
