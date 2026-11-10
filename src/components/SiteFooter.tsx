import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[#0C0A08]/[0.08] bg-[#FAF8F5] pt-16 pb-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-[#0C0A08]/[0.07] md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/assets/boubane-logo.png"
                alt="Boubane"
                width={30}
                height={30}
                className="rounded-lg transition-transform duration-300 ease-out group-hover:scale-105"
              />
              <span className="font-bold tracking-[-0.03em] text-[1.05rem] text-[#0C0A08]">
                BOUBANE
              </span>
            </Link>
            <p className="text-[0.9rem] leading-relaxed text-[#57534E] max-w-[34ch]">
              Atelier d&apos;artisanat web à Segré-en-Anjou Bleu (49500). Des vitrines sur-mesure à
              0 € d&apos;honoraires, codées à la main pour les artisans et entreprises d&apos;Anjou et
              de France.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#0C0A08]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Atelier Ouvert · Haut-Anjou</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#0C0A08]/45">
              Atelier &amp; Offre
            </div>
            <ul className="space-y-2.5 text-[0.9rem]">
              <li>
                <Link
                  href="/#modele"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Le Manifeste du 0 €
                </Link>
              </li>
              <li>
                <Link
                  href="/#realisations"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Dossiers &amp; Réalisations
                </Link>
              </li>
              <li>
                <Link
                  href="/commander"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Commander mon site (0 €)
                </Link>
              </li>
              <li>
                <Link
                  href="/hebergement"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Hébergement &amp; Infogérance
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#0C0A08]/45">
              Échanges Directs &amp; Ressources
            </div>
            <ul className="space-y-2.5 text-[0.9rem]">
              <li>
                <a
                  href="https://rdv.boubane.com/boubane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0C0A08]/75 hover:text-[#ED5B04] transition-colors"
                >
                  <span>Réserver un appel (10 min)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <Link
                  href="/creation-site-internet-segre"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Création site web Segré (49)
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Journal &amp; Analyses
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                >
                  Mentions Légales &amp; RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-[#0C0A08]/45">
          <span>© {new Date().getFullYear()} STUDIO BOUBANE · LÉO SAILLOUR</span>
          <span>SEGRÉ-EN-ANJOU BLEU (49) · CODE PROPRIÉTAIRE</span>
        </div>
      </div>
    </footer>
  );
}
