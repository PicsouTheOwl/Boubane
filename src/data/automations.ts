export interface AutomationModule {
  id: string;
  hook: string;
  name: string;
  description: string;
  metric: string;
  price: number;
  marketPrice: number; // Prix agence concurrente type Mushrooms
  iconName: "Globe" | "Mail" | "Receipt" | "BarChart3" | "PhoneCall" | "Users";
  includedByDefault?: boolean;
  isFree?: boolean;
  category: "site" | "ia";
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: "site-web",
    hook: "« Mon site actuel est lent ou inexistant »",
    name: "Site Web Vitrine Haute Précision",
    description:
      "Un site moderne, ultra-rapide sur mobile, pensé pour générer des appels et demandes de devis. Écrit directement avec vous.",
    metric: "Livré en 5 jours ouvrés",
    price: 0,
    marketPrice: 2400,
    iconName: "Globe",
    includedByDefault: true,
    isFree: true,
    category: "site",
  },
  {
    id: "assistant-mails",
    hook: "« Je croule sous les mails et demandes »",
    name: "Assistant Mails & Réponses IA",
    description:
      "Vos emails entrants triés par priorité et vos réponses préparées en brouillon. Vous relisez, vous validez : rien ne part sans votre accord.",
    metric: "≈ 300 h par an récupérées",
    price: 390,
    marketPrice: 1900,
    iconName: "Mail",
    category: "ia",
  },
  {
    id: "facturation-relances",
    hook: "« Mes relances de devis et factures traînent »",
    name: "Facturation & Relances Automatiques",
    description:
      "Devis accepté automatiquement converti en facture, relances des impayés programmées avec tact et suivi bancaire synchronisé.",
    metric: "1 à 3 jours par mois sauvés",
    price: 390,
    marketPrice: 1800,
    iconName: "Receipt",
    category: "ia",
  },
  {
    id: "tableau-bord",
    hook: "« Je n'ai aucune vue directe sur mes chiffres »",
    name: "Tableau de Bord & Trésorerie Directe",
    description:
      "Tous vos chiffres (entrées, devis en cours, factures en attente, solde) au même endroit en temps réel, sans aucune double saisie.",
    metric: "Vos chiffres clés en 10 secondes",
    price: 590,
    marketPrice: 2900,
    iconName: "BarChart3",
    category: "ia",
  },
  {
    id: "assistant-vocal",
    hook: "« Je rate des appels sur chantier ou en clientèle »",
    name: "Assistant Vocal Téléphonique 24/7",
    description:
      "Un agent vocal décroche avec une voix naturelle, qualifie la demande (urgence, coordonnées, type de travaux) et vous transmet le résumé par SMS/WhatsApp.",
    metric: "Zéro prospect perdu",
    price: 690,
    marketPrice: 2600,
    iconName: "PhoneCall",
    category: "ia",
  },
  {
    id: "crm-sur-mesure",
    hook: "« Je note tout sur des carnets ou WhatsApp »",
    name: "CRM Métier & Suivi Chantiers",
    description:
      "Un espace centralisé taillé pour votre façon de travailler : fiches clients, historique des échanges, devis et statut des chantiers sans usine à gaz.",
    metric: "Fin définitive de la double saisie",
    price: 790,
    marketPrice: 3900,
    iconName: "Users",
    category: "ia",
  },
];
