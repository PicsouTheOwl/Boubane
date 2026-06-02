"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Mail, FileText, BarChart3, MessageSquare, ArrowRight } from "lucide-react";

const flow = [
  {
    icon: Server,
    label: "Votre hardware",
    desc: "Mac Mini, NUC ou serveur",
    sub: "Chez vous",
  },
  {
    icon: Monitor,
    label: "Agent Boubane",
    desc: "ORCHESTRATOR",
    sub: "100% local",
  },
  {
    icon: Mail,
    label: "Emails",
    desc: "Tri, réponses, suivi",
    sub: "Automatique",
  },
  {
    icon: FileText,
    label: "Documents",
    desc: "Devis, rapports, factures",
    sub: "Générés",
  },
  {
    icon: BarChart3,
    label: "Analyses",
    desc: "KPI, alertes, insights",
    sub: "Temps réel",
  },
  {
    icon: MessageSquare,
    label: "Support",
    desc: "Réponses 24/7",
    sub: "Autonome",
  },
];

export default function Deployment() {
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
            Architecture
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Comment ça marche
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
            L&apos;agent s&apos;installe sur votre hardware et se connecte à vos outils existants. 
            Rien ne change pour votre équipe.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {flow.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <div className="card p-4 text-center h-full">
                  <div className="w-8 h-8 rounded-lg bg-surface-light border border-border flex items-center justify-center mx-auto mb-3">
                    <item.icon size={14} className="text-text-secondary" />
                  </div>
                  <p className="text-[13px] font-medium text-text mb-0.5">{item.label}</p>
                  <p className="text-[11px] text-text-muted">{item.desc}</p>
                  <p className="text-[10px] text-text-dim mt-1.5">{item.sub}</p>
                </div>

                {/* Arrow (not on last item) */}
                {i < flow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight size={12} className="text-text-dim" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Connection line (mobile) */}
          <div className="flex items-center justify-center gap-2 mt-6 lg:hidden">
            <div className="h-px w-8 bg-border" />
            <span className="text-[10px] text-text-dim">tout est connecté localement</span>
            <div className="h-px w-8 bg-border" />
          </div>
        </div>

        {/* Key point */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#30a46c]" />
              <span className="text-[12px] text-text-secondary">Internet requis</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-[12px] text-text-muted">optionnel (clés API)</span>
            <div className="w-px h-4 bg-border" />
            <span className="text-[12px] text-text-muted">100% offline possible</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
