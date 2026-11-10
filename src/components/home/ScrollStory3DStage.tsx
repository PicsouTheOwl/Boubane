"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import Link from "next/link";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING, cn } from "@/lib/utils";

interface StoryBeat {
  id: string;
  step: string;
  shortLabel: string;
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
    shortLabel: "Le déclic",
    eyebrow: "Le point de départ à Segré",
    title: "Une vitrine d'agence coûte souvent 4 500 €.",
    body: "Sur le terrain en Anjou, trop d'artisans et de gérants signent des factures lourdes ou un leasing sur quatre ans pour un site lent qu'ils ne possèdent même pas.",
    metric: "4 500 € en moyenne ailleurs",
    range: [0, 0.26],
  },
  {
    id: "beat-declic",
    step: "02",
    shortLabel: "Éclaté 0 €",
    eyebrow: "L'architecture mise à nu",
    title: "Enlever les intermédiaires ramène la création à 0 €.",
    body: "Pas de locaux parisiens, pas de commerciaux ni de réunions sans fin. Je dessine et j'écris chaque couche moi-même : structure Google, vraies photos et code rapide.",
    metric: "0 € d'honoraires de création",
    range: [0.26, 0.54],
  },
  {
    id: "beat-rapidite",
    step: "03",
    shortLabel: "En ligne 5j",
    eyebrow: "Assemblé pour votre téléphone",
    title: "Votre métier, crédible en moins de 0,3 seconde.",
    body: "Vos vraies photos de chantier ou d'atelier, des mots justes et votre numéro cliquable dès la première seconde sur mobile.",
    metric: "Livré sous 5 jours ouvrés",
    range: [0.54, 0.78],
  },
  {
    id: "beat-liberte",
    step: "04",
    shortLabel: "À votre nom",
    eyebrow: "Propriété intégrale",
    title: "Domaine et code source restent 100 % entre vos mains.",
    body: "Vous ne réglez que votre nom de domaine (~10 €/an) et votre hébergement (~5 €/mois) directement chez votre prestataire. Zéro engagement, jamais.",
    metric: "Liberté totale dès le premier jour",
    range: [0.78, 1.01],
  },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

function createPhoneScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 780;
  canvas.height = 1520;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const paint = (photo?: HTMLImageElement) => {
    if (!ctx) return;

    // Warm Apple cream screen surface
    ctx.fillStyle = "#FAF8F5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic Island top capsule
    ctx.fillStyle = "#0C0A08";
    drawRoundedRect(ctx, 290, 34, 200, 48, 24);
    ctx.fill();

    // Minimalist site navbar
    ctx.fillStyle = "#0C0A08";
    ctx.font = "700 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("Atelier du Haut-Anjou", 46, 150);

    ctx.fillStyle = "#ED5B04";
    drawRoundedRect(ctx, 560, 118, 174, 48, 24);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText("Devis direct", 588, 149);

    // Real photograph hero slot
    ctx.save();
    drawRoundedRect(ctx, 46, 200, 688, 490, 34);
    ctx.clip();
    if (photo && photo.naturalWidth > 0) {
      const targetRatio = 688 / 490;
      const srcRatio = photo.naturalWidth / photo.naturalHeight;
      let sx = 0,
        sy = 0,
        sw = photo.naturalWidth,
        sh = photo.naturalHeight;
      if (srcRatio > targetRatio) {
        sw = photo.naturalHeight * targetRatio;
        sx = (photo.naturalWidth - sw) / 2;
      } else {
        sh = photo.naturalWidth / targetRatio;
        sy = (photo.naturalHeight - sh) / 3;
      }
      ctx.drawImage(photo, sx, sy, sw, sh, 46, 200, 688, 490);
    } else {
      const grad = ctx.createLinearGradient(46, 200, 734, 690);
      grad.addColorStop(0, "#E8DAC1");
      grad.addColorStop(1, "#D6C2A3");
      ctx.fillStyle = grad;
      ctx.fillRect(46, 200, 688, 490);
    }
    // Bottom subtle scrim over photo
    const scrim = ctx.createLinearGradient(0, 500, 0, 690);
    scrim.addColorStop(0, "rgba(12,10,8,0)");
    scrim.addColorStop(1, "rgba(12,10,8,0.62)");
    ctx.fillStyle = scrim;
    ctx.fillRect(46, 200, 688, 490);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 24px ui-monospace, monospace";
    ctx.fillText("SEGRÉ · MAINE-ET-LOIRE", 78, 650);
    ctx.restore();

    // Crisp editorial headline
    ctx.fillStyle = "#0C0A08";
    ctx.font = "700 62px system-ui, -apple-system, sans-serif";
    ctx.fillText("Votre savoir-faire", 46, 782);
    ctx.fillText("en pleine lumière.", 46, 852);

    ctx.fillStyle = "#57534E";
    ctx.font = "400 30px system-ui, sans-serif";
    ctx.fillText("Vraies photos, appels directs et zéro", 46, 920);
    ctx.fillText("intermédiaire dès la mise en ligne.", 46, 962);

    // Performance glass card inside screen
    ctx.fillStyle = "#FFFFFF";
    drawRoundedRect(ctx, 46, 1020, 330, 195, 28);
    ctx.fill();
    ctx.strokeStyle = "rgba(12,10,8,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ED5B04";
    ctx.font = "700 58px system-ui, sans-serif";
    ctx.fillText("< 0,3s", 76, 1110);
    ctx.fillStyle = "#57534E";
    ctx.font = "500 24px system-ui, sans-serif";
    ctx.fillText("Ouverture instantanée", 76, 1165);

    ctx.fillStyle = "#141311";
    drawRoundedRect(ctx, 404, 1020, 330, 195, 28);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 58px system-ui, sans-serif";
    ctx.fillText("0 €", 436, 1110);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "500 24px system-ui, sans-serif";
    ctx.fillText("Création offerte", 436, 1165);

    // Signature CTA pill
    ctx.fillStyle = "#ED5B04";
    drawRoundedRect(ctx, 46, 1270, 688, 114, 57);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 34px system-ui, sans-serif";
    ctx.fillText("Appeler ou demander un devis   ↗", 118, 1338);

    // Home indicator
    ctx.fillStyle = "rgba(12,10,8,0.22)";
    drawRoundedRect(ctx, 270, 1468, 240, 10, 5);
    ctx.fill();

    tex.needsUpdate = true;
  };

  paint();
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => paint(img);
  img.src = "/images/story-artisan.jpg";

  return tex;
}

function createBackTitaniumTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 780;
  canvas.height = 1520;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Rich dark brushed slate comparing the heavy 4 500 € model
    ctx.fillStyle = "#181715";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 36, 36, canvas.width - 72, canvas.height - 72, 48);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 26px ui-monospace, monospace";
    ctx.fillText("MODÈLE AGENCE CLASSIQUE", 76, 165);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "700 138px system-ui, -apple-system, sans-serif";
    ctx.fillText("4 500 €", 72, 340);

    ctx.fillStyle = "#ED5B04";
    ctx.fillRect(76, 395, 628, 5);

    const rows = [
      ["Délai moyen", "8 à 12 semaines"],
      ["Commerciaux", "Facturés sur le devis"],
      ["Code source", "Souvent bloqué"],
      ["Avec Boubane", "0 € de création"],
    ];

    rows.forEach(([k, v], i) => {
      const y = 520 + i * 165;
      ctx.fillStyle = "rgba(255,255,255,0.48)";
      ctx.font = "500 26px ui-monospace, monospace";
      ctx.fillText(k.toUpperCase(), 76, y);

      ctx.fillStyle = i === 3 ? "#ED5B04" : "#FAF8F5";
      ctx.font = "700 44px system-ui, sans-serif";
      ctx.fillText(v, 76, y + 54);

      if (i < 3) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(76, y + 95, 628, 2);
      }
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createCardLayerTexture(variant: "kraft" | "orange"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const paint = (photo?: HTMLImageElement) => {
    if (!ctx) return;
    if (variant === "kraft") {
      ctx.fillStyle = "#F4EEE3";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (photo && photo.naturalWidth > 0) {
        ctx.save();
        drawRoundedRect(ctx, 28, 28, 270, 404, 24);
        ctx.clip();
        ctx.drawImage(photo, 28, 28, 270, 404);
        ctx.restore();
      }

      ctx.fillStyle = "#ED5B04";
      ctx.font = "600 22px ui-monospace, monospace";
      ctx.fillText("LÉO SAILLOUR · SEGRÉ", 326, 95);

      ctx.fillStyle = "#0C0A08";
      ctx.font = "700 44px system-ui, sans-serif";
      ctx.fillText("Un interlocuteur", 326, 170);
      ctx.fillText("unique, en direct.", 326, 224);

      ctx.fillStyle = "#57534E";
      ctx.font = "400 26px system-ui, sans-serif";
      ctx.fillText("Design, textes et code", 326, 300);
      ctx.fillText("réalisés sans sous-traitance.", 326, 338);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 680, 460);
      grad.addColorStop(0, "#FF6E1A");
      grad.addColorStop(1, "#E04F00");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 22px ui-monospace, monospace";
      ctx.fillText("PROPRIÉTÉ 100 % CLIENT", 48, 88);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 116px system-ui, sans-serif";
      ctx.fillText("0 €", 44, 232);

      ctx.font = "600 34px system-ui, sans-serif";
      ctx.fillText("Domaine (~10 €/an) · Hébergement (~5 €/mois)", 48, 330);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "400 26px system-ui, sans-serif";
      ctx.fillText("Tout est à votre nom dès le jour 1.", 48, 385);
    }
    tex.needsUpdate = true;
  };

  paint();
  if (variant === "kraft") {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => paint(img);
    img.src = "/images/story-leo-desk.jpg";
  }

  return tex;
}

export function ScrollStory3DStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const dragOffsetRef = useRef({ x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 });
  const [activeBeatIdx, setActiveBeatIdx] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

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

  // Three.js Hardware & Architectural Showcase Scene
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 45);
    camera.position.set(0, 0.12, 8.2);

    // Rich Apple-keynote lighting
    const hemi = new THREE.HemisphereLight(0xfffdf8, 0xd8cec0, 1.55);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.35);
    keyLight.position.set(4.8, 6.5, 6.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const warmRim = new THREE.DirectionalLight(0xff8c3d, 1.1);
    warmRim.position.set(-5.2, 2.2, -3.6);
    scene.add(warmRim);

    const coolFill = new THREE.DirectionalLight(0xeef6ff, 0.55);
    coolFill.position.set(-3.5, -2.5, 4.0);
    scene.add(coolFill);

    // Soft studio floor shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.ShadowMaterial({ opacity: 0.13 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.42;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const rig = new THREE.Group();
    scene.add(rig);

    const texFront = createPhoneScreenTexture();
    const texBack = createBackTitaniumTexture();
    const texKraft = createCardLayerTexture("kraft");
    const texOrange = createCardLayerTexture("orange");

    // 1. Titanium iPhone Chassis (sculpted silhouette)
    const chassisGeo = new RoundedBoxGeometry(1.94, 3.82, 0.16, 8, 0.24);
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x22201d,
      roughness: 0.26,
      metalness: 0.78,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
    });
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: texFront,
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const backSlateMat = new THREE.MeshStandardMaterial({
      map: texBack,
      roughness: 0.34,
      metalness: 0.18,
    });
    const phone = new THREE.Mesh(chassisGeo, [
      titaniumMat,
      titaniumMat,
      titaniumMat,
      titaniumMat,
      screenMat,
      backSlateMat,
    ]);
    phone.castShadow = true;
    phone.receiveShadow = true;
    rig.add(phone);

    // Subtle anodized orange side Action Button
    const buttonGeo = new RoundedBoxGeometry(0.05, 0.28, 0.06, 3, 0.02);
    const orangeMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xed5b04,
      roughness: 0.2,
      metalness: 0.4,
      clearcoat: 0.9,
    });
    const actionButton = new THREE.Mesh(buttonGeo, orangeMetalMat);
    actionButton.position.set(0.97, 0.72, 0);
    phone.add(actionButton);

    // 2. Exploded Frosted Glass Optical Layer (hovers over phone during Beats 2-3)
    const glassGeo = new RoundedBoxGeometry(2.08, 2.75, 0.04, 5, 0.16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.34,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      reflectivity: 0.9,
    });
    const glassLayer = new THREE.Mesh(glassGeo, glassMat);
    glassLayer.castShadow = true;
    rig.add(glassLayer);

    // 3. Orbiting Tactile Story Cards (Photo card + 0 € Orange plaque)
    const cardGeo = new RoundedBoxGeometry(2.35, 1.58, 0.08, 5, 0.12);
    const cardEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xe6ddd0,
      roughness: 0.45,
    });
    const kraftFaceMat = new THREE.MeshStandardMaterial({
      map: texKraft,
      roughness: 0.42,
    });
    const kraftCard = new THREE.Mesh(cardGeo, [
      cardEdgeMat,
      cardEdgeMat,
      cardEdgeMat,
      cardEdgeMat,
      kraftFaceMat,
      cardEdgeMat,
    ]);
    kraftCard.castShadow = true;
    rig.add(kraftCard);

    const orangeEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xd94e00,
      roughness: 0.28,
    });
    const orangeFaceMat = new THREE.MeshPhysicalMaterial({
      map: texOrange,
      roughness: 0.22,
      clearcoat: 0.7,
    });
    const orangeCard = new THREE.Mesh(cardGeo, [
      orangeEdgeMat,
      orangeEdgeMat,
      orangeEdgeMat,
      orangeEdgeMat,
      orangeFaceMat,
      orangeEdgeMat,
    ]);
    orangeCard.castShadow = true;
    rig.add(orangeCard);

    // 4. Sculptural Signature Ring orbiting behind assembly
    const ringGeo = new THREE.TorusGeometry(1.65, 0.032, 24, 96);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xed5b04,
      roughness: 0.22,
      metalness: 0.5,
      clearcoat: 0.85,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    rig.add(orbitRing);

    const resize = () => {
      if (!host) return;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 520 ? 10.6 : 8.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let smoothP = 0;
    let rafId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      smoothP += (targetProgressRef.current - smoothP) * 0.08;
      const p = smoothP;

      // Elastic return when user isn't actively dragging
      if (!dragOffsetRef.current.dragging) {
        dragOffsetRef.current.x *= 0.92;
        dragOffsetRef.current.y *= 0.92;
      }

      // Smooth 4-act choreography:
      // 0.00 -> 0.26: Back of chassis visible ("4 500 € Agence") with proud slight tilt
      // 0.26 -> 0.56: Graceful 180deg turntable spin + exploded crystal glass & orbiting cards
      // 0.56 -> 0.82: Cards tuck cleanly behind; iPhone screen gleams face-on showcasing real site photo
      // 0.82 -> 1.00: Orange 0 € ownership card locks crisply beside iPhone
      const spinPhase = Math.min(1, Math.max(0, (p - 0.14) / 0.44));
      const baseRotY = Math.PI * (1 - spinPhase) + (p > 0.58 ? (p - 0.58) * -0.42 : 0);
      const baseRotX = -0.08 + Math.sin(p * Math.PI * 1.6) * 0.12;

      rig.rotation.y = baseRotY + dragOffsetRef.current.x;
      rig.rotation.x = baseRotX + dragOffsetRef.current.y;
      rig.position.y = Math.sin(t * 1.25) * 0.06;

      // Bell curve peaking at Beat 2 (p ~ 0.40) for hardware explosion
      const explode = Math.sin(Math.min(1, Math.max(0, (p - 0.16) / 0.54)) * Math.PI);
      const badgeReveal = Math.min(1, Math.max(0, (p - 0.72) / 0.22));

      // Glass layer lifts forward toward viewer in Beat 2
      glassLayer.position.set(0.18 * explode, 0.15 * explode, 0.62 * explode + 0.02);
      glassLayer.rotation.z = -0.08 * explode;
      glassMat.opacity = 0.04 + 0.36 * explode;

      // Kraft Léo card orbits out left/back on Beat 2-3
      kraftCard.position.set(-1.35 * explode - 0.15, 0.68 * explode, -0.55 * explode - 0.25);
      kraftCard.rotation.y = -0.35 * explode;
      kraftCard.rotation.z = 0.08 * explode;
      kraftCard.scale.setScalar(0.55 + 0.45 * explode);

      // Orange 0 € card slides from hidden behind to flanking pride of place on Beat 4
      orangeCard.position.set(
        1.15 * explode + 1.05 * badgeReveal,
        -0.55 * explode - 0.65 * badgeReveal,
        -0.45 * explode + 0.32 * badgeReveal - 0.15
      );
      orangeCard.rotation.y = 0.28 * explode - 0.16 * badgeReveal;
      orangeCard.rotation.z = -0.06 * explode + 0.05 * badgeReveal;
      orangeCard.scale.setScalar(0.5 + 0.45 * Math.max(explode, badgeReveal));

      // Architectural orange halo ring
      orbitRing.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.5) * 0.15;
      orbitRing.rotation.y = t * 0.22 + p * 1.6;
      orbitRing.scale.setScalar(0.82 + explode * 0.35);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      chassisGeo.dispose();
      buttonGeo.dispose();
      glassGeo.dispose();
      cardGeo.dispose();
      ringGeo.dispose();
      texFront.dispose();
      texBack.dispose();
      texKraft.dispose();
      texOrange.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragOffsetRef.current.dragging = true;
    dragOffsetRef.current.lastX = e.clientX;
    dragOffsetRef.current.lastY = e.clientY;
    setHasDragged(true);
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOffsetRef.current.dragging) return;
    const dx = e.clientX - dragOffsetRef.current.lastX;
    const dy = e.clientY - dragOffsetRef.current.lastY;
    dragOffsetRef.current.lastX = e.clientX;
    dragOffsetRef.current.lastY = e.clientY;
    dragOffsetRef.current.x = Math.max(-1.2, Math.min(1.2, dragOffsetRef.current.x + dx * 0.008));
    dragOffsetRef.current.y = Math.max(-0.5, Math.min(0.5, dragOffsetRef.current.y + dy * 0.006));
  };

  const handleStagePointerEnd = () => {
    dragOffsetRef.current.dragging = false;
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
    <section id="modele" ref={sectionRef} className="relative bg-[#FAF8F5]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-14">
          {/* Seamless Sticky 3D Viewport (zero border line, continuous #FAF8F5 feather) */}
          <div className="lg:col-span-6 sticky top-14 lg:top-0 z-20 lg:z-auto h-[250px] sm:h-[310px] lg:h-[100dvh] flex flex-col justify-center bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent lg:bg-none -mx-5 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div
              onPointerDown={handleStagePointerDown}
              onPointerMove={handleStagePointerMove}
              onPointerUp={handleStagePointerEnd}
              onPointerCancel={handleStagePointerEnd}
              onPointerLeave={handleStagePointerEnd}
              className="relative w-full h-[225px] sm:h-[285px] lg:h-[600px] flex items-center justify-center overflow-hidden"
            >
              <div
                ref={canvasHostRef}
                aria-hidden="true"
                className="w-full h-full touch-pan-y cursor-grab active:cursor-grabbing"
              />

              {/* Subtle tactile drag hint that fades after interaction */}
              {!hasDragged && (
                <div className="pointer-events-none hidden sm:inline-flex items-center gap-1.5 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0C0A08]/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#57534E]">
                  <MoveHorizontal className="w-3 h-3 text-[#ED5B04]" />
                  <span>Glisser pour pivoter</span>
                </div>
              )}
            </div>

            {/* Desktop Interactive Beat Pill Switcher */}
            <div className="hidden lg:flex items-center justify-center gap-1.5 mt-1">
              {STORY_BEATS.map((beat, idx) => {
                const selected = activeBeatIdx === idx;
                return (
                  <button
                    key={beat.id}
                    type="button"
                    onClick={() => scrollToBeat(idx)}
                    className={cn(
                      "relative px-3.5 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors cursor-pointer",
                      selected ? "text-white" : "text-[#57534E] hover:text-[#0C0A08]"
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="scrollStoryBeatPill"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#0C0A08]"
                      />
                    )}
                    <span className="relative z-10">
                      {beat.step} · {beat.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Narrative Column */}
          <div className="lg:col-span-6 pb-16 lg:pb-0">
            {STORY_BEATS.map((beat, idx) => {
              const isActive = activeBeatIdx === idx;
              return (
                <div
                  key={beat.id}
                  className="py-14 sm:py-20 lg:py-0 lg:min-h-[82dvh] flex flex-col justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: ATELIER_EASE }}
                    className={cn(
                      "transition-opacity duration-300",
                      isActive ? "lg:opacity-100" : "lg:opacity-40"
                    )}
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
                      <span className="tabular-nums font-semibold">{beat.step}</span>
                      <span className="w-6 h-px bg-[#ED5B04]/40" aria-hidden="true" />
                      <span className="text-[#57534E]">{beat.eyebrow}</span>
                    </div>

                    <h2 className="mt-4 text-[clamp(1.85rem,3.6vw,3rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
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
