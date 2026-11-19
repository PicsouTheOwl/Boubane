"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
} from "motion/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { type AutomationModule } from "@/data/automations";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;
const EASE_PRESS = [0.16, 1, 0.3, 1] as const;

const MAX_PULL_DOWN = 110;
const MAX_PUSH_UP = 22;
const RUBBER_CONSTANT = 0.55;

/**
 * Deterministic currency formatting (avoids Node vs browser locale space mismatch during hydration).
 */
function formatAmount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

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
 * Compact Warm Atelier thermal printer unit with a clean, airy hanging paper receipt.
 */
export function AtelierProjectSummary({
  selectedModules,
  mode,
  orderUrl = "/commander",
  onRemoveModule,
}: AtelierProjectSummaryProps) {
  const prefersReducedMotion = !!useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
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

  // Subtle 3D tilt & bezel specular sheen (desktop mouse only)
  const rawTiltX = useMotionValue(0.5);
  const rawTiltY = useMotionValue(0.5);
  const springTiltX = useSpring(rawTiltX, { stiffness: 180, damping: 24 });
  const springTiltY = useSpring(rawTiltY, { stiffness: 180, damping: 24 });
  const rotateX = useTransform(springTiltY, [0, 1], [3.5, -3.5]);
  const rotateY = useTransform(springTiltX, [0, 1], [-3.5, 3.5]);
  const sheenX = useTransform(springTiltX, [0, 1], ["15%", "85%"]);

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

  // Secondary action (amber print LED) + follow-through feed impulse when modules change
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
        velocity: delta > 0 ? 150 : -95,
      });
    }
  }, [selectedModules.length, prefersReducedMotion, paperY]);

  const handleContainerPointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    rawTiltX.set(nx);
    rawTiltY.set(ny);
    if (!isHovered) setIsHovered(true);
  };

  const handleContainerPointerLeave = () => {
    setIsHovered(false);
    rawTiltX.set(0.5);
    rawTiltY.set(0.5);
  };

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
    <motion.div
      onPointerMove={handleContainerPointerMove}
      onPointerLeave={handleContainerPointerLeave}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }
      }
      className="w-full max-w-[400px] mx-auto lg:ml-auto lg:mr-0 will-change-transform"
    >
      {/* Layer 1: Compact Printer Hardware Unit */}
      <div className="relative z-10 overflow-hidden rounded-[24px] p-3.5 pb-6 bg-gradient-to-b from-[#F5F2EC] via-[#ECE7DE] to-[#E3DDD2] border border-[#0C0A08]/[0.1] shadow-[0_1px_2px_rgba(12,10,8,0.05),0_18px_38px_-18px_rgba(12,10,8,0.18),inset_0_1px_0_rgba(255,255,255,0.92)]">
        {/* Whisper-quiet specular sheen tracking pointer on printer bezel */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -translate-x-1/2 w-56 h-48 rounded-full transition-opacity duration-200"
            style={{
              left: sheenX,
              opacity: isHovered ? 0.55 : 0,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Top Hardware Header */}
        <div className="relative flex items-center justify-between gap-3 pb-3 px-0.5">
          <div className="w-9 h-9 rounded-[11px] bg-white border border-[#0C0A08]/[0.08] shadow-[0_1px_2px_rgba(12,10,8,0.06),inset_0_1px_0_#fff] flex items-center justify-center shrink-0">
            <img
              src="/assets/boubane-logo.png"
              alt="Boubane"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
          </div>

          {mode === "configurator" ? (
            <motion.div
              whileTap={
                prefersReducedMotion
                  ? undefined
                  : { scaleX: 1.03, scaleY: 0.94, y: 1.5 }
              }
              transition={{ duration: 0.11, ease: EASE_PRESS }}
            >
              <Link
                href={orderUrl || "/commander"}
                className="group min-h-[44px] inline-flex items-center gap-2 rounded-[12px] bg-[#ED5B04] hover:bg-[#D64E00] text-white pl-4 pr-2.5 py-2 text-[13px] font-semibold transition-colors duration-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_0_#B84400,0_10px_20px_-8px_rgba(237,91,4,0.48)]"
              >
                <span>{totalPrice === 0 ? "Lancer à 0 €" : "Commander"}</span>
                <span className="w-6 h-6 rounded-[8px] bg-black/15 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ) : (
            <div className="min-h-[32px] inline-flex items-center gap-2 rounded-full bg-white/85 border border-[#0C0A08]/[0.08] px-3 py-1 font-mono text-[11px] text-[#0C0A08]/75">
              <motion.span
                aria-hidden="true"
                animate={{
                  scale: isPrinting && !prefersReducedMotion ? 1.25 : 1,
                  backgroundColor: isPrinting ? "#ED5B04" : "#16A34A",
                }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                className="inline-block w-2 h-2 rounded-full"
              />
              <span>En direct</span>
            </div>
          )}
        </div>

        {/* Compact Recessed LCD Screen */}
        <div className="relative rounded-[14px] bg-white border border-[#0C0A08]/[0.08] px-4 py-3 shadow-[inset_0_1px_3px_rgba(12,10,8,0.07),0_1px_0_rgba(255,255,255,0.85)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold tracking-[-0.02em] text-[#0C0A08] leading-tight truncate">
                Votre projet
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#78716C] mt-0.5 tabular-nums">
                <motion.span
                  aria-hidden="true"
                  animate={{
                    scale: isPrinting && !prefersReducedMotion ? 1.35 : 1,
                    backgroundColor: isPrinting ? "#ED5B04" : "#16A34A",
                  }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                />
                <span>
                  {selectedModules.length} module
                  {selectedModules.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.08em] text-[#A8A29E] leading-tight">
                Total HT
              </div>
              <div className="mt-0.5 flex items-baseline justify-end">
                <RollingNumber
                  value={totalPrice}
                  reducedMotion={prefersReducedMotion}
                  className="font-mono text-[1.35rem] font-bold tracking-[-0.03em] text-[#0C0A08]"
                />
                <span className="font-mono text-[1.1rem] font-bold text-[#0C0A08] ml-1">
                  €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recessed Paper Ejection Slot */}
        <div
          aria-hidden="true"
          className="absolute bottom-2.5 inset-x-5 h-2 rounded-full bg-[#151311] shadow-[inset_0_1px_3px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.75)]"
        />
      </div>

      {/* Layer 2: Slot-Masked Airy Thermal Receipt Paper */}
      <div className="relative z-20 w-[86%] mx-auto -mt-3 [clip-path:inset(0_-32px_-56px_-32px)]">
        {/* Fixed slot exit cast-shadow (stays stationary while paper feeds/tugs beneath) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-3.5 z-10 bg-gradient-to-b from-[#0C0A08]/[0.14] via-[#0C0A08]/[0.04] to-transparent"
        />

        {/* One-time slot entrance wrapper */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { y: -24, opacity: 0 }
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
            {/* Hidden reserve paper roll tucked inside printer slot for downward pull continuity */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 inset-x-0 h-20 bg-[#FFFDF9] border-x border-[#0C0A08]/[0.06]"
            />

            <div className="relative bg-[#FFFDF9] text-[#0C0A08] border-x border-[#0C0A08]/[0.06] px-5 pt-6 pb-5">
              {/* Minimal Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-dashed border-[#0C0A08]/15">
                <span className="font-[family-name:var(--font-jakarta)] text-[14px] font-bold tracking-[-0.02em] text-[#0C0A08]">
                  Boubane
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#A8A29E]">
                  Prix fixes
                </span>
              </div>

              {/* Spacious Line Items */}
              <div className="py-4 border-b border-dashed border-[#0C0A08]/15">
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
                                  0 €
                                </span>
                              ) : (
                                <span className="font-semibold text-[#0C0A08]">
                                  {formatAmount(m.price)} €
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

              {/* Clean Minimal Totals (crisp ink total so primary CTA stays Von Restorff standout) */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-[12px] text-[#78716C]">
                  <span>Livraison</span>
                  <span className="font-mono text-[#0C0A08]/80">5 jours</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-[13px] font-semibold text-[#0C0A08]">
                    Total HT
                  </span>
                  <div className="flex items-baseline">
                    <RollingNumber
                      value={totalPrice}
                      reducedMotion={prefersReducedMotion}
                      className="font-mono text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#0C0A08]"
                    />
                    <span className="font-mono text-[1.15rem] font-extrabold text-[#0C0A08] ml-1">
                      €
                    </span>
                  </div>
                </div>

                {totalEconomy > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#0E7541] pt-0.5 tabular-nums">
                    <span>vs agences ({formatAmount(totalMarketPrice)} €)</span>
                    <span>&minus;{formatAmount(totalEconomy)} €</span>
                  </div>
                )}
              </div>

              {/* Minimal 1-line Footer */}
              <div className="mt-5 pt-3.5 border-t border-dashed border-[#0C0A08]/12 text-center font-mono text-[10.5px] text-[#A8A29E]">
                Sans acompte · Code 100 % à vous
              </div>
            </div>

            {/* Crisp Serrated Zig-Zag Paper Bottom Edge */}
            <div
              aria-hidden="true"
              className="h-3 w-full overflow-hidden leading-none pointer-events-none"
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

      {/* Subtle Secondary Visio Link below the hanging receipt */}
      {mode === "configurator" && (
        <div className="mt-5 text-center">
          <a
            href="https://rdv.boubane.com/boubane/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#78716C] hover:text-[#0C0A08] transition-colors"
          >
            <span>Ou valider en visio (30 min)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
