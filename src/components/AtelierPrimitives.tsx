"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
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
 * Precision editorial eyebrow pill with restrained hairline framing.
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
        "inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[11px] font-mono font-medium uppercase tracking-[0.12em] border backdrop-blur-md",
        dark
          ? "bg-white/[0.04] border-white/[0.1] text-white/75"
          : "bg-white/80 border-[#0C0A08]/[0.08] text-[#0C0A08]/75 shadow-[0_1px_2px_rgba(12,10,8,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-[#ED5B04] shadow-[0_0_8px_rgba(237,91,4,0.6)]"
      />
      {index && (
        <span className={cn("opacity-50", dark ? "text-white/60" : "text-[#0C0A08]")}>
          {index}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

/**
 * Interactive Tactile Plate with spring-interpolated specular reflection & optional subtle 3D perspective tilt (max 3deg).
 * Built following Emil Kowalski's spring physics principles — smooth momentum, zero linear stiffness.
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

  const springX = useSpring(rawX, { stiffness: 160, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 160, damping: 22 });

  const rotateX = useTransform(springY, [0, 1], tilt ? [2.8, -2.8] : [0, 0]);
  const rotateY = useTransform(springX, [0, 1], tilt ? [-2.8, 2.8] : [0, 0]);

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
        transformPerspective: 1100,
      }}
      className={cn(
        "relative overflow-hidden rounded-[24px] transition-shadow duration-500 will-change-transform",
        dark
          ? "bg-[#11100F] text-[#FAF8F5] border border-white/[0.09] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "bg-white text-[#0C0A08] border border-[#0C0A08]/[0.08] shadow-[0_2px_6px_rgba(12,10,8,0.025),0_20px_48px_-16px_rgba(12,10,8,0.08),inset_0_1px_0_rgba(255,255,255,1)]",
        className
      )}
    >
      {/* Dynamic Cursor-Tracking Specular Reflection */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full"
          style={{
            left: glareLeft,
            top: glareTop,
            background: dark
              ? "radial-gradient(circle, rgba(237,91,4,0.13) 0%, rgba(255,255,255,0.05) 35%, transparent 70%)"
              : "radial-gradient(circle, rgba(237,91,4,0.065) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {crosshairs && (
        <>
          <Crosshair className={cn("absolute top-3.5 left-3.5 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute top-3.5 right-3.5 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute bottom-3.5 left-3.5 z-20", dark && "text-white/25")} />
          <Crosshair className={cn("absolute bottom-3.5 right-3.5 z-20", dark && "text-white/25")} />
        </>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/**
 * Staggered reveal block with subtle blur-to-sharp entrance (450ms Emil/Basement cadence).
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
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: ATELIER_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
