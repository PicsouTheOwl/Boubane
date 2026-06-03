"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  metric: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Pierre Martin",
    role: "Gérant",
    company: "Atelier Martin — Ébénisterie",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    text: "L'agent qualifie les demandes, rédige les devis et planifie les RDV. Je me concentre enfin sur la création. Je récupère 3h par jour.",
    rating: 5,
    metric: "3h/jour gagnées",
  },
  {
    name: "Sophie Leroy",
    role: "Directrice",
    company: "Cabinet Delta — Conseil",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    text: "Nos rapports qui prenaient 2h sont générés automatiquement. On a pris 3 clients de plus sans embaucher personne.",
    rating: 5,
    metric: "12h/semaine gagnées",
  },
  {
    name: "Karim Benali",
    role: "Fondateur",
    company: "LogiTrans — Transport",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    text: "200 colis suivis par jour, notifications clients en temps réel. Notre taux d'erreur a chuté de 95%. Le support gagne en qualité.",
    rating: 5,
    metric: "95% moins d'erreurs",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
            Témoignages
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Ils ont franchi le pas
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-2xl mx-auto relative">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="card p-8 md:p-10 text-center"
          >
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} className="text-[#f5a623] fill-[#f5a623]" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-[1.05rem] text-text-secondary leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Metric badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 mb-5">
              <span className="text-[11px] font-medium text-[#5e6ad2]">{t.metric}</span>
            </div>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
                loading="lazy"
              />
              <div className="text-left">
                <p className="text-[13px] font-medium text-text">{t.name}</p>
                <p className="text-[11px] text-text-muted">{t.role}, {t.company}</p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-border-hover transition-colors"
            >
              <ChevronLeft size={14} className="text-text-secondary" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-5 bg-[#5e6ad2]" : "bg-text-dim hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-border-hover transition-colors"
            >
              <ChevronRight size={14} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
