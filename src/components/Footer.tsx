"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-surface-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold">
                Bou<span className="gradient-text">bane</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm leading-relaxed">
              Déployez des agents IA autonomes et sécurisés dans votre PME.
              Conçus sur-mesure, hébergés en France.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Navigation</h4>
            <div className="space-y-3">
              {[
                { href: "#services", label: "Services" },
                { href: "#processus", label: "Processus" },
                { href: "#apropos", label: "À propos" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-text-muted text-sm hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Légal</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-text-muted text-sm hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="block text-text-muted text-sm hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="block text-text-muted text-sm hover:text-foreground transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-sm">
            © {new Date().getFullYear()} Boubane. Tous droits réservés.
          </p>
          <p className="text-text-dim text-sm flex items-center gap-1">
            Fait avec <Sparkles size={12} className="text-accent" /> en France
          </p>
        </div>
      </div>
    </footer>
  );
}
