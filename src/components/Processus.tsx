"use client";

import { motion } from "framer-motion";
import { Package, Settings, Zap, Headphones } from "lucide-react";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Livraison",
    desc: "Mac Mini, NUC ou votre serveur — configuré et testé chez nous, livré prêt à brancher sur votre réseau.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Installation",
    desc: "On installe l'agent, on le connecte à vos outils (mail, CRM, fichiers), on paramètre vos règles métier.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Apprentissage",
    desc: "L'agent analyse vos emails, vos documents, votre façon de travailler. Il apprend votre style en quelques jours.",
  },
  {
    icon: Headphones,
    step: "04",
    title: "Autonomie",
    desc: "L'agent travaille en autonomie. On surveille, on ajuste, on améliore. Vous avez un interlocuteur dédié.",
  },
];

export default function Processus() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
                Processus
              </span>
              <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
                Du hardware
                <br />
                à l&apos;autonomie
              </h2>
              <p className="text-[0.95rem] text-text-secondary mb-6">
                On s&apos;occupe de tout. Vous branchez, on configure,
                l&apos;agent apprend — et vous gagnez du temps dès la première semaine.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 text-[11px] text-[#5e6ad2] font-medium">
                <Zap size={11} />
                Déploiement en 48h après livraison
              </div>
            </motion.div>
          </div>

          {/* Right — Timeline */}
          <div className="lg:col-span-3 space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 group"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center shrink-0 group-hover:bg-[#5e6ad2]/20 transition-colors">
                    <step.icon size={14} className="text-[#5e6ad2]" />
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p className="text-[10px] text-text-dim mb-1 font-mono">{step.step}</p>
                  <h3 className="text-[14px] font-semibold text-text mb-1">{step.title}</h3>
                  <p className="text-[12px] text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
