"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Cpu, Network, Terminal, ChevronRight } from "lucide-react";
import Link from "next/link";
import HeroCanvas from "./HeroCanvas";

/* === TYPING EFFECT === */
function useTypewriter(words: string[], speed = 80, pause = 2500) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), pause);
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((p) => (p + 1) % words.length);
          }
        }
      },
      isDeleting ? speed * 0.6 : speed
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

/* === AGENT TERMINAL DEMO === */
const scenarios = [
  {
    label: "Email automatique",
    icon: "📧",
    conversation: [
      { from: "trigger", text: "Nouveau email reçu : 'Demande de devis — Salle de sport FitPlus'" },
      { from: "agent", text: "Analyse de la demande..." },
      { from: "agent", text: "✓ Devis personnalisé généré (PDF)" },
      { from: "agent", text: "✓ Réponse envoyée en nom de Marc (ton professionnel)" },
      { from: "agent", text: "✓ RDV de suivi ajouté au calendrier" },
      { from: "agent", text: "→ Tâche suivante : relance automatique dans 3 jours si pas de réponse" },
    ],
  },
  {
    label: "Rapport commercial",
    icon: "📊",
    conversation: [
      { from: "trigger", text: "Commande : 'Prépare le rapport hebdo de la semaine 22'" },
      { from: "agent", text: "Collecte des données CRM + compta..." },
      { from: "agent", text: "CA S22 : 47 200€ (+12% vs S21)" },
      { from: "agent", text: "Top produit : Pack Pro (23 unités, 7 127€)" },
      { from: "agent", text: "⚠️ Alerte : stock Pack Pro < 15 unités" },
      { from: "agent", text: "✓ Rapport PDF généré et envoyé à l'équipe" },
    ],
  },
  {
    label: "Support client",
    icon: "💬",
    conversation: [
      { from: "trigger", text: "Ticket #1847 : 'Problème livraison — commande #8834'" },
      { from: "agent", text: "Recherche commande #8834..." },
      { from: "agent", text: "Statut : Colis en transit, retard estimé 2 jours" },
      { from: "agent", text: "✓ Email d'excuse envoyé au client" },
      { from: "agent", text: "✓ Code promo 10% appliqué sur prochaine commande" },
      { from: "agent", text: "✓ Ticket résolu — satisfaction estimée : 4.5/5" },
    ],
  },
];

function AgentTerminal() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const runScenario = (index: number) => {
    setActiveScenario(index);
    setVisibleLines(0);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || visibleLines >= scenarios[activeScenario].conversation.length) {
      if (visibleLines >= scenarios[activeScenario].conversation.length) {
        setIsRunning(false);
      }
      return;
    }
    const timeout = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 800);
    return () => clearTimeout(timeout);
  }, [isRunning, visibleLines, activeScenario]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const scenario = scenarios[activeScenario];

  return (
    <div className="terminal w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-dot bg-[#ef4444]" />
        <div className="terminal-dot bg-[#f59e0b]" />
        <div className="terminal-dot bg-[#10b981]" />
        <span className="ml-3 text-text-dim text-xs font-mono">orchestrator — agent runtime</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="status-dot" />
          <span className="text-success text-[10px] font-mono">ONLINE</span>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="flex gap-2 p-3 border-b border-border">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => runScenario(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScenario === i
                ? "bg-primary/15 text-primary-light border border-primary/20"
                : "text-text-dim hover:text-text-muted hover:bg-surface-light"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Terminal body */}
      <div ref={terminalRef} className="terminal-body min-h-[280px] max-h-[320px]">
        {/* Agent info line */}
        <div className="flex items-center gap-2 mb-4 text-text-dim">
          <Cpu size={12} />
          <span className="text-[11px] font-mono">ORCHESTRATOR v2.1 — Agent principal</span>
          <span className="text-[10px] text-success ml-auto">● connecté</span>
        </div>

        {/* Conversation */}
        <div className="space-y-2">
          {scenario.conversation.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`${activeScenario}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`text-[12px] font-mono leading-relaxed ${
                line.from === "trigger"
                  ? "text-accent/70"
                  : "text-text-muted"
              }`}
            >
              <span className="text-text-dim mr-2">
                {line.from === "trigger" ? "▸" : "→"}
              </span>
              {line.text}
            </motion.div>
          ))}
          {isRunning && (
            <div className="text-text-dim text-[12px] font-mono">
              <span className="cursor-blink" />
            </div>
          )}
        </div>

        {/* Run button */}
        {!isRunning && visibleLines === 0 && (
          <button
            onClick={() => runScenario(activeScenario)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary-light text-xs font-medium hover:bg-primary/15 transition-colors"
          >
            <Terminal size={14} />
            Exécuter le scénario
          </button>
        )}

        {!isRunning && visibleLines >= scenario.conversation.length && (
          <button
            onClick={() => runScenario(activeScenario)}
            className="mt-4 flex items-center gap-2 text-text-dim text-xs hover:text-text-muted transition-colors"
          >
            <ChevronRight size={14} />
            Relancer
          </button>
        )}
      </div>
    </div>
  );
}

/* === MAIN HERO === */
export default function Hero() {
  const typed = useTypewriter(["autonomes", "sécurisés", "invisibles", "fiables"]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Background */}
      <HeroCanvas />

      <div className="container relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10"
            >
              <div className="status-dot" />
              <span className="text-xs text-text-muted font-medium">
                Agents IA locaux — Données 100% privées
              </span>
            </motion.div>

            <h1 className="heading-xl mb-7">
              Des agents IA
              <br />
              <span className="gradient-text">{typed}</span>
              <span className="cursor-blink" />
              <br />
              <span className="text-text/70">intégrés à votre entreprise</span>
            </h1>

            <p className="text-lg text-text-muted max-w-lg mb-10 leading-relaxed">
              Boubane installe des agents IA directement dans votre environnement de travail — 
              votre réseau, vos mails, vos outils. Ils automatisent vos tâches répétitives, 
              répondent à vos mails, préparent vos rapports. 
              <span className="text-text/60"> Vos données ne sortent jamais de chez vous.</span>
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="#contact" className="btn-primary">
                Déployer mon agent
                <ArrowRight size={16} />
              </Link>
              <Link href="#demo" className="btn-ghost">
                Voir la démo
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Shield, text: "100% local" },
                { icon: Network, text: "Vos outils, votre réseau" },
                { icon: Cpu, text: "Déploiement 48h" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 text-text-dim">
                  <t.icon size={14} className="text-accent/60" />
                  <span className="text-xs font-medium">{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Agent Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            id="demo"
          >
            <AgentTerminal />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent z-10" />
    </section>
  );
}
