"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  animate,
} from "motion/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { formatAmount, type AutomationModule } from "@/data/automations";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;
const EASE_PRESS = [0.16, 1, 0.3, 1] as const;

const MAX_PULL_DOWN = 110;
const MAX_PUSH_UP = 22;
const RUBBER_CONSTANT = 0.55;

function rubberbandOffset(drag: number, size: number): number {
  return (1 - 1 / ((drag * RUBBER_CONSTANT) / size + 1)) * size;
}

function inverseRubberband(offset: number, size: number): number {
  const clamped = Math.min(offset, size - 0.5);
  return (clamped * size) / (RUBBER_CONSTANT * (size - clamped));
}

function RollingNumber({
  value,
  className,
  reducedMotion = false,
}: {
  value: number;
  className?: string;
  reducedMotion?: boolean;
}) {
  const formatted = formatAmount(value);

  if (reducedMotion) {
    return (
      <span className={cn("inline-flex items-baseline tabular-nums", className)}>
        {formatted}
      </span>
    );
  }

  const chars = formatted.split("");

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{formatted} €</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {chars.map((char, idx) => {
          const slotFromRight = chars.length - 1 - idx;
          if (!/^\d$/.test(char)) {
            return (
              <span
                key={`sep-${slotFromRight}`}
                className="inline-block w-[0.26em]"
              >
                {char}
              </span>
            );
          }

          return (
            <span
              key={`digit-${slotFromRight}`}
              className="inline-block relative overflow-hidden align-bottom leading-[1.08] tabular-nums"
            >
              <span className="invisible select-none">0</span>
              <motion.span
                initial={false}
                animate={{ y: `-${Number(char) * 10}%` }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 30,
                  mass: 0.7,
                }}
                className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
              >
                {DIGITS.map((d) => (
                  <span
                    key={d}
                    className="h-[1.08em] leading-[1.08] flex items-center justify-center"
                  >
                    {d}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export interface AtelierProjectSummaryProps {
  selectedModules: AutomationModule[];
  mode: "configurator" | "checkout";
  orderUrl?: string;
  onRemoveModule?: (id: string) => void;
}

/**
 * Minimal matte printer cap with a calm, airy hanging paper receipt.
 */
export function AtelierProjectSummary({
  selectedModules,
  mode,
  orderUrl = "/commander",
  onRemoveModule,
}: AtelierProjectSummaryProps) {
  const prefersReducedMotion = !!useReducedMotion();
  const [isPrinting, setIsPrinting] = useState(false);

  const hasMountedRef = useRef(false);
  const prevCountRef = useRef(selectedModules.length);
  const printTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paperY = useMotionValue(0);
  const dragStateRef = useRef({
    active: false,
    dragging: false,
    startY: 0,
    baseDrag: 0,
    lastY: 0,
    lastT: 0,
    velocity: 0,
  });

  const totalPrice = selectedModules.reduce((sum, m) => sum + m.price, 0);
  const totalMarketPrice = selectedModules.reduce(
    (sum, m) => sum + m.marketPrice,
    0
  );
  const totalEconomy = Math.max(0, totalMarketPrice - totalPrice);

  useEffect(() => {
    hasMountedRef.current = true;
    return () => {
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
    };
  }, []);

  // Secondary action (amber print LED) + gentle velocity feed follow-through on module count change
  useEffect(() => {
    const prev = prevCountRef.current;
    const next = selectedModules.length;
    if (prev === next) return;

    const delta = next - prev;
    prevCountRef.current = next;

    setIsPrinting(true);
    if (printTimerRef.current) clearTimeout(printTimerRef.current);
    printTimerRef.current = setTimeout(() => {
      setIsPrinting(false);
    }, 320);

    if (!prefersReducedMotion && !dragStateRef.current.dragging) {
      animate(paperY, 0, {
        type: "spring",
        stiffness: delta > 0 ? 260 : 280,
        damping: delta > 0 ? 19 : 22,
        velocity: delta > 0 ? 140 : -90,
      });
    }
  }, [selectedModules.length, prefersReducedMotion, paperY]);

  // Interruptible rubber-band tug on the hanging receipt (desktop mouse only)
  const handlePaperPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType !== "mouse" || e.button !== 0) {
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a")) return;

    const liveY = paperY.get();
    const baseDrag =
      liveY >= 0
        ? inverseRubberband(liveY, MAX_PULL_DOWN)
        : -inverseRubberband(-liveY, MAX_PUSH_UP);

    dragStateRef.current = {
      active: true,
      dragging: false,
      startY: e.clientY,
      baseDrag,
      lastY: e.clientY,
      lastT: performance.now(),
      velocity: 0,
    };
  };

  const handlePaperPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active || prefersReducedMotion) return;

    const deltaFromStart = e.clientY - state.startY;
    if (!state.dragging) {
      if (Math.abs(deltaFromStart) <= 6) return;
      state.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const now = performance.now();
    const dt = now - state.lastT;
    if (dt > 0) {
      state.velocity = ((e.clientY - state.lastY) / dt) * 1000;
    }
    state.lastY = e.clientY;
    state.lastT = now;

    const drag = state.baseDrag + deltaFromStart;
    const offset =
      drag >= 0
        ? rubberbandOffset(drag, MAX_PULL_DOWN)
        : -rubberbandOffset(-drag, MAX_PUSH_UP);
    paperY.set(offset);
  };

  const endPaperDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const wasDragging = state.dragging;
    const releaseVelocity = Math.max(-1200, Math.min(1200, state.velocity));

    state.active = false;
    state.dragging = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (wasDragging && !prefersReducedMotion) {
      animate(paperY, 0, {
        type: "spring",
        stiffness: 320,
        damping: 23,
        velocity: releaseVelocity,
      });
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto lg:ml-auto lg:mr-0">
      {/* Layer 1: Slimmer Matte Printer Cap */}
      <div className="relative z-10 rounded-[18px] px-4 pt-3 pb-4.5 bg-[#EFECE5] border border-[#0C0A08]/[0.08] shadow-[0_10px_24px_-16px_rgba(12,10,8,0.12),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/boubane-logo.png"
              alt="Boubane"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded-[4px] shrink-0"
            />

            <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#57534E] tabular-nums min-w-0">
              <motion.span
                aria-hidden="true"
                animate={{
                  scale: isPrinting && !prefersReducedMotion ? 1.3 : 1,
                  backgroundColor: isPrinting ? "#ED5B04" : "#16A34A",
                }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              />
              <span className="truncate">
                {selectedModules.length} module
                {selectedModules.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {mode === "configurator" ? (
            <motion.div
              whileTap={
                prefersReducedMotion
                  ? undefined
                  : { scaleX: 1.02, scaleY: 0.95, y: 1 }
              }
              transition={{ duration: 0.11, ease: EASE_PRESS }}
            >
              <Link
                href={orderUrl || "/commander"}
                className="group min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white pl-4 pr-3.5 py-2 text-[13px] font-semibold transition-colors duration-150 shadow-[0_8px_20px_-8px_rgba(237,91,4,0.45)]"
              >
                <span>{totalPrice === 0 ? "Lancer à 0 €" : "Commander"}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ) : (
            <span className="font-mono text-[11px] text-[#78716C] shrink-0">
              En direct
            </span>
          )}
        </div>

        {/* Slim Recessed Ejection Slot */}
        <div
          aria-hidden="true"
          className="absolute bottom-1.5 inset-x-4 h-[5px] rounded-full bg-[#1C1917]"
        />
      </div>

      {/* Layer 2: Slot-Masked Ultra-Pure Hanging Paper Receipt */}
      <div className="relative z-20 w-[88%] mx-auto -mt-2.5 [clip-path:inset(0_-28px_-48px_-28px)]">
        {/* Fixed slot exit cast-shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-3.5 z-10 bg-gradient-to-b from-[#0C0A08]/[0.14] via-[#0C0A08]/[0.04] to-transparent"
        />

        {/* One-time slot entrance wrapper */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { y: -22, opacity: 0 }
          }
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.14 }
              : { type: "spring", stiffness: 250, damping: 23 }
          }
        >
          {/* Interruptible rubber-band & feed follow-through sheet */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: paperY }}
            onPointerDown={handlePaperPointerDown}
            onPointerMove={handlePaperPointerMove}
            onPointerUp={endPaperDrag}
            onPointerCancel={endPaperDrag}
            className={cn(
              "relative select-none touch-pan-y [filter:drop-shadow(0_16px_22px_rgba(12,10,8,0.11))_drop-shadow(0_2px_4px_rgba(12,10,8,0.05))]",
              !prefersReducedMotion && "cursor-grab active:cursor-grabbing"
            )}
          >
            {/* Hidden reserve paper roll tucked inside printer slot */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 inset-x-0 h-20 bg-[#FFFDF9] border-x border-[#0C0A08]/[0.06]"
            />

            <div className="relative bg-[#FFFDF9] text-[#0C0A08] border-x border-[#0C0A08]/[0.06] px-5 pt-5 pb-4">
              {/* Clean Line Items — only ONE dashed divider below */}
              <div className="pb-3.5 border-b border-dashed border-[#0C0A08]/12">
                <AnimatePresence initial={false}>
                  {selectedModules.map((m, index) => {
                    const isFree = m.price === 0;
                    const staggerDelay =
                      !prefersReducedMotion && !hasMountedRef.current
                        ? Math.min(index, 6) * 0.045
                        : 0;

                    return (
                      <motion.div
                        key={m.id}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, height: 0, y: -6 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, transition: { duration: 0.12 } }
                            : {
                                opacity: 1,
                                height: "auto",
                                y: 0,
                                transition: {
                                  duration: 0.24,
                                  delay: staggerDelay,
                                  ease: EASE_OUT,
                                },
                              }
                        }
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0, transition: { duration: 0.1 } }
                            : {
                                opacity: 0,
                                height: 0,
                                y: -4,
                                transition: {
                                  duration: 0.11,
                                  ease: EASE_IN,
                                },
                              }
                        }
                        className="overflow-hidden"
                      >
                        <div className="py-1.5 flex items-center justify-between gap-3 group">
                          <span className="text-[12.5px] text-[#0C0A08]/90 truncate">
                            {m.name}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[12.5px] tabular-nums">
                              {isFree ? (
                                <span className="font-semibold text-[#0E7541]">
                                  0&nbsp;€
                                </span>
                              ) : (
                                <span className="font-semibold text-[#0C0A08]">
                                  {formatAmount(m.price)}&nbsp;€
                                </span>
                              )}
                            </span>

                            {!isFree && onRemoveModule && (
                              <button
                                type="button"
                                onClick={() => onRemoveModule(m.id)}
                                aria-label={`Retirer ${m.name}`}
                                className="min-w-[44px] min-h-[44px] -my-3 -mr-3 inline-flex items-center justify-center group/remove cursor-pointer"
                              >
                                <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[#A8A29E] group-hover/remove:text-[#DC2626] group-hover/remove:bg-[#FEF2F2] group-active/remove:scale-90 transition-all duration-100">
                                  <X className="w-3 h-3" />
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Single Total Block */}
              <div className="pt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium text-[#57534E]">
                    Total HT
                  </span>
                  <div className="flex items-baseline">
                    <RollingNumber
                      value={totalPrice}
                      reducedMotion={prefersReducedMotion}
                      className="font-mono text-[1.45rem] font-extrabold tracking-[-0.03em] text-[#0C0A08]"
                    />
                    <span className="font-mono text-[1.2rem] font-extrabold text-[#0C0A08] ml-1">
                      €
                    </span>
                  </div>
                </div>

                {totalEconomy > 0 && (
                  <div className="mt-1 text-right font-mono text-[11px] text-[#0E7541] tabular-nums">
                    &minus;{formatAmount(totalEconomy)}&nbsp;€ vs agence
                  </div>
                )}
              </div>

              {/* Calm 1-line Footer */}
              <div className="mt-4 text-center text-[11px] text-[#A8A29E]">
                Livré en 5j · Sans acompte · Code à vous
              </div>
            </div>

            {/* Flush Subtle Serrated Zig-Zag Paper Bottom Edge */}
            <div
              aria-hidden="true"
              className="h-2.5 w-full overflow-hidden leading-none pointer-events-none"
            >
              <svg
                className="block w-full h-full text-[#FFFDF9] fill-current"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 105,10 110,0 115,10 120,0 125,10 130,0 135,10 140,0 145,10 150,0 155,10 160,0 165,10 170,0 175,10 180,0 185,10 190,0 195,10 200,0" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Secondary Visio Link */}
      {mode === "configurator" && (
        <div className="mt-4 text-center">
          <Link
            href="/rdv"
            className="min-h-[44px] px-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors"
          >
            <span>Ou en discuter en visio (30 min)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
