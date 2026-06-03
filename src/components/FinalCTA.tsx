"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#5e6ad2]/5 rounded-3xl blur-[80px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text mb-4">
                Prêt à automatiser
                <br />
                votre entreprise ?
              </h2>
              <p className="text-[0.95rem] text-text-secondary mb-8 max-w-md mx-auto">
                Déployez un agent IA sur votre hardware en 48h.
                Vos données restent chez vous. Vous gardez le contrôle.
              </p>

              {/* Pricing hint */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 mb-8">
                <span className="text-[11px] text-[#5e6ad2] font-medium">À partir de 590€ + 190€/mois</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#5e6ad2] text-white font-medium text-[14px] hover:bg-[#4f58b8] transition-colors"
                >
                  Démarrer maintenant
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="mailto:contact@boubane.ai"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface border border-border text-text font-medium text-[14px] hover:bg-surface-light hover:border-border-hover transition-colors"
                >
                  contact@boubane.ai
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
