"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

type SiteKey = "astra" | "achille" | "valmy";

interface WindowMeta {
  id: string;
  key: SiteKey;
  urlText: string;
  dockLabel: string;
  dockShortLabel: string;
  dockSub: string;
  speedBadge: string;
  accentColor: string;
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
    dockLabel: "Astravacances",
    dockShortLabel: "Astra",
    dockSub: "Tourisme · Réalisé",
    speedBadge: "0.2s",
    accentColor: "#2B9BBD",
    iframeSrc: "/showcase-astra.html",
    defaultPos: { top: "14px", left: "6px" },
    defaultAngle: -1.8,
    widthStyle: "clamp(310px, 50%, 525px)",
    heightStyle: "clamp(260px, 41vh, 355px)",
  },
  {
    id: "bureauWinAchille",
    key: "achille",
    urlText: "atelier-renou.fr",
    dockLabel: "Atelier Renou",
    dockShortLabel: "Artisan",
    dockSub: "Menuiserie · Anjou",
    speedBadge: "0.2s",
    accentColor: "#1B4332",
    iframeSrc: "/showcase-artisan.html",
    defaultPos: { top: "26px", right: "8px" },
    defaultAngle: 1.8,
    widthStyle: "clamp(310px, 50%, 525px)",
    heightStyle: "clamp(260px, 41vh, 355px)",
  },
  {
    id: "bureauWinValmy",
    key: "valmy",
    urlText: "votre-entreprise.fr",
    dockLabel: "Votre futur site",
    dockShortLabel: "Votre site",
    dockSub: "Sur-mesure · 0 €",
    speedBadge: "0 €",
    accentColor: "#ED5B04",
    iframeSrc: "/showcase-votre-site.html",
    defaultPos: { top: "136px", left: "19%" },
    defaultAngle: 0,
    widthStyle: "clamp(340px, 60%, 600px)",
    heightStyle: "clamp(285px, 46vh, 385px)",
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
    url: "atelier-renou.fr",
    href: "/showcase-artisan.html",
    dotColor: "#1B4332",
    caption: "Atelier Renou — Menuiserie & Charpente en Haut-Anjou",
  },
  valmy: {
    url: "votre-entreprise.fr",
    href: "/showcase-votre-site.html",
    dotColor: "#ED5B04",
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
  const activeIdxRef = useRef<number>(2);
  const stackOrderRef = useRef<number[]>([0, 1, 2]);

  const [activeDockIdx, setActiveDockIdx] = useState<number>(2);
  const [minimizedMap, setMinimizedMap] = useState<Record<number, boolean>>({});
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);
  const [portalSite, setPortalSite] = useState<SiteKey | null>(null);

  const applyMobileStack = useCallback((animateTransition: boolean) => {
    const order = stackOrderRef.current.filter((idx) => {
      const w = winRefs.current[WINDOWS[idx].id];
      return w && w.getAttribute("data-minimized") !== "true";
    });

    order.forEach((idx, posInVisible) => {
      const win = winRefs.current[WINDOWS[idx].id];
      if (!win) return;
      const depthFromFront = order.length - 1 - posInVisible;
      const topPx = depthFromFront === 0 ? 38 : depthFromFront === 1 ? 20 : 4;
      const scaleVal = depthFromFront === 0 ? 1 : depthFromFront === 1 ? 0.958 : 0.916;
      const opacityVal = depthFromFront === 0 ? 1 : depthFromFront === 1 ? 0.9 : 0.76;

      if (animateTransition) {
        win.classList.add("is-transitioning");
        setTimeout(() => win.classList.remove("is-transitioning"), 380);
      }
      win.style.right = "auto";
      win.style.bottom = "auto";
      win.style.left = "6px";
      win.style.top = `${topPx}px`;
      win.style.transform = `scale(${scaleVal}) rotate(0deg)`;
      win.style.opacity = String(opacityVal);
      win.style.zIndex = String(14 + posInVisible * 4);
    });
  }, []);

  const syncDesktopAngles = useCallback((focusedIdx: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    WINDOWS.forEach((meta, i) => {
      const w = winRefs.current[meta.id];
      if (!w || w.getAttribute("data-minimized") === "true") return;
      if (w.classList.contains("is-dragging") || w.classList.contains("is-flying")) return;
      w.classList.add("is-transitioning");
      const targetAngle = i === focusedIdx ? 0 : meta.defaultAngle;
      w.style.transform = `rotate(${targetAngle}deg)`;
      w.setAttribute("data-saved-transform", `rotate(${targetAngle}deg)`);
      setTimeout(() => w.classList.remove("is-transitioning"), 380);
    });
  }, []);

  const focusWindow = useCallback(
    (idx: number) => {
      const meta = WINDOWS[idx];
      const win = winRefs.current[meta.id];
      if (!win) return;

      activeIdxRef.current = idx;
      setActiveDockIdx(idx);
      stackOrderRef.current = [
        ...stackOrderRef.current.filter((item) => item !== idx),
        idx,
      ];

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        applyMobileStack(true);
      } else {
        highestZ.current += 1;
        win.style.zIndex = String(highestZ.current);
        syncDesktopAngles(idx);
      }
    },
    [applyMobileStack, syncDesktopAngles]
  );

  const triggerBounce = useCallback((idx: number) => {
    setBouncingIdx(null);
    requestAnimationFrame(() => {
      setBouncingIdx(idx);
      setTimeout(() => setBouncingIdx((cur) => (cur === idx ? null : cur)), 450);
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
        win.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(0.08)`;
        win.style.opacity = "0";
        win.style.pointerEvents = "none";
      } else {
        win.classList.add("is-transitioning");
        win.style.transform = "translateY(100px) scale(0.2)";
        win.style.opacity = "0";
        win.style.pointerEvents = "none";
      }

      setMinimizedMap((prev) => {
        const next = { ...prev, [idx]: true };
        const remaining = stackOrderRef.current.filter((i) => !next[i]);
        const nextFocus = remaining.length > 0 ? remaining[remaining.length - 1] : idx;
        activeIdxRef.current = nextFocus;
        setActiveDockIdx(nextFocus);
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          requestAnimationFrame(() => applyMobileStack(true));
        } else {
          syncDesktopAngles(nextFocus);
        }
        return next;
      });

      triggerBounce(idx);
      setTimeout(() => win.classList.remove("is-transitioning"), 380);
    },
    [applyMobileStack, syncDesktopAngles, triggerBounce]
  );

  const restoreWindow = useCallback(
    (idx: number) => {
      const meta = WINDOWS[idx];
      const win = winRefs.current[meta.id];
      if (!win) return;

      win.removeAttribute("data-minimized");
      win.style.pointerEvents = "";
      win.style.opacity = "1";

      setMinimizedMap((prev) => ({ ...prev, [idx]: false }));
      focusWindow(idx);
      triggerBounce(idx);
    },
    [focusWindow, triggerBounce]
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

      if (activeIdxRef.current === idx) {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          setPortalSite(meta.key);
        } else {
          minimizeWindow(idx);
        }
      } else {
        focusWindow(idx);
        triggerBounce(idx);
      }
    },
    [focusWindow, minimizeWindow, restoreWindow, triggerBounce]
  );

  // Studio Desk Inertial Drag Physics + 5px Hysteresis + Mobile Card Stack
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanups: Array<() => void> = [];

    const layoutResponsive = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        applyMobileStack(false);
      } else {
        stackOrderRef.current.forEach((idx, orderPos) => {
          const meta = WINDOWS[idx];
          const win = winRefs.current[meta.id];
          if (!win || win.getAttribute("data-minimized") === "true") return;
          win.style.top = meta.defaultPos.top;
          win.style.left = meta.defaultPos.left ?? "auto";
          win.style.right = meta.defaultPos.right ?? "auto";
          win.style.bottom = "auto";
          win.style.opacity = "1";
          const angle = idx === activeIdxRef.current ? 0 : meta.defaultAngle;
          win.style.transform = `rotate(${angle}deg)`;
          win.style.zIndex = String(12 + orderPos);
        });
        highestZ.current = 16;
      }
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

      let activePointerId: number | null = null;
      let isDragging = false;
      let wasAlreadyFocused = false;
      let downX = 0;
      let downY = 0;
      let clickedBody = false;
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
        if (activePointerId !== null) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;

        const target = e.target as HTMLElement | null;
        if (target?.closest("button") || target?.closest("a") || target?.closest(".cs-dot")) {
          return;
        }

        wasAlreadyFocused = activeIdxRef.current === idx;
        clickedBody = !!target?.closest(".bureau-window-body");

        if (!wasAlreadyFocused) {
          focusWindow(idx);
        }

        // On mobile viewport, keep native vertical scrolling smooth; tap switches/opens cards
        if (window.innerWidth < 768) {
          activePointerId = e.pointerId;
          downX = e.clientX;
          downY = e.clientY;
          return;
        }

        cancelFling();
        activePointerId = e.pointerId;
        isDragging = false;
        downX = e.clientX;
        downY = e.clientY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastTime = performance.now();
        vx = 0;
        vy = 0;
        smoothedTilt = 0;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerId !== activePointerId || window.innerWidth < 768) return;

        if (!isDragging) {
          if (Math.hypot(e.clientX - downX, e.clientY - downY) < 5) return;

          isDragging = true;
          if (activeIdxRef.current !== idx) {
            focusWindow(idx);
          } else {
            highestZ.current += 1;
            win.style.zIndex = String(highestZ.current);
          }
          win.classList.add("is-dragging");
          win.classList.remove("is-transitioning");

          const canvasRect = canvas.getBoundingClientRect();
          const winRect = win.getBoundingClientRect();

          currentLeft = winRect.left - canvasRect.left;
          currentTop = winRect.top - canvasRect.top;

          win.style.right = "auto";
          win.style.bottom = "auto";
          win.style.left = `${currentLeft}px`;
          win.style.top = `${currentTop}px`;
          win.style.transform = "scale(1.018) rotate(0deg)";

          lastPointerX = e.clientX;
          lastPointerY = e.clientY;
          lastTime = performance.now();

          try {
            win.setPointerCapture(e.pointerId);
          } catch {}
        }

        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;

        vx = vx * 0.45 + (dx / dt) * 0.55;
        vy = vy * 0.45 + (dy / dt) * 0.55;
        currentLeft += dx;
        currentTop += dy;

        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastTime = now;

        const minVisibleX = 80;
        const minLeft = -win.offsetWidth + minVisibleX;
        const maxLeft = canvas.clientWidth - minVisibleX;
        const minTop = -40;
        const maxTop = canvas.clientHeight + 260;

        currentLeft = Math.max(minLeft, Math.min(currentLeft, maxLeft));
        currentTop = Math.max(minTop, Math.min(currentTop, maxTop));

        const targetTilt = Math.max(-4.5, Math.min(4.5, vx * 9));
        smoothedTilt += (targetTilt - smoothedTilt) * 0.25;

        win.style.transform = `scale(1.018) rotate(${smoothedTilt.toFixed(2)}deg)`;
        win.style.left = `${currentLeft.toFixed(1)}px`;
        win.style.top = `${currentTop.toFixed(1)}px`;
      };

      const stopDrag = (e: PointerEvent) => {
        if (e.pointerId !== activePointerId) return;
        activePointerId = null;

        const movedDist = Math.hypot(e.clientX - downX, e.clientY - downY);

        if (!isDragging) {
          if (movedDist < 6 && wasAlreadyFocused && clickedBody && e.type === "pointerup") {
            setPortalSite(meta.key);
          }
          return;
        }

        isDragging = false;
        win.classList.remove("is-dragging");
        try {
          if (win.hasPointerCapture(e.pointerId)) {
            win.releasePointerCapture(e.pointerId);
          }
        } catch {}

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const minVisibleX = 80;
        const minLeft = -win.offsetWidth + minVisibleX;
        const maxLeft = canvas.clientWidth - minVisibleX;
        const minTop = -40;
        const maxTop = canvas.clientHeight + 260;

        const speed = Math.hypot(vx, vy);
        if (speed > 0.06 && !prefersReduced) {
          win.classList.add("is-flying");
          let currentTilt = smoothedTilt;
          const step = () => {
            vx *= 0.91;
            vy *= 0.91;
            currentTilt *= 0.86;
            currentLeft += vx * 16;
            currentTop += vy * 16;

            if (currentLeft <= minLeft) {
              currentLeft = minLeft;
              vx = -vx * 0.35;
            } else if (currentLeft >= maxLeft) {
              currentLeft = maxLeft;
              vx = -vx * 0.35;
            }
            if (currentTop <= minTop) {
              currentTop = minTop;
              vy = -vy * 0.35;
            } else if (currentTop >= maxTop) {
              currentTop = maxTop;
              vy = -vy * 0.35;
            }

            win.style.left = `${currentLeft.toFixed(1)}px`;
            win.style.top = `${currentTop.toFixed(1)}px`;
            win.style.transform = `scale(1) rotate(${currentTilt.toFixed(2)}deg)`;

            if (Math.hypot(vx, vy) > 0.014) {
              flingAnimId = requestAnimationFrame(step);
            } else {
              cancelFling();
              win.classList.add("is-transitioning");
              win.style.transform = "rotate(0deg)";
              win.setAttribute("data-saved-transform", "rotate(0deg)");
              setTimeout(() => win.classList.remove("is-transitioning"), 320);
            }
          };
          flingAnimId = requestAnimationFrame(step);
        } else {
          win.classList.add("is-transitioning");
          win.style.transform = "rotate(0deg)";
          win.setAttribute("data-saved-transform", "rotate(0deg)");
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
  }, [applyMobileStack, focusWindow]);

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

    let bendY = 0;
    let targetBendY = 0;
    let velY = 0;

    let bendX = 0;
    let targetBendX = 0;

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

      if (!isDragging) {
        currentSpeed += (targetSpeed - currentSpeed) * 0.06;
        offset -= currentSpeed;
      }

      while (offset <= -singleLen * 2.5) offset += singleLen;
      while (offset >= -singleLen * 0.5) offset -= singleLen;

      textPath.setAttribute("startOffset", `${offset.toFixed(1)}px`);

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

  // Close Portal on Escape + lock background scroll
  useEffect(() => {
    if (!portalSite) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPortalSite(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
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
              <a
                href="https://rdv.boubane.com/boubane/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-magnetic"
                style={{
                  fontSize: "0.95rem",
                  padding: "13px 20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  borderColor: "rgba(12, 10, 8, 0.14)",
                  color: "#0C0A08",
                }}
                aria-label="Prendre rendez-vous avec Léo (30 min)"
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
                <span>Prendre RDV (30 min)</span>
              </a>
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
                {WINDOWS.map((win, idx) => {
                  const isFocused = activeDockIdx === idx && !minimizedMap[idx];
                  return (
                    <div
                      key={win.id}
                      ref={(el) => {
                        winRefs.current[win.id] = el;
                      }}
                      id={win.id}
                      className={`bureau-window ${isFocused ? "is-focused" : ""}`}
                      style={{
                        top: win.defaultPos.top,
                        left: win.defaultPos.left,
                        right: win.defaultPos.right,
                        width: win.widthStyle,
                        height: win.heightStyle,
                        transform: `rotate(${win.defaultAngle}deg)`,
                        zIndex: 12 + idx,
                        animationDelay: `${0.04 + idx * 0.06}s`,
                      }}
                    >
                      <div className="bureau-window-screen">
                        <div
                          className="bureau-window-bar"
                          onDoubleClick={() => setPortalSite(win.key)}
                        >
                          <div className="cs-traffic-lights cs-dots">
                            <button
                              type="button"
                              className="cs-dot cs-dot--red bureau-win-close"
                              aria-label={`Réduire ${win.dockLabel}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                minimizeWindow(idx);
                              }}
                            />
                            <button
                              type="button"
                              className="cs-dot cs-dot--yellow bureau-win-min"
                              aria-label={`Minimiser ${win.dockLabel}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                minimizeWindow(idx);
                              }}
                            />
                            <button
                              type="button"
                              className="cs-dot cs-dot--green bureau-win-max"
                              aria-label={`Ouvrir ${win.dockLabel} en plein écran`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPortalSite(win.key);
                              }}
                            />
                          </div>

                          <button
                            type="button"
                            className="bureau-url-capsule"
                            title="Explorer cette vitrine en plein écran"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPortalSite(win.key);
                            }}
                          >
                            <span
                              className="bureau-url-dot"
                              style={{ backgroundColor: win.accentColor }}
                              aria-hidden="true"
                            />
                            <svg
                              className="cs-url-lock-svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span className="cs-url-text">{win.urlText}</span>
                            <span className="bureau-url-speed">{win.speedBadge}</span>
                          </button>

                          <div className="bureau-bar-right">
                            <button
                              type="button"
                              className="bureau-expand-pill"
                              title="Agrandir en plein écran"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPortalSite(win.key);
                              }}
                            >
                              <span>Aperçu</span>
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="bureau-window-body">
                          <div className="bureau-window-iframe-shield" />
                          <iframe
                            src={win.iframeSrc}
                            title={win.urlText}
                            loading={idx === 2 ? "eager" : "lazy"}
                          />
                          <div className="bureau-live-cue" aria-hidden="true">
                            <span>Tester la démo en plein écran</span>
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <img
                  src="/images/boubane-mascot.gif"
                  alt="Mascotte chat Boubane qui code et fait signe"
                  width={600}
                  height={600}
                  className="pointer-events-none select-none absolute bottom-0 right-1 sm:right-4 z-[45] w-[92px] sm:w-[144px] lg:w-[156px] h-auto object-contain drop-shadow-[0_14px_22px_rgba(12,10,8,0.16)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-dock-wrap">
          <nav
            className="cs-floating-dock"
            id="heroFloatingDock"
            aria-label="Sélecteur de vitrines interactives"
          >
            <div className="cs-dock-items-wrap" role="tablist" aria-label="Vitrines de démonstration">
              {WINDOWS.map((win, idx) => {
                const isActive = activeDockIdx === idx && !minimizedMap[idx];
                return (
                  <button
                    key={win.key}
                    ref={(el) => {
                      dockRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    className={`cs-dock-app-btn ${isActive ? "active" : ""} ${
                      bouncingIdx === idx ? "is-bouncing" : ""
                    }`}
                    onClick={() => handleToggleDockApp(idx)}
                    aria-label={win.dockLabel}
                    aria-selected={isActive}
                  >
                    {idx === 0 && (
                      <div className="cs-dock-icon-box">
                        <img
                          src="/assets/astra-logo.png"
                          alt=""
                          className="cs-dock-img"
                        />
                      </div>
                    )}
                    {idx === 1 && (
                      <div
                        className="cs-dock-icon-box"
                        style={{
                          background: "#1B4332",
                          color: "#FAF8F5",
                          borderColor: "rgba(27, 67, 50, 0.35)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                          }}
                        >
                          R
                        </span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div
                        className="cs-dock-icon-box"
                        style={{
                          background: "#ED5B04",
                          color: "#FFFFFF",
                          borderColor: "rgba(237, 91, 4, 0.35)",
                        }}
                      >
                        <span style={{ fontSize: "0.9rem", fontWeight: 800 }}>✦</span>
                      </div>
                    )}

                    <span className="cs-dock-label-group">
                      <span className="cs-dock-label">
                        <span className="sm:hidden">{win.dockShortLabel}</span>
                        <span className="hidden sm:inline">{win.dockLabel}</span>
                      </span>
                      <span className="cs-dock-sub">{win.dockSub}</span>
                    </span>

                    <span className="cs-dock-indicator" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="cs-dock-divider" aria-hidden="true" />

            <button
              type="button"
              className="cs-dock-expand-btn"
              onClick={() => setPortalSite(WINDOWS[activeDockIdx]?.key ?? "valmy")}
              aria-label="Ouvrir la vitrine sélectionnée en plein écran"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <span className="cs-dock-expand-label">Plein écran</span>
            </button>
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
      <AnimatePresence>
        {portalSite && (
          <motion.div
            key="portal-modal"
            exit={{
              opacity: 0,
              transition: { duration: 0.12, ease: [0.7, 0, 0.84, 0] },
            }}
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
                    <button
                      type="button"
                      className="cs-dot cs-dot--yellow"
                      aria-label="Minimiser"
                      onClick={() => setPortalSite(null)}
                    />
                    <button
                      type="button"
                      className="cs-dot cs-dot--green"
                      aria-label="Ouvrir dans un nouvel onglet"
                      onClick={() => {
                        if (portalSite) {
                          window.open(PORTAL_META[portalSite].href, "_blank", "noopener,noreferrer");
                        }
                      }}
                    />
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
                              ? "Atelier Renou"
                              : "Votre futur site"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cs-url-bar" id="portalUrlBar">
                  <span
                    className="bureau-url-dot"
                    style={{ backgroundColor: PORTAL_META[portalSite].dotColor }}
                    aria-hidden="true"
                  />
                  <svg
                    className="cs-url-lock-svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="cs-url-text">{PORTAL_META[portalSite].url}</span>
                </div>

                <div className="cs-window-bar-right">
                  <a
                    href={PORTAL_META[portalSite].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-white border border-[#0C0A08]/[0.1] hover:border-[#0C0A08]/25 text-[#44403C] hover:text-[#0C0A08] px-3 py-1 text-[11.5px] font-medium transition-colors whitespace-nowrap"
                  >
                    <span>Nouvel onglet</span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>

                  <Link
                    href="/commander"
                    className="min-h-[38px] inline-flex items-center gap-1.5 rounded-full bg-[#ED5B04] hover:bg-[#D64E00] text-white px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors whitespace-nowrap"
                  >
                    <span className="sm:hidden">Commander</span>
                    <span className="hidden sm:inline">Commander ce style</span>
                  </Link>

                  <button
                    type="button"
                    aria-label="Fermer l'aperçu"
                    onClick={() => setPortalSite(null)}
                    className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#0C0A08]/[0.06] text-[#0C0A08] active:scale-95 transition-transform cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mockup-portal-body">
                <iframe
                  src={PORTAL_META[portalSite].href}
                  className="mockup-portal-iframe"
                  title={PORTAL_META[portalSite].caption}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
