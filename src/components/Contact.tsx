"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

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
            className="text-center mb-12"
          >
            <span className="text-micro uppercase tracking-[0.2em] text-text-muted block mb-4">
              Démarrer
            </span>
            <h2 className="heading-section mb-5">
              Déployez votre agent
            </h2>
            <p className="text-body">
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
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check size={20} className="text-success" />
              </div>
              <h3 className="heading-card mb-2">Message envoyé</h3>
              <p className="text-small">
                Merci. On vous répond sous 24h ouvrées.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="card p-6 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-micro text-text-muted block mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="text-micro text-text-muted block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="jean@entreprise.fr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-micro text-text-muted block mb-1.5">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="input"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="text-micro text-text-muted block mb-1.5">
                    Configuration souhaitée
                  </label>
                  <select
                    name="config"
                    value={form.config}
                    onChange={handleChange}
                    className="input"
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
                <label className="text-micro text-text-muted block mb-1.5">
                  Votre besoin
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="input resize-none"
                  placeholder="Décrivez votre activité, vos besoins, ce que vous voulez automatiser..."
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Envoyer
                <ArrowRight size={14} />
              </button>

              <p className="text-micro text-center">
                Réponse garantie sous 24h. Pas de spam.
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
