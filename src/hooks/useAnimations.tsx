"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, isInView } = useInView(0.3);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(eased * target);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, hasAnimated, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString("fr-FR");

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

/* === PARALLAX HOOK === */
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    setOffset((centerY - viewportCenter) * speed * -1);
  }, [speed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { ref, offset };
}

/* === MAGNETIC HOOK === */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.3s ease-out";
    };

    const handleMouseEnter = () => {
      el.style.transition = "none";
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [strength]);

  return ref;
}

/* === STAGGER CHILDREN === */
export const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* === GLOW ON HOOK === */
export function useGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--glow-x", `${x}px`);
      el.style.setProperty("--glow-y", `${y}px`);
      el.style.setProperty("--glow-visible", "1");
    };

    const handleMouseLeave = () => {
      el.style.setProperty("--glow-visible", "0");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
}
