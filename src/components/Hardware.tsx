"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive, Wifi, Shield, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const configs = [
  {
    name: "Essential",
    hardware: "Mac Mini M4",
    specs: ["Apple M4 10 cœurs", "16 Go RAM", "256 Go SSD", "macOS"],
    price: "à partir de 590€",
    priceNote: "hardware inclus",
    features: [
      "1 agent IA principal",
      "Jusqu'à 500 emails/mois",
      "Réponses automatiques",
      "Rapports hebdomadaires",
      "Support par email",
    ],
    recommended: false,
  },
  {
    name: "Professional",
    hardware: "Mac Mini M4 Pro",
    specs: ["Apple M4 Pro 14 cœurs", "32 Go RAM", "512 Go SSD", "macOS"],
    price: "à partir de 1 190€",
    priceNote: "hardware inclus",
    features: [
      "3 agents IA spécialisés",
      "Emails illimités",
      "Support client 24/7",
      "Rapports temps réel",
      "Intégrations multiples",
      "Formation équipe incluse",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    hardware: "Serveur sur-mesure",
    specs: ["Intel Xeon / AMD EPYC", "64+ Go RAM", "1+ To SSD", "Ubuntu / Debian"],
    price: "Sur devis",
    priceNote: "configuration adaptée",
    features: [
      "Agents illimités",
      "Modèles LLM multiples",
      "GPU dédié (optionnel)",
      "Hébergement rack",
      "SLA 99.9%",
      "Account manager dédié",
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
          className="text-center mb-16"
        >
          <span className="text-micro uppercase tracking-[0.2em] text-text-muted block mb-4">
            Hardware
          </span>
          <h2 className="heading-section mb-5">
            Votre agent tourne
            <br />
            sur votre machine
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Pas de cloud. Pas de données qui sortent. 
            L&apos;agent s&apos;installe sur le hardware que vous choisissez — 
            et il s&apos;adapte à vos besoins.
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
              className={`card p-6 flex flex-col ${
                config.recommended ? "border-accent/30" : ""
              }`}
            >
              {config.recommended && (
                <div className="text-micro text-accent font-medium mb-3">
                  Recommandé
                </div>
              )}

              <h3 className="heading-card mb-1">{config.name}</h3>
              <p className="text-small mb-4">{config.hardware}</p>

              {/* Specs */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {config.specs.map((spec) => (
                  <span key={spec} className="badge text-micro">
                    {spec}
                  </span>
                ))}
              </div>

              <hr className="divider my-5" />

              {/* Price */}
              <div className="mb-6">
                <p className="text-text font-semibold text-lg">{config.price}</p>
                <p className="text-micro">{config.priceNote}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {config.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-small">
                    <Check size={14} className="text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                className={`w-full justify-center ${
                  config.recommended ? "btn-primary" : "btn-secondary"
                }`}
              >
                Choisir cette config
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <hr className="divider mb-12" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HardDrive,
                title: "On installe",
                desc: "On configure le hardware chez vous — Mac Mini, NUC, ou votre serveur.",
              },
              {
                icon: Cpu,
                title: "L'agent apprend",
                desc: "Il analyse vos mails, vos fichiers, vos processus. Il apprend votre façon de travailler.",
              },
              {
                icon: Shield,
                title: "Ça tourne",
                desc: "L'agent travaille en autonomie. Vos données ne quittent jamais votre réseau.",
              },
            ].map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                  <step.icon size={18} className="text-text-secondary" />
                </div>
                <p className="text-micro text-text-muted mb-2">Étape {i + 1}</p>
                <p className="heading-card text-sm mb-2">{step.title}</p>
                <p className="text-small">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
