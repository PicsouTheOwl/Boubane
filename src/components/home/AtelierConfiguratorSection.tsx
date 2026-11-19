"use client";

import React, { useEffect, useState } from "react";
import { AUTOMATION_MODULES } from "@/data/automations";
import { AtelierReveal } from "@/components/AtelierPrimitives";
import { AtelierModuleList } from "@/components/AtelierModuleList";
import { AtelierProjectSummary } from "@/components/AtelierProjectSummary";

export function AtelierConfiguratorSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "site-web",
    "assistant-mails",
  ]);

  useEffect(() => {
    const onSelectModule = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id || id === "site-web") return;
      const isValid = AUTOMATION_MODULES.some((m) => m.id === id);
      if (!isValid) return;

      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    window.addEventListener("boubane:select-module", onSelectModule);
    return () =>
      window.removeEventListener("boubane:select-module", onSelectModule);
  }, []);

  const toggleModule = (id: string) => {
    if (id === "site-web") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectedModules = AUTOMATION_MODULES.filter((m) =>
    selectedIds.includes(m.id)
  );

  const queryParams = selectedIds
    .filter((id) => id !== "site-web")
    .join(",");
  const orderUrl = queryParams
    ? `/commander?modules=${encodeURIComponent(queryParams)}`
    : "/commander";

  return (
    <section
      id="configurateur"
      className="relative py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#0C0A08]/[0.07]"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <AtelierReveal className="max-w-2xl mb-10 sm:mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04] font-semibold">
            AUTOMATISATIONS &amp; IA
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[clamp(1.9rem,3.6vw,2.65rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#0C0A08]">
            Le site reste à 0&nbsp;€. Ajoutez l&apos;IA à prix fixe.
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.65] text-[#57534E] max-w-[50ch]">
            Composez vos modules. Sans abonnement, installé à votre nom.
          </p>
        </AtelierReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <AtelierModuleList
              selectedIds={selectedIds}
              onToggle={toggleModule}
            />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <AtelierProjectSummary
              mode="configurator"
              selectedModules={selectedModules}
              orderUrl={orderUrl}
              onRemoveModule={toggleModule}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
