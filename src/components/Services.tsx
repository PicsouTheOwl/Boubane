"use client";

import { motion } from "framer-motion";
import { Mail, FileText, BarChart3, MessageSquare, Workflow, Shield, Cpu, Terminal } from "lucide-react";

const services = [
  {
    icon: Mail,
    title: "Emails automatiques",
    desc: "L'agent lit, trie et répond à vos emails. Il qualifie les demandes, envoie les devis, planifie les RDV — en imitant votre style.",
    stat: "15h/semaine",
  },
  {
    icon: FileText,
    title: "Documents & Rapports",
    desc: "Génération automatique de devis, factures, rapports hebdos. L'agent collecte les données et produit des documents prêts à envoyer.",
    stat: "Auto",
  },
  {
    icon: BarChart3,
    title: "Analyse temps réel",
    desc: "Surveillance des KPI, détection d'anomalies, alertes. Tableaux de dashboards automatiques, recommandations proactives.",
    stat: "< 5 min",
  },
  {
    icon: MessageSquare,
    title: "Support client",
    desc: "Réponses instantanées 24/7, escalade intelligente, suivi des tickets. Vos clients n'attendent plus.",
    stat: "90% auto",
  },
  {
    icon: Workflow,
    title: "Automatisation",
    desc: "L'agent connecte vos outils (CRM, Slack, compta…) et orchestre les processus. Zéro saisie manuelle.",
    stat: "∞ workflows",
  },
  {
    icon: Shield,
    title: "100% local",
    desc: "Tout tourne sur votre hardware. RGPD natif, chiffrement E2E. Vos données ne sortent jamais de votre réseau.",
    stat: "0 donnée externe",
  },
];

export default function Services() {
  return (
    <section id="produit" className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <span className="text-micro uppercase tracking-[0.2em] text-text-muted block mb-4">
            Capacités
          </span>
          <h2 className="heading-section mb-5">
            L&apos;agent s&apos;adapte
            <br />
            à votre métier
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Pas d&apos;outil à apprendre. L&apos;agent se branche sur votre messagerie, 
            vos fichiers, vos outils existants — et automatise ce qui vous prend du temps.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-surface-light border border-border flex items-center justify-center">
                  <s.icon size={16} className="text-text-secondary group-hover:text-text transition-colors" />
                </div>
                <span className="text-micro text-accent font-medium">{s.stat}</span>
              </div>
              <h3 className="heading-card mb-2">{s.title}</h3>
              <p className="text-small">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Inline demo hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
            <Terminal size={14} className="text-accent" />
            <span className="text-small">
              Ou configurez vos propres scénarios — aucune limite.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
