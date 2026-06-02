"use client";

import { motion } from "framer-motion";
import { Mail, FileText, BarChart3, MessageSquare, FolderSync, Shield, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Mail,
    title: "Emails automatiques",
    desc: "Votre agent lit, trie et répond à vos emails en imitant votre style. Il qualifie les demandes, envoie les devis, planifie les RDV.",
    metric: "15h/semaine économisées",
    color: "from-primary to-primary-dark",
  },
  {
    icon: FileText,
    title: "Documents & Rapports",
    desc: "Génération automatique de devis, factures, rapports hebdos. L'agent collecte les données et produit des documents prêts à envoyer.",
    metric: "40 rapports/mois automatisés",
    color: "from-accent to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Analyse en temps réel",
    desc: "Votre agent surveille vos KPIs, détecte les anomalies et vous alerte. Tableaux de bord automatiques, recommandations proactives.",
    metric: "Détection en < 5 min",
    color: "from-violet-500 to-purple-700",
  },
  {
    icon: MessageSquare,
    title: "Support client 24/7",
    desc: "Réponses instantanées aux questions fréquentes, escalade intelligente, suivi des tickets. Vos clients ne attendent plus.",
    metric: "90% résolu sans humain",
    color: "from-emerald-500 to-green-700",
  },
  {
    icon: FolderSync,
    title: "Automatisation workflow",
    desc: "L'agent connecte vos outils (CRM, Slack, compta…) et orchestre les processus. Zéro saisie manuelle, zéro erreur.",
    metric: "0 tâche répétitive",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Sécurité & Conformité",
    desc: "Tout tourne sur votre infrastructure. RGPD natif, chiffrement E2E, audit complet. Vos données restent chez vous.",
    metric: "100% données privées",
    color: "from-pink-500 to-rose-700",
  },
];

export default function Services() {
  return (
    <section id="services" className="section relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">
            Ce que fait votre agent
          </span>
          <h2 className="heading-lg mt-5 mb-6">
            Il s&apos;intègre là où
            <br />
            <span className="gradient-text">vous travaillez déjà</span>
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto">
            Pas de nouvel outil à apprendre. Voté agent se branche sur votre messagerie, 
            vos fichiers, vos outils existants — et automatise ce qui vous prend du temps.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group gradient-border rounded-2xl p-7 hover:scale-[1.02] transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={16} className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="pt-4 border-t border-border">
                <span className="text-xs font-semibold text-accent">{s.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
