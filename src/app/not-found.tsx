import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SpecularPlate } from "@/components/AtelierPrimitives";

export default function NotFound() {
  return (
    <>
      <SiteHeader isHome={false} />
      <main className="min-h-[72vh] flex items-center justify-center px-6 py-20">
        <SpecularPlate tilt={false} crosshairs className="max-w-lg w-full p-10 sm:p-12 text-center bg-white">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#ED5B04] font-semibold">
            ERREUR 404 · HORS GABARIT
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-[#0C0A08]">
            Cette pièce n&apos;est pas sur l&apos;établi<span className="text-[#ED5B04]">.</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#57534E] leading-relaxed">
            La page demandée a été déplacée ou n&apos;existe pas. Revenez à l&apos;atelier pour
            reprendre votre parcours.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#0C0A08] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E1B18] active:scale-[0.97] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Revenir à l&apos;accueil</span>
            </Link>
          </div>
        </SpecularPlate>
      </main>
      <SiteFooter />
    </>
  );
}
