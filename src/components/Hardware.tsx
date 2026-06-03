"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive, Wifi, Shield, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import GlowCard from "./GlowCard";

const configs = [
  {
    name: "Essential",
    hardware: "Mac Mini M4",
    image: "https://images.unsplash.com/photo-1733076362724-f75c28fa857b?w=400&h=250&fit=crop&q=80",
    imageAlt: "Mac Mini M4",
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
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&q=80",
    imageAlt: "Circuit board close-up",
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
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80",
    imageAlt: "Data center server rack",
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
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {configs.map((config, i) => (
            <motion.div
              key={config.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlowCard
                className={`flex flex-col h-full ${
                  config.recommended ? "border-[#5e6ad2]/40" : ""
                }`}
              >
                {/* Product image */}
                <div className="relative h-40 overflow-hidden rounded-t-xl -mx-5 -mt-5 mb-4">
                  <img
                    src={config.image}
                    alt={config.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  {config.recommended && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#5e6ad2] text-[9px] font-semibold text-white uppercase tracking-wider">
                      Recommandé
                    </div>
                  )}
                </div>

                <h3 className="text-[15px] font-semibold text-text mb-0.5">{config.name}</h3>
                <p className="text-[12px] text-text-muted mb-3">{config.hardware}</p>

                {/* Specs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {config.specs.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-light border border-border text-[10px] text-text-secondary"
                    >
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
                      ? "bg-[#5e6ad2] text-white hover:bg-[#4f58b8]"
                      : "bg-surface border border-border text-text hover:bg-surface-light"
                  }`}
                >
                  Choisir
                  <ArrowRight size={12} />
                </Link>
              </GlowCard>
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
