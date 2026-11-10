"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_SNAPPY_SPRING } from "@/lib/utils";

export default function HebergementSuccesPage() {
  return (
    <>
      <SiteHeader isHome={false} />
      <main className="min-h-[75vh] flex items-center justify-center py-20 px-6">
        <SpecularPlate tilt={false} crosshairs className="max-w-xl w-full p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={ATELIER_SNAPPY_SPRING}
            className="mx-auto w-16 h-16 rounded-full bg-[#E6F8EE] text-[#0E7541] flex items-center justify-center mb-6"
          >
            <Check className="w-8 h-8" strokeWidth={2.5} />
          </motion.div>

          <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#0E7541]">
            PAIEMENT STRIPE VALIDÉ (15 € / AN)
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0C0A08]">
            Votre hébergement est activé<span className="text-[#ED5B04]">.</span>
          </h1>
          <p className="mt-3 text-[#57534E] text-sm sm:text-base leading-relaxed">
            Merci pour votre confiance. Votre souscription annuelle est enregistrée et votre reçu
            officiel vous a été transmis par e-mail.
          </p>

          <div className="mt-8 rounded-2xl bg-[#FAF8F5] border border-[#0C0A08]/[0.07] p-6 text-left text-sm">
            <div className="font-semibold text-[#0C0A08] mb-2">Prochaines opérations :</div>
            <ol className="list-decimal pl-5 space-y-1.5 text-[#57534E]">
              <li>Léo réserve ou connecte votre nom de domaine personnalisé.</li>
              <li>Déploiement de votre vitrine sur l&apos;infrastructure Edge (&lt; 0.3s).</li>
              <li>Génération du certificat SSL et vérification finale en ligne.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20viens%20de%20valider%20mon%20h%C3%A9bergement%20sur%20Stripe."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0E7541] text-white px-6 py-3 text-sm font-semibold active:scale-[0.97] transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Échanger sur WhatsApp avec Léo</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] text-[#0C0A08] px-6 py-3 text-sm font-semibold active:scale-[0.97] transition-transform"
            >
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </SpecularPlate>
      </main>
      <SiteFooter />
    </>
  );
}

