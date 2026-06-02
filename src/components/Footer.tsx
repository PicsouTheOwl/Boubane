import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-[#5e6ad2] flex items-center justify-center">
                <span className="text-white font-bold text-[9px]">B</span>
              </div>
              <span className="text-[13px] font-semibold text-text">Boubane</span>
            </Link>
            <p className="text-[11px] text-text-dim leading-relaxed max-w-48">
              Agents IA locaux pour PME. Vos données restent chez vous.
            </p>
          </div>

          {/* Produit */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Produit</p>
            <div className="flex flex-col gap-2">
              <Link href="#produit" className="text-[12px] text-text-secondary hover:text-text transition-colors">Capacités</Link>
              <Link href="#hardware" className="text-[12px] text-text-secondary hover:text-text transition-colors">Hardware</Link>
              <Link href="#contact" className="text-[12px] text-text-secondary hover:text-text transition-colors">Tarifs</Link>
            </div>
          </div>

          {/* Entreprise */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Légal</p>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-[12px] text-text-secondary hover:text-text transition-colors">Mentions légales</Link>
              <Link href="#" className="text-[12px] text-text-secondary hover:text-text transition-colors">Confidentialité</Link>
              <Link href="#" className="text-[12px] text-text-secondary hover:text-text transition-colors">CGV</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">Contact</p>
            <div className="flex flex-col gap-2">
              <Link href="#contact" className="text-[12px] text-text-secondary hover:text-text transition-colors">Démarrer</Link>
              <a href="mailto:contact@boubane.ai" className="text-[12px] text-text-secondary hover:text-text transition-colors">
                contact@boubane.ai
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-border mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-text-dim">
            © {new Date().getFullYear()} Boubane. Tous droits réservés.
          </p>
          <p className="text-[10px] text-text-dim">
            Fait en France
          </p>
        </div>
      </div>
    </footer>
  );
}
