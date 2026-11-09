#!/usr/bin/env python3
"""
scripts/remove_emojis.py
Removes all emojis across Boubane website files and replaces them with
clean, executive monochrome SVG micro-icons or clean typography.
Strictly conforms to: "aucun emoji autorisé sur le design du site web".
"""

import os
import re

SVG_CALENDAR_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
SVG_PHONE_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
SVG_CHAT_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
SVG_MAIL_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
SVG_LOCK_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
SVG_UNLOCK_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'
SVG_CLOCK_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
SVG_SMARTPHONE_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
SVG_DOLLAR_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
SVG_CLIPBOARD_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>'
SVG_LIGHTNING_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
SVG_BUILDING_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>'
SVG_GIFT_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>'
SVG_ARROW_RIGHT_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
SVG_HAMMER_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
SVG_WARNING_14 = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'

# Larger SVGs for cards
SVG_ROCKET_CARD = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
SVG_PHONE_CARD = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'

# Wizard choice icons (22x22)
SVG_WIZARD_TOOLS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
SVG_WIZARD_BRIEFCASE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
SVG_WIZARD_BUILDING = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>'
SVG_WIZARD_COMPASS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'


def process_file(filepath):
    if not os.path.isfile(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content

    # 1. index.html & site/index.html
    # Portal Tab 🔨
    content = content.replace(
        '<span class="cs-portal-seal" style="background: #ED5B04; color: #FAF8F5; font-weight: 800;">🔨</span>',
        f'<span class="cs-portal-seal" style="background: #ED5B04; color: #FAF8F5; display: inline-flex; align-items: center; justify-content: center;">{SVG_HAMMER_14}</span>'
    )
    # Dock icon 🔨
    content = content.replace(
        '<span>🔨</span>',
        f'<span style="display: inline-flex; align-items: center; justify-content: center;">{SVG_HAMMER_14}</span>'
    )
    # Buttons with 📅 Prendre RDV
    content = content.replace(
        '<span>📅 Prendre RDV (10 min)</span>',
        f'{SVG_CALENDAR_14}<span>Prendre RDV (10 min)</span>'
    )
    content = content.replace(
        '<span>📅 Réserver un créneau (10 min)</span>',
        f'{SVG_CALENDAR_14}<span>Réserver un créneau (10 min)</span>'
    )
    content = content.replace(
        '<span>📞 07 78 31 03 46</span>',
        f'{SVG_PHONE_14}<span>07 78 31 03 46</span>'
    )
    content = content.replace(
        '<span>💬 WhatsApp Direct</span>',
        f'{SVG_CHAT_14}<span>WhatsApp Direct</span>'
    )
    content = content.replace(
        '<span>✉ leosaillour@gmail.com</span>',
        f'{SVG_MAIL_14}<span>leosaillour@gmail.com</span>'
    )

    # 2. commander.html & site/commander.html
    # Proof cards
    content = content.replace(
        '<div class="proof-card-icon">🚀</div>',
        f'<div class="proof-card-icon">{SVG_ROCKET_CARD}</div>'
    )
    content = content.replace(
        '<div class="proof-card-icon">📞</div>',
        f'<div class="proof-card-icon">{SVG_PHONE_CARD}</div>'
    )
    # Compare table icons
    content = content.replace('<span class="compare-card-icon">🏢</span>', f'<span class="compare-card-icon">{SVG_BUILDING_14}</span>')
    content = content.replace('<span class="compare-card-icon">⚡</span>', f'<span class="compare-card-icon">{SVG_LIGHTNING_14}</span>')
    content = content.replace('<span class="compare-item-icon">⏳</span>', f'<span class="compare-item-icon">{SVG_CLOCK_14}</span>')
    content = content.replace('<span class="compare-item-icon">📱</span>', f'<span class="compare-item-icon">{SVG_SMARTPHONE_14}</span>')
    content = content.replace('<span class="compare-item-icon">💸</span>', f'<span class="compare-item-icon">{SVG_DOLLAR_14}</span>')
    content = content.replace('<span class="compare-item-icon">🔒</span>', f'<span class="compare-item-icon">{SVG_LOCK_14}</span>')
    content = content.replace('<span class="compare-item-icon">📋</span>', f'<span class="compare-item-icon">{SVG_CLIPBOARD_14}</span>')
    content = content.replace('<span class="compare-item-icon">⚡</span>', f'<span class="compare-item-icon">{SVG_LIGHTNING_14}</span>')
    content = content.replace('<span class="compare-item-icon">📞</span>', f'<span class="compare-item-icon">{SVG_PHONE_14}</span>')
    content = content.replace('<span class="compare-item-icon">🎁</span>', f'<span class="compare-item-icon">{SVG_GIFT_14}</span>')
    content = content.replace('<span class="compare-item-icon">🔓</span>', f'<span class="compare-item-icon">{SVG_UNLOCK_14}</span>')
    content = content.replace('<span class="compare-item-icon">🕊</span>', f'<span class="compare-item-icon">{SVG_ARROW_RIGHT_14}</span>')

    # Wizard choices
    content = content.replace('<div class="choice-icon">🪵</div>', f'<div class="choice-icon">{SVG_WIZARD_TOOLS}</div>')
    content = content.replace('<div class="choice-icon">⚖️</div>', f'<div class="choice-icon">{SVG_WIZARD_BRIEFCASE}</div>')
    content = content.replace('<div class="choice-icon">⚖</div>', f'<div class="choice-icon">{SVG_WIZARD_BRIEFCASE}</div>')
    content = content.replace('<div class="choice-icon">🏢</div>', f'<div class="choice-icon">{SVG_WIZARD_BUILDING}</div>')
    content = content.replace('<div class="choice-icon">✨</div>', f'<div class="choice-icon">{SVG_WIZARD_COMPASS}</div>')

    # Commander guarantee text
    content = content.replace(
        '🔒 Zéro spam · Aucun numéro de carte bancaire requis · Réponse directe sous 24h ouvrées.',
        f'{SVG_LOCK_14} Zéro spam · Aucun numéro de carte bancaire requis · Réponse directe sous 24h ouvrées.'
    )
    # Commander success view buttons
    content = content.replace(
        '<span>💬 Échanger sur WhatsApp</span>',
        f'{SVG_CHAT_14}<span>Échanger sur WhatsApp</span>'
    )
    content = content.replace(
        '<span>📅 Caler l\'appel de cadrage (10 min)</span>',
        f'{SVG_CALENDAR_14}<span>Caler l\'appel de cadrage (10 min)</span>'
    )

    # 3. creation-site-internet-segre.html
    content = content.replace(
        '<span>📞 07 78 31 03 46 (Léo Saillour)</span>',
        f'{SVG_PHONE_14}<span>07 78 31 03 46 (Léo Saillour)</span>'
    )
    content = content.replace(
        '<span>💬 Échange Direct WhatsApp</span>',
        f'{SVG_CHAT_14}<span>Échange Direct WhatsApp</span>'
    )

    # 4. blog.html
    content = content.replace(
        '<strong>⚠️ Les 4 clauses léonines récurrentes des contrats locatifs :</strong>',
        f'<strong>{SVG_WARNING_14} Les 4 clauses léonines récurrentes des contrats locatifs :</strong>'
    )

    # 5. hebergement.html & hebergement-succes.html
    content = content.replace(
        '<span>🔒 Paiement sécurisé Stripe</span>',
        f'{SVG_LOCK_14}<span>Paiement sécurisé Stripe</span>'
    )
    content = content.replace(
        '<span>💬 Contacter sur WhatsApp</span>',
        f'{SVG_CHAT_14}<span>Contacter sur WhatsApp</span>'
    )
    content = content.replace(
        '<span>💬 Échanger sur WhatsApp avec Léo</span>',
        f'{SVG_CHAT_14}<span>Échanger sur WhatsApp avec Léo</span>'
    )

    # 6. komponent.js
    content = content.replace(
        'kpi: "⚡ Vitesse : 0.27s · PageSpeed 100/100",',
        'kpi: "Réservations directes · Prêt en 48h",'
    )
    content = content.replace(
        'kpi: "⚡ Vitesse : 0.24s · IA 18ms",',
        'kpi: "Conversion qualifiée · 0 € de création",'
    )
    content = content.replace(
        'kpi: "⚡ Vitesse : < 0.3s · 0 € d\'acompte",',
        'kpi: "Livré sous 48h · 0 € d\'acompte",'
    )

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')
    else:
        print(f'No changes in {filepath}')


if __name__ == '__main__':
    target_files = [
        'index.html',
        'commander.html',
        'blog.html',
        'creation-site-internet-segre.html',
        'hebergement.html',
        'hebergement-succes.html',
        'komponent.js',
        'site/index.html',
        'site/commander.html',
        'site/blog.html',
        'site/creation-site-internet-segre.html',
        'site/hebergement.html',
        'site/hebergement-succes.html',
        'site/komponent.js',
    ]
    for fp in target_files:
        process_file(fp)

