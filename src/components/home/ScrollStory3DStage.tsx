"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ATELIER_EASE, cn } from "@/lib/utils";

interface StoryBeat {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  body: string;
  metric: string;
  range: [number, number];
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: "beat-constat",
    step: "01",
    eyebrow: "Le point de départ à Segré",
    title: "Une vitrine d'agence coûte souvent 4 500 €.",
    body: "Sur le terrain en Anjou, trop d'artisans et de gérants paient une fortune ou un leasing sur quatre ans pour un site lent qu'ils ne maîtrisent même pas.",
    metric: "4 500 € en moyenne ailleurs",
    range: [0, 0.27],
  },
  {
    id: "beat-declic",
    step: "02",
    eyebrow: "La coupe franche",
    title: "Enlever le superflu ramène la création à 0 €.",
    body: "Pas de locaux luxueux, pas de commerciaux ni de réunions sans fin. Je dessine et j'écris le code moi-même, en trois couches claires pensées pour vos vrais clients.",
    metric: "0 € d'honoraires de création",
    range: [0.27, 0.54],
  },
  {
    id: "beat-rapidite",
    step: "03",
    eyebrow: "Sur le terrain en 5 jours",
    title: "Votre métier, lisible en moins de 0,3 seconde.",
    body: "Vos vraies photos de chantier ou d'atelier, des phrases humaines et votre numéro accessible du premier coup d'œil sur téléphone.",
    metric: "Livré sous 5 jours ouvrés",
    range: [0.54, 0.78],
  },
  {
    id: "beat-liberte",
    step: "04",
    eyebrow: "Votre bien, pour de vrai",
    title: "Domaine et code source restent 100 % à votre nom.",
    body: "Vous ne réglez que votre hébergement (~5 €/mois) et votre nom de domaine (~10 €/an) directement chez votre prestataire. Zéro blocage, zéro engagement.",
    metric: "Liberté totale dès le premier jour",
    range: [0.78, 1.01],
  },
];

function createScreenTexture(variant: "agency" | "layer1" | "layer2" | "phone"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    if (variant === "agency") {
      ctx.fillStyle = "#181715";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "500 28px ui-monospace, monospace";
      ctx.fillText("DEVIS AGENCE CLASSIQUE", 76, 130);

      ctx.fillStyle = "#FAF8F5";
      ctx.font = "700 124px system-ui, -apple-system, sans-serif";
      ctx.fillText("4 500 €", 76, 300);

      ctx.fillStyle = "#ED5B04";
      ctx.fillRect(76, 340, 616, 4);

      const lines = [
        "Accompte à la signature",
        "Délai : 8 à 12 semaines",
        "Abonnement maintenance imposé",
        "Code verrouillé chez le prestataire",
      ];
      ctx.fillStyle = "rgba(250,248,245,0.65)";
      ctx.font = "400 32px system-ui, -apple-system, sans-serif";
      lines.forEach((line, idx) => {
        ctx.fillText("—  " + line, 76, 450 + idx * 82);
      });
    } else if (variant === "layer1") {
      ctx.fillStyle = "#EFEAE0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(12,10,8,0.12)";
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

      ctx.fillStyle = "#6B655E";
      ctx.font = "600 28px ui-monospace, monospace";
      ctx.fillText("01 · STRUCTURE & GOOGLE", 68, 120);

      ctx.fillStyle = "#0C0A08";
      ctx.font = "700 62px system-ui, sans-serif";
      ctx.fillText("Trouvé autour", 68, 220);
      ctx.fillText("de Segré.", 68, 295);

      ctx.strokeStyle = "rgba(12,10,8,0.16)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.strokeRect(68, 380 + i * 120, 632, 84);
      }
    } else if (variant === "layer2") {
      ctx.fillStyle = "#ED5B04";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "600 28px ui-monospace, monospace";
      ctx.fillText("02 · ARTISANAT & SUR-MESURE", 68, 120);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 132px system-ui, sans-serif";
      ctx.fillText("0 €", 68, 290);

      ctx.font = "500 40px system-ui, sans-serif";
      ctx.fillText("Design et code offerts.", 68, 370);

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(68, 450, 632, 340);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "500 32px system-ui, sans-serif";
      ctx.fillText("Vos photos de chantier", 104, 530);
      ctx.fillText("Vos vrais tarifs & mots", 104, 595);
      ctx.fillText("Retouches en direct avec Léo", 104, 660);
    } else {
      // Finished mobile site face
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clean warm header
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(0, 0, canvas.width, 130);
      ctx.fillStyle = "#0C0A08";
      ctx.font = "700 32px system-ui, sans-serif";
      ctx.fillText("Boubane · Atelier Web", 56, 82);

      // Pill badge
      ctx.fillStyle = "#FFF2E8";
      ctx.fillRect(56, 175, 290, 48);
      ctx.fillStyle = "#ED5B04";
      ctx.font = "600 24px ui-monospace, monospace";
      ctx.fillText("EN LIGNE EN 5 JOURS", 76, 207);

      // Headline
      ctx.fillStyle = "#0C0A08";
      ctx.font = "700 66px system-ui, sans-serif";
      ctx.fillText("Votre vitrine", 56, 310);
      ctx.fillText("à votre nom.", 56, 385);

      // Accent visual card inside phone screen
      const grad = ctx.createLinearGradient(56, 445, 712, 760);
      grad.addColorStop(0, "#ED5B04");
      grad.addColorStop(1, "#D64E00");
      ctx.fillStyle = grad;
      ctx.fillRect(56, 445, 656, 315);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 26px ui-monospace, monospace";
      ctx.fillText("PERFORMANCE MESURÉE", 92, 515);
      ctx.font = "700 84px system-ui, sans-serif";
      ctx.fillText("< 0,3 sec", 92, 625);
      ctx.font = "400 30px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillText("Code source & domaine 100 % à vous", 92, 700);

      // Bottom CTA
      ctx.fillStyle = "#0C0A08";
      ctx.fillRect(56, 820, 656, 108);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 34px system-ui, sans-serif";
      ctx.fillText("Demander un devis direct  →", 118, 886);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function ScrollStory3DStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const pointerTiltRef = useRef({ x: 0, y: 0 });
  const [activeBeatIdx, setActiveBeatIdx] = useState(0);

  // Sync scroll progress smoothly from section geometry
  useEffect(() => {
    const updateScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const raw = Math.min(1, Math.max(0, -rect.top / total));
      targetProgressRef.current = raw;

      const foundIdx = STORY_BEATS.findIndex((b) => raw >= b.range[0] && raw < b.range[1]);
      if (foundIdx !== -1) {
        setActiveBeatIdx((prev) => (prev === foundIdx ? prev : foundIdx));
      }
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  // Initialize Real Three.js Studio Scene
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.25, 7.6);

    // Warm Apple-studio 3-point lighting
    const hemi = new THREE.HemisphereLight(0xfffaf2, 0xd9cfc1, 1.45);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
    keyLight.position.set(4.5, 6.2, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff8e42, 0.9);
    rimLight.position.set(-4.5, 1.5, -3.5);
    scene.add(rimLight);

    // Soft studio shadow catcher plane
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.12 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.25;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Master sculptural rig
    const rig = new THREE.Group();
    scene.add(rig);

    const texAgency = createScreenTexture("agency");
    const texLayer1 = createScreenTexture("layer1");
    const texLayer2 = createScreenTexture("layer2");
    const texPhone = createScreenTexture("phone");

    // 1. Slab Back (Base structure cream-kraft architectural tile)
    const slabGeo = new RoundedBoxGeometry(2.15, 2.95, 0.14, 5, 0.1);
    const slab1Mat = new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.42,
      metalness: 0.05,
    });
    const slab1FaceMat = new THREE.MeshStandardMaterial({
      map: texLayer1,
      roughness: 0.35,
      metalness: 0.02,
    });
    const slab1 = new THREE.Mesh(slabGeo, [
      slab1Mat,
      slab1Mat,
      slab1Mat,
      slab1Mat,
      slab1FaceMat,
      slab1Mat,
    ]);
    slab1.castShadow = true;
    slab1.receiveShadow = true;
    rig.add(slab1);

    // 2. Slab Middle (Boubane Orange glass/ceramic core)
    const slab2Mat = new THREE.MeshPhysicalMaterial({
      color: 0xed5b04,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    });
    const slab2FaceMat = new THREE.MeshPhysicalMaterial({
      map: texLayer2,
      roughness: 0.24,
      metalness: 0.05,
      clearcoat: 0.7,
    });
    const slab2 = new THREE.Mesh(slabGeo, [
      slab2Mat,
      slab2Mat,
      slab2Mat,
      slab2Mat,
      slab2FaceMat,
      slab2Mat,
    ]);
    slab2.castShadow = true;
    rig.add(slab2);

    // 3. Hero Monolith / Smartphone Body (rotates from "4 500 € Agency" on back -> Live Boubane Site on front)
    const phoneGeo = new RoundedBoxGeometry(2.18, 3.05, 0.18, 6, 0.14);
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x161412,
      roughness: 0.28,
      metalness: 0.65,
      clearcoat: 0.5,
    });
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: texPhone,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const backMat = new THREE.MeshStandardMaterial({
      map: texAgency,
      roughness: 0.36,
      metalness: 0.1,
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, [
      frameMat,
      frameMat,
      frameMat,
      frameMat,
      frontMat,
      backMat,
    ]);
    phoneMesh.castShadow = true;
    phoneMesh.receiveShadow = true;
    rig.add(phoneMesh);

    // Subtle floating accent ring (craft precision badge)
    const accentSphere = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.075, 24, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0xed5b04,
        roughness: 0.18,
        metalness: 0.15,
        clearcoat: 0.9,
      })
    );
    accentSphere.castShadow = true;
    rig.add(accentSphere);

    const resize = () => {
      if (!host) return;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Scale distance nicely so mobile and desktop keep the full 3D stack crisp & unclipped
      camera.position.z = w < 520 ? 9.4 : 7.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let currentP = 0;
    let rafId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();
      currentP += (targetProgressRef.current - currentP) * 0.085;
      const p = currentP;

      // Scroll-driven choreography across the 4 story beats:
      // p=0.0..0.25 -> Back face visible ("4 500 € Agency slab" tilted monumentally)
      // p=0.25..0.55 -> Exploded 3 layers rotating dynamically in space ("0 € cut")
      // p=0.55..0.85 -> Smooth reveal of front iPhone / live Boubane vitrine
      // p=0.85..1.00 -> Clean front hero poise
      const explodeAmount = Math.sin(Math.min(1, Math.max(0, (p - 0.15) / 0.55)) * Math.PI);
      const rotY =
        Math.PI * (1 - Math.min(1, Math.max(0, (p - 0.18) / 0.45))) +
        Math.sin(p * Math.PI) * 0.25 +
        pointerTiltRef.current.x * 0.35;
      const rotX = -0.14 + Math.cos(p * Math.PI * 1.5) * 0.12 + pointerTiltRef.current.y * 0.22;

      rig.rotation.y = rotY;
      rig.rotation.x = rotX;
      rig.position.y = Math.sin(elapsed * 1.4) * 0.07;

      // Explode the 3 layers along Z and offset gracefully in Beat 2 & Beat 3
      slab1.position.z = -0.95 * explodeAmount - 0.04;
      slab1.position.x = -0.45 * explodeAmount;
      slab1.scale.setScalar(0.88 + 0.12 * explodeAmount);

      slab2.position.z = -0.46 * explodeAmount - 0.02;
      slab2.position.x = -0.22 * explodeAmount;
      slab2.scale.setScalar(0.92 + 0.08 * explodeAmount);

      phoneMesh.position.z = 0.42 * explodeAmount;
      phoneMesh.position.x = 0.2 * explodeAmount;

      accentSphere.position.set(
        1.15 + explodeAmount * 0.35,
        1.25 - explodeAmount * 0.2,
        0.55 + explodeAmount * 0.45
      );
      accentSphere.rotation.x = elapsed * 0.85;
      accentSphere.rotation.y = elapsed * 0.6;
      accentSphere.scale.setScalar(0.65 + explodeAmount * 0.45);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      slabGeo.dispose();
      phoneGeo.dispose();
      texAgency.dispose();
      texLayer1.dispose();
      texLayer2.dispose();
      texPhone.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    pointerTiltRef.current = { x: nx, y: ny };
  };

  const scrollToBeat = (beatIndex: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const total = Math.max(1, sectionRef.current.offsetHeight - window.innerHeight);
    const midRatio =
      (STORY_BEATS[beatIndex].range[0] + Math.min(1, STORY_BEATS[beatIndex].range[1])) / 2;
    window.scrollTo({ top: sectionTop + total * midRatio, behavior: "smooth" });
  };

  return (
    <section
      id="modele"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerTiltRef.current = { x: 0, y: 0 };
      }}
      className="relative bg-[#FAF8F5] border-t border-[#0C0A08]/[0.06]"
    >
      {/* Scroll Track: Mobile compact sticky stage + Desktop full cinema stage */}
      <div className="mx-auto max-w-[1220px] px-5 sm:px-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
          {/* Sticky 3D WebGL Sculpture Viewport (works identically on phone AND desktop) */}
          <div className="lg:col-span-6 sticky top-14 lg:top-0 z-20 lg:z-auto h-[250px] sm:h-[310px] lg:h-[100dvh] flex flex-col justify-center bg-[#FAF8F5]/92 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none border-b border-[#0C0A08]/[0.06] lg:border-none -mx-5 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div className="relative w-full h-[225px] sm:h-[285px] lg:h-[580px] flex items-center justify-center overflow-hidden">
              <div
                ref={canvasHostRef}
                aria-hidden="true"
                className="w-full h-full touch-pan-y cursor-grab active:cursor-grabbing"
              />
            </div>

            {/* Minimal desktop progress dots beneath 3D sculpture */}
            <div className="hidden lg:flex items-center justify-center gap-2 mt-2">
              {STORY_BEATS.map((beat, idx) => (
                <button
                  key={beat.id}
                  type="button"
                  onClick={() => scrollToBeat(idx)}
                  aria-label={`Aller à l'étape ${beat.step}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    activeBeatIdx === idx
                      ? "w-8 bg-[#ED5B04]"
                      : "w-2 bg-[#0C0A08]/15 hover:bg-[#0C0A08]/35"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Scrolling Story Narrative Beats — airy, unboxed, crystal clear hierarchy */}
          <div className="lg:col-span-6 pb-16 lg:pb-0">
            {STORY_BEATS.map((beat, idx) => {
              const isActive = activeBeatIdx === idx;
              return (
                <div
                  key={beat.id}
                  className="py-16 sm:py-20 lg:py-0 lg:min-h-[78dvh] flex flex-col justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, ease: ATELIER_EASE }}
                    className={cn(
                      "transition-opacity duration-300",
                      "lg:opacity-100",
                      isActive ? "lg:opacity-100" : "lg:opacity-45"
                    )}
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
                      <span className="tabular-nums font-semibold">{beat.step}</span>
                      <span className="w-6 h-px bg-[#ED5B04]/40" aria-hidden="true" />
                      <span className="text-[#57534E]">{beat.eyebrow}</span>
                    </div>

                    <h2 className="mt-4 text-[clamp(1.85rem,3.6vw,2.95rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
                      {beat.title}
                    </h2>

                    <p className="mt-4 text-[1rem] sm:text-[1.08rem] leading-[1.68] text-[#57534E] max-w-[44ch]">
                      {beat.body}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C0A08]">
                        <span className="w-2 h-2 rounded-full bg-[#ED5B04]" />
                        {beat.metric}
                      </span>

                      {idx === STORY_BEATS.length - 1 && (
                        <Link
                          href="/commander"
                          className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#ED5B04] active:scale-[0.97] transition-all"
                        >
                          <span>Lancer mon site à 0 €</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
