import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CommandPaletteTrigger } from "@/components/AtelierCommandPalette";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[#0C0A08]/[0.08] bg-[#FAF8F5] pt-16 pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
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

            <p className="text-[0.9rem] leading-relaxed text-[#57534E] max-w-[38ch]">
              Sites vitrines sur-mesure à 0&nbsp;€ d&apos;honoraires et automatisations IA à prix fixe pour artisans, cabinets et PME.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.84rem] font-mono text-[#0C0A08]/80">
              <a
                href="tel:+33778310346"
                className="inline-flex items-center min-h-[38px] sm:min-h-0 font-semibold hover:text-[#ED5B04] transition-colors"
              >
                07 78 31 03 46
              </a>
              <span aria-hidden="true" className="text-[#0C0A08]/25">
                ·
              </span>
              <a
                href="mailto:leo@boubane.com"
                className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#ED5B04] transition-colors"
              >
                leo@boubane.com
              </a>
            </div>

            <p className="text-[12px] text-[#78716C]">
              Léo Saillour · Segré-en-Anjou Bleu (49500) &amp; France entière
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-2">
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#0C0A08]/45">
                Le site
              </div>
              <ul className="space-y-1 sm:space-y-2.5 text-[0.9rem]">
                <li>
                  <Link
                    href="/#modele"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Pourquoi 0 €
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#configurateur"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Automatisations IA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#outils"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Outils compatibles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commander"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Commander mon site (0 €)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hebergement"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Hébergement
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#0C0A08]/45">
                Contact et infos
              </div>
              <ul className="space-y-1 sm:space-y-2.5 text-[0.9rem]">
                <li>
                  <Link
                    href="/rdv"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 gap-1.5 text-[#0C0A08]/75 hover:text-[#ED5B04] transition-colors"
                  >
                    <span>Réserver un appel (30 min)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20souhaite%20%C3%A9changer%20sur%20mon%20projet."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 gap-1.5 text-[#0C0A08]/75 hover:text-[#0E7541] transition-colors"
                  >
                    <span>WhatsApp direct</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/creation-site-internet-segre"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Création site web Segré (49)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Articles et guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mentions-legales"
                    className="inline-flex items-center min-h-[38px] sm:min-h-0 text-[#0C0A08]/75 hover:text-[#0C0A08] transition-colors"
                  >
                    Mentions légales et RGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-[#0C0A08]/45">
          <span>© {new Date().getFullYear()} BOUBANE · LÉO SAILLOUR</span>
          <CommandPaletteTrigger />
        </div>
      </div>
    </footer>
  );
}
