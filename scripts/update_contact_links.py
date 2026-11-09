#!/usr/bin/env python3
"""
Systematic updater for phone numbers, WhatsApp links, and Cal.com integration
across all Boubane website files.
"""

import os
import re

NEW_PHONE_INT = "+33778310346"
NEW_PHONE_NAT = "07 78 31 03 46"
NEW_WA_INT = "33778310346"
CALCOM_URL = "https://rdv.boubane.com/boubane"

TARGET_FILES = [
    "index.html",
    "site/index.html",
    "commander.html",
    "site/commander.html",
    "creation-site-internet-segre.html",
    "site/creation-site-internet-segre.html",
    "blog.html",
    "site/blog.html",
    "hebergement.html",
    "site/hebergement.html",
    "hebergement-succes.html",
    "site/hebergement-succes.html",
    "dashboard.html",
    "site/dashboard.html",
]

def update_file(path):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    orig_content = content

    # 1. Replace fake WhatsApp numbers
    content = content.replace("wa.me/33600000000", f"wa.me/{NEW_WA_INT}")
    content = content.replace("wa.me/33663934704", f"wa.me/{NEW_WA_INT}")
    
    # 2. Replace old phone numbers in tel links and JSON-LD
    content = content.replace("+33663934704", NEW_PHONE_INT)
    content = content.replace("06 63 93 47 04", NEW_PHONE_NAT)

    # 3. Add Cal.com CTA in index.html hero if not present
    if "index.html" in path and CALCOM_URL not in content:
        # Look for hero-split-actions
        hero_target = """                    <div class="hero-split-actions">
                        <a href="/commander" class="btn-ramp-cta btn-magnetic" aria-label="Commander mon site offert (0 €)">
                            <span>Commander mon site (0 €)</span>
                            <span class="btn-arrow-double" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                            </span>
                        </a>
                    </div>"""
        
        hero_replacement = """                    <div class="hero-split-actions" style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
                        <a href="/commander" class="btn-ramp-cta btn-magnetic" aria-label="Commander mon site offert (0 €)">
                            <span>Commander mon site (0 €)</span>
                            <span class="btn-arrow-double" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                            </span>
                        </a>
                        <a href="https://rdv.boubane.com/boubane" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-magnetic" style="font-size: 0.95rem; padding: 13px 20px; display: inline-flex; align-items: center; gap: 8px; border-color: rgba(237, 91, 4, 0.35); color: var(--color-primary);" aria-label="Prendre rendez-vous avec Léo (10 min)">
                            <span>📅 Prendre RDV (10 min)</span>
                        </a>
                    </div>"""
        if hero_target in content:
            content = content.replace(hero_target, hero_replacement)
            print(f"[{path}] Hero Cal.com CTA added!")
        else:
            print(f"[{path}] Hero target not matched exactly, checking contact section...")

    # 4. Add Cal.com CTA in index.html contact section
    if "index.html" in path and 'rdv.boubane.com' not in content:
        contact_target = """                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <a href="mailto:leosaillour@gmail.com?subject=Projet%20Site%20Vitrine%20Offert%20-%20Boubane%20Studio" class="btn btn-secondary" style="padding: 7px 12px; font-size: 0.78rem;" aria-label="Écrire un email direct à Léo">
                            <span>✉ leosaillour@gmail.com</span>
                        </a>"""
        contact_replacement = f"""                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <a href="{CALCOM_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 7px 12px; font-size: 0.78rem; color: #2563EB; border-color: rgba(37, 99, 235, 0.35);" aria-label="Réserver un créneau de 10 min sur Cal.com">
                            <span>📅 Réserver un créneau (10 min)</span>
                        </a>
                        <a href="tel:{NEW_PHONE_INT}" class="btn btn-secondary" style="padding: 7px 12px; font-size: 0.78rem;" aria-label="Appeler Léo au {NEW_PHONE_NAT}">
                            <span>📞 {NEW_PHONE_NAT}</span>
                        </a>
                        <a href="mailto:leosaillour@gmail.com?subject=Projet%20Site%20Vitrine%20Offert%20-%20Boubane%20Studio" class="btn btn-secondary" style="padding: 7px 12px; font-size: 0.78rem;" aria-label="Écrire un email direct à Léo">
                            <span>✉ leosaillour@gmail.com</span>
                        </a>"""
        if contact_target in content:
            content = content.replace(contact_target, contact_replacement)
            print(f"[{path}] Contact section Cal.com CTA added!")

    # 5. Add Cal.com CTA in commander.html confirmation view
    if "commander.html" in path and 'rdv.boubane.com' not in content:
        cmd_target = """                                <a href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20viens%20de%20valider%20ma%20r%C3%A9servation%20de%20site%20offert." target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="color: #16A34A; border-color: rgba(22, 163, 74, 0.3);">
                                    <span>💬 Échanger sur WhatsApp</span>
                                </a>"""
        cmd_replacement = f"""                                <a href="https://wa.me/33778310346?text=Bonjour%20L%C3%A9o%2C%20je%20viens%20de%20valider%20ma%20r%C3%A9servation%20de%20site%20offert." target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="color: #16A34A; border-color: rgba(22, 163, 74, 0.3);">
                                    <span>💬 Échanger sur WhatsApp</span>
                                </a>
                                <a href="{CALCOM_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="color: #2563EB; border-color: rgba(37, 99, 235, 0.35);">
                                    <span>📅 Caler l'appel de cadrage (10 min)</span>
                                </a>"""
        if cmd_target in content:
            content = content.replace(cmd_target, cmd_replacement)
            print(f"[{path}] Commander success view Cal.com CTA added!")

    if content != orig_content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Mis à jour : {path}")
    else:
        print(f"ℹ️ Aucun changement dans : {path}")

def main():
    print("=== DÉBUT DE LA MISE À JOUR DES COORDONNÉES ET LIENS CAL.COM ===")
    for path in TARGET_FILES:
        update_file(path)
    print("=== TERMINÉ ===")

if __name__ == "__main__":
    main()
