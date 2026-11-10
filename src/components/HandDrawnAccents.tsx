"use client";

import React from "react";
import { motion } from "motion/react";
import { ATELIER_EASE } from "@/lib/utils";

/**
 * Soulignement organique dessiné à la main (trace de plume asymétrique) qui s'anime au scroll.
 */
export function HandDrawnUnderline({
  className = "",
  color = "#ED5B04",
  delay = 0.25,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 220 18"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-visible ${className}`}
    >
      <motion.path
        d="M 3 12.5 C 52 5.2, 134 15.6, 217 7.8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.9 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.72, delay, ease: ATELIER_EASE }}
      />
    </svg>
  );
}

/**
 * Cercle dessiné au crayon autour d'un mot ou d'un chiffre clé (imperfection organique humaine).
 */
export function HandDrawnCircle({
  className = "",
  color = "#ED5B04",
  delay = 0.3,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 140 68"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-visible ${className}`}
    >
      <motion.path
        d="M 22 14 C 58 2, 126 6, 132 31 C 138 56, 82 65, 36 60 C 4 56, -2 28, 34 11"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.75 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.95, delay, ease: ATELIER_EASE }}
      />
    </svg>
  );
}

/**
 * Note marginale manuscrite d'architecte avec flèche courbée faite à la main.
 */
export function ArchitectMarginalia({
  note,
  className = "",
  dark = false,
}: {
  note: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 42 26" className="w-9 h-6 overflow-visible shrink-0" fill="none">
        <motion.path
          d="M 4 22 C 12 8, 25 6, 38 11"
          stroke="#ED5B04"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.65, delay: 0.15, ease: ATELIER_EASE }}
        />
        <motion.path
          d="M 32 7 L 39 11.5 L 33 15.5"
          stroke="#ED5B04"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.3, delay: 0.65, ease: ATELIER_EASE }}
        />
      </svg>
      <span
        className={`font-mono text-[10px] italic tracking-[0.04em] ${
          dark ? "text-[#ED5B04]/90" : "text-[#ED5B04]"
        }`}
      >
        {note}
      </span>
    </div>
  );
}
