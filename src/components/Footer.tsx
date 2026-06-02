import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">B</span>
              </div>
              <span className="text-sm font-semibold text-text">Boubane</span>
            </Link>
            <p className="text-micro max-w-xs">
              Agents IA locaux pour PME. Vos données restent chez vous.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-micro text-text-muted mb-3">Produit</p>
              <div className="flex flex-col gap-2">
                <Link href="#produit" className="text-small hover:text-text transition-colors">Capacités</Link>
                <Link href="#hardware" className="text-small hover:text-text transition-colors">Hardware</Link>
                <Link href="#tarifs" className="text-small hover:text-text transition-colors">Tarifs</Link>
              </div>
            </div>
            <div>
              <p className="text-micro text-text-muted mb-3">Légal</p>
              <div className="flex flex-col gap-2">
                <Link href="#" className="text-small hover:text-text transition-colors">Mentions légales</Link>
                <Link href="#" className="text-small hover:text-text transition-colors">Confidentialité</Link>
                <Link href="#" className="text-small hover:text-text transition-colors">CGV</Link>
              </div>
            </div>
            <div>
              <p className="text-micro text-text-muted mb-3">Contact</p>
              <div className="flex flex-col gap-2">
                <Link href="#contact" className="text-small hover:text-text transition-colors">Démarrer un projet</Link>
                <a href="mailto:contact@boubane.ai" className="text-small hover:text-text transition-colors">
                  contact@boubane.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-micro">
            © {new Date().getFullYear()} Boubane. Tous droits réservés.
          </p>
          <p className="text-micro">
            Fait en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
