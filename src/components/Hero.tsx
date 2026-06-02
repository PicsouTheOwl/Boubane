"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, HardDrive, Wifi, Play } from "lucide-react";
import Link from "next/link";

/* === TYPING EFFECT === */
function useTypewriter(words: string[], speed = 70, pause = 3000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((p) => (p + 1) % words.length);
          }
        }
      },
      isDeleting ? speed * 0.5 : speed
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

/* === TERMINAL DEMO — Ce qui fait la diff === */
function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  const scenario = [
    "$ boubane deploy --hardware mac-mini --local",
    "",
    "▸ Déploiement de l'agent ORCHESTRATOR...",
    "▸ Configuration réseau local (192.168.1.0/24)... ✓",
    "▸ Connexion à la messagerie (IMAP/SMTP)... ✓",
    "▸ Chargement des modèles locaux (Llama 3.1 8B)... ✓",
    "▸ Indexation des documents partagés... ✓",
    "▸ Apprentissage du style d'écriture... ✓",
    "",
    "Agent prêt. Surveillance active.",
    "14:32 — 3 emails triés, 1 réponse envoyée",
    "14:35 — Rapport hebdo généré (PDF)",
    "14:41 — Alerte: stock < 15 unités (Pack Pro)",
    "",
    "▸ Données traitées: 100% local",
    "▸ Requêtes API externes: 0",
  ];

  const runDemo = () => {
    setLines([]);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (lines.length >= scenario.length) {
      setIsRunning(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, scenario[prev.length]]);
    }, 120);
    return () => clearTimeout(timeout);
  }, [isRunning, lines.length]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="screenshot">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-micro ml-2 font-mono">terminal — boubane deploy</span>
      </div>

      {/* Terminal body */}
      <div
        ref={termRef}
        className="p-5 bg-[#0a0a0a] font-mono text-[13px] leading-relaxed max-h-[360px] overflow-y-auto"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className={`${
              line.startsWith("$")
                ? "text-text font-medium"
                : line.startsWith("▸")
                ? "text-accent-light"
                : line.startsWith("Agent") || line.startsWith("▸ Données")
                ? "text-success"
                : line.includes("✓")
                ? "text-success"
                : line.includes("14:")
                ? "text-text-secondary"
                : "text-text-muted"
            }`}
          >
            {line || "\u00A0"}
          </motion.div>
        ))}
        {isRunning && (
          <span className="inline-block w-2 h-4 bg-text animate-pulse" />
        )}
        {!isRunning && lines.length === 0 && (
          <button
            onClick={runDemo}
            className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors mt-2"
          >
            <Play size={14} />
            <span className="text-xs">Voir le déploiement en action</span>
          </button>
        )}
        {!isRunning && lines.length > 0 && (
          <button
            onClick={runDemo}
            className="text-text-dim hover:text-text-muted transition-colors mt-3 text-xs"
          >
            Relancer →
          </button>
        )}
      </div>
    </div>
  );
}

/* === MAIN HERO === */
export default function Hero() {
  const typed = useTypewriter(["autonomes", "locaux", "privés", "fiables"]);

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-50" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="badge mb-8"
          >
            <div className="status-dot" />
            <span>Vos données restent chez vous</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="heading-hero mb-6"
          >
            Un agent IA sur
            <br />
            <span className="inline-flex items-baseline gap-2">
              <span>{typed}</span>
              <span className="inline-block w-1 h-[0.9em] bg-text animate-pulse" />
            </span>
            <br />
            votre hardware
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-body max-w-xl mx-auto mb-10"
          >
            Boubane installe un agent IA directement dans votre entreprise — 
            sur un Mac Mini, un NUC, ou votre serveur. Il répond à vos mails, 
            automatise vos rapports, gère votre support. 
            <span className="text-text-muted"> 100% local.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="#contact" className="btn-primary">
              Déployer un agent
              <ArrowRight size={14} />
            </Link>
            <Link href="#hardware" className="btn-secondary">
              Voir les configurations
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-micro"
          >
            <span className="flex items-center gap-1.5">
              <Cpu size={12} />
              <span>Mac Mini / NUC / Serveur</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive size={12} />
              <span>Données 100% locales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Wifi size={12} />
              <span>Clé API ou 100% offline</span>
            </span>
          </motion.div>
        </div>

        {/* Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="max-w-2xl mx-auto"
        >
          <TerminalDemo />
        </motion.div>

        {/* Logos / Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mt-16 md:mt-24"
        >
          <p className="text-micro mb-6 uppercase tracking-widest">
            Déployé sur
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-micro">
            {["Mac Mini M4", "Intel NUC", "HP ProDesk", "Serveur Linux", "DIY"].map((hw) => (
              <span key={hw} className="flex items-center gap-2">
                <HardDrive size={10} className="text-text-dim" />
                {hw}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
