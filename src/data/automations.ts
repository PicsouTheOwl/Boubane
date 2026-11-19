export interface AutomationModule {
  id: string;
  hook: string;
  name: string;
  description: string;
  metric: string;
  price: number;
  marketPrice: number; // Tarif moyen constaté en agence
  iconName: "Globe" | "Mail" | "Receipt" | "BarChart3" | "PhoneCall" | "Users";
  includedByDefault?: boolean;
  isFree?: boolean;
  category: "site" | "ia";
}

/**
 * Deterministic currency formatting (avoids Node vs browser locale space mismatch during SSR hydration).
 */
export function formatAmount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: "site-web",
    hook: "Présence en ligne",
    name: "Site vitrine",
    description: "Design sur mesure, rapide sur mobile, livré en 5 jours.",
    metric: "Livré en 5 jours",
    price: 0,
    marketPrice: 2400,
    iconName: "Globe",
    includedByDefault: true,
    isFree: true,
    category: "site",
  },
  {
    id: "assistant-mails",
    hook: "Boîte de réception",
    name: "Assistant mails",
    description: "Mails triés et brouillons prêts. Vous validez avant envoi.",
    metric: "~300 h / an gagnées",
    price: 390,
    marketPrice: 1900,
    iconName: "Mail",
    category: "ia",
  },
  {
    id: "facturation-relances",
    hook: "Trésorerie",
    name: "Facturation & relances",
    description: "Devis convertis en factures et relances d'impayés automatiques.",
    metric: "1 à 3 j / mois sauvés",
    price: 390,
    marketPrice: 1800,
    iconName: "Receipt",
    category: "ia",
  },
  {
    id: "tableau-bord",
    hook: "Pilotage",
    name: "Tableau de bord",
    description: "CA, devis en cours et trésorerie réunis sur un seul écran.",
    metric: "Chiffres en direct",
    price: 590,
    marketPrice: 2900,
    iconName: "BarChart3",
    category: "ia",
  },
  {
    id: "assistant-vocal",
    hook: "Standard 24/7",
    name: "Assistant vocal",
    description: "Décroche vos appels manqués, qualifie et résume par SMS.",
    metric: "Zéro appel perdu",
    price: 690,
    marketPrice: 2600,
    iconName: "PhoneCall",
    category: "ia",
  },
  {
    id: "crm-sur-mesure",
    hook: "Suivi clients",
    name: "CRM sur mesure",
    description: "Clients, chantiers et devis centralisés sans double saisie.",
    metric: "Zéro ressaisie",
    price: 790,
    marketPrice: 3900,
    iconName: "Users",
    category: "ia",
  },
];
