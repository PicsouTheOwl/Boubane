"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, HardDrive, Wifi, Play, Check } from "lucide-react";
import Link from "next/link";
import NodeNetwork from "./NodeNetwork";

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

/* === TERMINAL DEMO === */
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
    }, 100);
    return () => clearTimeout(timeout);
  }, [isRunning, lines.length]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[11px] text-text-dim font-mono ml-2">terminal</span>
      </div>

      {/* Terminal body */}
      <div
        ref={termRef}
        className="p-4 bg-[#080808] font-mono text-[12px] leading-[1.7] max-h-[320px] overflow-y-auto"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }}
            className={
              line.startsWith("$")
                ? "text-text"
                : line.startsWith("▸") && line.includes("✓")
                ? "text-[#30a46c]"
                : line.startsWith("▸")
                ? "text-[#5e6ad2]"
                : line.startsWith("Agent")
                ? "text-text font-medium"
                : line.includes("14:")
                ? "text-text-secondary"
                : "text-text-muted"
            }
          >
            {line || "\u00A0"}
          </motion.div>
        ))}
        {isRunning && (
          <span className="inline-block w-1.5 h-3.5 bg-text animate-pulse" />
        )}
        {!isRunning && lines.length === 0 && (
          <button
            onClick={runDemo}
            className="flex items-center gap-2 text-[#5e6ad2] hover:text-[#7c85e0] transition-colors mt-1"
          >
            <Play size={12} />
            <span className="text-[12px]">Voir le déploiement</span>
          </button>
        )}
        {!isRunning && lines.length > 0 && (
          <button
            onClick={runDemo}
            className="text-text-dim hover:text-text-muted transition-colors mt-2 text-[11px]"
          >
            ↻ Relancer
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
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden">
      {/* Node network background */}
      <div className="absolute inset-0 opacity-40">
        <NodeNetwork />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#30a46c]" />
            <span className="text-[11px] text-text-secondary font-medium">
              100% local — Vos données restent chez vous
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text mb-5"
          >
            Un agent IA
            <br />
            <span className="inline-flex items-baseline gap-1">
              <span>{typed}</span>
              <span className="inline-block w-0.5 h-[0.85em] bg-text animate-pulse" />
            </span>
            <br />
            <span className="text-text-muted">sur votre hardware</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[1.05rem] text-text-secondary leading-relaxed max-w-lg mx-auto mb-8"
          >
            Boubane installe un agent IA dans votre entreprise — sur un Mac Mini, 
            un NUC, ou votre serveur. Il répond à vos mails, automatise vos rapports, 
            gère votre support.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-text text-bg font-medium text-[13px] hover:bg-[#f0f0f0] transition-colors"
            >
              Déployer un agent
              <ArrowRight size={13} />
            </Link>
            <Link
              href="#hardware"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface border border-border text-text font-medium text-[13px] hover:bg-surface-light transition-colors"
            >
              Voir les configurations
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-5 mt-8"
          >
            {[
              { icon: Cpu, text: "Mac Mini / NUC / Serveur" },
              { icon: HardDrive, text: "Données 100% locales" },
              { icon: Wifi, text: "API ou 100% offline" },
            ].map((t) => (
              <span key={t.text} className="flex items-center gap-1.5 text-[11px] text-text-dim">
                <t.icon size={11} />
                {t.text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="max-w-xl mx-auto"
        >
          <TerminalDemo />
        </motion.div>

        {/* Deployed on */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mt-14 md:mt-20"
        >
          <p className="text-[10px] text-text-dim uppercase tracking-[0.15em] mb-5">
            Déployé sur
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["Mac Mini M4", "Intel NUC", "HP ProDesk", "Serveur Linux", "DIY"].map((hw) => (
              <span key={hw} className="flex items-center gap-1.5 text-[11px] text-text-dim">
                <HardDrive size={10} />
                {hw}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
