# Boubane — Système de Design (DESIGN.md)

Ce système de design est dérivé exclusivement de la couleur dominante du logo Boubane : **`#ED5B04`** (Orange vif).  
Toutes les teintes (fond, texte, bordures, ombres, rayons) sont harmonisées avec cette teinte primaire selon l'approche **Surface-First** (Surface Decide / Learn pour une landing page de studio digital d'élite et d'architectures IA pour entreprises ambitieuses).

```yaml
meta:
  name: "Boubane Design System"
  version: "1.0.0"
  primaryColor: "#ED5B04"
  surfaceType: "Decide / Learn"

colors:
  primary: "#ED5B04"
  primary-hover: "#D64E00"
  primary-active: "#BA4200"
  primary-soft: "#FFF2E8"
  background: "#FFF9F0"
  surface: "#FFFFFF"
  surface-card: "#FFFFFF"
  text: "#1A1A1A"
  text-muted: "#595959"
  muted: "#6B6B6B"
  border: "#ED5B0433"
  border-subtle: "#EADCCF"
  border-focus: "rgb(20, 110, 245)"
  dark-surface: "#141416"
  dark-text: "#F7F7F8"

typography:
  heading:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  subheading:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "Space Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.875rem"
    fontWeight: 700

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"

radius:
  sm: "4px"
  md: "12px"
  lg: "24px"
  xl: "40px"
  pill: "9999px"

shadow:
  low: "0px 1px 2px rgba(0,0,0,0.05)"
  medium: "0px 4px 6px rgba(0,0,0,0.1)"
  high: "0px 8px 16px rgba(0,0,0,0.15)"
  colored: "0px 6px 16px rgba(237, 91, 4, 0.25)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{radius.md}"
    padding: "12px 24px"
    minHeight: "44px"
    fontWeight: "600"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    border: "1px solid {colors.border}"
    rounded: "{radius.md}"
    padding: "12px 24px"
    minHeight: "44px"
    fontWeight: "600"
  card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{radius.lg}"
    padding: "{spacing.md}"
    shadow: "{shadow.low}"
  badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    border: "1px solid {colors.border}"
    rounded: "{radius.pill}"
    padding: "4px 12px"

breakpoints:
  mobile-small: "< 479px"
  mobile: "479px - 767px"
  tablet: "768px - 991px"
  desktop: ">= 992px"

accessibility:
  wcagContrast: "AA compliant (>= 4.5:1)"
  touchTargetMin: "44px"
  focusVisible: "2px solid rgb(20, 110, 245) with 2px offset"
  reducedMotion: "Supported via @media (prefers-reduced-motion: reduce)"
```
