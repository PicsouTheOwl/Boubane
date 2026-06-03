"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const ringScale = useTransform(
    [cursorXSpring, cursorYSpring],
    () => (isPointer ? 1.8 : 1)
  );
  const dotScale = useTransform(
    [cursorXSpring, cursorYSpring],
    () => (isPointer ? 0 : 1)
  );

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [cursorX, cursorY, isVisible]
  );

  const handlePointerChange = useCallback(() => {
    const hovered = document.querySelectorAll("a, button, [role='button'], .card, .hover-lift");
    const checkPointer = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const isOverInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".card") ||
        target.closest(".hover-lift") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON";
      setIsPointer(!!isOverInteractive);
    };

    hovered.forEach((el) => {
      el.addEventListener("pointerenter", checkPointer as EventListener);
      el.addEventListener("pointerleave", () => setIsPointer(false));
    });

    return () => {
      hovered.forEach((el) => {
        el.removeEventListener("pointerenter", checkPointer as EventListener);
        el.removeEventListener("pointerleave", () => setIsPointer(false));
      });
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);
    const cleanup = handlePointerChange();
    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cleanup?.();
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [moveCursor, handlePointerChange]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Outer ring */}
      <motion.div
        className="fixed border rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 36,
          height: 36,
          borderColor: "rgba(94, 106, 210, 0.4)",
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed rounded-full bg-[#5e6ad2]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 6,
          height: 6,
          translateX: "-50%",
          translateY: "-50%",
          scale: dotScale,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
}
