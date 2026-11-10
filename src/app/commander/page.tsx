"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

const TRADES = [
  "Artisan / BTP (Menuisier, Couvreur, Maçon…)",
  "Tourisme / Gîte / Hôtellerie",
  "Profession Libérale / Cabinet",
  "Commerce Local / Domaine / Table",
  "PME Industrielle / Services B2B",
];

const SITUATIONS = [
  "Je n'ai pas encore de site web",
  "Mon site actuel est lent ou vieillissant",
  "Je paye trop cher une agence / un abonnement",
  "Je veux lancer une nouvelle activité",
];

declare global {
  interface Window {
    boubaneRegisterLead?: (lead: { name: string; email: string; message: string }) => void;
    BoubaneAnalytics?: { track: (name: string, details?: Record<string, unknown>) => void };
  }
}

export default function CommanderPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [trade, setTrade] = useState(TRADES[0]);
  const [situation, setSituation] = useState(SITUATIONS[0]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNextFromStep2 = () => {
    if (!name.trim() || !company.trim() || !email.trim()) {
      setErrorMsg("Merci de renseigner votre nom, votre entreprise et votre e-mail ou téléphone.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const fullMessage = `[PROJET SITE OFFERT]\n• Entreprise : ${company}\n• Profil : ${trade}\n• Situation : ${situation}\n• Téléphone : ${
      phone || "Non renseigné"
    }\n• Message : ${details || "Aucun détail supplémentaire"}`;

    if (typeof window !== "undefined" && typeof window.boubaneRegisterLead === "function") {
      window.boubaneRegisterLead({
        name: `${name} (${company})`,
        email,
        message: fullMessage,
      });
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 550);
  };

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[1160px] px-6">
          <AtelierReveal className="max-w-3xl mb-12">
            <EyebrowBadge index="BRIEF EXPRESS">Réservation Créneau · 0 €</EyebrowBadge>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Commandez votre vitrine sur-mesure<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[#57534E] max-w-[54ch]">
              Trois étapes rapides pour réserver votre créneau de conception. Aucun acompte, aucun
              engagement, code propriétaire livré sous 5 jours.
            </p>
          </AtelierReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tunnel Tactile 3 Étapes */}
            <div className="lg:col-span-8">
              <SpecularPlate tilt={false} crosshairs className="p-7 sm:p-10 bg-white">
                {!submitted ? (
                  <>
                    {/* Barre de progression cinétique */}
                    <div className="mb-9">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.1em] text-[#0C0A08]/55 mb-3">
                        <span>Étape 0{step} / 03</span>
                        <span className="text-[#ED5B04]">
                          {step === 1
                            ? "Activité & Contexte"
                            : step === 2
                            ? "Coordonnées Directes"
                            : "Validation Finale"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((s) => (
                          <div
                            key={s}
                            className="h-1.5 rounded-full bg-[#0C0A08]/[0.07] overflow-hidden"
                          >
                            <motion.div
                              initial={false}
                              animate={{ scaleX: step >= s ? 1 : 0 }}
                              transition={{ duration: 0.4, ease: ATELIER_EASE }}
                              style={{ transformOrigin: "left center" }}
                              className="h-full w-full bg-[#ED5B04]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, filter: "blur(3px)", x: 16 }}
                          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                          exit={{ opacity: 0, filter: "blur(3px)", x: -16 }}
                          transition={{ duration: 0.28, ease: ATELIER_EASE }}
                          className="space-y-8"
                        >
                          <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/55 mb-3">
                              Votre secteur d&apos;activité
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {TRADES.map((item) => {
                                const selected = trade === item;
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => setTrade(item)}
                                    className={`relative text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.98] ${
                                      selected
                                        ? "border-[#0C0A08] bg-[#0C0A08] text-white shadow-sm"
                                        : "border-[#0C0A08]/[0.09] bg-[#FAF8F5] text-[#0C0A08] hover:border-[#0C0A08]/30"
                                    }`}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/55 mb-3">
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
                                    className={`relative text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.98] ${
                                      selected
                                        ? "border-[#ED5B04] bg-[#FFF2E8] text-[#0C0A08]"
                                        : "border-[#0C0A08]/[0.09] bg-[#FAF8F5] text-[#0C0A08]/80 hover:border-[#0C0A08]/30"
                                    }`}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all cursor-pointer"
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
                          initial={{ opacity: 0, filter: "blur(3px)", x: 16 }}
                          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                          exit={{ opacity: 0, filter: "blur(3px)", x: -16 }}
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
                              Notes sur votre projet (facultatif)
                            </label>
                            <textarea
                              rows={3}
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              placeholder="Ex: Zone d'intervention, couleurs souhaitées, exemples de sites que vous appréciez..."
                              className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-3 text-base text-[#0C0A08] focus:bg-white focus:border-[#ED5B04] focus:outline-none transition-colors"
                            />
                          </div>

                          {errorMsg && (
                            <p className="text-sm font-medium text-[#B91C1C]">{errorMsg}</p>
                          )}

                          <div className="pt-4 flex items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Retour</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleNextFromStep2}
                              className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all cursor-pointer"
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
                          initial={{ opacity: 0, filter: "blur(3px)", x: 16 }}
                          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                          exit={{ opacity: 0, filter: "blur(3px)", x: -16 }}
                          transition={{ duration: 0.28, ease: ATELIER_EASE }}
                          className="space-y-6"
                        >
                          <div className="rounded-2xl bg-[#FAF8F5] border border-[#0C0A08]/[0.08] p-6 space-y-4">
                            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                              RÉCAPITULATIF DE VOTRE RÉSERVATION
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
                                </div>
                                <div className="text-[#57534E]">{email}</div>
                              </div>
                              <div>
                                <div className="text-[#0C0A08]/45 font-mono text-[11px]">
                                  HONORAIRES STUDIO
                                </div>
                                <div className="font-mono text-lg font-bold text-[#0C0A08] mt-0.5">
                                  0.00 € HT
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => setStep(2)}
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
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={ATELIER_SNAPPY_SPRING}
                    className="py-10 text-center space-y-5"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#E6F8EE] text-[#0E7541] flex items-center justify-center">
                      <Check className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                      CRÉNEAU RÉSERVÉ AVEC SUCCÈS
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                      Merci {name}, votre demande est entre mes mains.
                    </h2>
                    <p className="text-[#57534E] max-w-[46ch] mx-auto">
                      Je vous réponds personnellement sous 24h ouvrées pour lancer votre esquisse
                      gratuite. Vous pouvez aussi bloquer un créneau de 10 min dès maintenant.
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href="https://rdv.boubane.com/boubane"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Réserver mon créneau (10 min)</span>
                      </a>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.12] text-[#0C0A08] px-6 py-3 text-sm font-semibold"
                      >
                        <span>Retour à l&apos;accueil</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </SpecularPlate>
            </div>

            {/* Sidebar Garanties Gravées */}
            <div className="lg:col-span-4 space-y-5">
              <SpecularPlate dark className="p-7 space-y-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                  GARANTIES GRAVÉES
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#ED5B04] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">0 € de conception</div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Aucun acompte. Vous ne réglez rien avant la mise en ligne finale à votre
                        nom.
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
                        Livré sur votre dépôt privé, hébergé en direct sur votre propre nom de
                        domaine.
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
                  <a
                    href="https://rdv.boubane.com/boubane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ED5B04]" />
                    <span>Appel découverte 10 min</span>
                  </a>
                  <a
                    href="https://wa.me/33778310346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] px-4 py-2.5 text-xs font-semibold text-[#0C0A08] hover:border-[#0C0A08] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0E7541]" />
                    <span>WhatsApp · 07 78 31 03 46</span>
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
