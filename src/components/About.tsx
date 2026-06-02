"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Clock, Award } from "lucide-react";

const stats = [
  { value: "50+", label: "Agents déployés", icon: Users },
  { value: "48h", label: "Temps de déploiement", icon: Clock },
  { value: "99.9%", label: "Disponibilité", icon: CheckCircle2 },
  { value: "100%", label: "Satisfaction client", icon: Award },
];

const values = [
  "Sécurité first — Vos données ne quittent jamais votre infrastructure",
  "Transparence totale — Vous contrôlez tout ce que fait votre agent",
  "Sur-mesure — Pas de solution générique, chaque agent est unique",
  "Humain au centre — L'IA assiste, ne remplace pas",
];

export default function About() {
  return (
    <section id="apropos" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">
              À propos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              L'IA au service
              <br />
              <span className="gradient-text">des PME</span>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Boubane est née d'un constat : les PME ont autant besoin d'IA que les grandes entreprises,
              mais n'ont ni le budget ni les équipes techniques pour en bénéficier.
              <br /><br />
              Notre mission ? Démocratiser l'IA en déployant des agents autonomes, sécurisés et
              parfaitement adaptés à votre métier. Pas de promesses vides, des résultats concrets.
            </p>

            {/* Values */}
            <div className="space-y-4">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="text-success mt-0.5 shrink-0" />
                  <span className="text-foreground/80 text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="gradient-border rounded-2xl p-8 text-center hover:scale-[1.03] transition-transform"
              >
                <stat.icon size={28} className="text-accent mx-auto mb-4" />
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
