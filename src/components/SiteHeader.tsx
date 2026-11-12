"use client";

import Link from "next/link";

export function SiteHeader({ isHome = true }: { isHome?: boolean }) {
  const prefix = isHome ? "" : "/";

  return (
    <header className="header">
      <div className="nav-pill-wrapper">
        <Link href={isHome ? "#top" : "/"} className="brand" aria-label="Accueil Boubane">
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
              <Link href={`${prefix}#processus`} className="nav-link">
                Processus
              </Link>
            </li>
            <li>
              <Link href={`${prefix}#faq`} className="nav-link">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          href="/commander"
          className="btn btn-primary btn-magnetic"
          aria-label="Commander mon site offert"
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
      </div>
    </header>
  );
}

