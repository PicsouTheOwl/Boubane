# Boubane — Système de Design & Charte Graphique Web (DESIGN.md)

Ce système de design est dérivé directement de la couleur et de l'énergie du logo Boubane : **`#EE5A00`** / **`#ED5B04`** (Orange incandescent & silhouette de chouette totem).  
Il intègre les standards contemporains du web d'élite (shadcn/ui, Linear, Vercel) et respecte rigoureusement les normes d'accessibilité **WCAG 2.1 AA / AAA**.

---

## Spécification YAML des Tokens

```yaml
meta:
  name: "Boubane Design System"
  version: "2.0.0"
  primaryColor: "#EE5A00"
  primaryTone: "Incandescent Orange"
  wcagCompliance: "WCAG 2.1 AA / AAA"

colors:
  primary: "#EE5A00"
  primary-hover: "#D84C00"
  primary-active: "#B83E00"
  primary-accessible: "#9A3412" # Conforme AA pour texte normal sur fond clair
  primary-soft: "rgba(238, 90, 0, 0.08)"
  
  # Neutres & Surfaces
  background: "#FAFAFA"
  surface: "#FFFFFF"
  surface-hover: "#F4F4F5"
  surface-muted: "#F4F4F5"
  text: "#09090B"
  text-muted: "#52525B"
  text-subtle: "#71717A"
  
  # Bordures & Séparateurs
  border-subtle: "#E4E4E7"
  border-strong: "#D4D4D8"
  border-focus: "#EE5A00"
  
  # Mode Sombre
  dark-background: "#09090B"
  dark-surface: "#121215"
  dark-surface-hover: "#1A1A1E"
  dark-border: "#27272A"
  dark-text: "#FAFAFA"
  dark-text-muted: "#A1A1AA"

  # Sémantique
  success: "#10B981"
  success-text: "#047857"
  destructive: "#EF4444"
  destructive-text: "#B91C1C"
  warning: "#F59E0B"
  warning-text: "#B45309"
  info: "#0EA5E9"
  info-text: "#0369A1"

typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    googleFont: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  subheading:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, Inter, sans-serif"
    googleFont: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Geist, Inter, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "Geist Mono, Space Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 600

radius:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  pill: "9999px"

shadows:
  level-1: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  level-2: "0 8px 24px -4px rgba(0, 0, 0, 0.08)"
  level-3: "0 20px 48px -8px rgba(0, 0, 0, 0.16)"
  brand-glow: "0 0 0 3px rgba(238, 90, 0, 0.20), 0 8px 20px -2px rgba(238, 90, 0, 0.28)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    hoverColor: "{colors.primary-hover}"
    rounded: "{radius.sm}"
    padding: "12px 24px"
    minHeight: "44px"
    fontWeight: "600"
    shadow: "{shadows.level-1}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    rounded: "{radius.sm}"
    padding: "12px 24px"
    minHeight: "44px"
    fontWeight: "600"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-subtle}"
    rounded: "{radius.lg}"
    padding: "24px"
    shadow: "{shadows.level-1}"
```
