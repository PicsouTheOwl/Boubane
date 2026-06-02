"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Eye, Server, Lock, Cpu } from "lucide-react";

const reasons = [
  {
    icon: Server,
    title: "100% local",
    desc: "L'agent tourne sur votre hardware, dans votre entreprise. Vos données ne sortent jamais de votre réseau. Pas de cloud, pas de risque.",
  },
  {
    icon: Lock,
    title: "Zéro donnée externe",
    desc: "Contrairement aux solutions SaaS, aucun email, aucun document, aucune donnée ne transite par des serveurs tiers. RGPD natif.",
  },
  {
    icon: Zap,
    title: "Déploiement en 48h",
    desc: "On livre le hardware configuré, on installe l'agent, on connecte vos outils. En 48h, votre agent est opérationnel.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    desc: "Vous voyez tout ce que fait l'agent. Chaque action est loggable, auditable. Vous gardez le contrôle à 100%.",
  },
  {
    icon: Cpu,
    title: "Sur-mesure",
    desc: "Chaque agent est configuré pour votre métier, vos processus, votre façon de travailler. Pas de solution générique.",
  },
  {
    icon: Shield,
    title: "Support dédié",
    desc: "Un interlocuteur unique, disponible, qui connaît votre installation. Pas de ticket anonyme, pas de chatbot.",
  },
];

export default function WhyBoubane() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
            Pourquoi Boubane
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Pas un SaaS de plus
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
            Un agent qui vous appartient, qui tourne chez vous, 
            et qui ne partage rien avec personne.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 group hover-lift"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-surface-light border border-border flex items-center justify-center shrink-0 group-hover:border-border-hover transition-colors">
                  <r.icon size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-text mb-1">{r.title}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="card overflow-hidden">
            <div className="grid grid-cols-3 text-[11px]">
              {/* Header */}
              <div className="p-3 bg-surface-light border-b border-border font-medium text-text-secondary">
                Critère
              </div>
              <div className="p-3 bg-surface-light border-b border-border font-medium text-[#5e6ad2] text-center">
                Boubane
              </div>
              <div className="p-3 bg-surface-light border-b border-border font-medium text-text-muted text-center">
                SaaS classique
              </div>

              {/* Rows */}
              {[
                ["Données", "100% locales", "Cloud tiers"],
                ["RGPD", "Natif", "Variable"],
                ["Personnalisation", "Sur-mesure", "Limitée"],
                ["Disponibilité", "48h", "Immédiate"],
                ["Coût long terme", "Prévisible", "Croissant"],
                ["Contrôle", "Total", "Partiel"],
              ].map(([critere, boubane, saas], i) => (
                <div key={critere} className="contents">
                  <div className={`p-3 border-b border-border text-text-secondary ${i === 5 ? "" : ""}`}>
                    {critere}
                  </div>
                  <div className="p-3 border-b border-border text-center text-[#30a46c]">
                    {boubane}
                  </div>
                  <div className="p-3 border-b border-border text-center text-text-dim">
                    {saas}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
