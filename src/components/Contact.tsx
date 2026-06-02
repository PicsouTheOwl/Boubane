"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Mail, MessageSquare, Building2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API route
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Parlons de votre
            <br />
            <span className="gradient-text">projet IA</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Décrivez-nous votre besoin et recevez une proposition personnalisée sous 24h.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Mail size={20} className="text-primary-light" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-text-muted text-sm">contact@boubane.ai</p>
                </div>
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <MessageSquare size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Réponse garantie</p>
                  <p className="text-text-muted text-sm">Sous 24h ouvrées</p>
                </div>
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <Building2 size={20} className="text-success" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Basé en France</p>
                  <p className="text-text-muted text-sm">Données hébergées en EU</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="gradient-border rounded-2xl p-12 text-center"
              >
                <CheckCircle2 size={64} className="text-success mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">Message envoyé !</h3>
                <p className="text-text-muted">
                  Merci pour votre message. Nous vous répondrons sous 24h.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="gradient-border rounded-2xl p-8">
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-foreground placeholder-text-dim focus:outline-none focus:border-primary transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-foreground placeholder-text-dim focus:outline-none focus:border-primary transition-colors"
                      placeholder="jean@entreprise.fr"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-foreground placeholder-text-dim focus:outline-none focus:border-primary transition-colors"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Service souhaité
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="agent-metier">Agent IA Métier</option>
                      <option value="support">Support Client IA</option>
                      <option value="analyse">Analyse & Reporting</option>
                      <option value="automatisation">Automatisation Workflow</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Votre message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-foreground placeholder-text-dim focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send size={18} />
                  Envoyer le message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
