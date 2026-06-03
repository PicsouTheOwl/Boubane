"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlowCard({
  children,
  className = "",
  glowColor = "rgba(94, 106, 210, 0.15)",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-border-hover ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
