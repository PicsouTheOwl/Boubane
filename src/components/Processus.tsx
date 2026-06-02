"use client";

import { motion } from "framer-motion";
import { Package, Settings, Rocket, Headphones } from "lucide-react";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Livraison du hardware",
    desc: "Mac Mini, NUC ou votre serveur — configuré et testé chez nous, livré prêt à brancher.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Installation & configuration",
    desc: "On installe l'agent, on le connecte à vos outils (mail, CRM, fichiers), on paramètre vos règles métier.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Formation de l'agent",
    desc: "L'agent analyse vos emails, vos documents, votre façon de travailler. Il apprend votre style en quelques jours.",
  },
  {
    icon: Headphones,
    step: "04",
    title: "Autonomie & suivi",
    desc: "L'agent travaille en autonomie. On surveille, on ajuste, on améliore. Vous avez un interlocuteur dédié.",
  },
];

export default function Processus() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="text-micro uppercase tracking-[0.2em] text-text-muted block mb-4">
              Processus
            </span>
            <h2 className="heading-section mb-5">
              Du硬件 à l&apos;autonomie
              <br />
              en 4 étapes
            </h2>
            <p className="text-body mb-8">
              On s&apos;occupe de tout. Vous branchez, on configure, 
              l&apos;agent apprend — et vous gagnez du temps dès la première semaine.
            </p>
            <div className="badge">
              <Rocket size={12} />
              <span>Déploiement en 48h après livraison</span>
            </div>
          </motion.div>

          {/* Right — Steps */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 pb-8"
              >
                {/* Left column — step number & line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                    <step.icon size={14} className="text-text-secondary" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="text-micro text-text-dim mb-1">{step.step}</p>
                  <h3 className="heading-card text-sm mb-1.5">{step.title}</h3>
                  <p className="text-small">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
