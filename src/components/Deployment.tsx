"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Mail, FileText, BarChart3, MessageSquare, ArrowDown, ArrowRight, Lock, Wifi } from "lucide-react";

export default function Deployment() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
            Architecture
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
            Comment ça marche
          </h2>
          <p className="text-[0.95rem] text-text-secondary max-w-lg mx-auto">
            L&apos;agent s&apos;installe sur votre hardware et se connecte à vos outils existants. 
            Rien ne change pour votre équipe.
          </p>
        </motion.div>

        {/* Flow diagram — desktop */}
        <div className="hidden md:block max-w-5xl mx-auto">
          {/* Row 1: Hardware → Agent */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Hardware */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-5 w-56 text-center"
            >
              <Server size={20} className="text-text-secondary mx-auto mb-3" />
              <p className="text-[13px] font-semibold text-text mb-1">Votre hardware</p>
              <p className="text-[11px] text-text-muted">Mac Mini / NUC / Serveur</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Lock size={9} className="text-[#30a46c]" />
                <span className="text-[9px] text-[#30a46c]">Chez vous</span>
              </div>
            </motion.div>

            {/* Connection */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-px w-16 bg-border" />
              <span className="text-[9px] text-text-dim">LAN</span>
              <div className="h-px w-16 bg-border" />
            </div>

            {/* Agent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-5 w-64 text-center border-[#5e6ad2]/20"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center mx-auto mb-3">
                <Monitor size={18} className="text-[#5e6ad2]" />
              </div>
              <p className="text-[13px] font-semibold text-text mb-0.5">ORCHESTRATOR</p>
              <p className="text-[11px] text-text-muted">Agent principal</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30a46c]" />
                <span className="text-[9px] text-[#30a46c]">Actif</span>
              </div>
            </motion.div>

            {/* Connection */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-px w-16 bg-border" />
              <span className="text-[9px] text-text-dim">API / IMAP</span>
              <div className="h-px w-16 bg-border" />
            </div>

            {/* Internet (optional) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-5 w-44 text-center opacity-60"
            >
              <Wifi size={16} className="text-text-dim mx-auto mb-2" />
              <p className="text-[12px] font-medium text-text-muted mb-0.5">Internet</p>
              <p className="text-[10px] text-text-dim">Optionnel</p>
              <p className="text-[8px] text-text-dim mt-1">Clés API ou offline</p>
            </motion.div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center mb-6">
            <ArrowDown size={16} className="text-text-dim" />
          </div>

          {/* Row 2: Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {[
              { icon: Mail, label: "Emails", sub: "IMAP/SMTP" },
              { icon: FileText, label: "Documents", sub: "PDF/Word" },
              { icon: BarChart3, label: "Données", sub: "CRM/ERP" },
              { icon: MessageSquare, label: "Chat", sub: "Slack/Web" },
            ].map((tool) => (
              <div key={tool.label} className="card px-5 py-3 flex items-center gap-3">
                <tool.icon size={14} className="text-text-muted" />
                <div>
                  <p className="text-[12px] font-medium text-text">{tool.label}</p>
                  <p className="text-[9px] text-text-dim">{tool.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile flow */}
        <div className="md:hidden space-y-3 max-w-sm mx-auto">
          {[
            { icon: Server, title: "Votre hardware", sub: "Mac Mini / NUC / Serveur", badge: "Chez vous" },
            { icon: Monitor, title: "Agent ORCHESTRATOR", sub: "Installé localement", badge: "100% local", accent: true },
            { icon: Mail, title: "Vos outils", sub: "Emails, CRM, Slack, fichiers...", badge: "Connecté" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`card p-4 flex items-center gap-4 ${item.accent ? "border-[#5e6ad2]/20" : ""}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.accent ? "bg-[#5e6ad2]/10" : "bg-surface-light border border-border"}`}>
                  <item.icon size={16} className={item.accent ? "text-[#5e6ad2]" : "text-text-secondary"} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-text">{item.title}</p>
                  <p className="text-[11px] text-text-muted">{item.sub}</p>
                </div>
                <span className="text-[9px] text-[#30a46c]">{item.badge}</span>
              </div>
              {i < 2 && (
                <div className="flex justify-center py-1">
                  <ArrowDown size={12} className="text-text-dim" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Key point */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-1.5">
              <Lock size={10} className="text-[#30a46c]" />
              <span className="text-[11px] text-text-secondary">Données 100% locales</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px] text-text-dim">Internet optionnel</span>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px] text-text-dim">RGPD natif</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
