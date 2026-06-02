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
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text mb-4">
            Prêt à automatiser
            <br />
            votre entreprise ?
          </h2>
          <p className="text-[0.95rem] text-text-secondary mb-8 max-w-md mx-auto">
            Déployez un agent IA sur votre hardware en 48h. 
            Vos données restent chez vous. Vous gardez le contrôle.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-text text-bg font-medium text-[14px] hover:bg-[#f0f0f0] transition-colors"
            >
              Démarrer maintenant
              <ArrowRight size={14} />
            </Link>
            <a
              href="mailto:contact@boubane.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface border border-border text-text font-medium text-[14px] hover:bg-surface-light transition-colors"
            >
              contact@boubane.ai
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
