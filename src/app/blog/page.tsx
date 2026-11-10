"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AtelierReveal, EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

interface Article {
  id: string;
  category: "Modèle" | "Souveraineté" | "Performance" | "Territoire";
  readTime: string;
  title: string;
  excerpt: string;
  sections: Array<{ heading: string; body: string }>;
}

const ARTICLES: Article[] = [
  {
    id: "cout-agence",
    category: "Modèle",
    readTime: "4 min",
    title: "Pourquoi un site vitrine facturé 4 500 € en agence n'a plus aucun sens",
    excerpt:
      "Décomposition chirurgicale d'un devis d'agence classique et explication du circuit court Boubane à 0 € d'honoraires.",
    sections: [
      {
        heading: "1. La décomposition réelle des coûts d'une agence classique",
        body: "Dans un devis standard à 4 500 €, plus de 70 % sert à financer la prospection commerciale, les réunions de chefs de projet et les frais généraux de bureaux. L'artisan ou le dirigeant paie pour une structure administrative, pas pour son site.",
      },
      {
        heading: "2. Pourquoi Boubane offre 100 % de la conception",
        body: "En supprimant les intermédiaires commerciaux et en travaillant sur une architecture de code pure, le coût marginal d'exécution est optimisé. Vous ne payez que votre hébergement réel (~5 €/mois) directement à votre nom.",
      },
    ],
  },
  {
    id: "souverainete-numerique",
    category: "Souveraineté",
    readTime: "3 min",
    title: "L'impôt caché des abonnements captifs : reprenez votre code source",
    excerpt:
      "150 € par mois pendant 4 ans représente 7 200 € dépensés à fonds perdus sans posséder une seule ligne de votre site.",
    sections: [
      {
        heading: "1. Le calcul financier implacable : 7 200 € à fonds perdus",
        body: "Les formules locatives vous lient par contrat : dès que vous cessez de payer la mensualité, votre vitrine et parfois votre nom de domaine disparaissent.",
      },
      {
        heading: "2. Votre vitrine doit être un actif patrimonial",
        body: "Chez Boubane, votre dépôt GitHub privé et votre nom de domaine sont enregistrés à votre nom dès la livraison. Liberté juridique totale.",
      },
    ],
  },
  {
    id: "vitesse-3-secondes",
    category: "Performance",
    readTime: "5 min",
    title: "La règle des 0.3 secondes : pourquoi la vitesse multiplie vos demandes de devis",
    excerpt:
      "Chaque seconde de latence WordPress réduit la conversion mobile de 20 %. Comment le code pur bat les CMS préfabriqués.",
    sections: [
      {
        heading: "1. L'impact commercial direct sur smartphone",
        body: "Plus de 72 % de vos prospects consultent votre site depuis un téléphone sur chantier ou entre deux rendez-vous. S'il met 4 secondes à charger, ils retournent sur Google.",
      },
      {
        heading: "2. La supériorité du code pur sur les constructeurs de pages",
        body: "Zéro thème obèse, zéro dizaine d'extensions en conflit : uniquement du code moderne taillé au millimètre pour l'affichage instantané.",
      },
    ],
  },
  {
    id: "seo-segre-haut-anjou",
    category: "Territoire",
    readTime: "4 min",
    title: "Dominer les recherches locales à Segré-en-Anjou Bleu et dans le Haut-Anjou",
    excerpt:
      "Comment structurer sa vitrine pour capter les clients sérieux du 49 et du 53 sans dépendre de la publicité payante.",
    sections: [
      {
        heading: "1. Le dynamisme du Segréen mérite des vitrines d'exception",
        body: "Artisans, cabinets et PME locales disposent d'un savoir-faire réel souvent invisibilisé par des sites datés ou une simple page Facebook.",
      },
      {
        heading: "2. Architecture sémantique et balisage local",
        body: "Chaque page livrée par le studio intègre les données structurées géolocalisées (Segré, Le Lion-d'Angers, Château-Gontier, Angers) pour une indexation propre et durable.",
      },
    ],
  },
];

const CATEGORIES = ["Tous", "Modèle", "Souveraineté", "Performance", "Territoire"] as const;

export default function BlogPage() {
  const [selectedCat, setSelectedCat] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const filtered = ARTICLES.filter((a) => {
    const matchCat = selectedCat === "Tous" || a.category === selectedCat;
    const matchQuery =
      !query.trim() ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[1160px] px-6">
          <AtelierReveal className="max-w-3xl mb-12">
            <EyebrowBadge index="ÉDITION">Journal &amp; Guides Stratégiques</EyebrowBadge>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.04em] leading-[1.06] text-[#0C0A08]">
              Architecture web, tarifs &amp; souveraineté<span className="text-[#ED5B04]">.</span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[#57534E] max-w-[54ch]">
              Nos analyses sans langue de bois pour comprendre ce qui distingue un actif numérique
              durable d&apos;une dépense d&apos;agence inutile.
            </p>
          </AtelierReveal>

          {/* Barre de Filtres Tactile */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#0C0A08]/[0.08]">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const active = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`relative px-4 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                      active ? "text-white" : "text-[#0C0A08]/60 hover:text-[#0C0A08]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="blogCatPill"
                        transition={ATELIER_SNAPPY_SPRING}
                        className="absolute inset-0 rounded-full bg-[#0C0A08]"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#0C0A08]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un dossier..."
                className="w-full rounded-full border border-[#0C0A08]/[0.1] bg-white pl-10 pr-4 py-2 text-sm text-[#0C0A08] focus:border-[#ED5B04] focus:outline-none"
              />
            </div>
          </div>

          {/* Grille Éditoriale Magazine */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((art, i) => (
                <AtelierReveal key={art.id} delay={i * 0.05} className="flex">
                  <SpecularPlate className="w-full p-8 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#0C0A08]/[0.07]">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#0C0A08]/[0.08] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#ED5B04]">
                          {art.category}
                        </span>
                        <span className="font-mono text-[11px] text-[#0C0A08]/45">
                          LECTURE · {art.readTime}
                        </span>
                      </div>
                      <h2 className="mt-5 text-xl sm:text-2xl font-bold tracking-[-0.025em] leading-[1.2] text-[#0C0A08]">
                        {art.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#57534E]">{art.excerpt}</p>
                    </div>

                    <div className="mt-7 pt-5 border-t border-[#0C0A08]/[0.06] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setOpenArticle(art)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C0A08] hover:text-[#ED5B04] transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Lire l&apos;article complet</span>
                      </button>
                      <ArrowRight className="w-4 h-4 text-[#0C0A08]/35" />
                    </div>
                  </SpecularPlate>
                </AtelierReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#0C0A08]/[0.08] bg-white p-12 text-center text-[#57534E]">
              Aucun article ne correspond à votre recherche.
            </div>
          )}

          {/* CTA Éditorial Final */}
          <AtelierReveal className="mt-16">
            <SpecularPlate dark crosshairs className="p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04]">
                  PASSER À L&apos;ACTION
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                  Prêt à lancer votre propre vitrine à 0 € ?
                </h3>
                <p className="mt-2 text-sm text-white/65 max-w-[48ch]">
                  Réservez votre créneau en 2 minutes et recevez votre première maquette sous 5
                  jours ouvrés.
                </p>
              </div>
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#ED5B04] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#D64E00] active:scale-[0.97] transition-all shrink-0"
              >
                <span>Commander mon site (0 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </SpecularPlate>
          </AtelierReveal>
        </div>
      </main>

      {/* Lecteur d'Article Optique */}
      <AnimatePresence>
        {openArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenArticle(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4"
          >
            <motion.article
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: ATELIER_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[24px] bg-[#FAF8F5] p-8 sm:p-10 border border-[#0C0A08]/[0.1] shadow-2xl"
            >
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpenArticle(null)}
                className="sticky float-right top-0 w-8 h-8 rounded-full bg-white border border-[#0C0A08]/[0.1] flex items-center justify-center text-[#0C0A08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                {openArticle.category} · {openArticle.readTime}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.03em] leading-[1.15] text-[#0C0A08]">
                {openArticle.title}
              </h2>
              <p className="mt-4 text-base text-[#57534E] leading-relaxed pb-6 border-b border-[#0C0A08]/[0.08]">
                {openArticle.excerpt}
              </p>

              <div className="mt-6 space-y-6">
                {openArticle.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h3 className="text-lg font-bold text-[#0C0A08]">{sec.heading}</h3>
                    <p className="mt-2 text-[0.96rem] leading-[1.7] text-[#57534E]">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#0C0A08]/[0.08] flex justify-end">
                <Link
                  href="/commander"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-6 py-3 text-sm font-semibold"
                >
                  <span>Commander mon site (0 €)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </>
  );
}
