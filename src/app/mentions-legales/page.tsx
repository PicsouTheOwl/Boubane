export const dynamic = "force-dynamic";

export default function MentionsLegales() {
  return (
    <main className="pt-24 pb-16">
      <div className="container max-w-2xl">
        <h1 className="text-[1.8rem] font-semibold text-text mb-2">Mentions légales</h1>
        <p className="text-[12px] text-text-muted mb-10">Dernière mise à jour : juin 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-[14px] font-semibold text-text mb-2">Éditeur du site</h2>
            <div className="text-[12px] text-text-secondary leading-relaxed space-y-1">
              <p>Boubane</p>
              <p>Entreprise individuelle</p>
              <p>France</p>
              <p>Email : contact@boubane.ai</p>
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-semibold text-text mb-2">Hébergement</h2>
            <div className="text-[12px] text-text-secondary leading-relaxed space-y-1">
              <p>Vercel Inc.</p>
              <p>340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-semibold text-text mb-2">Propriété intellectuelle</h2>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, logos, etc.) est la propriété exclusive de Boubane. 
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments 
              du site est interdite sans l&apos;autorisation écrite préalable de Boubane.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-semibold text-text mb-2">Données personnelles</h2>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Les données collectées via le formulaire de contact sont uniquement utilisées pour répondre à vos demandes. 
              Elles ne sont pas transmises à des tiers. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, 
              de rectification et de suppression de vos données en contactant contact@boubane.ai.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-semibold text-text mb-2">Cookies</h2>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Ce site n&apos;utilise aucun cookie de suivi ni traceur publicitaire. 
              Seules les données strictement nécessaires au fonctionnement du site sont collectées.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
