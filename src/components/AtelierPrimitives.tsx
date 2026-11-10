"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { cn, ATELIER_EASE } from "@/lib/utils";

/**
 * Architectural alignment crosshair (+) placed at key structural intersections.
 */
export function Crosshair({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none inline-flex items-center justify-center w-3 h-3 text-[#0C0A08]/25 font-mono text-[10px] leading-none",
        className
      )}
    >
      +
    </span>
  );
}

/**
 * Precision editorial eyebrow label — restrained, calm, zero loud bloat.
 */
export function EyebrowBadge({
  children,
  index,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[11px] font-mono font-medium uppercase tracking-[0.14em] border backdrop-blur-md",
        dark
          ? "bg-white/[0.04] border-white/[0.1] text-white/70"
          : "bg-white/75 border-[#0C0A08]/[0.08] text-[#0C0A08]/70 shadow-[0_1px_2px_rgba(12,10,8,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-[#ED5B04] shadow-[0_0_8px_rgba(237,91,4,0.55)]"
      />
      {index && (
        <span className={cn("opacity-45", dark ? "text-white/60" : "text-[#0C0A08]")}>
          {index}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

/**
 * Sculpted Physical Specimen Plate with spring-damped specular light & subtle tilt.
 */
export function SpecularPlate({
  children,
  className,
  dark = false,
  tilt = true,
  crosshairs = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  tilt?: boolean;
  crosshairs?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const springX = useSpring(rawX, { stiffness: 150, damping: 24 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 24 });

  const rotateX = useTransform(springY, [0, 1], tilt ? [2.2, -2.2] : [0, 0]);
  const rotateY = useTransform(springX, [0, 1], tilt ? [-2.2, 2.2] : [0, 0]);

  const glareLeft = useTransform(springX, [0, 1], ["0%", "100%"]);
  const glareTop = useTransform(springY, [0, 1], ["0%", "100%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current || e.pointerType !== "mouse") return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    rawX.set(x);
    rawY.set(y);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovered(true);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className={cn(
        "relative overflow-hidden rounded-[24px] transition-shadow duration-500 will-change-transform",
        dark
          ? "bg-[#100F0E] text-[#FAF8F5] border border-white/[0.09] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "bg-white text-[#0C0A08] border border-[#0C0A08]/[0.08] shadow-[0_2px_6px_rgba(12,10,8,0.025),0_24px_56px_-18px_rgba(12,10,8,0.09),inset_0_1px_0_rgba(255,255,255,1)]",
        className
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full"
          style={{
            left: glareLeft,
            top: glareTop,
            background: dark
              ? "radial-gradient(circle, rgba(237,91,4,0.12) 0%, rgba(255,255,255,0.045) 35%, transparent 68%)"
              : "radial-gradient(circle, rgba(237,91,4,0.06) 0%, rgba(255,255,255,0.45) 42%, transparent 70%)",
          }}
        />
      </motion.div>

      {crosshairs && (
        <>
          <Crosshair className={cn("absolute top-4 left-4 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute top-4 right-4 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute bottom-4 left-4 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute bottom-4 right-4 z-20", dark && "text-white/25")} />
        </>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/**
 * Staggered reveal block with subtle blur-to-sharp entrance (non-blocking).
 */
export function AtelierReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.48, delay, ease: ATELIER_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CHAPTERS = [
  { id: "modele", label: "01 · Modèle à 0 €" },
  { id: "comparatif", label: "02 · Comparatif" },
  { id: "realisations", label: "03 · Réalisations" },
  { id: "processus", label: "04 · Méthode en 5 jours" },
  { id: "artisan", label: "05 · Qui code votre site" },
  { id: "faq", label: "06 · Questions" },
];

/**
 * Whisper-quiet spatial compass & chapter indicator on desktop scroll (never obscures Hero).
 */
export function AtelierReadingCompass() {
  const { scrollYProgress } = useScroll();
  const smoothScale = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });
  const [visible, setVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].label);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 720);
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          setActiveChapter(CHAPTERS[i].label);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top 1.5px hair-thin scroll beam */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothScale, transformOrigin: "left center" }}
        className="fixed top-0 inset-x-0 h-[2px] bg-[#ED5B04] z-[120] pointer-events-none"
      />

      {/* Floating minimalist chapter telemetry pill */}
      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
        transition={{ duration: 0.22, ease: ATELIER_EASE }}
        className="hidden xl:flex fixed bottom-6 left-6 z-40 pointer-events-none items-center gap-2.5 rounded-full bg-[#0C0A08]/90 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[11px] font-mono text-[#FAF8F5] shadow-lg"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#ED5B04]" />
        <span className="tracking-[0.06em] uppercase">{activeChapter}</span>
      </motion.div>
    </>
  );
}
