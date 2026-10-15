# Boubane — Système de Design (Design System)

Système de design extrait de **boubane.com**, conçu selon l'approche **Surface-First** pour une landing page de conversion et de réassurance (Decide / Learn).

---

## 1. Tokens de Design (Design Tokens)

### 1.1 Palette de Couleurs (Color Palette)
Les couleurs sont construites autour de l'orange signature du logo chat et de tons organiques contrastés :

| Variable CSS | Valeur Hex / Format | Usage |
| :--- | :--- | :--- |
| `--color-orange` | `#ed5c01` | Couleur d'accent principale, boutons CTA, points focaux |
| `--color-orange-hover` | `#d34e00` | État hover des boutons et éléments interactifs |
| `--color-orange-light` | `#ff7524` | Accents lumineux, dégradés, lueurs d'ambiance |
| `--color-orange-soft` | `#fff1ea` | Fonds de badges, tags, surbrillances douces |
| `--color-orange-border` | `#fecba5` | Bordures de cartes actives, focus states |
| `--color-paper` | `#faf9f8` | Surface principale (fond de page chaud et tactile) |
| `--color-paper-card` | `#ffffff` | Surface de cartes, conteneurs surélevés |
| `--color-ink` | `#0c0d10` | Texte principal, titres, contrastes profonds |
| `--color-ink-card` | `#131418` | Cartes sombres contrastées (bannière finale) |
| `--color-muted` | `#e5e2dc` | Bordures douces, séparateurs de section |
| `--color-text-subtle` | `#5a5a64` | Textes secondaires, légendes, kickers |

### 1.2 Typographie (Typography)

| Variable CSS | Police | Usage |
| :--- | :--- | :--- |
| `--font-serif` | `'Instrument Serif', Georgia, serif` | Titres d'impact (h1, h2), italiques d'emphase |
| `--font-sans` | `'Inter', -apple-system, sans-serif` | Corps de texte, interfaces, boutons, navigation |
| `--font-mono` | `'Space Mono', monospace` | Kickers, chiffres, badges, étiquettes techniques |

### 1.3 Échelle Typographique
- **Display / H1** : `clamp(2.5rem, 6vw, 4.2rem)`, line-height: `1.05`, letter-spacing: `-0.02em`
- **Section Heading / H2** : `clamp(2rem, 4.5vw, 3.2rem)`, line-height: `1.15`
- **Subheading / H3** : `1.25rem - 1.5rem`, font-weight: `600`
- **Body Regular** : `1rem (16px)`, line-height: `1.6`
- **Body Large** : `1.125rem (18px)`, line-height: `1.6`
- **Small / Tag** : `0.75rem - 0.875rem`, font-weight: `600`, uppercase

### 1.4 Espacements & Rayons (Spacing & Radius)
- `--radius-sm`: `6px`
- `--radius-md`: `12px`
- `--radius-lg`: `20px`
- `--radius-pill`: `9999px`
- `--space-unit`: `8px` (multiples: 8px, 16px, 24px, 32px, 48px, 64px, 96px)

### 1.5 Ombres & Élévation (Shadows)
- `--shadow-card`: `0 1px 3px rgba(12, 13, 16, 0.04), 0 10px 30px -10px rgba(12, 13, 16, 0.06)`
- `--shadow-hover`: `0 20px 40px -15px rgba(237, 92, 1, 0.15)`
- `--shadow-button`: `0 4px 14px rgba(237, 92, 1, 0.35)`

---

## 2. Règle « Surface-First »

1. **Surface Principale** : `--color-paper` (`#faf9f8`) crée une sensation chaleureuse d'atelier d'artisan numérique, loin du blanc clinique ou du noir générique.
2. **Surfaces d'Élévation** : `--color-paper-card` (`#ffffff`) avec bordure subtile `--color-muted` pour détacher le contenu sans alourdir.
3. **Surfaces de Conversion** : Ruban fixe en bas de page (`backdrop-filter: blur(12px)`) et modale fluide pour réserver un appel ou échanger directement par WhatsApp/Email.

---

## 3. Composants Clés

- **Navbar** : Logo chat haute fidélité, navigation fluide vers les sections `#offre`, `#pourquoi-gratuit`, `#couts`, `#faq`.
- **Hero** : Proposition de valeur tranchante ("Je crée votre site web gratuitement"), proposition "zéro risque", badge de garantie à vie.
- **Section Coûts Réels** : Clarté totale sur les seuls frais tiers (nom de domaine ~10€/an + hébergement ~5-10€/mois) payés directement aux hébergeurs.
- **Ruban d'Action Flottant** : Bouton d'action directe toujours à portée de main sans bloquer la lecture.
- **Mentions Légales** : Modale accessible intégrée + page dédiée `/mentions-legales` conformes LCEN et RGPD.
