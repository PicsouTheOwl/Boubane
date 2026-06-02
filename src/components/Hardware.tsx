"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive, Wifi, Shield, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const configs = [
  {
    name: "Essential",
    hardware: "Mac Mini M4",
    specs: ["Apple M4 10 cœurs", "16 Go RAM", "256 Go SSD"],
    price: "590€",
    period: "+ 190€/mois",
    priceNote: "hardware + agent",
    features: [
      "1 agent IA",
      "Jusqu'à 500 emails/mois",
      "Réponses automatiques",
      "Rapports hebdomadaires",
      "Support email",
    ],
    recommended: false,
  },
  {
    name: "Professional",
    hardware: "Mac Mini M4 Pro",
    specs: ["Apple M4 Pro 14 cœurs", "32 Go RAM", "512 Go SSD"],
    price: "1 190€",
    period: "+ 390€/mois",
    priceNote: "hardware + agents",
    features: [
      "3 agents spécialisés",
      "Emails illimités",
      "Support client 24/7",
      "Rapports temps réel",
      "Intégrations multiples",
      "Formation équipe",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    hardware: "Serveur sur-mesure",
    specs: ["Xeon / EPYC", "64+ Go RAM", "1+ To SSD"],
    price: "Sur devis",
    period: "sur devis",
    priceNote: "configuration adaptée",
    features: [
      "Agents illimités",
      "GPU dédié (optionnel)",
      "Modèles LLM multiples",
      "Hébergement rack",
      "SLA 99.9%",
      "Account manager",
    ],
    recommended: false,
  },
];

export default function Hardware() {
  return (
    <section id="hardware" className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
            Hardware & Tarifs
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Choisissez votre configuration
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
            Tout est inclus : le hardware, l&apos;installation de l&apos;agent, 
            et le support. Vous branchez, on configure.
          </p>
        </motion.div>

        {/* Configs */}
        <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {configs.map((config, i) => (
            <motion.div
              key={config.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`card p-5 flex flex-col ${
                config.recommended ? "border-[#5e6ad2]/30" : ""
              }`}
            >
              {config.recommended && (
                <p className="text-[10px] text-[#5e6ad2] font-medium mb-2 uppercase tracking-wider">
                  Recommandé
                </p>
              )}

              <h3 className="text-[15px] font-semibold text-text mb-0.5">{config.name}</h3>
              <p className="text-[12px] text-text-muted mb-3">{config.hardware}</p>

              {/* Specs */}
              <div className="flex flex-wrap gap-1 mb-4">
                {config.specs.map((spec) => (
                  <span key={spec} className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-light border border-border text-[10px] text-text-secondary">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="h-px bg-border my-4" />

              {/* Price */}
              <div className="mb-5">
                <p className="text-[17px] font-semibold text-text">{config.price}</p>
                <p className="text-[11px] text-text-muted">{config.period}</p>
                <p className="text-[10px] text-text-dim">{config.priceNote}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {config.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px] text-text-secondary">
                    <Check size={12} className="text-[#30a46c] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  config.recommended
                    ? "bg-text text-bg hover:bg-[#f0f0f0]"
                    : "bg-surface border border-border text-text hover:bg-surface-light"
                }`}
              >
                Choisir
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] text-text-dim mt-6"
        >
          Engagement 3 mois. Annulation possible après. TVA non incluse.
        </motion.p>
      </div>
    </section>
  );
}
