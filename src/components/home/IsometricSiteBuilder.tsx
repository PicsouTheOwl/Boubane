"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Layers, Square } from "lucide-react";
import { ATELIER_EASE, ATELIER_SPRING, cn } from "@/lib/utils";
import { HandwrittenNote } from "@/components/DraftingPrimitives";

interface LayerInfo {
  id: number;
  code: string;
  title: string;
  tag: string;
  summary: string;
  detail: string;
  paper: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: 0,
    code: "FEUILLET 01",
    title: "Plan crayonné & intention Google",
    tag: "Jour 1 · 10 min ensemble",
    summary: "Ce que vos futurs clients tapent vraiment à Segré ou en Anjou.",
    detail:
      "Pas de jargon SEO. On pose sur le papier vos 3 vrais services, votre secteur géographique et les mots simples qui amènent le bon coup de fil.",
    paper: "Papier kraft millimétré",
  },
  {
    id: 1,
    code: "FEUILLET 02",
    title: "Calque textes humains & mise en page",
    tag: "Jours 2 à 4 · Sans blabla",
    summary: "Vos vraies photos de chantier ou d'établissement, lisibles sur mobile.",
    detail:
      "Je rédige et j'assemble chaque bloc pour qu'un visiteur comprenne qui vous êtes en quatre secondes et trouve votre numéro sans chercher.",
    paper: "Calque translucide tracé",
  },
  {
    id: 2,
    code: "FEUILLET 03",
    title: "Vitrine finie, rapide et à votre nom",
    tag: "Jour 5 · Mise en ligne",
    summary: "Chargement < 0,3s, code et nom de domaine 100 % à vous.",
    detail:
      "0 € d'honoraires de création. Vous réglez uniquement votre domaine (~10 €/an) et votre hébergement (~5 €/mois), sans jamais être bloqué.",
    paper: "Feuille finale vernie",
  },
];

export function IsometricSiteBuilder() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [activeLayer, setActiveLayer] = useState<number>(2);

  // Scroll-linked explosion distance between the 3 stacked sheets
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const scrollSpread = useTransform(scrollYProgress, [0.1, 0.55, 0.9], [12, 34, 16]);
  const smoothSpread = useSpring(scrollSpread, { stiffness: 140, damping: 24 });

  // Gentle desktop mouse parallax on the 3D desk plane
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawY, { stiffness: 130, damping: 22 });
  const tiltY = useSpring(rawX, { stiffness: 130, damping: 22 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode !== "3d" || e.pointerType !== "mouse" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx * 10);
    rawY.set(-ny * 8);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const current = LAYERS[activeLayer];

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative rounded-md border border-[#424242]/25 bg-[#F3EDE0] drafting-grid paper-sheet-shadow-lg overflow-hidden"
    >
      {/* Top drafting toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[#424242]/20 bg-[#FDFBF5]/90">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#ED5B04]" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#0C0A08]/75">
            MAQUETTE EN 3 FEUILLETS · FAUX-3D
          </span>
        </div>

        {/* 2D / 3D physical toggle button */}
        <div
          role="group"
          aria-label="Basculer vue 3D éclatée ou vue 2D à plat"
          className="inline-flex rounded-[4px] border border-[#424242]/30 bg-[#EFE9DC] p-0.5"
        >
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors cursor-pointer min-h-[34px]",
              viewMode === "3d"
                ? "bg-[#141311] text-[#FAF7F0] shadow-xs"
                : "text-[#0C0A08]/65 hover:text-[#0C0A08]"
            )}
          >
            <Layers className="w-3.5 h-3.5 text-[#ED5B04]" />
            <span>3D éclaté</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors cursor-pointer min-h-[34px]",
              viewMode === "2d"
                ? "bg-[#141311] text-[#FAF7F0] shadow-xs"
                : "text-[#0C0A08]/65 hover:text-[#0C0A08]"
            )}
          >
            <Square className="w-3.5 h-3.5" />
            <span>2D à plat</span>
          </button>
        </div>
      </div>

      {/* Perspective 2.5D Isometric Drafting Stage (strictly centered & mobile-clamped) */}
      <div className="relative h-[285px] sm:h-[340px] flex items-center justify-center overflow-hidden select-none">
        {/* Corner annotation in Caveat font */}
        <div className="hidden sm:block absolute top-4 left-5 z-20 -rotate-2">
          <HandwrittenNote className="text-[1.2rem]">
            Cliquez sur un feuillet pour le soulever
          </HandwrittenNote>
        </div>

        <motion.div
          style={{
            perspective: 1400,
            rotateX: viewMode === "3d" ? tiltX : 0,
            rotateY: viewMode === "3d" ? tiltY : 0,
          }}
          className="relative flex items-center justify-center w-full h-full scale-[0.76] sm:scale-[0.94] lg:scale-100 transition-transform"
        >
          <motion.div
            animate={
              viewMode === "3d"
                ? { rotateX: 50, rotateZ: -28, y: 12 }
                : { rotateX: 0, rotateZ: 0, y: 0 }
            }
            transition={ATELIER_SPRING}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-[290px] sm:w-[320px] h-[196px]"
          >
            {/* Floor cast shadow on the drafting desk */}
            <motion.div
              animate={{
                opacity: viewMode === "3d" ? 1 : 0.35,
                scale: viewMode === "3d" ? 1.04 : 0.98,
                x: viewMode === "3d" ? 16 : 6,
                y: viewMode === "3d" ? 20 : 6,
              }}
              transition={ATELIER_SPRING}
              className="absolute inset-0 rounded-[4px] bg-[#0C0A08]/16 blur-[10px]"
              style={{ transform: "translateZ(-24px)" }}
            />

            {/* LAYER 0: Kraft Blueprint Base Sheet */}
            <motion.button
              type="button"
              onClick={() => setActiveLayer(0)}
              aria-label="Inspecter le feuillet 01 : Plan crayonné"
              animate={{
                z:
                  viewMode === "2d"
                    ? 0
                    : activeLayer === 0
                      ? 28
                      : -16,
                y: viewMode === "2d" ? (activeLayer === 0 ? -6 : 0) : 0,
              }}
              transition={ATELIER_SPRING}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "4px 4px 0 rgba(12,10,8,0.12)",
              }}
              className={cn(
                "absolute inset-0 rounded-[4px] border text-left p-4 cursor-pointer transition-colors",
                "bg-[#E8DAC1] border-[#424242]/40 text-[#0C0A08]",
                activeLayer === 0 && "ring-2 ring-[#ED5B04]"
              )}
            >
              <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.12em] opacity-70 pb-2 border-b border-dashed border-[#0C0A08]/25">
                <span>01 · PLAN CRAYONNÉ</span>
                <span>KRAFT 120G</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="col-span-2 h-16 rounded-[2px] border border-dashed border-[#0C0A08]/35 bg-[#FDFBF5]/45 p-2">
                  <div className="h-1.5 w-14 bg-[#0C0A08]/45 rounded-full mb-1.5" />
                  <div className="h-1.5 w-20 bg-[#0C0A08]/20 rounded-full mb-1" />
                  <div className="h-1.5 w-16 bg-[#0C0A08]/20 rounded-full" />
                </div>
                <div className="h-16 rounded-[2px] border border-dashed border-[#ED5B04]/60 bg-[#ED5B04]/10 flex items-center justify-center font-mono text-[9px] text-[#ED5B04] font-semibold">
                  APPEL
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] text-[#0C0A08]/60">
                <span>SEGRÉ · HAUT-ANJOU</span>
                <span>ECH. 1:1</span>
              </div>
            </motion.button>

            {/* LAYER 1: Translucent Tracing Calque Sheet */}
            <motion.button
              type="button"
              onClick={() => setActiveLayer(1)}
              aria-label="Inspecter le feuillet 02 : Calque textes et mise en page"
              animate={{
                z:
                  viewMode === "2d"
                    ? activeLayer === 1
                      ? 12
                      : 4
                    : activeLayer === 1
                      ? 78
                      : 32,
                x: viewMode === "2d" && activeLayer === 1 ? -4 : 0,
                y: viewMode === "2d" && activeLayer === 1 ? -4 : 0,
              }}
              transition={ATELIER_SPRING}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "5px 5px 0 rgba(12,10,8,0.10)",
              }}
              className={cn(
                "absolute inset-0 rounded-[4px] border text-left p-4 cursor-pointer transition-colors backdrop-blur-[2px]",
                "bg-[#FAF7F0]/86 border-[#192841]/35 text-[#0C0A08]",
                activeLayer === 1 && "ring-2 ring-[#ED5B04] bg-[#FAF7F0]/95"
              )}
            >
              <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#192841] pb-2 border-b border-dashed border-[#192841]/30">
                <span>02 · CALQUE TEXTES &amp; PHOTOS</span>
                <span>90G TRANSPARENT</span>
              </div>
              <div className="mt-3 flex items-start gap-2.5">
                <div className="w-12 h-12 rounded-[2px] border border-[#192841]/30 bg-[#192841]/10 flex items-center justify-center font-mono text-[8px] text-[#192841]">
                  PHOTO
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-36 bg-[#192841]/80 rounded-[1px]" />
                  <div className="h-1.5 w-32 bg-[#192841]/30 rounded-[1px]" />
                  <div className="h-1.5 w-24 bg-[#192841]/30 rounded-[1px]" />
                </div>
              </div>
              <div className="mt-3 font-[family-name:var(--font-caveat)] text-[1.05rem] text-[#ED5B04]">
                &laquo; Vos vrais mots, pas du texte de catalogue &raquo;
              </div>
            </motion.button>

            {/* LAYER 2: Finished Live Orange & Ink Production Sheet */}
            <motion.button
              type="button"
              onClick={() => setActiveLayer(2)}
              aria-label="Inspecter le feuillet 03 : Vitrine en ligne"
              animate={{
                z:
                  viewMode === "2d"
                    ? activeLayer === 2
                      ? 16
                      : 2
                    : activeLayer === 2
                      ? 106
                      : 78,
                x: viewMode === "2d" && activeLayer !== 2 ? 12 : 0,
                y: viewMode === "2d" && activeLayer !== 2 ? 10 : 0,
                opacity: viewMode === "2d" && activeLayer !== 2 ? 0.35 : 1,
              }}
              transition={ATELIER_SPRING}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "6px 6px 0 rgba(12,10,8,0.16)",
              }}
              className={cn(
                "absolute inset-0 rounded-[4px] border text-left p-4 cursor-pointer transition-colors",
                "bg-[#141311] border-white/25 text-[#FAF7F0]",
                activeLayer === 2 && "ring-2 ring-[#ED5B04]"
              )}
            >
              <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.12em] pb-2 border-b border-dashed border-white/20">
                <span className="text-[#ED5B04] font-semibold">03 · VITRINE EN LIGNE</span>
                <span className="text-emerald-400">&lt; 0,3S</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[9px] text-white/50">VOTRE-METIER.FR</div>
                  <div className="text-[13px] font-bold tracking-tight text-white mt-0.5">
                    Prêt en 5 jours ouvrés
                  </div>
                </div>
                <div className="rounded-[2px] bg-[#ED5B04] text-white font-mono text-[10px] font-bold px-2.5 py-1">
                  0 € CRÉA
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 font-mono text-[8.5px] text-white/75">
                <div className="rounded-[2px] border border-white/15 px-2 py-1.5 bg-white/[0.04]">
                  Mobile net
                </div>
                <div className="rounded-[2px] border border-white/15 px-2 py-1.5 bg-white/[0.04]">
                  Code à vous
                </div>
                <div className="rounded-[2px] border border-white/15 px-2 py-1.5 bg-white/[0.04]">
                  Zéro piège
                </div>
              </div>
            </motion.button>

            {/* Subtle scroll-driven height ruler guide on 3D side */}
            {viewMode === "3d" && (
              <motion.div
                aria-hidden="true"
                style={{ height: smoothSpread, transform: "rotateX(-90deg) translateX(-18px)" }}
                className="hidden sm:block absolute left-0 bottom-0 w-px bg-[#ED5B04]/45 origin-bottom"
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Interactive Layer Selector + Live Explanation */}
      <div className="border-t border-[#424242]/20 bg-[#FDFBF5] p-4 sm:p-6">
        <div
          role="tablist"
          aria-label="Choisir le feuillet à inspecter"
          className="grid grid-cols-3 gap-2 mb-4"
        >
          {LAYERS.map((layer) => {
            const selected = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActiveLayer(layer.id)}
                className={cn(
                  "relative px-2.5 py-2.5 rounded-[4px] border text-left transition-all cursor-pointer min-h-[46px] active:scale-[0.98]",
                  selected
                    ? "bg-[#141311] border-[#141311] text-[#FAF7F0] paper-sheet-shadow"
                    : "bg-[#F3EDE0]/70 border-[#424242]/25 text-[#0C0A08]/80 hover:border-[#ED5B04]"
                )}
              >
                <div
                  className={cn(
                    "font-mono text-[9.5px] uppercase tracking-[0.1em]",
                    selected ? "text-[#ED5B04]" : "text-[#57534E]"
                  )}
                >
                  {layer.code}
                </div>
                <div className="text-[11.5px] sm:text-xs font-semibold truncate mt-0.5">
                  {layer.title.split(" & ")[0]}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: ATELIER_EASE }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#ED5B04]">
                <span>{current.tag}</span>
                <span className="text-[#0C0A08]/30">·</span>
                <span className="text-[#57534E]">{current.paper}</span>
              </div>
              <p className="text-[0.95rem] font-semibold text-[#0C0A08] mt-1">{current.summary}</p>
              <p className="text-[0.88rem] leading-[1.58] text-[#57534E] mt-1 max-w-[54ch]">
                {current.detail}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
