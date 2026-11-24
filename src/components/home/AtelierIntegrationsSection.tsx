"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AtelierReveal } from "@/components/AtelierPrimitives";

interface IntegrationTool {
  name: string;
  role: string;
  logo: string;
}

const TOOLS: IntegrationTool[] = [
  { name: "Gmail", role: "Messagerie", logo: "/logos/gmail.svg" },
  { name: "Outlook", role: "Messagerie", logo: "/logos/outlook.svg" },
  { name: "Google Agenda", role: "Rendez-vous", logo: "/logos/google-calendar.svg" },
  { name: "WhatsApp", role: "Messages & SMS", logo: "/logos/whatsapp.svg" },
  { name: "Excel", role: "Tableurs", logo: "/logos/excel.svg" },
  { name: "Google Sheets", role: "Tableurs", logo: "/logos/google-sheets.svg" },
  { name: "Google Drive", role: "Documents", logo: "/logos/google-drive.svg" },
  { name: "Stripe", role: "Paiements", logo: "/logos/stripe.svg" },
  { name: "HubSpot", role: "CRM", logo: "/logos/hubspot.svg" },
  { name: "Notion", role: "Organisation", logo: "/logos/notion.svg" },
  { name: "Slack", role: "Équipe", logo: "/logos/slack.svg" },
  { name: "Teams", role: "Équipe", logo: "/logos/teams.svg" },
];

export function AtelierIntegrationsSection() {
  return (
    <section
      id="outils"
      className="relative py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <AtelierReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
              VOS OUTILS EXISTANTS
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.85rem,3.6vw,2.55rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
              On se branche sur vos logiciels du quotidien.
            </h2>
            <p className="mt-3.5 text-[0.98rem] sm:text-[1rem] leading-[1.62] text-[#57534E] max-w-[54ch]">
              Gmail, Outlook, Excel, WhatsApp ou votre CRM : rien à remplacer. Vos automatisations s&apos;intègrent directement dans les outils que vous utilisez déjà.
            </p>
          </div>

          <p className="text-[12.5px] font-mono text-[#78716C] shrink-0">
            Aucune migration · Accès sécurisés à votre nom
          </p>
        </AtelierReveal>

        <AtelierReveal delay={0.05}>
          <div className="rounded-[20px] border border-[#0C0A08]/[0.08] bg-[#0C0A08]/[0.07] overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px shadow-[0_14px_36px_-22px_rgba(12,10,8,0.1)]">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="bg-white hover:bg-[#FFFDF9] px-3 py-3.5 sm:px-5 sm:py-5 flex items-center gap-2.5 sm:gap-3.5 transition-colors duration-150"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[11px] sm:rounded-[12px] bg-[#FAF8F5] border border-[#0C0A08]/[0.06] flex items-center justify-center shrink-0">
                  <img
                    src={tool.logo}
                    alt={`Logo ${tool.name}`}
                    width={22}
                    height={22}
                    className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-jakarta)] text-[13px] sm:text-[14.5px] font-semibold tracking-[-0.015em] text-[#0C0A08] truncate">
                    {tool.name}
                  </div>
                  <div className="text-[11.5px] text-[#78716C] truncate">
                    {tool.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AtelierReveal>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-[13px] text-[#57534E]">
          <p>
            Et aussi :{" "}
            <span className="font-medium text-[#0C0A08]">
              Pennylane, Qonto, Brevo, Pipedrive, Shopify, Airtable
            </span>{" "}
            ou tout outil métier avec API.
          </p>
          <Link
            href="/commander"
            className="min-h-[44px] inline-flex items-center gap-1.5 font-semibold text-[#0C0A08] hover:text-[#ED5B04] transition-colors shrink-0"
          >
            <span>Vérifier vos outils</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
