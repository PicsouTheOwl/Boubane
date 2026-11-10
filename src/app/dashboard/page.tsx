"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Download,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Trash2,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import { ATELIER_EASE, ATELIER_SNAPPY_SPRING } from "@/lib/utils";

type TabId = "overview" | "leads" | "automations" | "hosting" | "settings";

interface Lead {
  name: string;
  email: string;
  message: string;
  stage?: string;
  timestamp?: number;
  synced?: boolean;
}

interface SessionRecord {
  id: string;
  source?: string;
  device?: string;
  date?: string;
  path?: string;
}

interface EventRecord {
  name: string;
  date?: string;
  path?: string;
}

interface AutoTask {
  id: string;
  type: string;
  leadName?: string;
  status?: string;
  createdAt?: string;
}

const HOSTING_CLIENTS = [
  {
    domain: "ebenisterie-vaneau.fr",
    client: "Atelier Vaneau",
    since: "12 Oct 2025",
    renew: "12 Oct 2026",
    ssl: "Let's Encrypt Actif",
    price: "15 € / an",
  },
  {
    domain: "valmy-avocats.com",
    client: "Cabinet Valmy",
    since: "04 Nov 2025",
    renew: "04 Nov 2026",
    ssl: "Let's Encrypt Actif",
    price: "15 € / an",
  },
  {
    domain: "apex-logistics.eu",
    client: "Apex Logistics",
    since: "18 Déc 2025",
    renew: "18 Déc 2026",
    ssl: "Let's Encrypt Actif",
    price: "15 € / an",
  },
  {
    domain: "maconnerie-west-anjou.fr",
    client: "Maçonnerie West Anjou",
    since: "15 Jan 2026",
    renew: "15 Jan 2027",
    ssl: "Let's Encrypt Actif",
    price: "15 € / an",
  },
];

const DEFAULT_PIN = "0000";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [locked, setLocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [queue, setQueue] = useState<AutoTask[]>([]);
  const [lcp, setLcp] = useState<string>("210");
  const [cls, setCls] = useState<string>("0.00");
  const [crmWebhook, setCrmWebhook] = useState("https://crm.boubane.com/api/webhook/lead");
  const [searchLead, setSearchLead] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const loadStorageData = () => {
    try {
      const rawLeads = localStorage.getItem("boubane_leads");
      setLeads(rawLeads ? JSON.parse(rawLeads) : []);

      const rawSessions = localStorage.getItem("boubane_analytics_sessions");
      setSessions(rawSessions ? JSON.parse(rawSessions) : []);

      const rawEvents = localStorage.getItem("boubane_analytics_events");
      setEvents(rawEvents ? JSON.parse(rawEvents) : []);

      const rawQueue = localStorage.getItem("boubane_automations_queue");
      setQueue(rawQueue ? JSON.parse(rawQueue) : []);

      setLcp(localStorage.getItem("boubane_cwv_lcp") || "210");
      setCls(localStorage.getItem("boubane_cwv_cls") || "0.00");

      const cfgRaw = localStorage.getItem("boubane_analytics_config");
      if (cfgRaw) {
        const cfg = JSON.parse(cfgRaw);
        if (cfg.crmWebhookUrl) setCrmWebhook(cfg.crmWebhookUrl);
      }
    } catch {}
  };

  useEffect(() => {
    if (sessionStorage.getItem("boubane_dash_locked") === "true") {
      setLocked(true);
    }
    loadStorageData();
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = localStorage.getItem("boubane_dash_pin") || DEFAULT_PIN;
    if (pinInput === expected) {
      sessionStorage.setItem("boubane_dash_locked", "false");
      setLocked(false);
      setPinError(false);
      setPinInput("");
      loadStorageData();
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    sessionStorage.setItem("boubane_dash_locked", "true");
    setLocked(true);
  };

  const saveLeads = (next: Lead[]) => {
    setLeads(next);
    localStorage.setItem("boubane_leads", JSON.stringify(next));
  };

  const injectSampleLead = () => {
    const sample: Lead = {
      name: "Menuiserie Bodin (Demo)",
      email: "contact@menuiserie-bodin.fr",
      message: "[PROJET SITE OFFERT] · Secteur : Artisan BTP · Segré (49500)",
      stage: "NOUVEAU",
      timestamp: Date.now(),
      synced: false,
    };
    saveLeads([sample, ...leads]);
    notify("Prospect démo ajouté au pipeline.");
  };

  const advanceLeadStage = (idx: number) => {
    const stages = ["NOUVEAU", "BRIEF ENVOYÉ", "MAQUETTE", "LIVRÉ"];
    const next = [...leads];
    const cur = next[idx].stage || "NOUVEAU";
    const nextStage = stages[(stages.indexOf(cur) + 1) % stages.length];
    next[idx] = { ...next[idx], stage: nextStage };
    saveLeads(next);
    notify(`Statut mis à jour : ${nextStage}`);
  };

  const pushLeadToCrm = async (idx: number) => {
    const lead = leads[idx];
    try {
      await fetch(crmWebhook, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(lead),
      });
      const next = [...leads];
      next[idx] = { ...next[idx], synced: true };
      saveLeads(next);
      notify(`Lead transmis vers ${crmWebhook}`);
    } catch {
      notify("Erreur lors de la transmission CRM.");
    }
  };

  const deleteLead = (idx: number) => {
    const next = leads.filter((_, i) => i !== idx);
    saveLeads(next);
    notify("Prospect retiré du pipeline.");
  };

  const exportLeadsCsv = () => {
    const header = "Nom,Email,Statut,Message\n";
    const rows = leads
      .map((l) =>
        [l.name, l.email, l.stage || "NOUVEAU", (l.message || "").replace(/\n/g, " ")]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boubane-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveConfig = () => {
    localStorage.setItem("boubane_analytics_config", JSON.stringify({ crmWebhookUrl: crmWebhook }));
    notify("Configuration webhook enregistrée.");
  };

  const filteredLeads = leads.filter(
    (l) =>
      !searchLead.trim() ||
      l.name.toLowerCase().includes(searchLead.toLowerCase()) ||
      l.email.toLowerCase().includes(searchLead.toLowerCase())
  );

  if (locked) {
    return (
      <main className="min-h-screen bg-[#0B0A09] text-[#FAF8F5] flex items-center justify-center p-6">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm rounded-[24px] bg-[#141311] border border-white/[0.1] p-8 text-center space-y-5 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto text-[#ED5B04]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ED5B04]">
              ACCÈS RESTREINT
            </div>
            <h1 className="mt-1 text-xl font-bold">Cockpit Boubane</h1>
          </div>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Code PIN (0000)"
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.12] px-4 py-3 text-center font-mono tracking-[0.3em] text-white focus:border-[#ED5B04] focus:outline-none"
          />
          {pinError && <p className="text-xs text-red-400">Code PIN incorrect.</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-[#ED5B04] text-white py-3 text-sm font-semibold cursor-pointer"
          >
            Déverrouiller
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C0A08]">
      {/* Barre supérieure Exécutive */}
      <header className="sticky top-0 z-30 border-b border-[#0C0A08]/[0.08] bg-[#FAF8F5]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.1em] text-[#0C0A08]/60 hover:text-[#0C0A08]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Site Public</span>
            </Link>
            <span className="h-4 w-px bg-[#0C0A08]/10" />
            <div className="flex items-center gap-2.5">
              <img src="/assets/boubane-logo.png" alt="Boubane" width={24} height={24} className="rounded-md" />
              <span className="font-bold tracking-[-0.02em]">Cockpit Boubane</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#ED5B04]/10 text-[#ED5B04] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase">
                NEXT.JS COCKPIT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadStorageData}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0C0A08]/[0.12] bg-white px-3.5 py-1.5 text-xs font-medium hover:border-[#0C0A08] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0C0A08] text-white px-3.5 py-1.5 text-xs font-medium cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verrouiller</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-10">
        {/* Sélecteur d'Onglets à ressort layoutId */}
        <div className="mb-10 flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#F0ECE3] border border-[#0C0A08]/[0.08] w-fit">
          {(
            [
              { id: "overview", label: "Vue Générale", icon: Activity },
              { id: "leads", label: `Prospects (${leads.length})`, icon: Users },
              { id: "automations", label: "Automatisations", icon: Zap },
              { id: "hosting", label: "Hébergement", icon: Globe },
              { id: "settings", label: "Configuration", icon: Settings },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-[0.06em] cursor-pointer transition-colors ${
                  active ? "text-white" : "text-[#0C0A08]/60 hover:text-[#0C0A08]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cockpitTabPill"
                    transition={ATELIER_SNAPPY_SPRING}
                    className="absolute inset-0 rounded-full bg-[#0C0A08]"
                  />
                )}
                <Icon className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: ATELIER_EASE }}
              className="space-y-8"
            >
              {/* KPIs Sans Cartes Lourdes */}
              <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-[#0C0A08]/[0.09] divide-y lg:divide-y-0 lg:divide-x divide-[#0C0A08]/[0.09] bg-white rounded-2xl border overflow-hidden">
                {[
                  { label: "SESSIONS MESURÉES", val: String(sessions.length), sub: "Télémétrie locale" },
                  { label: "PROSPECTS CAPTÉS", val: String(leads.length), sub: "Formulaires & RDV" },
                  { label: "LCP MOYEN", val: `${lcp} ms`, sub: "Seuil cible < 300 ms" },
                  { label: "CLS STABILITÉ", val: cls, sub: "Zéro décalage visuel" },
                ].map((k) => (
                  <div key={k.label} className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                      {k.label}
                    </div>
                    <div className="mt-2 text-3xl font-bold tracking-[-0.03em] tabular-nums">
                      {k.val}
                    </div>
                    <div className="mt-1 text-xs text-[#57534E]">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Derniers Événements */}
              <div className="rounded-2xl bg-white border border-[#0C0A08]/[0.08] p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45 mb-4">
                  ACTIVITÉ RÉCENTE ({events.length} ÉVÉNEMENTS)
                </div>
                {events.length > 0 ? (
                  <div className="divide-y divide-[#0C0A08]/[0.06] text-sm">
                    {events.slice(-6).reverse().map((ev, i) => (
                      <div key={i} className="py-3 flex items-center justify-between gap-4">
                        <span className="font-mono font-medium text-[#0C0A08]">{ev.name}</span>
                        <span className="font-mono text-xs text-[#57534E]">
                          {ev.path || "/"} · {ev.date || "Aujourd'hui"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#57534E]">
                    Naviguez sur les pages du site pour alimenter la télémétrie en direct.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "leads" && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: ATELIER_EASE }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <input
                  type="text"
                  value={searchLead}
                  onChange={(e) => setSearchLead(e.target.value)}
                  placeholder="Filtrer un prospect..."
                  className="rounded-full border border-[#0C0A08]/[0.12] bg-white px-4 py-2 text-sm w-64 focus:border-[#ED5B04] focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={injectSampleLead}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0C0A08]/[0.12] bg-white px-4 py-2 text-xs font-semibold hover:border-[#0C0A08] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter démo</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportLeadsCsv}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0C0A08] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#0C0A08]/[0.08] divide-y divide-[#0C0A08]/[0.07] overflow-hidden">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, idx) => (
                    <div
                      key={idx}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#0C0A08]">{lead.name}</span>
                          <span className="rounded-full bg-[#FFF2E8] text-[#ED5B04] px-2.5 py-0.5 font-mono text-[10px] font-semibold">
                            {lead.stage || "NOUVEAU"}
                          </span>
                          {lead.synced && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0E7541]">
                              <CheckCircle2 className="w-3 h-3" /> CRM OK
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-[#57534E]">{lead.email}</div>
                        <p className="text-xs text-[#57534E] whitespace-pre-line">{lead.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => advanceLeadStage(idx)}
                          className="rounded-full border border-[#0C0A08]/[0.12] px-3 py-1.5 text-xs font-medium hover:border-[#0C0A08] cursor-pointer"
                        >
                          Avancer étape
                        </button>
                        <button
                          type="button"
                          onClick={() => pushLeadToCrm(idx)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#0C0A08] text-white px-3 py-1.5 text-xs font-medium cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>CRM</span>
                        </button>
                        <button
                          type="button"
                          aria-label="Supprimer"
                          onClick={() => deleteLead(idx)}
                          className="p-2 rounded-full text-[#0C0A08]/40 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-sm text-[#57534E]">
                    Aucun prospect dans le stockage local. Soumettez le tunnel /commander ou
                    ajoutez un prospect démo.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "automations" && (
            <motion.div
              key="automations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: ATELIER_EASE }}
              className="rounded-2xl bg-white border border-[#0C0A08]/[0.08] p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/45">
                  FILE D&apos;AUTOMATISATIONS ({queue.length})
                </span>
              </div>
              {queue.length > 0 ? (
                <div className="divide-y divide-[#0C0A08]/[0.06] text-sm">
                  {queue.map((t, i) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <span className="font-mono font-semibold">{t.type}</span>
                      <span className="font-mono text-xs text-[#57534E]">
                        {t.leadName || t.id} · {t.status || "PLANIFIÉ"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#57534E]">Aucune tâche en attente dans la file.</p>
              )}
            </motion.div>
          )}

          {activeTab === "hosting" && (
            <motion.div
              key="hosting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: ATELIER_EASE }}
              className="rounded-2xl bg-white border border-[#0C0A08]/[0.08] divide-y divide-[#0C0A08]/[0.07]"
            >
              {HOSTING_CLIENTS.map((c) => (
                <div
                  key={c.domain}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-mono font-bold text-sm text-[#0C0A08]">{c.domain}</div>
                    <div className="text-xs text-[#57534E]">
                      {c.client} · Renouvellement {c.renew}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F8EE] text-[#0E7541] px-2.5 py-1">
                      <Shield className="w-3 h-3" /> {c.ssl}
                    </span>
                    <span className="font-semibold">{c.price}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: ATELIER_EASE }}
              className="max-w-xl rounded-2xl bg-white border border-[#0C0A08]/[0.08] p-7 space-y-5"
            >
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#0C0A08]/60 mb-2">
                  URL Webhook CRM Boubane
                </label>
                <input
                  type="url"
                  value={crmWebhook}
                  onChange={(e) => setCrmWebhook(e.target.value)}
                  className="w-full rounded-xl border border-[#0C0A08]/[0.12] bg-[#FAF8F5] px-4 py-2.5 font-mono text-sm"
                />
              </div>
              <button
                type="button"
                onClick={saveConfig}
                className="rounded-full bg-[#0C0A08] text-white px-6 py-2.5 text-sm font-semibold cursor-pointer"
              >
                Enregistrer la configuration
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0C0A08] text-white px-5 py-3 text-xs font-mono shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

