"use client";

import { motion } from "framer-motion";
import { Brain, MessageSquare, BarChart3, Shield, Cog, Headphones } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Agent IA Métier",
    description:
      "Un assistant qui connaît votre entreprise sur le bout des doigts. Il répond aux questions, rédige des documents et prend des décisions selon vos règles.",
    features: ["Compréhension contextuelle", "Mémoire à long terme", "Décisions autonomes"],
    color: "from-primary to-primary-dark",
  },
  {
    icon: MessageSquare,
    title: "Support Client IA",
    description:
      "Un agent disponible 24/7 qui traite les demandes clients, escalade les cas complexes et maintient la satisfaction à son maximum.",
    features: ["Disponibilité 24/7", "Multi-canal", "Escalade intelligente"],
    color: "from-accent to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Analyse & Reporting",
    description:
      "Automatisez vos rapports, dashboards et analyses. Votre agent collecte, traite et présente les données clés de votre business.",
    features: ["Rapports automatiques", "Alertes en temps réel", "Recommandations"],
    color: "from-violet-500 to-purple-700",
  },
  {
    icon: Shield,
    title: "Sécurité & Conformité",
    description:
      "Vos agents Boubane respectent les normes RGPD et les standards de sécurité. Hébergement en France, données chiffrées.",
    features: ["RGPD compliant", "Hébergement FR", "Chiffrement E2E"],
    color: "from-emerald-500 to-green-700",
  },
  {
    icon: Cog,
    title: "Automatisation Workflow",
    description:
      "Connectez vos outils existants (CRM, ERP, Slack, email) et laissez vos agents orchestrer les processus automatiquement.",
    features: ["Intégrations multiples", "Workflows visuels", "Zéro code"],
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Headphones,
    title: "Formation & Suivi",
    description:
      "On ne vous laisse pas seuls. Formation de votre équipe, monitoring continu et optimisation des performances de vos agents.",
    features: ["Formation incluse", "Monitoring 24/7", "Amélioration continue"],
    color: "from-pink-500 to-rose-700",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services() {
  return (
    <section id="services" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Tout ce dont votre PME
            <br />
            <span className="gradient-text">a besoin</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Des solutions IA modulables, déployées rapidement et adaptées à votre réalité.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group gradient-border rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 cursor-default"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}
              >
                <service.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-full bg-surface-light text-xs text-text-muted border border-surface-border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
