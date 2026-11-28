"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

export function SiteHeader({ isHome = true }: { isHome?: boolean }) {
  const prefix = isHome ? "" : "/";
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="nav-pill-wrapper">
        <Link
          href={isHome ? "#top" : "/"}
          onClick={closeMenu}
          className="brand"
          aria-label="Accueil Boubane"
        >
          <img
            src="/assets/boubane-logo.png"
            alt="Logo Boubane"
            className="brand-logo"
            width={28}
            height={28}
          />
          <span>BOUBANE</span>
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="nav-links">
            <li>
              <Link href={`${prefix}#modele`} className="nav-link">
                Modèle 0 €
              </Link>
            </li>
            <li>
              <Link href={`${prefix}#configurateur`} className="nav-link">
                Configurateur
              </Link>
            </li>
            <li>
              <Link href={`${prefix}#faq`} className="nav-link">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/commander"
            onClick={closeMenu}
            className="btn btn-primary btn-magnetic"
            aria-label="Commander mon projet"
          >
            <span className="nav-btn-text-full">Commander (0 €)</span>
            <span className="nav-btn-text-short">Commander</span>
            <span className="btn-arrow-double" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full text-[#0C0A08] hover:bg-[#0C0A08]/[0.06] active:scale-95 transition-all cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: prefersReducedMotion ? 0.08 : 0.14 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: prefersReducedMotion ? 0.06 : 0.1 },
              }}
              onClick={closeMenu}
              className="fixed inset-0 z-[-1] md:hidden bg-[#0C0A08]/15"
              aria-hidden="true"
            />

            <motion.nav
              key="mobile-nav-panel"
              id="mobile-nav-drawer"
              aria-label="Navigation mobile"
              style={{ transformOrigin: "top right" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: -6 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: prefersReducedMotion
                  ? { duration: 0.1 }
                  : { duration: 0.2, ease: EASE_OUT },
              }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0, transition: { duration: 0.08 } }
                  : {
                      opacity: 0,
                      scale: 0.97,
                      y: -4,
                      transition: { duration: 0.1, ease: EASE_IN },
                    }
              }
              className="md:hidden mt-2 rounded-[22px] bg-[#FAF9F6]/96 backdrop-blur-xl border border-[#0C0A08]/[0.09] shadow-[0_20px_48px_-12px_rgba(12,10,8,0.16)] p-2.5 overflow-hidden"
            >
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href={`${prefix}#modele`}
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#0C0A08] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Modèle 0 €</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${prefix}#configurateur`}
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#0C0A08] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Automatisations IA</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${prefix}#apercu`}
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#0C0A08] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Aperçu interactif</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${prefix}#faq`}
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#0C0A08] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Questions fréquentes</span>
                  </Link>
                </li>

                <li aria-hidden="true" className="border-t border-[#0C0A08]/[0.07] my-1.5" />

                <li>
                  <Link
                    href="/rdv"
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#0C0A08] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Prendre RDV (30 min)</span>
                    <ArrowUpRight className="w-4 h-4 text-[#ED5B04]" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hebergement"
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#57534E] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Hébergement</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onClick={closeMenu}
                    className="min-h-[44px] px-3.5 rounded-[14px] flex items-center justify-between text-[14.5px] font-medium text-[#57534E] active:bg-[#0C0A08]/[0.06] transition-colors"
                  >
                    <span>Articles et guides</span>
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
