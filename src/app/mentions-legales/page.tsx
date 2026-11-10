import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EyebrowBadge, SpecularPlate } from "@/components/AtelierPrimitives";

export const metadata: Metadata = {
  title: "Mentions Légales & Confidentialité · Boubane",
  description:
    "Mentions légales, hébergement souverain et politique de confidentialité RGPD du studio Boubane.",
};

const LEGAL_SECTIONS = [
  {
    title: "1. Éditeur du site & Responsable de publication",
    body: "Le site www.boubane.com est édité par Léo Saillour (Boubane), entrepreneur individuel domicilié à Segré-en-Anjou Bleu (49500), France. Contact direct : leosaillour@gmail.com · 07 78 31 03 46.",
  },
  {
    title: "2. Hébergement",
    body: "Le présent site vitrine est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).",
  },
  {
    title: "3. Propriété intellectuelle",
    body: "L'ensemble des contenus éditoriaux, design, logo Boubane et architectures de ce site est protégé par les dispositions du Code de la propriété intellectuelle. Les sites réalisés pour nos clients leur sont cédés en pleine propriété sur leur propre dépôt GitHub.",
  },
  {
    title: "4. Protection des données personnelles (RGPD)",
    body: "Les données saisies dans le tunnel de commande ou les formulaires de contact servent exclusivement à traiter votre demande professionnelle. Aucune donnée n'est vendue ou cédée à des tiers. Droit d'accès, rectification et suppression sur simple demande à leosaillour@gmail.com.",
  },
  {
    title: "5. Cadre de l'offre « Site offert à 0 € »",
    body: "100 % des honoraires de conception et de développement vitrine standard sont pris en charge par Studio Boubane. Le client ne règle que ses frais techniques directs (nom de domaine et hébergement auprès du fournisseur choisi, ou option Pass Hébergement Boubane à 15 €/an sans engagement).",
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <SiteHeader isHome={false} />
      <main className="relative pt-16 pb-28">
        <div className="mx-auto max-w-[860px] px-6">
          <EyebrowBadge index="LÉGAL & RGPD">Transparence</EyebrowBadge>
          <h1 className="mt-5 text-[clamp(2.1rem,4.5vw,3.3rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Mentions Légales &amp; Confidentialité<span className="text-[#ED5B04]">.</span>
          </h1>

          <SpecularPlate tilt={false} className="mt-10 p-8 sm:p-11 bg-white space-y-8">
            {LEGAL_SECTIONS.map((sec) => (
              <section key={sec.title} className="pb-6 border-b border-[#0C0A08]/[0.07] last:border-none last:pb-0">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-[#0C0A08]">{sec.title}</h2>
                <p className="mt-2.5 text-[0.95rem] leading-[1.7] text-[#57534E]">{sec.body}</p>
              </section>
            ))}
          </SpecularPlate>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

