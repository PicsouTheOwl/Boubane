"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    company: "Atelier Martin",
    industry: "Ébénisterie",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    metric: "3h",
    metricLabel: "par jour",
    detail:
      "L'agent qualifie les demandes, rédige les devis et planifie les rendez-vous. Pierre se concentre sur la création.",
    config: "Mac Mini M4",
    owner: "Pierre M.",
  },
  {
    company: "LogiTrans",
    industry: "Transport & logistique",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    metric: "95%",
    metricLabel: "moins d'erreurs",
    detail:
      "Suivi automatique de 200 colis/jour, notifications clients en temps réel. Le support gagne en qualité.",
    config: "Mac Mini M4 Pro",
    owner: "Karim B.",
  },
  {
    company: "Cabinet Delta",
    industry: "Conseil en stratégie",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
    metric: "12h",
    metricLabel: "par semaine",
    detail:
      "Préparation automatique des rapports, synthèses de réunions, mise à jour CRM. 3 clients de plus sans embaucher.",
    config: "Serveur Linux",
    owner: "Sophie L.",
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

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {cases.map((c, i) => (
            <motion.div
              key={c.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="card overflow-hidden hover:border-border-hover transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-40 -mx-5 -mt-5 mb-4 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />

                  {/* Metric overlay */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[2rem] font-semibold text-text leading-none">{c.metric}</p>
                    <p className="text-[10px] text-text-secondary">{c.metricLabel}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={c.avatar}
                    alt={c.owner}
                    className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-text">{c.company}</p>
                    <p className="text-[10px] text-text-dim">{c.industry}</p>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed mb-4">{c.detail}</p>

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-surface-light border border-border text-[9px] text-text-dim">
                    {c.config}
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-text-dim group-hover:text-[#5e6ad2] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
