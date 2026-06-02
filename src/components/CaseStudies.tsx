"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

const cases = [
  {
    company: "Atelier Martin",
    industry: "Artisan ébéniste",
    problem: "Passait 3h/jour à répondre aux devis et emails clients",
    solution: "Agent IA qui qualifie les demandes, rédige les devis et planifie les rendez-vous",
    results: [
      { icon: Clock, value: "3h/jour", label: "économisées" },
      { icon: TrendingUp, value: "+35%", label: "de devis signés" },
      { icon: DollarSign, value: "2 400€", label: "de CA supplémentaire/mois" },
    ],
    quote: "En 2 semaines, mon agent gérait 80% de mes demandes. Je me suis enfin concentré sur ce que je sais faire : créer.",
    author: "Pierre Martin",
    role: "Fondateur",
    color: "from-primary to-primary-dark",
  },
  {
    company: "LogiTrans",
    industry: "Transport & logistique",
    problem: "Suivi manuel de 200 colis/jour, erreurs fréquentes, clients mécontents",
    solution: "Agent IA de suivi automatique qui surveille les expéditions et notifie les clients en temps réel",
    results: [
      { icon: Clock, value: "95%", label: "moins d'erreurs" },
      { icon: TrendingUp, value: "-60%", label: "d'appels au support" },
      { icon: DollarSign, value: "18 000€", label: "économisés/an" },
    ],
    quote: "Nos clients reçoivent des mises à jour avant même de demander. Le support a enfin du temps pour les vrais problèmes.",
    author: "Sophie Chen",
    role: "Directrice des opérations",
    color: "from-accent to-cyan-600",
  },
  {
    company: "Cabinet Conseil Delta",
    industry: "Conseil en stratégie",
    problem: "Les consultants passaient 40% de leur temps sur des tâches administratives",
    solution: "Agent IA qui prépare les rapports, synthétise les réunions et met à jour le CRM",
    results: [
      { icon: Clock, value: "12h/sem", label: "économisées/consultant" },
      { icon: TrendingUp, value: "+50%", label: "de capacité client" },
      { icon: DollarSign, value: "45 000€", label: "de valeur récupérée/an" },
    ],
    quote: "Chaque consultant a gagné une demi-journée par semaine. On a pu prendre 3 clients de plus sans embaucher.",
    author: "Marc Dubois",
    role: "Associé gérant",
    color: "from-violet-500 to-purple-700",
  },
];

export default function CaseStudies() {
  return (
    <section id="resultats" className="section relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
            Résultats
          </span>
          <h2 className="heading-lg mt-4 mb-5">
            Des résultats concrets,
            <br />
            <span className="gradient-text">pas des promesses</span>
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            Voici ce que nos clients PME ont obtenu après le déploiement de leur agent IA.
          </p>
        </motion.div>

        {/* Cases */}
        <div className="space-y-8">
          {cases.map((c, i) => (
            <motion.div
              key={c.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="gradient-border rounded-2xl overflow-hidden"
            >
              <div className="bg-surface p-8 md:p-10">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left — Story */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{c.company[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.company}</p>
                        <p className="text-xs text-text-dim">{c.industry}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-1">Problème</p>
                        <p className="text-sm text-text-muted">{c.problem}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-1">Solution</p>
                        <p className="text-sm text-text-muted">{c.solution}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="border-l-2 border-primary/30 pl-4 py-1">
                      <p className="text-sm text-text/80 italic leading-relaxed">"{c.quote}"</p>
                      <footer className="mt-2 text-xs text-text-dim">
                        — {c.author}, {c.role}
                      </footer>
                    </blockquote>
                  </div>

                  {/* Right — Results */}
                  <div className="flex flex-col justify-center gap-4">
                    {c.results.map((r) => (
                      <div key={r.label} className="flex items-center gap-4 p-4 rounded-xl bg-surface-light border border-border">
                        <div className="w-10 h-10 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                          <r.icon size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-text">{r.value}</p>
                          <p className="text-xs text-text-dim">{r.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-text-muted text-sm mb-4">Ces résultats vous parlent ?</p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.03]"
          >
            Obtenir vos propres résultats
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
