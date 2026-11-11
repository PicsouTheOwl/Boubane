"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Compass,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ArchitectMarginalia, HandDrawnUnderline } from "@/components/HandDrawnAccents";
import { ATELIER_EASE, ATELIER_SPRING, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

interface TownNode {
  id: string;
  name: string;
  mapLabel: string;
  cp: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
  distanceKm: number;
  driveMin: number;
  zoneLabel: string;
  localQueries: string[];
}

const TOWNS: TownNode[] = [
  {
    id: "segre",
    name: "Segré-en-Anjou Bleu",
    mapLabel: "Segré (49500)",
    cp: "49500",
    x: 215,
    y: 165,
    dx: 0,
    dy: 17,
    anchor: "middle",
    distanceKm: 0,
    driveMin: 0,
    zoneLabel: "Base Atelier Boubane · Centre Segréen",
    localQueries: ["menuisier Segré", "couvreur 49500", "création site Segré"],
  },
  {
    id: "lion",
    name: "Le Lion-d'Angers",
    mapLabel: "Le Lion-d'Angers",
    cp: "49220",
    x: 296,
    y: 185,
    dx: 10,
    dy: 3,
    anchor: "start",
    distanceKm: 13,
    driveMin: 14,
    zoneLabel: "Axe D775 · Pôle Équestre & Artisanal",
    localQueries: ["artisan Le Lion-d'Angers", "cabinet 49220", "maçonnerie Anjou"],
  },
  {
    id: "chateau-gontier",
    name: "Château-Gontier",
    mapLabel: "Château-Gontier",
    cp: "53200",
    x: 278,
    y: 78,
    dx: 0,
    dy: -12,
    anchor: "middle",
    distanceKm: 23,
    driveMin: 22,
    zoneLabel: "Sud Mayenne · Bassin Industriel & BTP",
    localQueries: ["entreprise BTP 53200", "plombier Château-Gontier", "PME Mayenne"],
  },
  {
    id: "cande",
    name: "Candé",
    mapLabel: "Candé",
    cp: "49440",
    x: 162,
    y: 238,
    dx: 0,
    dy: 17,
    anchor: "middle",
    distanceKm: 19,
    driveMin: 18,
    zoneLabel: "Sud-Ouest Segréen · Proximité Loire-Atlantique",
    localQueries: ["ébéniste Candé", "paysagiste 49440", "rénovation Haut-Anjou"],
  },
  {
    id: "pouance",
    name: "Pouancé · Ombrée d'Anjou",
    mapLabel: "Pouancé",
    cp: "49420",
    x: 122,
    y: 112,
    dx: 0,
    dy: -12,
    anchor: "middle",
    distanceKm: 25,
    driveMin: 24,
    zoneLabel: "Nord-Ouest Anjou · Zone Artisanale",
    localQueries: ["charpentier Pouancé", "garagiste Ombrée d'Anjou", "BTP 49420"],
  },
  {
    id: "chateaubriant",
    name: "Châteaubriant",
    mapLabel: "Châteaubriant",
    cp: "44110",
    x: 54,
    y: 178,
    dx: 0,
    dy: 17,
    anchor: "start",
    distanceKm: 37,
    driveMin: 35,
    zoneLabel: "Bassin 44/49 · Échanges Directs",
    localQueries: ["menuiserie Châteaubriant", "industriel 44110", "site vitrine 44"],
  },
  {
    id: "angers",
    name: "Angers & Agglomération",
    mapLabel: "Angers",
    cp: "49000",
    x: 368,
    y: 252,
    dx: -10,
    dy: 3,
    anchor: "end",
    distanceKm: 39,
    driveMin: 34,
    zoneLabel: "Axe Express 4 Voies · Maine-et-Loire",
    localQueries: ["cabinet conseil Angers", "architecte 49000", "vitrine sur-mesure 49"],
  },
];

interface TradeSector {
  index: string;
  tag: string;
  title: string;
  desc: string;
  metrics: { label: string; value: string }[];
  architectureFeatures: string[];
  googleKeywords: string[];
}

const SECTORS: TradeSector[] = [
  {
    index: "01",
    tag: "ARTISANAT & BÂTIMENT",
    title: "Menuisiers, Couvreurs, Ébénistes & BTP",
    desc: "Montrez vos vrais chantiers en photo et recevez des demandes de devis claires directement depuis le Segréen.",
    metrics: [
      { label: "Ouverture sur mobile", value: "< 0,3s" },
      { label: "Demande de devis", value: "En 2 clics" },
    ],
    architectureFeatures: [
      "Photos de chantiers avant et après sans ralentir le téléphone",
      "Formulaire simple avec commune et nature des travaux",
      "Mise en avant de vos assurances RGE, Qualibat et Décennale",
    ],
    googleKeywords: ["couvreur Segré", "menuisier Château-Gontier", "maçon Haut-Anjou"],
  },
  {
    index: "02",
    tag: "PROFESSIONS LIBÉRALES",
    title: "Avocats, Notaires, Cabinets & Praticiens",
    desc: "Une présentation sobre et claire pour que vos futurs clients ou patients trouvent vos infos et prennent rendez-vous sans chercher.",
    metrics: [
      { label: "Prise de RDV", value: "Directe" },
      { label: "Lecture mobile", value: "Immédiate" },
    ],
    architectureFeatures: [
      "Mise en page posée et lisible sans effets inutiles",
      "Explication simple de vos domaines et honoraires",
      "Lien direct vers votre agenda (Cal.com, Doctolib) ou secrétariat",
    ],
    googleKeywords: ["avocat Segré", "ostéopathe Le Lion-d'Angers", "cabinet comptable 49"],
  },
  {
    index: "03",
    tag: "INDUSTRIE & PME",
    title: "PME Industrielles & ZI d'Étriché / Segré",
    desc: "Un site net et rapide pour présenter votre parc machines à vos clients nationaux et attirer de bons profils locaux.",
    metrics: [
      { label: "Propriété du code", value: "100 % à vous" },
      { label: "Frais de création", value: "0 €" },
    ],
    architectureFeatures: [
      "Présentation claire de vos machines, capacités et normes",
      "Page recrutement directe sans intermédiaire",
      "Site léger sans WordPress ni extensions à mettre à jour",
    ],
    googleKeywords: ["usinage précision 49", "sous-traitance industrielle Segré", "PME ZI Étriché"],
  },
  {
    index: "04",
    tag: "COMMERCE & TERROIR",
    title: "Boutiques, Domaines, Gîtes & Tables",
    desc: "Évitez de laisser 15 à 18 % de commission à Booking ou Airbnb en permettant aux clients de réserver en direct.",
    metrics: [
      { label: "Commission", value: "0 %" },
      { label: "En direct", value: "100 %" },
    ],
    architectureFeatures: [
      "Vraies photos du lieu, de la carte ou des chambres",
      "Boutons directs pour réserver, appeler ou lancer le GPS",
      "Meilleure visibilité sur Google pour le tourisme en Haut-Anjou",
    ],
    googleKeywords: ["gîte Anjou Bleu", "restaurant Segré", "domaine réception 49"],
  },
];

const LOCAL_FAQS = [
  {
    index: "01",
    q: "Puis-je rencontrer Léo en personne à Segré ou sur mon chantier ?",
    a: "Oui. Je suis basé à Segré-en-Anjou Bleu et me déplace sans frais autour de Segré, Le Lion-d'Angers, Candé, Pouancé et Château-Gontier pour comprendre votre métier, voir vos réalisations et cadrer votre vitrine en 20 minutes autour d'un café.",
  },
  {
    index: "02",
    q: "Pourquoi offrir la création à 0 € aux entreprises du Segréen ?",
    a: "Parce que le modèle d'agence à 4 500 € repose sur des frais commerciaux et de structure que je n'ai pas. En travaillant en circuit court sur une architecture de code pur, je crée votre vitrine gratuitement et vous ne payez que votre hébergement direct (~5 €/mois ou 15 €/an clé en main).",
  },
  {
    index: "03",
    q: "Comment faites-vous pour que mon site sorte premier sur Google à Segré ?",
    a: "Chaque page livrée intègre un balisage sémantique local complet (Schema.org LocalBusiness géolocalisé 49500/53200), un temps de chargement inférieur à 0.3 seconde sur smartphone et des titres calibrés sur les recherches exactes de vos clients locaux.",
  },
  {
    index: "04",
    q: "Et si j'ai déjà un vieux site ou juste une page Facebook ?",
    a: "C'est le cas de la majorité des artisans du Haut-Anjou que j'accompagne. Je récupère vos meilleures photos et avis existants, je réécris les textes de manière claire, et je vous livre une vitrine complète sous 5 jours ouvrés sans coupure de service.",
  },
];

export function SegreInteractiveExperience() {
  const [selectedTownId, setSelectedTownId] = useState<string>("lion");
  const [selectedSectorIdx, setSelectedSectorIdx] = useState<number>(0);
  const [budgetYears, setBudgetYears] = useState<1 | 3>(3);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const segreOrigin = TOWNS[0];
  const activeTown = TOWNS.find((t) => t.id === selectedTownId) ?? TOWNS[1];
  const activeSector = SECTORS[selectedSectorIdx];

  const agencyBudget = budgetYears === 1 ? "6 300 €" : "9 900 €";
  const boubaneBudget = budgetYears === 1 ? "~60 €" : "~180 €";
  const savedAmount = budgetYears === 1 ? "6 240 €" : "9 720 €";

  return (
    <main className="relative pt-14 md:pt-20 pb-0">
      {/* ====================================================================
          ZONE 01 : HERO LOCALE + CARTE TOPOGRAPHIQUE INTERACTIVE DU HAUT-ANJOU
         ==================================================================== */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Colonne Gauche : Positionnement & Actions Directes */}
          <AtelierReveal className="lg:col-span-6 space-y-6">
            <EyebrowBadge index="HAUT-ANJOU · 49500">Artisanat Web Local</EyebrowBadge>

            <h1 className="text-[clamp(2.35rem,4.6vw,3.9rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
              Création de site internet à{" "}
              <span className="relative inline-block">
                Segré
                <HandDrawnUnderline className="absolute -bottom-1.5 inset-x-0 h-2.5 w-full" delay={0.2} />
              </span>{" "}
              <span className="text-[#0C0A08]/40 font-normal">&amp; en Haut-Anjou.</span>
            </h1>

            <p className="text-[1.04rem] leading-[1.65] text-[#57534E] max-w-[48ch]">
              Un interlocuteur unique basé à Segré-en-Anjou Bleu. Nous concevons et codons votre
              vitrine sur-mesure à <strong>0 € d&apos;honoraires</strong> pour attirer de vrais
              clients dans le 49 et le 53.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all shadow-[0_6px_20px_rgba(12,10,8,0.16)]"
              >
                <span>Commander mon site (0 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://rdv.boubane.com/boubane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.12] px-6 py-3.5 text-sm font-semibold text-[#0C0A08] hover:border-[#0C0A08] active:scale-[0.97] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#ED5B04]" />
                <span>Café / Appel (10 min)</span>
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-5">
              <a
                href="tel:+33778310346"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#0C0A08]/75 hover:text-[#ED5B04] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#ED5B04]" />
                <span>07 78 31 03 46</span>
              </a>
              <ArchitectMarginalia note="Déplacement offert en Segréen" />
            </div>
          </AtelierReveal>

          {/* Colonne Droite : Radar Topographique Interactif SVG du Haut-Anjou */}
          <AtelierReveal delay={0.08} className="lg:col-span-6">
            <SpecularPlate dark crosshairs className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>CARTE DE PROXIMITÉ · CLIC SUR UNE VILLE</span>
                </div>
                <span className="font-mono text-[10px] text-white/40 tabular-nums">
                  47.68° N · 0.87° O
                </span>
              </div>

              {/* Canevas SVG Topographique Vectoriel Fait Main */}
              <div className="relative mt-4 rounded-2xl bg-[#0B0A09] border border-white/[0.07] overflow-hidden">
                <svg
                  viewBox="0 0 440 300"
                  className="w-full h-auto block select-none"
                  role="img"
                  aria-label="Carte interactive du rayon d'intervention autour de Segré"
                >
                  {/* Lignes topographiques concentriques autour de Segré */}
                  <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
                    <circle cx={segreOrigin.x} cy={segreOrigin.y} r="48" strokeDasharray="3 4" />
                    <circle cx={segreOrigin.x} cy={segreOrigin.y} r="96" strokeDasharray="3 4" />
                    <circle cx={segreOrigin.x} cy={segreOrigin.y} r="152" />
                    <path
                      d="M 20 120 Q 120 155 215 165 T 410 250"
                      stroke="rgba(237,91,4,0.12)"
                      strokeWidth="1.5"
                    />
                  </g>

                  {/* Faisceau de trajet animé entre Segré et la ville active */}
                  {activeTown.id !== "segre" && (
                    <motion.line
                      key={activeTown.id}
                      x1={segreOrigin.x}
                      y1={segreOrigin.y}
                      x2={activeTown.x}
                      y2={activeTown.y}
                      stroke="#ED5B04"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.2 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 0.45, ease: ATELIER_EASE }}
                    />
                  )}

                  {/* Points des 7 communes */}
                  {TOWNS.map((town) => {
                    const isOrigin = town.id === "segre";
                    const isSelected = town.id === activeTown.id;
                    return (
                      <g
                        key={town.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedTownId(town.id)}
                        onMouseEnter={() => setSelectedTownId(town.id)}
                      >
                        <circle cx={town.x} cy={town.y} r="18" fill="transparent" />

                        {isSelected && (
                          <circle
                            cx={town.x}
                            cy={town.y}
                            r="12"
                            fill="rgba(237,91,4,0.22)"
                          />
                        )}

                        <circle
                          cx={town.x}
                          cy={town.y}
                          r={isOrigin || isSelected ? 5.5 : 3.8}
                          fill={isOrigin ? "#FAF8F5" : isSelected ? "#ED5B04" : "rgba(255,255,255,0.45)"}
                          stroke="#0B0A09"
                          strokeWidth="1.5"
                        />

                        <text
                          x={town.x + town.dx}
                          y={town.y + town.dy}
                          textAnchor={town.anchor}
                          fontFamily="monospace"
                          fontSize={isSelected || isOrigin ? "10" : "8.8"}
                          fontWeight={isSelected || isOrigin ? "700" : "500"}
                          fill={isSelected || isOrigin ? "#FAF8F5" : "rgba(255,255,255,0.52)"}
                        >
                          {town.mapLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Télémétrie Live de la Commune Sélectionnée */}
              <div className="relative overflow-hidden mt-4 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 min-h-[116px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeTown.id}
                    initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                    transition={{ duration: 0.2, ease: ATELIER_EASE }}
                    className="space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {activeTown.name}{" "}
                          <span className="font-mono text-xs text-white/45">({activeTown.cp})</span>
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#ED5B04]">
                          {activeTown.zoneLabel}
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs tabular-nums">
                        <span className="text-white font-bold">
                          {activeTown.distanceKm === 0 ? "Sur place" : `${activeTown.distanceKm} km`}
                        </span>
                        {activeTown.driveMin > 0 && (
                          <span className="text-white/45 ml-1.5">· {activeTown.driveMin} min</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/40 mr-1">
                        <Search className="w-3 h-3" /> SEO ciblé :
                      </span>
                      {activeTown.localQueries.map((q) => (
                        <span
                          key={q}
                          className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] text-white/80"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pilules rapides des villes pour mobile */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TOWNS.map((t) => {
                  const active = t.id === activeTown.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTownId(t.id)}
                      className={`px-2.5 py-1 rounded-full font-mono text-[10px] transition-colors cursor-pointer active:scale-[0.96] ${
                        active
                          ? "bg-[#ED5B04] text-white font-semibold"
                          : "bg-white/[0.05] text-white/55 hover:text-white"
                      }`}
                    >
                      {t.name.split(" ·")[0]}
                    </button>
                  );
                })}
              </div>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </section>

      {/* ====================================================================
          ZONE 02 : EXPLORATEUR INTERACTIF DES MÉTIERS DU SEGRÉEN
         ==================================================================== */}
      <section className="py-24 md:py-32 bg-[#F3EFE7] border-t border-[#0C0A08]/[0.07]">
        <div className="mx-auto max-w-[1200px] px-6">
          <AtelierReveal className="max-w-2xl mb-14">
            <EyebrowBadge index="02">Pour votre métier</EyebrowBadge>
            <h2 className="mt-5 text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold tracking-[-0.045em] leading-[1.04] text-[#0C0A08]">
              Un site adapté à{" "}
              <span className="text-[#0C0A08]/40 font-normal">votre activité locale.</span>
            </h2>
          </AtelierReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Sélecteur Vertical Rail layoutId */}
            <div className="lg:col-span-5 divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09] flex flex-col justify-center">
              {SECTORS.map((sec, idx) => {
                const selected = selectedSectorIdx === idx;
                return (
                  <button
                    key={sec.index}
                    type="button"
                    onClick={() => setSelectedSectorIdx(idx)}
                    onMouseEnter={() => setSelectedSectorIdx(idx)}
                    className="relative w-full text-left py-6 pl-6 pr-4 flex items-start gap-5 cursor-pointer group active:scale-[0.995] transition-transform"
                  >
                    {selected && (
                      <motion.span
                        layoutId="segreSectorRail"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-[#ED5B04]"
                      />
                    )}
                    <span
                      className={`font-mono text-lg font-medium tabular-nums pt-0.5 transition-colors ${
                        selected ? "text-[#ED5B04]" : "text-[#0C0A08]/30 group-hover:text-[#0C0A08]/60"
                      }`}
                    >
                      {sec.index}
                    </span>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                        {sec.tag}
                      </div>
                      <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#0C0A08]">
                        {sec.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fiche Technique Interactive du Secteur Sélectionné */}
            <div className="lg:col-span-7 flex">
              <SpecularPlate className="w-full p-8 sm:p-10 bg-white atelier-shadow-warm overflow-hidden flex flex-col justify-between">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeSector.index}
                    initial={{ opacity: 0, filter: "blur(3px)", y: 8 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(3px)", y: -6 }}
                    transition={{ duration: 0.24, ease: ATELIER_EASE }}
                    className="space-y-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#0C0A08]/[0.07]">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ED5B04]">
                        SPÉCIFICATION #{activeSector.index} · {activeSector.tag}
                      </span>
                      <div className="flex items-center gap-4">
                        {activeSector.metrics.map((m) => (
                          <div key={m.label} className="text-right">
                            <div className="font-mono text-[10px] text-[#0C0A08]/45">{m.label}</div>
                            <div className="font-mono text-sm font-bold text-[#0C0A08] tabular-nums">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                        {activeSector.title}
                      </h3>
                      <p className="mt-2.5 text-[0.96rem] leading-[1.65] text-[#57534E]">
                        {activeSector.desc}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                        CE QUE NOUS CONSTRUISONS SUR VOTRE VITRINE :
                      </div>
                      {activeSector.architectureFeatures.map((feat) => (
                        <div key={feat} className="flex items-start gap-3 text-sm text-[#0C0A08]">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ED5B04]/10 text-[#ED5B04]">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-[#FAF8F5] border border-[#0C0A08]/[0.07] p-4 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#0C0A08]/50 mr-1">
                        EXEMPLES REQUÊTES GOOGLE :
                      </span>
                      {activeSector.googleKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-white border border-[#0C0A08]/[0.08] px-3 py-1 font-mono text-[11px] text-[#0C0A08]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C0A08]/[0.07]">
                      <Link
                        href="/commander"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
                      >
                        <span>Lancer mon projet (0 €)</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="/showcase-votre-site.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0C0A08]/70 hover:text-[#ED5B04] transition-colors"
                      >
                        <span>Voir un exemple live</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </SpecularPlate>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ZONE 03 : COMPARATEUR LOCAL INTERACTIF (AGENCE D'ANGERS VS SEGRÉ)
         ==================================================================== */}
      <section className="py-24 md:py-32 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.06]">
        <div className="mx-auto max-w-[1160px] px-6">
          <AtelierReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <EyebrowBadge index="03">Économie Locale</EyebrowBadge>
              <h2 className="mt-5 text-[clamp(2rem,4vw,3.1rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
                Pourquoi payer 5 000 € en agence{" "}
                <span className="text-[#0C0A08]/40 font-normal">n&apos;a plus de sens à Segré.</span>
              </h2>
            </div>

            <div className="inline-flex p-1 rounded-full bg-[#F0ECE3] border border-[#0C0A08]/[0.08] shrink-0">
              {([1, 3] as const).map((y) => {
                const active = budgetYears === y;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setBudgetYears(y)}
                    className={`relative px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] cursor-pointer transition-colors ${
                      active ? "text-white" : "text-[#0C0A08]/60"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="segreYearsPill"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#0C0A08]"
                      />
                    )}
                    <span className="relative z-10">{y === 1 ? "Sur 1 an" : "Sur 3 ans"}</span>
                  </button>
                );
              })}
            </div>
          </AtelierReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <AtelierReveal delay={0.04} className="flex">
              <div className="w-full rounded-[24px] bg-[#F3EFE7] border border-[#0C0A08]/[0.08] p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                    MODÈLE AGENCE CLASSIQUE (ANGERS / NANTES)
                  </div>
                  <div className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#0C0A08]/50 line-through tabular-nums">
                    {agencyBudget}
                  </div>
                  <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
                    Facture initiale de 4 500 € + maintenance mensuelle captive de 150 €/mois sur
                    WordPress, sans propriété réelle du code source.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#0C0A08]/[0.07] font-mono text-xs text-[#0C0A08]/45">
                  INTERLOCUTEUR DISTANT · TICKETS D&apos;ATTENTE
                </div>
              </div>
            </AtelierReveal>

            <AtelierReveal delay={0.1} className="flex">
              <SpecularPlate dark crosshairs className="w-full p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                      ARTISANAT WEB BOUBANE · SEGRÉ
                    </span>
                    <span className="rounded-full bg-[#ED5B04]/15 border border-[#ED5B04]/30 px-2.5 py-0.5 font-mono text-[10px] text-[#ED5B04]">
                      -{savedAmount} d&apos;économie
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-4xl font-bold tracking-[-0.04em] text-white tabular-nums">
                      0 €
                    </span>
                    <span className="font-mono text-xs text-white/55 tabular-nums">
                      conception · {boubaneBudget} hébergement direct
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">
                    Conception et code sur-mesure offerts à 100 %, code déposé à votre nom,
                    rencontre locale à Segré et affichage instantané &lt; 0.3s.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] font-mono text-xs text-white/60">
                  CIRCUIT COURT · ZÉRO ENGAGEMENT
                </div>
              </SpecularPlate>
            </AtelierReveal>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ZONE 04 : QUESTIONS FRÉQUENTES LOCALES (OUVERT À FILETS FINS)
         ==================================================================== */}
      <section className="py-24 md:py-28 bg-[#F3EFE7] border-t border-[#0C0A08]/[0.07]">
        <div className="mx-auto max-w-[1040px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <EyebrowBadge index="04">FAQ Segréen</EyebrowBadge>
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#0C0A08]">
                Questions des dirigeants locaux
              </h2>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09]">
              {LOCAL_FAQS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={item.index}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer group active:scale-[0.996]"
                    >
                      <div className="flex items-baseline gap-3.5">
                        <span className="font-mono text-xs text-[#ED5B04] font-semibold">
                          {item.index}
                        </span>
                        <span className="font-semibold text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                          {item.q}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.22, ease: ATELIER_EASE }}
                        className="w-7 h-7 shrink-0 rounded-full border border-[#0C0A08]/[0.12] flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: ATELIER_EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-8 pr-4 text-sm leading-[1.68] text-[#57534E]">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ZONE 05 : FINAL LUMINEUX HAUT-ANJOU
         ==================================================================== */}
      <section className="py-24 md:py-32 bg-[#FAF8F5] text-[#0C0A08] border-t border-[#0C0A08]/[0.07] relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(237,91,4,0.1)_0%,transparent_70%)] blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-[860px] px-6 text-center space-y-7">
          <div className="flex justify-center">
            <EyebrowBadge index="SEGRÉ · 49500">
              Disponible cette semaine
            </EyebrowBadge>
          </div>
          <h2 className="text-[clamp(2.2rem,5vw,3.7rem)] font-bold tracking-[-0.045em] leading-[1.04] text-[#0C0A08]">
            On se voit autour d&apos;un{" "}
            <span className="relative inline-block text-[#57534E] font-normal">
              café à Segré
              <HandDrawnUnderline className="absolute -bottom-2 inset-x-0 h-2.5 w-full" delay={0.25} />
            </span>{" "}
            ?
          </h2>
          <p className="text-[#57534E] max-w-[50ch] mx-auto text-[1.02rem] leading-relaxed">
            Réservez votre créneau offert (0 €) en 2 minutes ou appelez Léo directement au 07 78 31
            03 46.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(237,91,4,0.22)]"
            >
              <span>Commander mon site (0 €)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20suis%20bas%C3%A9%20pr%C3%A8s%20de%20Segr%C3%A9%20et%20souhaite%20discuter%20de%20mon%20site."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0C0A08]/[0.14] text-[#0C0A08] px-6 py-3.5 text-sm font-semibold hover:border-[#0C0A08] active:scale-[0.97] transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#ED5B04]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
          <div className="pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#57534E] flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#ED5B04]" />
            <span>Segré · Le Lion-d&apos;Angers · Château-Gontier · Angers</span>
          </div>
        </div>
      </section>
    </main>
  );
}
