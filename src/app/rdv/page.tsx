"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ATELIER_SPRING } from "@/lib/utils";

const DAYS = [
  "Dès demain",
  "Cette semaine",
  "Semaine prochaine",
] as const;

const SLOTS = [
  { time: "10h00", period: "Matin" },
  { time: "14h00", period: "Après-midi" },
  { time: "16h30", period: "Fin de journée" },
] as const;

export default function RdvPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [calOnline, setCalOnline] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>("10h00 (Matin)");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/rdv-status")
      .then((r) => r.json())
      .then((d: { online?: boolean }) => {
        if (d?.online) setCalOnline(true);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      setErrorMsg("Merci d'indiquer votre nom ainsi qu'un numéro de téléphone ou e-mail.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    const summary = `[DEMANDE DE RDV BOUBANE]\n• Contact : ${name}${
      company ? ` (${company})` : ""
    }\n• Créneau souhaité : ${selectedDay} · ${selectedSlot}\n• Téléphone : ${
      phone || "Non renseigné"
    }\n• Email : ${email || "Non renseigné"}\n• Sujet : ${
      topic || "Site vitrine 0 € / Automatisations IA"
    }`;

    if (typeof window !== "undefined" && typeof window.boubaneRegisterLead === "function") {
      window.boubaneRegisterLead({
        name: company ? `${name} (${company})` : name,
        email: email || `${phone}@rdv.boubane.com`,
        message: summary,
      });
    }

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rdv",
          name,
          company,
          phone,
          email,
          preferredSlot: `${selectedDay} · ${selectedSlot}`,
          message: summary,
          website: honeypot,
        }),
      });
    } catch {
      // Direct fallback links shown on confirmation state
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const whatsappRdvUrl = `https://wa.me/33778310346?text=${encodeURIComponent(
    `Bonjour Léo, je souhaite réserver un échange téléphonique (${selectedDay} vers ${selectedSlot}).\nNom : ${name}${
      company ? ` (${company})` : ""
    }${topic ? `\nSujet : ${topic}` : ""}`
  )}`;

  const mailtoRdvUrl = `mailto:leo@boubane.com?subject=${encodeURIComponent(
    `Demande de RDV — ${company || name}`
  )}&body=${encodeURIComponent(
    `Bonjour Léo,\n\nJe souhaite convenir d'un échange de 15 à 30 minutes.\n• Disponibilité : ${selectedDay} · ${selectedSlot}\n• Téléphone : ${phone || "—"}\n• Sujet : ${topic || "Site vitrine / Automatisations IA"}\n\nMerci,\n${name}`
  )}`;

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-12 pb-28">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors mb-3 min-h-[44px] -ml-1 px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l&apos;accueil</span>
            </Link>

            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              ÉCHANGE DIRECT · 15 À 30 MIN
            </p>
            <h1 className="mt-2.5 font-[family-name:var(--font-jakarta)] text-[clamp(2rem,4.4vw,3.1rem)] font-extrabold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Réservez un point avec Léo<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-3 text-[0.98rem] leading-[1.6] text-[#57534E] max-w-[52ch]">
              Un appel simple et sans discours commercial pour cadrer votre site vitrine à 0&nbsp;€ ou vos automatisations IA.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-[#0C0A08]/[0.08] bg-white p-6 sm:p-10 shadow-[0_14px_40px_-18px_rgba(12,10,8,0.08)]">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Day selector */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0C0A08] mb-3">
                        1. Quand préférez-vous échanger ?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {DAYS.map((day) => {
                          const active = selectedDay === day;
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setSelectedDay(day)}
                              className={`min-h-[48px] px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.98] flex items-center justify-between gap-2 ${
                                active
                                  ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                  : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/70 text-[#0C0A08] hover:border-[#0C0A08]/25 hover:bg-white"
                              }`}
                            >
                              <span>{day}</span>
                              {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slot selector */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0C0A08] mb-3">
                        2. Créneau indicatif (heure de Paris)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {SLOTS.map((s) => {
                          const value = `${s.time} (${s.period})`;
                          const active = selectedSlot === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSelectedSlot(value)}
                              className={`min-h-[54px] px-4 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-[0.98] flex items-center justify-between gap-2 ${
                                active
                                  ? "border-[#0C0A08] bg-[#0C0A08] text-white"
                                  : "border-[#0C0A08]/[0.09] bg-[#FAF8F5]/70 text-[#0C0A08] hover:border-[#0C0A08]/25 hover:bg-white"
                              }`}
                            >
                              <div>
                                <div className="font-mono text-sm font-bold">{s.time}</div>
                                <div
                                  className={`text-[11.5px] ${
                                    active ? "text-white/75" : "text-[#78716C]"
                                  }`}
                                >
                                  {s.period}
                                </div>
                              </div>
                              <Clock
                                className={`w-4 h-4 shrink-0 ${
                                  active ? "text-[#ED5B04]" : "text-[#A8A29E]"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact fields */}
                    <div className="space-y-4 pt-1">
                      <label className="block text-[13px] font-semibold text-[#0C0A08]">
                        3. Vos coordonnées directes
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="rdv-name"
                            className="block text-[12px] font-medium text-[#57534E] mb-1.5"
                          >
                            Votre nom *
                          </label>
                          <input
                            id="rdv-name"
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
                            htmlFor="rdv-company"
                            className="block text-[12px] font-medium text-[#57534E] mb-1.5"
                          >
                            Entreprise (facultatif)
                          </label>
                          <input
                            id="rdv-company"
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
                            htmlFor="rdv-phone"
                            className="block text-[12px] font-medium text-[#57534E] mb-1.5"
                          >
                            Téléphone pour l&apos;appel *
                          </label>
                          <input
                            id="rdv-phone"
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
                        <div>
                          <label
                            htmlFor="rdv-email"
                            className="block text-[12px] font-medium text-[#57534E] mb-1.5"
                          >
                            Email (invitation agenda)
                          </label>
                          <input
                            id="rdv-email"
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
                      </div>

                      <div>
                        <label
                          htmlFor="rdv-topic"
                          className="block text-[12px] font-medium text-[#57534E] mb-1.5"
                        >
                          Sujet en quelques mots (facultatif)
                        </label>
                        <input
                          id="rdv-topic"
                          type="text"
                          enterKeyHint="done"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="Ex : Création site vitrine menuiserie, assistant mails Outlook..."
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
                    </div>

                    {errorMsg && (
                      <div className="rounded-xl bg-[#FEF2F2] border border-[#B91C1C]/20 px-4 py-3 text-sm font-medium text-[#B91C1C]">
                        {errorMsg}
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#0C0A08]/[0.08] flex flex-wrap items-center justify-between gap-4">
                      <span className="text-[12.5px] text-[#78716C]">
                        Confirmation par SMS ou e-mail sous 2h ouvrées
                      </span>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white min-h-[48px] px-8 py-3.5 text-sm font-bold shadow-[0_10px_28px_rgba(237,91,4,0.26)] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>
                          {submitting ? "Enregistrement..." : "Confirmer ma demande d'appel"}
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={prefersReducedMotion ? { duration: 0.14 } : ATELIER_SPRING}
                    className="py-8 text-center space-y-5"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#E6F8EE] text-[#0E7541] flex items-center justify-center">
                      <Check className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#0E7541] font-semibold">
                      CRÉNEAU ENREGISTRÉ
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                      À très vite {name}.
                    </h2>
                    <p className="text-[#57534E] max-w-[46ch] mx-auto text-sm leading-relaxed">
                      Votre souhait de créneau (<strong>{selectedDay} · {selectedSlot}</strong>) est bien noté. Je vous confirme l&apos;horaire exact très rapidement.
                    </p>
                    <div className="pt-3 flex flex-wrap justify-center gap-3">
                      <a
                        href={whatsappRdvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#0E7541] hover:bg-[#0B5E34] text-white px-6 py-3 text-sm font-semibold transition-colors active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Valider l&apos;horaire sur WhatsApp</span>
                      </a>
                      <a
                        href={mailtoRdvUrl}
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Envoyer par e-mail</span>
                      </a>
                      <Link
                        href="/commander"
                        className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.1] text-[#0C0A08] px-5 py-3 text-sm font-semibold hover:border-[#0C0A08] transition-colors active:scale-[0.98]"
                      >
                        <span>Configurer mon projet</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Direct Contact Sidebar */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-[#0C0A08]/[0.08] bg-[#FFFDF9] p-6 space-y-5 shadow-[0_12px_30px_-18px_rgba(12,10,8,0.08)]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                    INTERLOCUTEUR UNIQUE
                  </div>
                  <div className="mt-1.5 font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0C0A08]">
                    Léo Saillour · Boubane
                  </div>
                  <p className="mt-1 text-[13px] text-[#57534E] leading-relaxed">
                    Basé à Segré-en-Anjou Bleu (49500). Vous échangez directement avec la personne qui conçoit et déploie votre projet.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#0C0A08]/[0.07] space-y-2.5">
                  <a
                    href="tel:+33778310346"
                    className="w-full min-h-[44px] rounded-xl bg-[#0C0A08] hover:bg-[#1E1A16] text-white px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#ED5B04]" />
                      <span>Appeler : 07 78 31 03 46</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] rounded-xl bg-[#E6F8EE] border border-[#0E7541]/20 text-[#0E7541] hover:bg-[#D8F3E4] px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Écrire sur WhatsApp</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href="mailto:leo@boubane.com"
                    className="w-full min-h-[44px] rounded-xl bg-white border border-[#0C0A08]/[0.09] hover:border-[#0C0A08]/25 text-[#0C0A08] px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#78716C]" />
                      <span>leo@boubane.com</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C]" />
                  </a>
                </div>

                {calOnline && (
                  <div className="pt-4 border-t border-[#0C0A08]/[0.07]">
                    <a
                      href="https://rdv.boubane.com/boubane/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] rounded-xl bg-[#FAF8F5] border border-[#0C0A08]/[0.1] hover:border-[#0C0A08] text-[#0C0A08] px-4 py-2.5 text-[12.5px] font-semibold flex items-center justify-between transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        <span>Agenda temps réel Cal.com</span>
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
