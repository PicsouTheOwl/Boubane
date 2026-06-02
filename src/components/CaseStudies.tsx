"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    company: "Atelier Martin",
    industry: "Ébénisterie",
    result: "3h/jour économisées sur les emails et devis",
    metric: "3h/jour",
    detail: "L'agent qualifie les demandes, rédige les devis et planifie les rendez-vous. Pierre se concentre sur la création.",
    config: "Mac Mini M4",
  },
  {
    company: "LogiTrans",
    industry: "Transport & logistique",
    result: "95% moins d'erreurs de suivi colis",
    metric: "95%",
    detail: "Suivi automatique de 200 colis/jour, notifications clients en temps réel. Le support gagne en qualité.",
    config: "Mac Mini M4 Pro",
  },
  {
    company: "Cabinet Delta",
    industry: "Conseil en stratégie",
    result: "12h/semaine récupérées par consultant",
    metric: "12h/sem",
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

        <div className="max-w-4xl mx-auto space-y-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.company}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* Company */}
                <div className="md:w-40 shrink-0">
                  <p className="text-[13px] font-medium text-text">{c.company}</p>
                  <p className="text-[11px] text-text-muted">{c.industry}</p>
                </div>

                {/* Result */}
                <div className="flex-1">
                  <p className="text-[13px] text-text-secondary">{c.result}</p>
                  <p className="text-[11px] text-text-dim mt-1">{c.detail}</p>
                </div>

                {/* Metric */}
                <div className="md:text-right shrink-0">
                  <p className="text-[15px] font-semibold text-text">{c.metric}</p>
                  <p className="text-[10px] text-text-dim">{c.config}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
