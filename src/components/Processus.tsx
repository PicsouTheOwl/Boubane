"use client";

import { motion } from "framer-motion";
import { MessageCircle, Settings, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Découverte",
    description:
      "On analyse vos besoins, vos processus et vos outils existants. On identifie les tâches à automatiser et les gains potentiels.",
    duration: "1-2 jours",
  },
  {
    icon: Settings,
    step: "02",
    title: "Configuration",
    description:
      "On configure votre agent IA selon vos règles métier. Intégration avec vos outils (CRM, Slack, email, etc.).",
    duration: "2-3 jours",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Déploiement",
    description:
      "Votre agent est mis en production. Tests, validation et formation de votre équipe. Zéro interruption de service.",
    duration: "1 jour",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimisation",
    description:
      "Monitoring continu, ajustements et améliorations. Votre agent apprend et devient plus efficace chaque jour.",
    duration: "Continu",
  },
];

export default function Processus() {
  return (
    <section id="processus" className="relative py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Processus
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            De l'idée à la réalité
            <br />
            <span className="gradient-text">en 4 étapes</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Un processus éprouvé pour déployer vos agents IA rapidement, sans risque.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="gradient-border rounded-2xl p-8 text-center hover:scale-[1.03] transition-transform duration-300">
                {/* Step number */}
                <div className="text-5xl font-bold text-primary/10 mb-4">{step.step}</div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <step.icon size={28} className="text-primary-light" />
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  {step.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
