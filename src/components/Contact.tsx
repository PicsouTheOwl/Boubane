"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    config: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] block mb-4">
              Démarrer
            </span>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text mb-4">
              Déployez votre agent
            </h2>
            <p className="text-[0.95rem] text-text-secondary">
              Décrivez-nous votre besoin. On vous répond sous 24h 
              avec une proposition adaptée.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-[#30a46c]/10 flex items-center justify-center mx-auto mb-3">
                <Check size={16} className="text-[#30a46c]" />
              </div>
              <h3 className="text-[15px] font-semibold text-text mb-1">Message envoyé</h3>
              <p className="text-[12px] text-text-muted mb-4">
                Merci. On vous répond sous 24h ouvrées.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", config: "", message: "" }); }}
                className="text-[12px] text-text-secondary hover:text-text transition-colors"
              >
                Envoyer un autre message →
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="card p-5 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-text-muted block mb-1.5">Nom</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-[13px] text-text placeholder-text-dim outline-none focus:border-border-active transition-colors"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-muted block mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-[13px] text-text placeholder-text-dim outline-none focus:border-border-active transition-colors"
                    placeholder="jean@entreprise.fr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-text-muted block mb-1.5">Entreprise</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-[13px] text-text placeholder-text-dim outline-none focus:border-border-active transition-colors"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-muted block mb-1.5">Configuration</label>
                  <select
                    name="config"
                    value={form.config}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-[13px] text-text outline-none focus:border-border-active transition-colors appearance-none"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="essential">Essential — Mac Mini M4</option>
                    <option value="professional">Professional — Mac Mini M4 Pro</option>
                    <option value="enterprise">Enterprise — Serveur sur-mesure</option>
                    <option value="autre">Autre / Je ne sais pas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-text-muted block mb-1.5">Votre besoin</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-[13px] text-text placeholder-text-dim outline-none focus:border-border-active transition-colors resize-none"
                  placeholder="Décrivez votre activité, ce que vous voulez automatiser..."
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-text text-bg font-medium text-[13px] hover:bg-[#f0f0f0] transition-colors"
              >
                Envoyer
                <ArrowRight size={13} />
              </button>

              <p className="text-[10px] text-text-dim text-center">
                Réponse garantie sous 24h. Pas de spam.
              </p>
            </motion.form>
          )}

          {/* Alternative contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="mailto:contact@boubane.ai" className="flex items-center gap-2 text-[12px] text-text-muted hover:text-text-secondary transition-colors">
              <Mail size={12} />
              contact@boubane.ai
            </a>
            <span className="hidden sm:block text-text-dim">·</span>
            <span className="flex items-center gap-2 text-[12px] text-text-muted">
              <MapPin size={12} />
              France
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
