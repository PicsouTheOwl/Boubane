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
  index: string;
  category: "Modèle" | "Souveraineté" | "Performance" | "Territoire";
  readTime: string;
  title: string;
  excerpt: string;
  sections: Array<{ heading: string; body: string }>;
}

const ARTICLES: Article[] = [
  {
    id: "cout-agence",
    index: "01",
    category: "Modèle",
    readTime: "4 min",
    title: "Pourquoi un site vitrine facturé 4 500 € en agence n'a plus beaucoup de sens",
    excerpt:
      "Ce qu'il y a vraiment dans un devis d'agence classique, et comment on arrive à 0 € de création chez Boubane.",
    sections: [
      {
        heading: "1. Ce que paie vraiment un devis à 4 500 €",
        body: "Sur une facture classique à 4 500 €, plus de 70 % sert à payer les commerciaux, les réunions de suivi et les loyers de bureaux. Vous payez le fonctionnement d'une structure, pas la qualité du code.",
      },
      {
        heading: "2. Pourquoi Boubane peut offrir la création à 0 €",
        body: "En travaillant en direct sans intermédiaires et sur du code léger sur mesure, je peux concevoir votre vitrine à mes frais. Vous ne payez que votre nom de domaine et votre serveur (~5 €/mois) directement à votre nom.",
      },
    ],
  },
  {
    id: "souverainete-numerique",
    index: "02",
    category: "Souveraineté",
    readTime: "3 min",
    title: "Abonnements mensuels à 150 € : le coût réel sur 4 ans",
    excerpt:
      "À 150 € par mois pendant 4 ans, vous dépensez 7 200 € sans jamais être propriétaire de votre site.",
    sections: [
      {
        heading: "1. L'addition à la fin du contrat : 7 200 €",
        body: "Les formules par abonnement vous engagent sur la durée : le jour où vous arrêtez de payer, le site et parfois même le nom de domaine sont coupés.",
      },
      {
        heading: "2. Garder la main sur votre outil de travail",
        body: "Chez Boubane, votre dépôt GitHub et votre nom de domaine sont à votre nom dès le départ. Vous restez libre de partir ou de modifier votre site à tout moment.",
      },
    ],
  },
  {
    id: "vitesse-3-secondes",
    index: "03",
    category: "Performance",
    readTime: "5 min",
    title: "La règle des 3 secondes : pourquoi un site lent vous fait perdre des clients",
    excerpt:
      "Quand une page met quatre secondes à s'ouvrir sur téléphone, la moitié des visiteurs repartent sur Google.",
    sections: [
      {
        heading: "1. Vos clients vous cherchent d'abord sur mobile",
        body: "Plus de 7 personnes sur 10 consultent votre site depuis leur téléphone. S'il met quatre secondes à charger, elles ferment l'onglet avant même de voir vos chantiers.",
      },
      {
        heading: "2. Code propre contre WordPress surchargé",
        body: "Sans thème lourd ni dizaines d'extensions en conflit, les pages s'affichent en moins de 0,3 seconde.",
      },
    ],
  },
  {
    id: "seo-segre-haut-anjou",
    index: "04",
    category: "Territoire",
    readTime: "4 min",
    title: "Être trouvé sur Google à Segré-en-Anjou Bleu et dans le Haut-Anjou",
    excerpt:
      "Comment organiser votre site pour capter les recherches locales du 49 et du 53 sans payer de publicité.",
    sections: [
      {
        heading: "1. Montrer votre vrai travail dans le Segréen",
        body: "Beaucoup d'artisans et de PME locales travaillent très bien mais n'ont qu'une page Facebook ou un vieux site dépassé.",
      },
      {
        heading: "2. Des pages structurées pour les recherches de proximité",
        body: "Chaque site intègre les bonnes balises locales (Segré, Le Lion-d'Angers, Château-Gontier, Angers) pour ressortir naturellement sur les requêtes de votre secteur.",
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

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <SiteHeader isHome={false} />

      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[1160px] px-6">
          <AtelierReveal className="max-w-3xl mb-12">
            <EyebrowBadge index="ÉDITION">Journal &amp; Guides Stratégiques</EyebrowBadge>
            <h1 className="mt-6 text-[clamp(2.3rem,5vw,3.9rem)] font-bold tracking-[-0.045em] leading-[1.03] text-[#0C0A08]">
              Architecture web,{" "}
              <span className="text-[#0C0A08]/40 font-normal">tarifs &amp; souveraineté.</span>
            </h1>
            <p className="mt-4 text-[1.02rem] leading-[1.6] text-[#57534E] max-w-[54ch]">
              Nos analyses sans langue de bois pour comprendre ce qui distingue un actif numérique
              durable d&apos;une dépense d&apos;agence inutile.
            </p>
          </AtelierReveal>

          {/* Barre de Filtres Tactile */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-[#0C0A08]/[0.08]">
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

          {filtered.length > 0 ? (
            <div className="space-y-12">
              {/* Dossier Principal en Vedette (Monolithe Sombre) */}
              {featured && (
                <AtelierReveal>
                  <SpecularPlate dark crosshairs className="p-8 sm:p-11">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                        DOSSIER À LA UNE · {featured.category}
                      </span>
                      <span className="font-mono text-[11px] text-white/45">
                        LECTURE · {featured.readTime}
                      </span>
                    </div>

                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                      <div className="lg:col-span-8">
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.035em] leading-[1.12] text-white">
                          {featured.title}
                        </h2>
                        <p className="mt-4 text-base text-white/65 leading-relaxed max-w-[58ch]">
                          {featured.excerpt}
                        </p>
                      </div>
                      <div className="lg:col-span-4 flex lg:justify-end">
                        <button
                          type="button"
                          onClick={() => setOpenArticle(featured)}
                          className="inline-flex items-center gap-2.5 rounded-full bg-[#FAF8F5] text-[#0C0A08] px-6 py-3.5 text-sm font-semibold hover:bg-white active:scale-[0.97] transition-all cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Lire l&apos;analyse</span>
                        </button>
                      </div>
                    </div>
                  </SpecularPlate>
                </AtelierReveal>
              )}

              {/* Liste Éditoriale à Filets Fins pour les autres dossiers */}
              {rest.length > 0 && (
                <div className="divide-y divide-[#0C0A08]/[0.09] border-y border-[#0C0A08]/[0.09]">
                  {rest.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setOpenArticle(art)}
                      className="py-8 grid grid-cols-1 md:grid-cols-12 gap-5 items-center group cursor-pointer"
                    >
                      <div className="md:col-span-2 flex items-center gap-3 font-mono text-xs">
                        <span className="text-[#ED5B04] font-semibold">{art.index}</span>
                        <span className="text-[#0C0A08]/45 uppercase tracking-[0.08em]">
                          {art.category}
                        </span>
                      </div>

                      <div className="md:col-span-8">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.025em] text-[#0C0A08] group-hover:text-[#ED5B04] transition-colors">
                          {art.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#57534E] leading-relaxed max-w-[60ch]">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="md:col-span-2 flex md:justify-end items-center gap-2 font-mono text-xs text-[#0C0A08]/60 group-hover:text-[#0C0A08]">
                        <span>{art.readTime}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#0C0A08]/[0.08] bg-white p-12 text-center text-[#57534E]">
              Aucun article ne correspond à votre recherche.
            </div>
          )}

          {/* CTA Éditorial Final */}
          <AtelierReveal className="mt-16">
            <div className="rounded-[24px] bg-[#F3EFE7] border border-[#0C0A08]/[0.08] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ED5B04] font-semibold">
                  PASSER À L&apos;ACTION
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0C0A08]">
                  Prêt à lancer votre propre vitrine à 0 € ?
                </h3>
                <p className="mt-2 text-sm text-[#57534E] max-w-[48ch]">
                  Réservez votre créneau en 2 minutes et recevez votre première maquette sous 5
                  jours ouvrés.
                </p>
              </div>
              <Link
                href="/commander"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all shrink-0"
              >
                <span>Commander mon site (0 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
