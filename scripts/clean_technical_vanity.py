#!/usr/bin/env python3
"""
Eliminate developer vanity metrics (100/100 PageSpeed, 0.3s, 14x plus rapide, Achille.ai)
and replace with direct artisan/business value propositions:
- 0 € création (100% offert)
- Prêt en 48h chrono
- Demandes de devis directes & bouton d'appel mobile
- Visibilité locale Google & proximité
- 100% propriétaire sans abonnement captif
"""

import os
import re

FILES = [
    "commander.html",
    "site/commander.html",
    "index.html",
    "site/index.html",
    "creation-site-internet-segre.html",
    "site/creation-site-internet-segre.html",
    "showcase-votre-site.html",
    "site/showcase-votre-site.html",
    "showcase-astra.html",
    "site/showcase-astra.html",
    "showcase/astra/index.html",
    "site/showcase/astra/index.html",
    "blog.html",
    "site/blog.html"
]

def clean_commander(content):
    # 1. Micro stats in hero
    content = content.replace(
        """                <!-- Micro-Stats -->
                <div class="hero-micro-stats">
                    <div class="micro-stat">
                        <span class="micro-stat-value">100<span style="font-size: 0.7em; color: var(--color-text-muted);">/100</span></span>
                        <span class="micro-stat-label">Google PageSpeed</span>
                    </div>
                    <div class="micro-stat">
                        <span class="micro-stat-value micro-stat-value--accent">&lt; 0.4s</span>
                        <span class="micro-stat-label">Temps de chargement</span>
                    </div>
                    <div class="micro-stat">
                        <span class="micro-stat-value">0 €</span>
                        <span class="micro-stat-label">Conception &amp; Code</span>
                    </div>
                </div>""",
        """                <!-- Micro-Stats Métier & Garanties -->
                <div class="hero-micro-stats">
                    <div class="micro-stat">
                        <span class="micro-stat-value">0 €</span>
                        <span class="micro-stat-label">Frais de création (100% offert)</span>
                    </div>
                    <div class="micro-stat">
                        <span class="micro-stat-value micro-stat-value--accent">48h</span>
                        <span class="micro-stat-label">Délai de mise en ligne</span>
                    </div>
                    <div class="micro-stat">
                        <span class="micro-stat-value">100%</span>
                        <span class="micro-stat-label">Propriétaire &amp; Sans engagement</span>
                    </div>
                </div>"""
    )

    # 2. Proof section header
    content = content.replace(
        """                    <span class="cmd-eyebrow">[ 01 ] Résultats</span>
                    <h2 class="cmd-section-title">Des performances mesurables<span class="dot-accent">.</span></h2>
                    <p class="cmd-section-lead">Chaque projet est optimisé pour la vitesse maximale et la visibilité Google. Voici les résultats concrets.</p>""",
        """                    <span class="cmd-eyebrow">[ 01 ] Vos Garanties</span>
                    <h2 class="cmd-section-title">Des résultats concrets pour votre activité<span class="dot-accent">.</span></h2>
                    <p class="cmd-section-lead">Chaque vitrine est conçue pour capter des chantiers dans votre secteur et rassurer vos futurs clients. Zéro discours technique, zéro intermédiaire.</p>"""
    )

    # 3. Proof cards grid (Astra + Achille + Global)
    old_proof_grid = """                <div class="proof-grid">
                    <!-- Astra Vacances -->
                    <div class="proof-card reveal reveal-delay-1">
                        <img src="assets/astra-logo.png" alt="Astra Vacances" class="proof-card-logo">
                        <div class="proof-card-name">Astravacances.fr</div>
                        <div class="proof-card-metric proof-card-metric--accent">100/100</div>
                        <div class="proof-card-label">Score Google PageSpeed</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 100%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Vérifié Google PageSpeed Insights
                        </div>
                    </div>

                    <!-- Achille.ai -->
                    <div class="proof-card reveal reveal-delay-2">
                        <img src="assets/achille-logo.png" alt="Achille.ai" class="proof-card-logo">
                        <div class="proof-card-name">Achille.ai</div>
                        <div class="proof-card-metric">0.3<span style="font-size: 0.5em; color: var(--color-text-muted);">s</span></div>
                        <div class="proof-card-label">Temps de chargement complet</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 7%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            14x plus rapide que la moyenne web
                        </div>
                    </div>

                    <!-- Global -->
                    <div class="proof-card reveal reveal-delay-3">
                        <div class="proof-card-icon">✦</div>
                        <div class="proof-card-name">Tous les projets</div>
                        <div class="proof-card-metric proof-card-metric--accent">100%</div>
                        <div class="proof-card-label">Clients satisfaits à ce jour</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 100%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Zéro projet abandonné
                        </div>
                    </div>
                </div>"""

    new_proof_grid = """                <div class="proof-grid">
                    <!-- Garantie 1 : Clé en main -->
                    <div class="proof-card reveal reveal-delay-1">
                        <div class="proof-card-icon">🚀</div>
                        <div class="proof-card-name">Mise en ligne express</div>
                        <div class="proof-card-metric proof-card-metric--accent">48h</div>
                        <div class="proof-card-label">Délai moyen de livraison</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 100%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Prêt à recevoir des demandes sans attendre
                        </div>
                    </div>

                    <!-- Garantie 2 : Contact direct -->
                    <div class="proof-card reveal reveal-delay-2">
                        <div class="proof-card-icon">📞</div>
                        <div class="proof-card-name">Demandes de devis directes</div>
                        <div class="proof-card-metric">100%</div>
                        <div class="proof-card-label">Transmission immédiate sans filtre</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 100%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Bouton d'appel mobile &amp; formulaire direct
                        </div>
                    </div>

                    <!-- Garantie 3 : Souveraineté -->
                    <div class="proof-card reveal reveal-delay-3">
                        <div class="proof-card-icon">✦</div>
                        <div class="proof-card-name">Liberté &amp; Zéro engagement</div>
                        <div class="proof-card-metric proof-card-metric--accent">0 €</div>
                        <div class="proof-card-label">Frais d'agence &amp; abonnement captif</div>
                        <div class="proof-bar">
                            <div class="proof-bar-fill" style="--bar-target: 100%"></div>
                        </div>
                        <div class="proof-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Vous êtes 100% propriétaire du site
                        </div>
                    </div>
                </div>"""

    content = content.replace(old_proof_grid, new_proof_grid)

    # 4. Comparison table items
    content = content.replace(
        """                        <div class="compare-item">
                            <span class="compare-item-icon">⚡</span>
                            <div>
                                <div class="compare-item-label">Vitesse de chargement</div>
                                <div class="compare-item-value compare-item-value--bad">4.2 secondes en moyenne</div>
                            </div>
                        </div>
                        <div class="compare-item">
                            <span class="compare-item-icon">📊</span>
                            <div>
                                <div class="compare-item-label">Score Google PageSpeed</div>
                                <div class="compare-item-value compare-item-value--bad">34 / 100 en moyenne</div>
                            </div>
                        </div>""",
        """                        <div class="compare-item">
                            <span class="compare-item-icon">⏳</span>
                            <div>
                                <div class="compare-item-label">Délai de livraison</div>
                                <div class="compare-item-value compare-item-value--bad">2 à 4 mois de réunions</div>
                            </div>
                        </div>
                        <div class="compare-item">
                            <span class="compare-item-icon">📱</span>
                            <div>
                                <div class="compare-item-label">Contact commercial</div>
                                <div class="compare-item-value compare-item-value--bad">Formulaire passif sans appel direct</div>
                            </div>
                        </div>"""
    )

    content = content.replace(
        """                        <div class="compare-item">
                            <span class="compare-item-icon">⚡</span>
                            <div>
                                <div class="compare-item-label">Vitesse de chargement</div>
                                <div class="compare-item-value compare-item-value--good">0.3 seconde — 14x plus rapide</div>
                            </div>
                        </div>
                        <div class="compare-item">
                            <span class="compare-item-icon">🏆</span>
                            <div>
                                <div class="compare-item-label">Score Google PageSpeed</div>
                                <div class="compare-item-value compare-item-value--good">100 / 100 — score parfait</div>
                            </div>
                        </div>""",
        """                        <div class="compare-item">
                            <span class="compare-item-icon">⚡</span>
                            <div>
                                <div class="compare-item-label">Délai de livraison</div>
                                <div class="compare-item-value compare-item-value--good">Prêt en 48 heures chrono</div>
                            </div>
                        </div>
                        <div class="compare-item">
                            <span class="compare-item-icon">📞</span>
                            <div>
                                <div class="compare-item-label">Contact commercial</div>
                                <div class="compare-item-value compare-item-value--good">Bouton d'appel smartphone &amp; devis direct</div>
                            </div>
                        </div>"""
    )

    content = content.replace(
        "Je développe votre site à la main. Code ultra-léger, Google PageSpeed 100/100, vitesse &lt; 0.4s et responsive mobile taillé pour convertir vos visiteurs.",
        "Je conçois votre vitrine sur-mesure, livrée en 48h. Vos chantiers mis en valeur, bouton d'appel direct sur smartphone et formulaire de devis pour convertir les particuliers du coin."
    )

    content = content.replace(
        "<span>Vitesse Google chirurgicale &lt; 0.4s (Score 100/100)</span>",
        "<span>Site moderne clé en main, prêt pour vos demandes de devis</span>"
    )

    return content

def clean_index(content):
    # Meta description
    content = content.replace(
        "Vitesse < 0.3s, 0 € en création, liberté totale sans engagement.",
        "0 € en création, livré en 48h, liberté totale sans engagement."
    )
    content = content.replace(
        "Vitesse d'affichage < 0.4s, Google PageSpeed 100/100, sémantique Hn optimisée.",
        "Conception de vitrine sur-mesure pour artisans, mise en valeur des chantiers et demandes de devis directes."
    )

    # Replace Achille tab in portal
    content = content.replace(
        """                        <button type="button" class="cs-portal-tab-btn" id="portalTabAchille" onclick="switchPortalSite('achille')" title="Afficher Achille.ai">
                            <img src="assets/achille-logo.png" alt="" class="cs-portal-tab-icon cs-portal-tab-icon--achille">
                            <span>Achille.ai</span>
                        </button>""",
        """                        <button type="button" class="cs-portal-tab-btn" id="portalTabAchille" onclick="switchPortalSite('votresite')" title="Afficher Vitrine Artisanale">
                            <span class="cs-portal-seal" style="background: #ED5B04; color: #FAF8F5; font-weight: 800;">🔨</span>
                            <span>Vitrine Artisanale</span>
                        </button>"""
    )

    # Replace Achille Window in hero desktop
    content = content.replace(
        """                            <!-- Fenêtre 2 : Achille.ai -->
                            <div id="bureauWinAchille" class="bureau-window" style="top: 15px; right: 20px; width: clamp(310px, 46%, 490px); height: clamp(250px, 40vh, 340px); transform: rotate(1.8deg); z-index: 13;">
                                <div class="bureau-window-bar">
                                    <div class="cs-traffic-lights cs-dots">
                                        <button type="button" class="cs-dot cs-dot--red bureau-win-close" aria-label="Fermer"></button>
                                        <button type="button" class="cs-dot cs-dot--yellow bureau-win-min" aria-label="Minimiser"></button>
                                        <button type="button" class="cs-dot cs-dot--green bureau-win-max" data-site="achille" aria-label="Plein écran"></button>
                                    </div>
                                    <div class="cs-url-bar">
                                        <svg class="cs-url-lock-svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <span class="cs-url-text">achille.ai</span>
                                    </div>
                                    <button type="button" class="bureau-expand-pill" data-site="achille" title="Agrandir en plein écran">
                                        <span>Agrandir</span>
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </button>
                                </div>
                                <div class="bureau-window-body">
                                    <div class="bureau-window-iframe-shield"></div>
                                    <iframe src="showcase-achille.html" title="Aperçu Achille.ai" loading="lazy"></iframe>
                                </div>
                            </div>""",
        """                            <!-- Fenêtre 2 : Vitrine Artisanale -->
                            <div id="bureauWinAchille" class="bureau-window" style="top: 15px; right: 20px; width: clamp(310px, 46%, 490px); height: clamp(250px, 40vh, 340px); transform: rotate(1.8deg); z-index: 13;">
                                <div class="bureau-window-bar">
                                    <div class="cs-traffic-lights cs-dots">
                                        <button type="button" class="cs-dot cs-dot--red bureau-win-close" aria-label="Fermer"></button>
                                        <button type="button" class="cs-dot cs-dot--yellow bureau-win-min" aria-label="Minimiser"></button>
                                        <button type="button" class="cs-dot cs-dot--green bureau-win-max" data-site="votresite" aria-label="Plein écran"></button>
                                    </div>
                                    <div class="cs-url-bar">
                                        <svg class="cs-url-lock-svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <span class="cs-url-text">artisan-haut-anjou.fr</span>
                                    </div>
                                    <button type="button" class="bureau-expand-pill" data-site="votresite" title="Agrandir en plein écran">
                                        <span>Agrandir</span>
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </button>
                                </div>
                                <div class="bureau-window-body">
                                    <div class="bureau-window-iframe-shield"></div>
                                    <iframe src="showcase-votre-site.html" title="Aperçu Vitrine Artisanale" loading="lazy"></iframe>
                                </div>
                            </div>"""
    )

    # Dock button 1
    content = content.replace(
        """                        <button type="button" class="cs-dock-app-btn" id="dockBtn1" onclick="toggleDockApp(1)" aria-label="Achille.ai" aria-selected="false">
                            <span class="cs-dock-tooltip">Achille.ai</span>
                            <div class="cs-dock-icon-box">
                                <img src="assets/achille-logo.png" alt="Achille.ai" class="cs-dock-img cs-dock-img--achille">
                            </div>
                            <span class="cs-dock-indicator"></span>
                        </button>""",
        """                        <button type="button" class="cs-dock-app-btn" id="dockBtn1" onclick="toggleDockApp(1)" aria-label="Vitrine Artisanale" aria-selected="false">
                            <span class="cs-dock-tooltip">Vitrine Artisanale</span>
                            <div class="cs-dock-icon-box" style="background: #ED5B04; color: #FAF8F5; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                                <span>🔨</span>
                            </div>
                            <span class="cs-dock-indicator"></span>
                        </button>"""
    )

    # Marquee track
    content = content.replace("Google PageSpeed 100/100", "Prêt en 48h Clé en Main")
    content = content.replace("Vitesse Chirurgicale &lt; 0.4s", "Demandes de Devis Directes")

    return content

def clean_creation_segre(content):
    content = content.replace(
        "Vitesse chirurgicale &lt; 0.3s, Google 100/100, 0 € de création d'agence pour artisans, PME et commerces du Segréen et Haut-Anjou. 100% propriétaire.",
        "0 € de création d'agence pour artisans, PME et commerces du Segréen et Haut-Anjou. Prêt en 48h, 100% propriétaire sans abonnement captif."
    )
    content = content.replace(
        "Vitesse chirurgicale < 0.3s, Google 100/100, 0 € de création d'agence pour artisans, PME et commerces du Segréen et Haut-Anjou. 100% propriétaire.",
        "0 € de création d'agence pour artisans, PME et commerces du Segréen et Haut-Anjou. Prêt en 48h, 100% propriétaire sans abonnement captif."
    )

    # Comparison metrics
    content = content.replace(
        """                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Temps de chargement :</span>
                                    <span class="segre-metric-val">3.8 à 5.2 secondes</span>
                                </div>
                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Score Google PageSpeed :</span>
                                    <span class="segre-metric-val">38 / 100 (Pénalisé)</span>
                                </div>""",
        """                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Délai de mise en ligne :</span>
                                    <span class="segre-metric-val">2 à 4 mois d'attente</span>
                                </div>
                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Capture de clients :</span>
                                    <span class="segre-metric-val">Formulaire passif sans appel direct</span>
                                </div>"""
    )

    content = content.replace(
        """                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Temps de chargement :</span>
                                    <span class="segre-metric-val">&lt; 0.28 seconde (Instant)</span>
                                </div>
                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Score Google PageSpeed :</span>
                                    <span class="segre-metric-val">100 / 100 (Optimal)</span>
                                </div>""",
        """                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Délai de mise en ligne :</span>
                                    <span class="segre-metric-val">Prêt en 48 heures chrono</span>
                                </div>
                                <div class="segre-metric-row">
                                    <span class="segre-metric-label">Capture de clients :</span>
                                    <span class="segre-metric-val">Bouton d'appel mobile &amp; devis direct</span>
                                </div>"""
    )

    return content

def clean_showcase_votre_site(content):
    content = content.replace(
        """      <div class="pillar-card">
        <div class="pillar-kpi">&lt; 0.3s</div>
        <div class="pillar-title">Vitesse Pure</div>
        <div class="pillar-desc">Score 100/100 Google PageSpeed, zéro framework lourd.</div>
      </div>""",
        """      <div class="pillar-card">
        <div class="pillar-kpi">48h</div>
        <div class="pillar-title">Clé en Main</div>
        <div class="pillar-desc">Votre vitrine déployée sans effort, prête à recevoir des demandes de devis.</div>
      </div>"""
    )
    return content

def clean_showcase_astra(content):
    content = content.replace(
        "Temps de chargement &lt; 0.3s • PageSpeed 100/100",
        "Vitrine Pro Clé en Main • 100% Propriétaire"
    )
    return content

def process_file(path):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    orig = content
    if "commander.html" in path:
        content = clean_commander(content)
    if "index.html" in path and "commander" not in path:
        content = clean_index(content)
    if "creation-site-internet-segre.html" in path:
        content = clean_creation_segre(content)
    if "showcase-votre-site.html" in path:
        content = clean_showcase_votre_site(content)
    if "showcase-astra.html" in path or "showcase/astra" in path:
        content = clean_showcase_astra(content)

    if content != orig:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Nettoyé : {path}")
    else:
        print(f"ℹ️ Aucun changement dans {path}")

def main():
    print("=== ÉLIMINATION DES ARGUMENTS TECHNIQUES & ACHILLE.AI ===")
    for p in FILES:
        process_file(p)
    print("=== OPÉRATION TERMINÉE ===")

if __name__ == "__main__":
    main()

