"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

type SiteKey = "astra" | "achille" | "valmy";

interface WindowMeta {
  id: string;
  key: SiteKey;
  urlText: string;
  iframeSrc: string;
  defaultPos: { top: string; left?: string; right?: string };
  defaultAngle: number;
  widthStyle: string;
  heightStyle: string;
}

const WINDOWS: WindowMeta[] = [
  {
    id: "bureauWinAstra",
    key: "astra",
    urlText: "astravacances.fr",
    iframeSrc: "/showcase-astra.html",
    defaultPos: { top: "25px", left: "15px" },
    defaultAngle: -1.5,
    widthStyle: "clamp(320px, 48%, 520px)",
    heightStyle: "clamp(260px, 42vh, 360px)",
  },
  {
    id: "bureauWinAchille",
    key: "achille",
    urlText: "artisan-haut-anjou.fr",
    iframeSrc: "/showcase-artisan.html",
    defaultPos: { top: "15px", right: "20px" },
    defaultAngle: 1.8,
    widthStyle: "clamp(310px, 46%, 490px)",
    heightStyle: "clamp(250px, 40vh, 340px)",
  },
  {
    id: "bureauWinValmy",
    key: "valmy",
    urlText: "votre-prochain-site.fr",
    iframeSrc: "/showcase-votre-site.html",
    defaultPos: { top: "220px", left: "80px" },
    defaultAngle: -0.8,
    widthStyle: "clamp(310px, 47%, 500px)",
    heightStyle: "clamp(250px, 40vh, 340px)",
  },
];

const PORTAL_META: Record<
  SiteKey,
  { url: string; href: string; dotColor: string; caption: string }
> = {
  astra: {
    url: "astravacances.fr",
    href: "/showcase-astra.html",
    dotColor: "#2B9BBD",
    caption: "Astravacances.fr — Vitrine Réalisée par Studio Boubane (Vitesse < 0.3s)",
  },
  achille: {
    url: "artisan-haut-anjou.fr",
    href: "/showcase-artisan.html",
    dotColor: "#ED5B04",
    caption: "Atelier Renou — Menuiserie & Charpente en Haut-Anjou",
  },
  valmy: {
    url: "votre-prochain-site.fr",
    href: "/showcase-votre-site.html",
    dotColor: "#0C0A08",
    caption: "Votre Prochain Site — Conception Sur-Mesure Studio Boubane",
  },
};

export function HeroSection() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const winRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dockRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const textPathRef = useRef<SVGTextPathElement>(null);
  const bannerWrapRef = useRef<HTMLElement>(null);
  const ribbonShadowPathRef = useRef<SVGPathElement>(null);
  const ribbonMainPathRef = useRef<SVGPathElement>(null);
  const archTextCurveRef = useRef<SVGPathElement>(null);
  const runnerGroupRef = useRef<SVGGElement>(null);

  const highestZ = useRef(20);
  const [activeDockIdx, setActiveDockIdx] = useState<number>(0);
  const [minimizedMap, setMinimizedMap] = useState<Record<number, boolean>>({});
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);
  const [portalSite, setPortalSite] = useState<SiteKey | null>(null);

  const triggerBounce = useCallback((idx: number) => {
    setBouncingIdx(null);
    requestAnimationFrame(() => {
      setBouncingIdx(idx);
      setTimeout(() => setBouncingIdx((cur) => (cur === idx ? null : cur)), 620);
    });
  }, []);

  const minimizeWindow = useCallback(
    (idx: number) => {
      const meta = WINDOWS[idx];
      const win = winRefs.current[meta.id];
      const dockBtn = dockRefs.current[idx];
      if (!win) return;

      win.setAttribute("data-saved-transform", win.style.transform || "");
      win.setAttribute("data-minimized", "true");

      if (dockBtn) {
        const winRect = win.getBoundingClientRect();
        const btnRect = dockBtn.getBoundingClientRect();
        const dx = btnRect.left + btnRect.width / 2 - (winRect.left + winRect.width / 2);
        const dy = btnRect.top + btnRect.height / 2 - (winRect.top + winRect.height / 2);
        win.classList.add("is-transitioning");
        win.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(0.06)`;
        win.style.opacity = "0";
        win.style.pointerEvents = "none";
      } else {
        win.classList.add("is-transitioning");
        win.style.transform = "translateY(120px) scale(0.2)";
        win.style.opacity = "0";
        win.style.pointerEvents = "none";
      }

      setMinimizedMap((prev) => ({ ...prev, [idx]: true }));
      triggerBounce(idx);
      setTimeout(() => win.classList.remove("is-transitioning"), 450);
    },
    [triggerBounce]
  );

  const restoreWindow = useCallback(
    (idx: number) => {
      const meta = WINDOWS[idx];
      const win = winRefs.current[meta.id];
      if (!win) return;

      highestZ.current += 1;
      win.style.zIndex = String(highestZ.current);
      win.removeAttribute("data-minimized");
      win.style.pointerEvents = "";

      const savedTransform = win.getAttribute("data-saved-transform");
      win.classList.add("is-transitioning");
      win.style.transform = savedTransform || `rotate(${meta.defaultAngle}deg)`;
      win.style.opacity = "1";

      setMinimizedMap((prev) => ({ ...prev, [idx]: false }));
      setActiveDockIdx(idx);
      triggerBounce(idx);
      setTimeout(() => win.classList.remove("is-transitioning"), 460);
    },
    [triggerBounce]
  );

  const handleToggleDockApp = useCallback(
    (idx: number) => {
      const meta = WINDOWS[idx];
      const win = winRefs.current[meta.id];
      if (!win) return;

      const isMin = win.getAttribute("data-minimized") === "true" || win.style.opacity === "0";
      if (isMin) {
        restoreWindow(idx);
        return;
      }

      const curZ = parseInt(win.style.zIndex || "0", 10);
      if (curZ === highestZ.current) {
        minimizeWindow(idx);
      } else {
        highestZ.current += 1;
        win.style.zIndex = String(highestZ.current);
        win.classList.add("is-transitioning");
        setTimeout(() => win.classList.remove("is-transitioning"), 450);
        setActiveDockIdx(idx);
      }
    },
    [minimizeWindow, restoreWindow]
  );

  // Desktop Messy Desk Inertial Drag Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanups: Array<() => void> = [];

    const layoutResponsive = () => {
      const isMobile = window.innerWidth < 768;
      WINDOWS.forEach((meta, i) => {
        const win = winRefs.current[meta.id];
        if (!win) return;
        if (isMobile) {
          win.style.right = "auto";
          win.style.bottom = "auto";
          win.style.left = "10px";
          win.style.top = `${12 + i * 26}px`;
          win.style.transform = "rotate(0deg)";
          win.style.zIndex = String(10 + i);
        } else {
          win.style.top = meta.defaultPos.top;
          win.style.left = meta.defaultPos.left ?? "auto";
          win.style.right = meta.defaultPos.right ?? "auto";
          win.style.bottom = "auto";
          win.style.transform = `rotate(${meta.defaultAngle}deg)`;
          win.style.zIndex = String(12 + i);
        }
      });
    };

    if (window.innerWidth < 768) {
      layoutResponsive();
    }

    let wasMobile = window.innerWidth < 768;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile !== wasMobile) {
          wasMobile = isMobile;
          layoutResponsive();
        }
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    WINDOWS.forEach((meta, idx) => {
      const win = winRefs.current[meta.id];
      if (!win) return;

      let isDragging = false;
      let currentLeft = 0;
      let currentTop = 0;
      let lastPointerX = 0;
      let lastPointerY = 0;
      let lastTime = 0;
      let vx = 0;
      let vy = 0;
      let smoothedTilt = 0;
      let flingAnimId: number | null = null;

      const cancelFling = () => {
        if (flingAnimId) {
          cancelAnimationFrame(flingAnimId);
          flingAnimId = null;
        }
        win.classList.remove("is-flying");
      };

      const onPointerDown = (e: PointerEvent) => {
        highestZ.current += 1;
        win.style.zIndex = String(highestZ.current);
        setActiveDockIdx(idx);

        const target = e.target as HTMLElement | null;
        if (target?.closest("button") || target?.closest("a") || target?.closest(".cs-dot")) {
          return;
        }
        if (e.pointerType === "touch" && !target?.closest(".bureau-window-bar")) {
          return;
        }

        cancelFling();
        isDragging = true;
        win.classList.add("is-dragging");
        win.classList.remove("is-transitioning");

        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastTime = performance.now();
        vx = 0;
        vy = 0;
        smoothedTilt = 0;

        const canvasRect = canvas.getBoundingClientRect();
        const winRect = win.getBoundingClientRect();

        currentLeft = winRect.left - canvasRect.left;
        currentTop = winRect.top - canvasRect.top;

        win.style.right = "auto";
        win.style.bottom = "auto";
        win.style.left = `${currentLeft}px`;
        win.style.top = `${currentTop}px`;

        const curRotate = window.innerWidth < 768 ? 0 : meta.defaultAngle;
        win.style.transform = `scale(1.025) rotate(${curRotate}deg)`;

        try {
          win.setPointerCapture(e.pointerId);
        } catch {}

        e.preventDefault();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;

        vx = vx * 0.4 + (dx / dt) * 0.6;
        vy = vy * 0.4 + (dy / dt) * 0.6;
        currentLeft += dx;
        currentTop += dy;

        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastTime = now;

        const minVisibleX = 60;
        const minLeft = -win.offsetWidth + minVisibleX;
        const maxLeft = canvas.clientWidth - minVisibleX;
        const minTop = -60;
        const maxTop = canvas.clientHeight + 350;

        currentLeft = Math.max(minLeft, Math.min(currentLeft, maxLeft));
        currentTop = Math.max(minTop, Math.min(currentTop, maxTop));

        const targetTilt = Math.max(-8, Math.min(8, vx * 14));
        smoothedTilt += (targetTilt - smoothedTilt) * 0.28;
        const pitch = Math.max(-5, Math.min(5, -vy * 8));

        win.style.transform = `scale(1.028) rotate(${(meta.defaultAngle + smoothedTilt).toFixed(
          2
        )}deg) perspective(650px) rotateX(${pitch.toFixed(1)}deg)`;
        win.style.left = `${currentLeft.toFixed(1)}px`;
        win.style.top = `${currentTop.toFixed(1)}px`;
      };

      const stopDrag = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        win.classList.remove("is-dragging");
        try {
          if (e.pointerId) win.releasePointerCapture(e.pointerId);
        } catch {}

        const minVisibleX = 60;
        const minLeft = -win.offsetWidth + minVisibleX;
        const maxLeft = canvas.clientWidth - minVisibleX;
        const minTop = -60;
        const maxTop = canvas.clientHeight + 350;

        const speed = Math.hypot(vx, vy);
        if (speed > 0.05) {
          win.classList.add("is-flying");
          let currentTilt = smoothedTilt;
          const step = () => {
            vx *= 0.92;
            vy *= 0.92;
            currentTilt *= 0.88;
            currentLeft += vx * 16;
            currentTop += vy * 16;

            if (currentLeft <= minLeft) {
              currentLeft = minLeft;
              vx = -vx * 0.38;
            } else if (currentLeft >= maxLeft) {
              currentLeft = maxLeft;
              vx = -vx * 0.38;
            }
            if (currentTop <= minTop) {
              currentTop = minTop;
              vy = -vy * 0.38;
            } else if (currentTop >= maxTop) {
              currentTop = maxTop;
              vy = -vy * 0.38;
            }

            win.style.left = `${currentLeft.toFixed(1)}px`;
            win.style.top = `${currentTop.toFixed(1)}px`;
            win.style.transform = `scale(1) rotate(${(meta.defaultAngle + currentTilt).toFixed(2)}deg)`;

            if (Math.hypot(vx, vy) > 0.012) {
              flingAnimId = requestAnimationFrame(step);
            } else {
              cancelFling();
              win.classList.add("is-transitioning");
              win.style.transform = `rotate(${meta.defaultAngle}deg)`;
              win.setAttribute("data-saved-transform", `rotate(${meta.defaultAngle}deg)`);
              setTimeout(() => win.classList.remove("is-transitioning"), 300);
            }
          };
          flingAnimId = requestAnimationFrame(step);
        } else {
          win.classList.add("is-transitioning");
          win.style.transform = `rotate(${meta.defaultAngle}deg)`;
          win.setAttribute("data-saved-transform", `rotate(${meta.defaultAngle}deg)`);
          setTimeout(() => win.classList.remove("is-transitioning"), 280);
        }
      };

      win.addEventListener("pointerdown", onPointerDown);
      win.addEventListener("pointermove", onPointerMove);
      win.addEventListener("pointerup", stopDrag);
      win.addEventListener("pointercancel", stopDrag);

      cleanups.push(() => {
        cancelFling();
        win.removeEventListener("pointerdown", onPointerDown);
        win.removeEventListener("pointermove", onPointerMove);
        win.removeEventListener("pointerup", stopDrag);
        win.removeEventListener("pointercancel", stopDrag);
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Kinetic 3D Ribbon Marquee + Elastic Drag/Fling Physics Engine
  useEffect(() => {
    const textPath = textPathRef.current;
    const banner = bannerWrapRef.current;
    const shadowPath = ribbonShadowPathRef.current;
    const mainPath = ribbonMainPathRef.current;
    const curvePath = archTextCurveRef.current;
    if (!textPath || !banner || !shadowPath || !mainPath || !curvePath) return;

    let rafId = 0;
    const baseSpeed = 1.15;
    let targetSpeed = baseSpeed;
    let currentSpeed = baseSpeed;
    let singleLen = 1900;
    let offset = -singleLen;
    let lastScrollY = window.scrollY;
    let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

    // Smooth, critically balanced elastic arch spring state (zero jitter or jumping)
    let bendY = 0;
    let targetBendY = 0;
    let velY = 0;

    let bendX = 0;
    let targetBendX = 0;

    // Grab / Scrub / Release inertia state
    let isDragging = false;
    let startClientX = 0;
    let startClientY = 0;
    let lastClientX = 0;
    let lastMoveTime = 0;
    let dragVx = 0;
    let movedDist = 0;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const measureSingle = () => {
      try {
        const len = textPath.getComputedTextLength();
        if (len > 100) {
          singleLen = len / 5;
        }
      } catch {}
    };
    measureSingle();
    offset = -singleLen * 1.5;

    const updateCurveGeometry = (bx: number, by: number) => {
      const midY = 135 + by;
      const c1y = 220 + by * 0.55;
      const c2y = 50 + by * 0.55;
      const midX = 760 + bx;
      const x1 = 480 + bx * 0.35;
      const x2 = 1040 + bx * 0.35;

      mainPath.setAttribute(
        "d",
        `M -150, 225 C 180, 270 ${x1.toFixed(1)}, ${c1y.toFixed(1)} ${midX.toFixed(1)}, ${midY.toFixed(
          1
        )} C ${x2.toFixed(1)}, ${c2y.toFixed(1)} 1320, 170 1620, 210`
      );
      shadowPath.setAttribute(
        "d",
        `M -150, 231 C 180, 276 ${x1.toFixed(1)}, ${(c1y + 6).toFixed(1)} ${midX.toFixed(1)}, ${(
          midY + 6
        ).toFixed(1)} C ${x2.toFixed(1)}, ${(c2y + 6).toFixed(1)} 1320, 176 1620, 216`
      );
      curvePath.setAttribute(
        "d",
        `M -2500, 300 C -1500, 280 -800, 190 -150, 225 C 180, 270 ${x1.toFixed(1)}, ${c1y.toFixed(
          1
        )} ${midX.toFixed(1)}, ${midY.toFixed(1)} C ${x2.toFixed(1)}, ${c2y.toFixed(
          1
        )} 1320, 170 1620, 210 C 2100, 240 2800, 280 3800, 300`
      );
    };

    const onScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (Math.abs(deltaY) > 2 && !isDragging) {
        targetSpeed = baseSpeed + Math.min(Math.abs(deltaY) * 0.14, 4.0);
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          targetSpeed = baseSpeed;
        }, 140);
      }
    };

    const onPointerEnter = () => {
      if (!isDragging) targetSpeed = baseSpeed * 1.85;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startClientX = e.clientX;
      startClientY = e.clientY;
      lastClientX = e.clientX;
      lastMoveTime = performance.now();
      dragVx = 0;
      movedDist = 0;
      try {
        banner.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = banner.getBoundingClientRect();
      const relX = clamp(((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2, -1, 1);
      const relY = clamp(((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2, -1, 1);

      if (!isDragging) {
        // Gentle, predictable hover sway without ever reversing marquee text or jumping
        targetBendY = relY * 20;
        targetBendX = relX * 14;
        return;
      }

      const now = performance.now();
      const dt = Math.max(16, now - lastMoveTime);
      const dx = e.clientX - lastClientX;
      const dyTotal = e.clientY - startClientY;
      const dxTotal = e.clientX - startClientX;

      movedDist += Math.abs(dx);
      const instVx = clamp((dx / dt) * 16, -24, 24);
      dragVx = dragVx * 0.4 + instVx * 0.6;

      // Scrub text cleanly 1:1 with pointer horizontal movement
      offset += dx * 1.35;
      targetBendY = clamp(dyTotal * 0.45, -42, 42);
      targetBendX = clamp(dxTotal * 0.16, -22, 22);

      lastClientX = e.clientX;
      lastMoveTime = now;
    };

    const releaseDrag = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        try {
          if (e.pointerId) banner.releasePointerCapture(e.pointerId);
        } catch {}

        if (movedDist < 6) {
          // Gentle tap pulse
          currentSpeed = -8;
          velY = 10;
        } else {
          currentSpeed = -clamp(dragVx * 1.15, -24, 24);
          velY = clamp(-bendY * 0.16, -12, 12);
        }
        targetSpeed = baseSpeed;
      }
      targetBendY = 0;
      targetBendX = 0;
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (!isDragging) {
        targetSpeed = baseSpeed;
        targetBendY = 0;
        targetBendX = 0;
      } else {
        releaseDrag(e);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    banner.addEventListener("pointerenter", onPointerEnter);
    banner.addEventListener("pointerdown", onPointerDown);
    banner.addEventListener("pointermove", onPointerMove);
    banner.addEventListener("pointerup", releaseDrag);
    banner.addEventListener("pointercancel", releaseDrag);
    banner.addEventListener("pointerleave", onPointerLeave);

    let lastTickTime = performance.now();
    let runDist = 180;

    const tick = (now: number) => {
      const dt = Math.min(48, Math.max(1, now - lastTickTime));
      lastTickTime = now;

      // Velocity / Marquee Position
      if (!isDragging) {
        currentSpeed += (targetSpeed - currentSpeed) * 0.06;
        offset -= currentSpeed;
      }

      // Seamless infinite wrap across both forward & reverse throw directions
      while (offset <= -singleLen * 2.5) offset += singleLen;
      while (offset >= -singleLen * 0.5) offset -= singleLen;

      textPath.setAttribute("startOffset", `${offset.toFixed(1)}px`);

      // Smooth damped spring interpolation (consistent, zero snap)
      if (isDragging) {
        bendY += (targetBendY - bendY) * 0.28;
        bendX += (targetBendX - bendX) * 0.28;
        velY = 0;
      } else {
        velY = clamp((velY + (targetBendY - bendY) * 0.12) * 0.8, -14, 14);
        bendY = clamp(bendY + velY, -46, 46);
        bendX += (targetBendX - bendX) * 0.12;
      }

      if (Math.abs(bendY) > 0.04 || Math.abs(bendX) > 0.04 || Math.abs(velY) > 0.04) {
        updateCurveGeometry(bendX, bendY);
      }

      // Animate running cat smoothly left -> right along the upper contour of the live bent ribbon
      const runner = runnerGroupRef.current;
      if (runner) {
        try {
          const totalLen = mainPath.getTotalLength();
          if (totalLen > 120) {
            runDist += dt * 0.24;
            if (runDist > totalLen - 30) {
              runDist = 30;
            }
            const d1 = Math.max(0, runDist - 4);
            const d2 = Math.min(totalLen, runDist + 4);
            const p = mainPath.getPointAtLength(runDist);
            const p1 = mainPath.getPointAtLength(d1);
            const p2 = mainPath.getPointAtLength(d2);
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const tLen = Math.hypot(dx, dy) || 1;
            const nx = dy / tLen;
            const ny = -dx / tLen;
            const sx = p.x + nx * 46;
            const sy = p.y + ny * 46;
            const angle = clamp(Math.atan2(dy, dx) * (180 / Math.PI), -24, 24);
            runner.setAttribute(
              "transform",
              `translate(${sx.toFixed(1)}, ${sy.toFixed(1)}) rotate(${angle.toFixed(1)})`
            );
          }
        } catch {}
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", onScroll);
      banner.removeEventListener("pointerenter", onPointerEnter);
      banner.removeEventListener("pointerdown", onPointerDown);
      banner.removeEventListener("pointermove", onPointerMove);
      banner.removeEventListener("pointerup", releaseDrag);
      banner.removeEventListener("pointercancel", releaseDrag);
      banner.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  // Close Portal on Escape
  useEffect(() => {
    if (!portalSite) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPortalSite(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [portalSite]);

  return (
    <>
      <section className="ssg-hero">
        <div className="hero-organic-stream" aria-hidden="true">
          <svg viewBox="0 0 1600 680" width="100%" height="100%" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroStreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(237, 91, 4, 0.05)" />
                <stop offset="45%" stopColor="rgba(238, 248, 90, 0.07)" />
                <stop offset="100%" stopColor="rgba(237, 91, 4, 0.02)" />
              </linearGradient>
              <linearGradient id="heroStreamLine" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="rgba(237, 91, 4, 0)" />
                <stop offset="35%" stopColor="rgba(237, 91, 4, 0.18)" />
                <stop offset="70%" stopColor="rgba(238, 248, 90, 0.28)" />
                <stop offset="100%" stopColor="rgba(237, 91, 4, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M -100, 340 C 320, 180 580, 520 1020, 240 C 1280, 70 1520, 180 1700, 130 L 1700, 680 L -100, 680 Z"
              fill="url(#heroStreamGrad)"
            />
            <path
              d="M -100, 340 C 320, 180 580, 520 1020, 240 C 1280, 70 1520, 180 1700, 130"
              stroke="url(#heroStreamLine)"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.65"
            />
          </svg>
        </div>

        <div className="hero-split-grid">
          <div className="hero-split-col hero-split-col--text">
            <h1 className="hero-split-title">
              Des vitrines d&apos;exception. Sans agence. Sans compromis.
            </h1>

            <p className="hero-split-lead">
              Conception &amp; code sur-mesure <strong>offerts à 100%</strong> : vous ne réglez que
              votre hébergement direct. Zéro frais d&apos;agence.
            </p>

            <div className="hero-split-actions">
              <Link
                href="/commander"
                className="btn-ramp-cta btn-magnetic"
                aria-label="Commander mon site offert (0 €)"
              >
                <span>Commander mon site (0 €)</span>
                <span className="btn-arrow-double" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/rdv"
                className="btn btn-secondary btn-magnetic"
                style={{
                  fontSize: "0.95rem",
                  padding: "13px 20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  borderColor: "rgba(237, 91, 4, 0.35)",
                  color: "var(--color-primary)",
                }}
                aria-label="Prendre rendez-vous avec Léo (10 min)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Prendre RDV (10 min)</span>
              </Link>
            </div>
          </div>

          <div className="hero-split-col hero-split-col--mockup" id="heroShowcase">
            <div className="hero-showcase-stage-inner">
              <div
                ref={canvasRef}
                id="bureauCanvas"
                className="bureau-canvas hero-bureau-canvas"
                aria-label="Espace de travail interactif multi-fenêtres"
              >
                {WINDOWS.map((win, idx) => (
                  <div
                    key={win.id}
                    ref={(el) => {
                      winRefs.current[win.id] = el;
                    }}
                    id={win.id}
                    className="bureau-window"
                    style={{
                      top: win.defaultPos.top,
                      left: win.defaultPos.left,
                      right: win.defaultPos.right,
                      width: win.widthStyle,
                      height: win.heightStyle,
                      transform: `rotate(${win.defaultAngle}deg)`,
                      zIndex: 12 + idx,
                      animationDelay: `${0.06 + idx * 0.13}s`,
                    }}
                  >
                    <div className="bureau-window-bar">
                      <div className="cs-traffic-lights cs-dots">
                        <button
                          type="button"
                          className="cs-dot cs-dot--red bureau-win-close"
                          aria-label="Fermer"
                          onClick={(e) => {
                            e.stopPropagation();
                            minimizeWindow(idx);
                          }}
                        />
                        <button
                          type="button"
                          className="cs-dot cs-dot--yellow bureau-win-min"
                          aria-label="Minimiser"
                          onClick={(e) => {
                            e.stopPropagation();
                            minimizeWindow(idx);
                          }}
                        />
                        <button
                          type="button"
                          className="cs-dot cs-dot--green bureau-win-max"
                          aria-label="Plein écran"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPortalSite(win.key);
                          }}
                        />
                      </div>
                      <div className="cs-url-bar">
                        <svg
                          className="cs-url-lock-svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="cs-url-text">{win.urlText}</span>
                      </div>
                      <button
                        type="button"
                        className="bureau-expand-pill"
                        title="Agrandir en plein écran"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPortalSite(win.key);
                        }}
                      >
                        <span>Agrandir</span>
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="bureau-window-body">
                      <div className="bureau-window-iframe-shield" />
                      <iframe
                        src={win.iframeSrc}
                        title={win.urlText}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                ))}

                <img
                  src="/images/boubane-mascot.gif"
                  alt="Mascotte chat Boubane qui code et fait signe"
                  width={600}
                  height={600}
                  className="pointer-events-none select-none absolute bottom-0 right-1 sm:right-4 z-[35] w-[112px] sm:w-[144px] lg:w-[156px] h-auto object-contain drop-shadow-[0_14px_22px_rgba(12,10,8,0.16)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-dock-wrap">
          <nav
            className="cs-floating-dock"
            id="heroFloatingDock"
            aria-label="Dock d'applications macOS et sélecteur de vitrines"
          >
            <div className="cs-dock-items-wrap">
              <button
                ref={(el) => {
                  dockRefs.current[0] = el;
                }}
                type="button"
                className={`cs-dock-app-btn ${activeDockIdx === 0 && !minimizedMap[0] ? "active" : ""} ${
                  bouncingIdx === 0 ? "is-bouncing" : ""
                }`}
                onClick={() => handleToggleDockApp(0)}
                aria-label="Astravacances"
                aria-selected={activeDockIdx === 0 && !minimizedMap[0]}
              >
                <span className="cs-dock-tooltip">Astravacances.fr</span>
                <div className="cs-dock-icon-box">
                  <img src="/assets/astra-logo.png" alt="Astravacances" className="cs-dock-img" />
                </div>
                <span className="cs-dock-indicator" />
              </button>

              <button
                ref={(el) => {
                  dockRefs.current[1] = el;
                }}
                type="button"
                className={`cs-dock-app-btn ${activeDockIdx === 1 && !minimizedMap[1] ? "active" : ""} ${
                  bouncingIdx === 1 ? "is-bouncing" : ""
                }`}
                onClick={() => handleToggleDockApp(1)}
                aria-label="Vitrine Artisanale"
                aria-selected={activeDockIdx === 1 && !minimizedMap[1]}
              >
                <span className="cs-dock-tooltip">Vitrine Artisanale</span>
                <div
                  className="cs-dock-icon-box"
                  style={{
                    background: "#ED5B04",
                    color: "#FAF8F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span className="cs-dock-indicator" />
              </button>

              <button
                ref={(el) => {
                  dockRefs.current[2] = el;
                }}
                type="button"
                className={`cs-dock-app-btn ${activeDockIdx === 2 && !minimizedMap[2] ? "active" : ""} ${
                  bouncingIdx === 2 ? "is-bouncing" : ""
                }`}
                onClick={() => handleToggleDockApp(2)}
                aria-label="Votre prochain site"
                aria-selected={activeDockIdx === 2 && !minimizedMap[2]}
              >
                <span className="cs-dock-tooltip">Votre prochain site</span>
                <div
                  className="cs-dock-icon-box"
                  style={{
                    background: "linear-gradient(135deg, #27272A 0%, #0C0A08 100%)",
                    color: "#FAF8F5",
                  }}
                >
                  <span style={{ fontSize: "1.1rem", color: "#EEF85A", fontWeight: 800 }}>✦</span>
                </div>
                <span className="cs-dock-indicator" />
              </button>
            </div>
          </nav>
        </div>
      </section>

      {/* Ruban Sculptural en Arche Organique (Kinetic 3D Interactive Ribbon) */}
      <section
        ref={bannerWrapRef}
        className="curved-banner-wrap"
        style={{ touchAction: "pan-y" }}
        aria-label="Ruban interactif : glissez ou cliquez pour jouer avec les standards du studio"
        id="engagements"
      >
        <div className="curved-banner-inner">
          <svg
            className="curved-banner-svg"
            viewBox="0 0 1440 340"
            width="100%"
            height="auto"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ribbonOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6E14" />
                <stop offset="30%" stopColor="#ED5B04" />
                <stop offset="70%" stopColor="#FA5400" />
                <stop offset="100%" stopColor="#D94800" />
              </linearGradient>

              <filter
                id="ribbonElevation"
                filterUnits="userSpaceOnUse"
                x="-400"
                y="-260"
                width="2240"
                height="860"
              >
                <feDropShadow
                  dx="0"
                  dy="16"
                  stdDeviation="18"
                  floodColor="rgba(237, 91, 4, 0.26)"
                />
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(12, 10, 8, 0.08)" />
              </filter>

              <path
                ref={archTextCurveRef}
                id="archTextCurve"
                d="M -2500, 300 C -1500, 280 -800, 190 -150, 225 C 180, 270 480, 220 760, 135 C 1040, 50 1320, 170 1620, 210 C 2100, 240 2800, 280 3800, 300"
                fill="none"
              />
            </defs>

            <path
              ref={ribbonShadowPathRef}
              d="M -150, 231 C 180, 276 480, 226 760, 141 C 1040, 56 1320, 176 1620, 216"
              stroke="rgba(12, 10, 8, 0.08)"
              strokeWidth="96"
              fill="none"
              strokeLinecap="square"
            />
            <path
              ref={ribbonMainPathRef}
              d="M -150, 225 C 180, 270 480, 220 760, 135 C 1040, 50 1320, 170 1620, 210"
              stroke="url(#ribbonOrangeGrad)"
              strokeWidth="94"
              fill="none"
              strokeLinecap="square"
              filter="url(#ribbonElevation)"
            />

            <text
              fontFamily="'Geist', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="25"
              fill="#FFFFFF"
              letterSpacing="0.06em"
              dominantBaseline="central"
              style={{ pointerEvents: "none" }}
            >
              <textPath ref={textPathRef} id="curvedMarqueeText" href="#archTextCurve" startOffset="0">
                DIRECT À VOTRE NOM • DESIGN HAUTE AUTORITÉ • ARTISANAT WEB FRANÇAIS • DEMANDES DE DEVIS DIRECTES • 100% DE LA CRÉATION OFFERTE • CODE PROPRIÉTAIRE • DIRECT À VOTRE NOM • DESIGN HAUTE AUTORITÉ • ARTISANAT WEB FRANÇAIS • DEMANDES DE DEVIS DIRECTES • 100% DE LA CRÉATION OFFERTE • CODE PROPRIÉTAIRE • DIRECT À VOTRE NOM • DESIGN HAUTE AUTORITÉ • ARTISANAT WEB FRANÇAIS • DEMANDES DE DEVIS DIRECTES • 100% DE LA CRÉATION OFFERTE • CODE PROPRIÉTAIRE • DIRECT À VOTRE NOM • DESIGN HAUTE AUTORITÉ • ARTISANAT WEB FRANÇAIS • DEMANDES DE DEVIS DIRECTES • 100% DE LA CRÉATION OFFERTE • CODE PROPRIÉTAIRE • DIRECT À VOTRE NOM • DESIGN HAUTE AUTORITÉ • ARTISANAT WEB FRANÇAIS • DEMANDES DE DEVIS DIRECTES • 100% DE LA CRÉATION OFFERTE • CODE PROPRIÉTAIRE •
              </textPath>
            </text>

            <g
              ref={runnerGroupRef}
              transform="translate(-200, -200)"
              style={{ pointerEvents: "none" }}
              aria-hidden="true"
            >
              <image
                href="/images/boubane-cat-run.gif"
                x="-52"
                y="-88"
                width="104"
                height="104"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
        </div>
      </section>

      {/* Portail Plein Écran macOS */}
      {portalSite && (
        <div
          className="mockup-fullscreen-portal active is-active"
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu plein écran"
        >
          <div className="mockup-portal-backdrop" onClick={() => setPortalSite(null)} />
          <div className="mockup-portal-window">
            <div className="cs-window-bar">
              <div className="cs-window-bar-left">
                <div className="cs-dots">
                  <button
                    type="button"
                    className="cs-dot cs-dot--red"
                    aria-label="Fermer"
                    onClick={() => setPortalSite(null)}
                  />
                  <span className="cs-dot cs-dot--yellow" aria-hidden="true" />
                  <span className="cs-dot cs-dot--green" aria-hidden="true" />
                </div>
                <div className="cs-portal-site-switch">
                  {(["astra", "achille", "valmy"] as SiteKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`cs-portal-tab-btn ${portalSite === key ? "active" : ""}`}
                      onClick={() => setPortalSite(key)}
                    >
                      <span>
                        {key === "astra"
                          ? "Astravacances"
                          : key === "achille"
                          ? "Artisanat BTP"
                          : "Votre Prochain Site"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="cs-url-bar" id="portalUrlBar">
                <span className="cs-url-text">{PORTAL_META[portalSite].url}</span>
              </div>

              <div className="cs-window-bar-right" />
            </div>

            <div className="mockup-portal-body">
              <iframe
                src={PORTAL_META[portalSite].href}
                className="mockup-portal-iframe"
                title={PORTAL_META[portalSite].caption}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

