"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

const results = [
  { icon: Clock, value: "15h", label: "économisées / semaine" },
  { icon: TrendingUp, value: "40%", label: "de productivité en plus" },
  { icon: Shield, value: "100%", label: "données sécurisées" },
];

const words = ["autonomes", "sécurisés", "efficaces", "sur-mesure"];

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
            setTimeout(() => setIsDeleting(true), 2500);
          }
        } else {
          setText(currentWord.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 80
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

function FloatingOrb({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        opacity: 0.12,
      }}
      animate={{
        y: [0, -25, 0],
        x: [0, 12, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function AgentDemo() {
  const [visibleCount, setVisibleCount] = useState(0);

  const demoMessages: { role: "user" | "agent"; text: string }[] = [
    { role: "user", text: "Résume les ventes de la semaine" },
    { role: "agent", text: "📊 Semaine 22 : 12 450€ (+8% vs S21). Top produit : Pack Pro (14 ventes). 3 commandes en attente." },
    { role: "user", text: "Relance les clients en attente de paiement" },
    { role: "agent", text: "✅ 4 relances envoyées. 2 clients ont déjà payé. Montant récupéré : 890€." },
  ];

  useEffect(() => {
    if (visibleCount < demoMessages.length) {
      const timeout = setTimeout(() => {
        setVisibleCount((c) => c + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount]);

  const visibleMessages = demoMessages.slice(0, visibleCount);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="gradient-border rounded-2xl overflow-hidden">
        <div className="bg-surface p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface" />
            </div>
            <div>
              <p className="font-semibold text-sm">Agent Boubane</p>
              <p className="text-xs text-success">Actif</p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 min-h-[180px]">
            {visibleMessages.length === 0 && (
              <div className="flex items-center gap-2 text-text-dim text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Initialisation de l&apos;agent...
              </div>
            )}
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/15 text-text rounded-br-sm"
                      : "bg-surface-light text-text/90 rounded-bl-sm border border-border"
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background orbs */}
      <FloatingOrb delay={0} size={500} x="5%" y="15%" color="rgba(99,102,241,0.6)" />
      <FloatingOrb delay={3} size={400} x="75%" y="55%" color="rgba(34,211,238,0.5)" />
      <FloatingOrb delay={6} size={300} x="85%" y="10%" color="rgba(99,102,241,0.4)" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-border mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-text-muted font-medium">Agents IA déployés en 48h</span>
            </motion.div>

            <h1 className="heading-xl mb-6">
              Des agents IA
              <br />
              <TypewriterWord />
              <br />
              <span className="text-text/80">qui travaillent pour vous</span>
            </h1>

            <p className="text-lg text-text-muted max-w-lg mb-10 leading-relaxed">
              Boubane installe des assistants IA dans votre PME. Ils automatisent vos tâches répétitives, 
              traitent vos demandes clients et analysent vos données — pendant que vous vous concentrez sur ce qui compte.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Démarrer gratuitement
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#resultats"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-text font-semibold text-sm hover:bg-surface-light hover:border-border-hover transition-all"
              >
                Voir les résultats
              </Link>
            </div>

            {/* Results */}
            <div className="flex flex-wrap gap-6">
              {results.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <r.icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{r.value}</p>
                    <p className="text-xs text-text-dim">{r.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Agent Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <AgentDemo />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
