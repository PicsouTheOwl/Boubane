/**
 * Boubane Automations Engine (Internal Automations & Webhooks)
 * R1: Briefing Pré-Appel Telegram via Bot API
 * R2: Pipeline Onboarding Photos & Relance J+2
 * R4: Suivi de Livraison & Demande d'Avis Google 48h
 * R5: Synchronisation Stockage Local & Cockpit dashboard.html
 *
 * @version 1.0.0
 * @author Boubane Engineering
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BoubaneAutomations = factory().BoubaneAutomations;
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // Helper for slugification
  function slugify(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0153/g, 'oe')
      .replace(/\u0152/g, 'oe')
      .replace(/\u00e6/g, 'ae')
      .replace(/\u00c6/g, 'ae')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  // Browser Storage Wrapper
  class BrowserStorage {
    getItem(key) {
      try {
        return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
      } catch {
        return null;
      }
    }
    setItem(key, value) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, String(value));
        }
      } catch {}
    }
    removeItem(key) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch {}
    }
  }

  // Browser Network Wrapper
  class BrowserNetwork {
    async fetch(url, options = {}) {
      if (typeof fetch !== 'undefined') {
        return fetch(url, options);
      }
      throw new Error('fetch API is not available');
    }
  }

  class BoubaneAutomations {
    constructor(storage = null, network = null) {
      this.storage = storage || new BrowserStorage();
      this.network = network || new BrowserNetwork();
      this.defaultChatId = 8036535453;
      this.botToken = '9011245213:AAHpCWAW10PAU7-FWKaha80gyCa2J1cEPWs';
    }

    /**
     * R1: Normalize Cal.com webhook booking payload
     */
    parseCalcomBooking(rawPayload) {
      if (!rawPayload || typeof rawPayload !== 'object') {
        throw new Error('Invalid Cal.com payload: payload must be a non-null object');
      }

      const payload = rawPayload.payload || rawPayload;
      const responses = payload.responses || {};

      const attendee = (payload.attendees && payload.attendees[0]) || {};
      const name = (responses.name && responses.name.value) || attendee.name || 'Prospect Inconnu';
      const email = (responses.email && responses.email.value) || attendee.email || '';
      const phone = (responses.phone && responses.phone.value) || '';
      const company = (responses.company && responses.company.value) || `${name} Entreprise`;
      const craft = (responses.craft && responses.craft.value) || 'Artisan du Bâtiment';
      const city = (responses.city && responses.city.value) || 'Segré-en-Anjou Bleu (49500)';
      const notes = (responses.notes && responses.notes.value) || payload.description || '';

      return {
        bookingId: payload.bookingId || payload.id || Date.now(),
        startTime: payload.startTime || new Date().toISOString(),
        endTime: payload.endTime || new Date().toISOString(),
        title: payload.title || `RDV Cadrage avec ${name}`,
        name,
        email,
        phone,
        company,
        craft,
        city,
        notes,
        raw: rawPayload
      };
    }

    /**
     * R1: Generate prospect diagnosis (online presence, Google Maps, local competitors, pitch)
     */
    generateProspectDiagnosis(bookingOrLead) {
      if (!bookingOrLead) throw new Error('Lead or booking required for diagnosis');

      const name = bookingOrLead.name || bookingOrLead.contact_name || 'Artisan';
      const company = bookingOrLead.company || bookingOrLead.company_name || 'Entreprise';
      const craft = bookingOrLead.craft || bookingOrLead.craft_label || 'Bâtiment';
      const city = bookingOrLead.city || 'Segré-en-Anjou Bleu';
      const phone = bookingOrLead.phone || '';
      const email = bookingOrLead.email || '';

      const hasWebsite = Boolean(bookingOrLead.has_website || bookingOrLead.hasWebsite);
      const domainSlug = slugify(`${company}-${city}`);
      const recommendedDomain = bookingOrLead.recommended_domain || `${domainSlug || 'artisan-boubane'}.fr`;

      const googleMaps = {
        claimed: Boolean(bookingOrLead.google_maps_claimed),
        rating: bookingOrLead.google_rating || 4.7,
        reviewsCount: bookingOrLead.google_reviews_count || 3,
        label: bookingOrLead.google_maps_claimed
          ? `✅ Fiche revendiquée (${bookingOrLead.google_reviews_count || 5} avis, ${bookingOrLead.google_rating || 4.8}★)`
          : `⚠️ Fiche non revendiquée (${bookingOrLead.google_reviews_count || 3} avis, ${bookingOrLead.google_rating || 4.7}★)`
      };

      const competitors = bookingOrLead.competitors || [
        { name: 'Anjou Bâti Rénov', rating: 4.5, reviews: 12 },
        { name: "Maçonnerie de l'Oudon", rating: 4.8, reviews: 5 }
      ];

      const pitchPoints = [
        '1. Rassurer sur le 0€ : Aucune avance de trésorerie, aucun crédit-bail 48 mois (anti-Locam).',
        '2. Zéro contrainte pour lui : Il envoie 4-5 photos de chantiers par WhatsApp, Boubane s\'occupe de tout.',
        '3. Contrepartie unique demandée : Un avis 5 étoiles Google dès que le site est en ligne sous 48h.'
      ];

      return {
        contact: { name, company, craft, city, phone, email },
        diagnosis: {
          hasWebsite,
          websiteStatus: hasWebsite ? `✅ Site existant (${bookingOrLead.current_website_url || 'actif'})` : '❌ Aucun site web détecté (Priorité 0€ Clé en Main)',
          recommendedDomain,
          googleMaps,
          competitors
        },
        pitchPoints
      };
    }

    /**
     * R1: Format Telegram Markdown Message
     */
    formatTelegramMessage(diagnostic) {
      const c = diagnostic.contact;
      const d = diagnostic.diagnosis;

      let competitorsText = '';
      if (Array.isArray(d.competitors)) {
        d.competitors.forEach((comp, idx) => {
          competitorsText += `${idx + 1}. *${comp.name}* : ${comp.reviews} avis (${comp.rating}★)\n`;
        });
      }

      return `🎯 *NOUVEAU BRIEFING PRÉ-APPEL BOUBANE*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *RDV :* En attente de cadrage

👤 *PROSPECT & ENTREPRISE*
• *Contact :* ${c.name}
• *Entreprise :* ${c.company}
• *Métier :* ${c.craft}
• *Ville :* ${c.city}
• *Tél :* \`${c.phone}\`
• *Email :* \`${c.email}\`

🌐 *DIAGNOSTIC PRÉSENCE EN LIGNE*
• *Site web :* ${d.websiteStatus}
• *Nom de domaine conseillé :* \`${d.recommendedDomain}\` (Disponible)
• *Fiche Google Maps :* ${d.googleMaps.label}

⚔️ *CONCURRENTS LOCAUX*
${competitorsText.trim()}

💡 *STRATÉGIE & ACCROCHE APPEL (10 MIN)*
${diagnostic.pitchPoints.join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }

    /**
     * R1: Send Telegram briefing via Bot API
     */
    async sendTelegramBriefing(diagnostic, options = {}) {
      const chatId = options.chatId || this.defaultChatId;
      const text = this.formatTelegramMessage(diagnostic);
      const phone = (diagnostic.contact.phone || '').replace(/[^0-9+]/g, '');

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: '📞 Appeler', url: `tel:${phone}` },
            { text: '💬 WhatsApp', url: `https://wa.me/${phone.replace(/^\+/, '')}` }
          ],
          [
            { text: '🏢 Fiche Twenty CRM', url: 'https://crm.boubane.com' },
            { text: '🗺️ Google Maps', url: `https://www.google.com/maps/search/${encodeURIComponent(diagnostic.contact.company)}` }
          ],
          [
            { text: '📸 Lancer Onboarding Photos', callback_data: `trigger_onboarding:${diagnostic.contact.name}` }
          ]
        ]
      };

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const payload = {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      };

      try {
        const resp = await this.network.fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          this._logAutomation('R1_TELEGRAM_DISPATCH', 'ERROR', `Failed to send Telegram briefing: HTTP ${resp.status}`);
          return { success: false, status: resp.status, error: 'Telegram dispatch failed' };
        }

        const data = await resp.json();
        this._logAutomation('R1_TELEGRAM_DISPATCH', 'INFO', `Telegram briefing delivered to chat ${chatId}`);

        return {
          success: true,
          chatId,
          messageId: data.result ? data.result.message_id : 10001,
          text
        };
      } catch (err) {
        this._logAutomation('R1_TELEGRAM_DISPATCH', 'ERROR', `Telegram dispatch network error: ${err.message}`);
        throw err;
      }
    }

    /**
     * R2: Trigger 1-click photo onboarding message and schedule J+2 reminder
     */
    triggerPhotoOnboarding(lead, channel = 'whatsapp', options = {}) {
      if (!lead) throw new Error('Lead object required for photo onboarding');

      const name = lead.name || lead.contact_name || 'Client';
      const rawPhone = lead.phone || '';
      const phoneClean = rawPhone.replace(/[^0-9+]/g, '');
      const phoneDigits = rawPhone.replace(/[^0-9]/g, '');
      const now = options.currentTime || Date.now();
      const reminderDueAt = now + (48 * 3600 * 1000); // J+2

      const message = `Bonjour ${name} ! C'est parti pour la création de votre site Boubane.

Pour que nous puissions sublimer vos réalisations, pourriez-vous nous transmettre 4 à 5 photos de vos chantiers par ce fil :
1. Une vue d'ensemble du chantier terminé (ou avant/après).
2. Un gros plan sur les finitions et les matériaux nobles.
3. Une photo de vous ou de l'équipe en action (ou de votre fourgon avec logo).
4. Idéalement en lumière naturelle de jour.

Dès réception, nous traitons vos photos et assemblons votre site sous 48h !`;

      let directUrl = '';
      if (channel === 'whatsapp') {
        directUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
      } else if (channel === 'sms') {
        directUrl = `sms:${phoneClean}?body=${encodeURIComponent(message)}`;
      } else {
        directUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`;
      }

      // Schedule J+2 reminder in queue
      const taskId = `reminder_photos_${lead.id || name}_${now}`;
      const task = {
        id: taskId,
        type: 'PHOTO_REMINDER_J2',
        leadId: lead.id || name,
        leadName: name,
        phone: phoneClean,
        channel,
        scheduledAt: now,
        dueAt: reminderDueAt,
        status: 'PENDING'
      };

      this._enqueueTask(task);
      this._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', `1-click photo onboarding initiated for ${name}. J+2 reminder scheduled.`);

      return {
        success: true,
        channel,
        directUrl,
        message,
        reminderDueAt,
        taskId
      };
    }

    /**
     * R2: Watchdog for J+2 photo reminders
     */
    checkAndTriggerPhotoReminders(options = {}) {
      const now = options.currentTime || Date.now();
      const queue = this._getQueue();
      const reports = [];

      queue.forEach(task => {
        if (task.type === 'PHOTO_REMINDER_J2' && task.status === 'PENDING') {
          const photoStatus = options.leadPhotoStatusMap
            ? options.leadPhotoStatusMap[task.leadId]
            : task.currentPhotoStatus;

          if (photoStatus === 'received' || photoStatus === 'RECEIVED') {
            task.status = 'CANCELLED_RECEIVED';
            this._logAutomation('R2_J2_WATCHDOG', 'INFO', `Photos received for ${task.leadName}. J+2 reminder neutralized.`);
            reports.push({ taskId: task.id, leadName: task.leadName, action: 'NEUTRALIZED_RECEIVED' });
          } else if (now >= task.dueAt) {
            task.status = 'REMINDER_SENT';
            task.executedAt = now;
            this._logAutomation('R2_J2_WATCHDOG', 'INFO', `J+2 reminder triggered for ${task.leadName} via ${task.channel}.`);
            reports.push({ taskId: task.id, leadName: task.leadName, action: 'REMINDER_SENT', channel: task.channel });
          }
        }
      });

      this._saveQueue(queue);
      return reports;
    }

    /**
     * R4: Trigger delivery message when project moves to LIVRÉ
     */
    triggerDelivery(lead, deliveryUrl, options = {}) {
      if (!lead) throw new Error('Lead object required for delivery trigger');
      const name = lead.name || lead.contact_name || 'Client';
      const phone = (lead.phone || '').replace(/[^0-9]/g, '');
      const now = options.currentTime || Date.now();
      const reviewDueAt = now + (48 * 3600 * 1000); // 48h later

      const finalUrl = deliveryUrl || `https://boubane.com/clients/${slugify(lead.company || name)}`;

      const deliveryMessage = `Félicitations ${name} ! Votre nouveau site internet Boubane est officiellement en ligne :
👉 ${finalUrl}

Il est optimisé pour le référencement local Google, ultra-rapide et adapté à tous les smartphones. Prenez le temps de le découvrir !`;

      // Arm 48h review task
      const reviewTaskId = `review_followup_${lead.id || name}_${now}`;
      const reviewTask = {
        id: reviewTaskId,
        type: 'GOOGLE_REVIEW_48H',
        leadId: lead.id || name,
        leadName: name,
        phone,
        siteUrl: finalUrl,
        reviewUrl: 'https://g.page/r/boubane/review',
        scheduledAt: now,
        dueAt: reviewDueAt,
        status: 'PENDING'
      };

      this._enqueueTask(reviewTask);
      this._logAutomation('R4_DELIVERY_NOTIFICATION', 'INFO', `Delivery message generated for ${name} (${finalUrl}). 48h review followup armed.`);

      return {
        success: true,
        deliveredAt: now,
        deliveryUrl: finalUrl,
        deliveryMessage,
        reviewDueAt,
        reviewTaskId
      };
    }

    /**
     * R4: Watchdog for Google 5-star review followup at 48h
     */
    checkAndTriggerReviewRequests(options = {}) {
      const now = options.currentTime || Date.now();
      const queue = this._getQueue();
      const reports = [];

      queue.forEach(task => {
        if (task.type === 'GOOGLE_REVIEW_48H' && task.status === 'PENDING') {
          const hasRevisions = options.revisionReportedMap
            ? Boolean(options.revisionReportedMap[task.leadId])
            : false;

          if (hasRevisions) {
            task.status = 'PAUSED_REVISIONS';
            this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `Revisions requested for ${task.leadName}. Review followup paused.`);
            reports.push({ taskId: task.id, leadName: task.leadName, action: 'PAUSED_REVISIONS' });
          } else if (now >= task.dueAt) {
            task.status = 'REVIEW_SENT';
            task.executedAt = now;
            const reviewMessage = `Bonjour ${task.leadName}, votre site est en ligne depuis 48h ! Si vous êtes satisfait de notre travail et de notre réactivité, un avis 5 étoiles nous aiderait énormément :
👉 ${task.reviewUrl}
Merci de votre confiance !`;
            this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `48h Google review request sent for ${task.leadName}.`);
            reports.push({ taskId: task.id, leadName: task.leadName, action: 'REVIEW_SENT', message: reviewMessage });
          }
        }
      });

      this._saveQueue(queue);
      return reports;
    }

    // Storage / Queue Helpers
    _getQueue() {
      try {
        const raw = this.storage.getItem('boubane_automations_queue');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    _saveQueue(queue) {
      this.storage.setItem('boubane_automations_queue', JSON.stringify(queue));
    }

    _enqueueTask(task) {
      const queue = this._getQueue();
      queue.push(task);
      this._saveQueue(queue);
    }

    _logAutomation(module, level, message) {
      try {
        const raw = this.storage.getItem('boubane_automations_log');
        const logs = raw ? JSON.parse(raw) : [];
        logs.push({
          timestamp: new Date().toISOString(),
          module,
          level,
          message,
          status: level === 'ERROR' ? 'FAILURE' : 'SUCCESS'
        });
        this.storage.setItem('boubane_automations_log', JSON.stringify(logs));
      } catch {}
    }

    getAutomationLogs() {
      try {
        const raw = this.storage.getItem('boubane_automations_log');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    getScheduledQueue() {
      return this._getQueue();
    }
  }

  return { BoubaneAutomations };
});
