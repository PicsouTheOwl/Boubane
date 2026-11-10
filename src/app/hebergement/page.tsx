"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, MessageCircle, Server, Shield, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

const BOUBANE_STRIPE_PAYMENT_URL: string = "";

export default function HebergementPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePaymentClick = () => {
    if (typeof window !== "undefined" && window.BoubaneAnalytics) {
      window.BoubaneAnalytics.track("click_buy_hosting", { price: "15_eur_year" });
    }
    if (BOUBANE_STRIPE_PAYMENT_URL && BOUBANE_STRIPE_PAYMENT_URL.startsWith("http")) {
      window.location.href = BOUBANE_STRIPE_PAYMENT_URL;
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[1140px] px-6">
          <AtelierReveal className="max-w-3xl mb-14">
            <EyebrowBadge index="INFRASTRUCTURE">Hébergement &amp; Souveraineté</EyebrowBadge>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              L&apos;hébergement au coût réel, sans marge captive<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[#57534E] max-w-[56ch]">
              Votre site vous appartient à 100 %. Choisissez entre votre propre hébergement direct ou
              notre pass clé en main ultra-rapide à tarif transparent.
            </p>
          </AtelierReveal>

          {/* Tableau d'ingénierie 2 options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <AtelierReveal delay={0.05} className="lg:col-span-6 flex">
              <SpecularPlate className="w-full p-8 sm:p-10 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-[#0C0A08]/[0.07]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                      OPTION A · AUTONOMIE TOTALE
                    </span>
                    <Server className="w-4 h-4 text-[#0C0A08]/40" />
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[#0C0A08] tabular-nums">
                      ~5 €
                    </span>
                    <span className="font-mono text-xs uppercase text-[#57534E]">
                      / mois (OVH / Hostinger / Vercel)
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-[#0C0A08]">
                    Compte Direct à Votre Nom
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                    Nous ouvrons ou connectons directement votre propre compte hébergeur. Vous payez
                    la facture serveur directement au fournisseur, sans jamais passer par nous.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#0C0A08]">
                    {[
                      "Nom de domaine 100% enregistré à votre nom",
                      "Dépôt GitHub privé transféré intégralement",
                      "Zéro intermédiaire de facturation",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#ED5B04]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[#0C0A08]/[0.07]">
                  <Link
                    href="/commander"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.14] px-6 py-3.5 text-sm font-semibold text-[#0C0A08] hover:border-[#0C0A08] active:scale-[0.98] transition-all"
                  >
                    <span>Commander mon site avec mon hébergeur</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </SpecularPlate>
            </AtelierReveal>

            <AtelierReveal delay={0.12} className="lg:col-span-6 flex">
              <SpecularPlate dark crosshairs className="w-full p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                      OPTION B · PASS HÉBERGEMENT ÉLITE
                    </span>
                    <Shield className="w-4 h-4 text-[#ED5B04]" />
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white tabular-nums">
                      15 €
                    </span>
                    <span className="font-mono text-xs uppercase text-white/55">
                      / an · Sans engagement
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white">
                    Infrastructure Clé en Main &amp; SSL
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Idéal si vous ne voulez toucher à aucun réglage DNS ou serveur. Nous gérons la
                    mise en ligne globale, le certificat SSL et les sauvegardes Edge.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-white/85">
                    {[
                      "Hébergement Edge mondial (< 0.3s temps de réponse)",
                      "Certificat SSL HTTPS & renouvellement automatique",
                      "Résiliable en 1 clic à tout moment",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#ED5B04]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={handlePaymentClick}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#ED5B04] text-white px-6 py-4 text-sm font-semibold shadow-[0_10px_28px_rgba(237,91,4,0.3)] hover:bg-[#D64E00] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Activer mon Pass Hébergement (15 € / an)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </SpecularPlate>
            </AtelierReveal>
          </div>
        </div>
      </main>

      {/* Modal Stripe / Activation */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={ATELIER_SNAPPY_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[24px] bg-white p-8 border border-[#0C0A08]/[0.1] shadow-2xl text-center"
            >
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#0C0A08]/60 hover:text-[#0C0A08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-full bg-[#FFF2E8] text-[#ED5B04] flex items-center justify-center mx-auto mb-4 font-bold">
                ✦
              </div>
              <h3 className="text-xl font-bold text-[#0C0A08]">Activation de l&apos;Hébergement</h3>
              <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                Votre lien de paiement Stripe direct est activé dès validation de votre réservation
                de site. Échangez directement avec Léo pour associer votre nom de domaine.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <a
                  href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20activer%20l%27h%C3%A9bergement%20%C3%A0%2015%E2%82%AC%20pour%20mon%20site."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-5 py-2.5 text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contacter sur WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.12] px-5 py-2.5 text-xs font-semibold text-[#0C0A08] cursor-pointer"
                >
                  Fermer
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
