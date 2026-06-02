"use client";

import { motion } from "framer-motion";

const cases = [
  {
    company: "Atelier Martin",
    industry: "Ébénisterie",
    metric: "3h",
    metricLabel: "par jour",
    detail: "L'agent qualifie les demandes, rédige les devis et planifie les rendez-vous. Pierre se concentre sur la création.",
    config: "Mac Mini M4",
  },
  {
    company: "LogiTrans",
    industry: "Transport & logistique",
    metric: "95%",
    metricLabel: "moins d'erreurs",
    detail: "Suivi automatique de 200 colis/jour, notifications clients en temps réel. Le support gagne en qualité.",
    config: "Mac Mini M4 Pro",
  },
  {
    company: "Cabinet Delta",
    industry: "Conseil en stratégie",
    metric: "12h",
    metricLabel: "par semaine",
    detail: "Préparation automatique des rapports, synthèses de réunions, mise à jour CRM. 3 clients de plus sans embaucher.",
    config: "Serveur Linux",
  },
];

export default function CaseStudies() {
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
            Résultats
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Des gains mesurables
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
            Nos clients PME récupèrent du temps dès la première semaine.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.company}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-6 text-center hover-lift"
            >
              {/* Metric */}
              <p className="text-[2.5rem] font-semibold text-text leading-none mb-1">
                {c.metric}
              </p>
              <p className="text-[11px] text-text-muted mb-4">{c.metricLabel}</p>

              <div className="h-px bg-border mb-4" />

              {/* Company */}
              <p className="text-[13px] font-medium text-text mb-0.5">{c.company}</p>
              <p className="text-[10px] text-text-dim mb-3">{c.industry}</p>

              <p className="text-[11px] text-text-muted leading-relaxed mb-4">{c.detail}</p>

              <div className="inline-flex items-center px-2 py-1 rounded-md bg-surface-light border border-border text-[9px] text-text-dim">
                {c.config}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
