"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "490€",
    period: "/mois",
    description: "Pour démarrer avec un agent IA simple et efficace",
    features: [
      "1 agent IA métier",
      "Jusqu'à 500 requêtes/mois",
      "Intégration email + 1 outil",
      "Support par email",
      "Déploiement en 48h",
    ],
    cta: "Commencer",
    popular: false,
    color: "border-border",
  },
  {
    name: "Growth",
    price: "990€",
    period: "/mois",
    description: "Pour les PME qui veulent automatiser plusieurs processus",
    features: [
      "3 agents IA spécialisés",
      "Requêtes illimitées",
      "Intégrations multiples (CRM, Slack, etc.)",
      "Support prioritaire",
      "Formation équipe incluse",
      "Rapports hebdomadaires",
    ],
    cta: "Démarrer",
    popular: true,
    color: "border-primary/40",
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    period: "",
    description: "Solution sur-mesure pour des besoins complexes",
    features: [
      "Agents illimités",
      "Développement sur-mesure",
      "Hébergement dédié (France)",
      "SLA garanti 99.9%",
      "Account manager dédié",
      "Audit IA complet",
    ],
    cta: "Nous contacter",
    popular: false,
    color: "border-border",
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="section relative">
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
            Tarifs
          </span>
          <h2 className="heading-lg mt-4 mb-5">
            Un investissement,
            <br />
            <span className="gradient-text">pas un coût</span>
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            À partir de 490€/mois. Le retour sur investissement est généralement visible dès le premier mois.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative gradient-border rounded-2xl p-8 flex flex-col ${plan.popular ? "scale-[1.02]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold flex items-center gap-1">
                  <Sparkles size={12} />
                  Populaire
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-text-dim">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-text">{plan.price}</span>
                {plan.period && <span className="text-text-dim text-sm">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="text-success mt-0.5 shrink-0" />
                    <span className="text-sm text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.98] ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/20"
                    : "border border-border text-text hover:bg-surface-light hover:border-border-hover"
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-text-dim mt-8"
        >
          Engagement minimum 3 mois. Annulation possible après. TVA non incluse.
        </motion.p>
      </div>
    </section>
  );
}
