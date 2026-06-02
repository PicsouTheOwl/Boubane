"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

const words = ["autonomes", "sécurisés", "intelligents", "fiables"];

function TypewriterWord() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentWord.slice(0, text.length + 1));
          if (text.length + 1 === currentWord.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setText(currentWord.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <span className="gradient-text">
      {text}
      <span className="cursor-blink" />
    </span>
  );
}

function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${
          delay % 2 === 0 ? "rgba(99,102,241,0.8)" : "rgba(34,211,238,0.8)"
        }, transparent)`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function AgentDemo() {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([]);
  const demoMessages = [
    { role: "user" as const, text: "Résume les ventes du mois dernier" },
    { role: "agent" as const, text: "📊 Ventes de mai : 47 200€ (+12% vs avril). Top produit : Pack Pro (23 unités). Tendance haussière sur les 3 dernières semaines." },
    { role: "user" as const, text: "Envoie un résumé à l'équipe" },
    { role: "agent" as const, text: "✅ Résumé envoyé à 6 membres de l'équipe via Slack. Programmation d'un rapport hebdomadaire activée." },
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < demoMessages.length) {
        setMessages((prev) => [...prev, demoMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="gradient-border rounded-2xl overflow-hidden">
        <div className="bg-surface p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
            </div>
            <div>
              <p className="font-semibold text-sm">Agent Boubane</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                En ligne
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 min-h-[200px]">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary/20 text-foreground rounded-br-md"
                      : "bg-surface-light text-foreground/90 rounded-bl-md border border-surface-border"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background orbs */}
      <FloatingOrb delay={0} size={400} x="10%" y="20%" />
      <FloatingOrb delay={2} size={300} x="70%" y="60%" />
      <FloatingOrb delay={4} size={250} x="80%" y="10%" />

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles size={14} className="text-accent" />
            <span className="text-sm text-text-muted">Nouveau — Agents IA de nouvelle génération</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            Des agents IA
            <br />
            <TypewriterWord />
            <br />
            <span className="text-foreground/80">pour votre PME</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-lg mb-10 leading-relaxed">
            Boubane déploie des assistants IA autonomes qui comprennent votre métier,
            exécutent vos tâches répétitives et sécurisent vos données.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all hover:scale-105"
            >
              Démarrer un projet
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-surface-border text-foreground font-semibold hover:bg-surface-light transition-all"
            >
              Découvrir nos services
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2 text-text-dim">
              <Shield size={16} className="text-success" />
              <span className="text-sm">Données 100% sécurisées</span>
            </div>
            <div className="flex items-center gap-2 text-text-dim">
              <Zap size={16} className="text-accent" />
              <span className="text-sm">Déploiement en 48h</span>
            </div>
            <div className="flex items-center gap-2 text-text-dim">
              <Sparkles size={16} className="text-primary-light" />
              <span className="text-sm">Sur-mesure</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Agent Demo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <AgentDemo />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-surface-border flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
