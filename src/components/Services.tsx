"use client";

import { motion } from "framer-motion";
import { Mail, FileText, BarChart3, MessageSquare, Workflow, Shield, Cpu } from "lucide-react";

const services = [
  {
    icon: Mail,
    title: "Emails automatiques",
    desc: "L'agent lit, trie et répond à vos emails. Il qualifie les demandes, envoie les devis, planifie les RDV — en imitant votre style.",
    stat: "15h/semaine",
    statLabel: "économisées",
  },
  {
    icon: FileText,
    title: "Documents & Rapports",
    desc: "Génération automatique de devis, factures, rapports hebdos. L'agent collecte les données et produit des documents prêts à envoyer.",
    stat: "Auto",
    statLabel: "génération",
  },
  {
    icon: BarChart3,
    title: "Analyse temps réel",
    desc: "Surveillance des KPI, détection d'anomalies, alertes. Dashboards automatiques, recommandations proactives.",
    stat: "< 5 min",
    statLabel: "détection",
  },
  {
    icon: MessageSquare,
    title: "Support client",
    desc: "Réponses instantanées 24/7, escalade intelligente, suivi des tickets. Vos clients n'attendent plus.",
    stat: "90%",
    statLabel: "résolu seul",
  },
  {
    icon: Workflow,
    title: "Automatisation",
    desc: "L'agent connecte vos outils (CRM, Slack, compta…) et orchestre les processus. Zéro saisie manuelle.",
    stat: "∞",
    statLabel: "workflows",
  },
  {
    icon: Shield,
    title: "100% local",
    desc: "Tout tourne sur votre hardware. RGPD natif, chiffrement E2E. Vos données ne sortent jamais de votre réseau.",
    stat: "0",
    statLabel: "donnée externe",
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
          className="text-center mb-14"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
            Capacités
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            L&apos;agent s&apos;adapte
            <br />
            à votre métier
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
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
              className="card p-5 group hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-surface-light border border-border flex items-center justify-center group-hover:border-border-hover transition-colors">
                  <s.icon size={15} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-text">{s.stat}</p>
                  <p className="text-[9px] text-text-dim uppercase tracking-wider">{s.statLabel}</p>
                </div>
              </div>
              <h3 className="text-[14px] font-semibold text-text mb-1.5">{s.title}</h3>
              <p className="text-[12px] text-text-muted leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
            <Cpu size={12} className="text-[#5e6ad2]" />
            <span className="text-[11px] text-text-secondary">
              Chaque agent est configuré pour votre métier — aucune limite.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
