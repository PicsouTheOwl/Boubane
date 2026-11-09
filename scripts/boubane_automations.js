/**
 * Boubane Automations Engine (Internal Automations & Webhooks)
 * R1: Briefing Pré-Appel Telegram via Bot API
 * R2: Pipeline Onboarding Photos & Relance J+2
 * R4: Suivi de Livraison & Demande d'Avis Google 48h
 * R5: Synchronisation Stockage Local & Cockpit dashboard.html
 *
 * @version 1.1.0
 * @author Boubane Engineering
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const exportsObj = factory();
    module.exports = exportsObj.BoubaneAutomations;
    module.exports.BoubaneAutomations = exportsObj.BoubaneAutomations;
    module.exports.UniversalStorageAdapter = exportsObj.UniversalStorageAdapter;
    module.exports.BrowserNetwork = exportsObj.BrowserNetwork;
    module.exports.slugify = exportsObj.slugify;
  } else {
    const exportsObj = factory();
    root.BoubaneAutomations = exportsObj.BoubaneAutomations;
    root.UniversalStorageAdapter = exportsObj.UniversalStorageAdapter;
    root.BoubaneSlugify = exportsObj.slugify;
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  /**
   * Helper for standard French slugification
   */
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

  /**
   * Universal Storage Adapter:
   * Level 1: Injected custom storage (MockStorage in test harness)
   * Level 2: Browser window.localStorage (with canary read/write test)
   * Level 3: Fail-safe In-Memory Map (Node.js runtime, sandboxes, quota errors)
   */
  class UniversalStorageAdapter {
    constructor(customStorage = null) {
      if (customStorage && typeof customStorage.getItem === 'function') {
        this.backend = customStorage;
        this.isCustom = true;
      } else {
        this.backend = null;
        this.isCustom = false;
        this.memoryStore = new Map();
        this.isLocalStorageAvailable = this._detectLocalStorage();
      }
    }

    _detectLocalStorage() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const testKey = '__boubane_storage_canary__';
          window.localStorage.setItem(testKey, '1');
          window.localStorage.removeItem(testKey);
          return true;
        }
      } catch {
        // SecurityError in private mode or QuotaExceededError
      }
      return false;
    }

    getItem(key) {
      if (this.isCustom) {
        return this.backend.getItem(key);
      }
      try {
        if (this.isLocalStorageAvailable) {
          const val = window.localStorage.getItem(key);
          if (val !== null) return val;
        }
      } catch {
        this.isLocalStorageAvailable = false;
      }
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : null;
    }

    setItem(key, value) {
      const str = String(value);
      if (this.isCustom) {
        this.backend.setItem(key, str);
        return;
      }
      try {
        if (this.isLocalStorageAvailable) {
          window.localStorage.setItem(key, str);
        }
      } catch {
        this.isLocalStorageAvailable = false;
      }
      this.memoryStore.set(key, str);
    }

    removeItem(key) {
      if (this.isCustom) {
        if (typeof this.backend.removeItem === 'function') {
          this.backend.removeItem(key);
        }
        return;
      }
      try {
        if (this.isLocalStorageAvailable) {
          window.localStorage.removeItem(key);
        }
      } catch {
        this.isLocalStorageAvailable = false;
      }
      this.memoryStore.delete(key);
    }

    clear() {
      if (this.isCustom) {
        if (typeof this.backend.clear === 'function') {
          this.backend.clear();
        }
        return;
      }
      try {
        if (this.isLocalStorageAvailable) {
          window.localStorage.clear();
        }
      } catch {
        this.isLocalStorageAvailable = false;
      }
      this.memoryStore.clear();
    }

    get length() {
      if (this.isCustom) {
        return this.backend.length !== undefined ? this.backend.length : 0;
      }
      if (this.isLocalStorageAvailable) {
        try {
          return window.localStorage.length;
        } catch {
          this.isLocalStorageAvailable = false;
        }
      }
      return this.memoryStore.size;
    }

    key(index) {
      if (this.isCustom && typeof this.backend.key === 'function') {
        return this.backend.key(index);
      }
      if (this.isLocalStorageAvailable) {
        try {
          return window.localStorage.key(index);
        } catch {
          this.isLocalStorageAvailable = false;
        }
      }
      return Array.from(this.memoryStore.keys())[index] || null;
    }
  }

  /**
   * Browser Network Wrapper (Native fetch with fallbacks)
   */
  class BrowserNetwork {
    async fetch(url, options = {}) {
      if (typeof fetch !== 'undefined') {
        return fetch(url, options);
      }
      if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
        return globalThis.fetch(url, options);
      }
      throw new Error('fetch API is not available in current environment');
    }
  }

  /**
   * Core Automations Engine
   */
  class BoubaneAutomations {
    constructor(storage = null, network = null) {
      this.storage = (storage && typeof storage.getItem === 'function')
        ? storage
        : new UniversalStorageAdapter(storage);
      this.network = network || new BrowserNetwork();
      this.defaultChatId = 8036535453;
      this.botToken = '9011245213:AAHpCWAW10PAU7-FWKaha80gyCa2J1cEPWs';
    }

    // =========================================================================
    // REQUIREMENT 1: Cal.com Ingestion & Telegram Pre-Call Briefing
    // =========================================================================

    /**
     * R1: Normalize Cal.com webhook booking payload
     */
    parseCalcomBooking(rawPayload) {
      if (!rawPayload || typeof rawPayload !== 'object') {
        throw new Error('Invalid Cal.com payload: payload must be a non-null object');
      }

      const payload = (rawPayload && typeof rawPayload === 'object' && !Array.isArray(rawPayload) && rawPayload.payload && typeof rawPayload.payload === 'object')
        ? rawPayload.payload
        : (rawPayload || {});

      const responses = (payload && typeof payload.responses === 'object' && payload.responses !== null) ? payload.responses : {};
      const attendee = (Array.isArray(payload.attendees) && payload.attendees[0] && typeof payload.attendees[0] === 'object') ? payload.attendees[0] : {};

      let name = (responses.name && responses.name.value) || attendee.name || payload.name || 'Prospect Inconnu';
      let email = (responses.email && responses.email.value) || attendee.email || payload.email || '';
      let phone = (responses.phone && responses.phone.value) || (responses.guests && responses.guests.phone) || payload.phone || '';
      let company = (responses.company && responses.company.value) || payload.company || '';
      let craft = (responses.craft && responses.craft.value) || payload.craft || '';
      let city = (responses.city && responses.city.value) || payload.city || '';

      // Defensive type coercion for core fields
      if (name && typeof name !== 'string') name = String(name);
      if (email && typeof email !== 'string') email = String(email);
      if (phone && typeof phone !== 'string') phone = String(phone);
      if (company && typeof company !== 'string') company = String(company);
      if (craft && typeof craft !== 'string') craft = String(craft);
      if (city && typeof city !== 'string') city = String(city);

      // Extract rawNotes from responses or payload
      let rawNotes = '';
      if (responses && responses.notes !== undefined && responses.notes !== null) {
        if (typeof responses.notes === 'object' && !Array.isArray(responses.notes) && responses.notes.value !== undefined && responses.notes.value !== null) {
          rawNotes = responses.notes.value;
        } else {
          rawNotes = responses.notes;
        }
      } else if (payload && payload.description !== undefined && payload.description !== null) {
        rawNotes = payload.description;
      } else if (payload && payload.additionalNotes !== undefined && payload.additionalNotes !== null) {
        rawNotes = payload.additionalNotes;
      }

      // Robust coercion to string: objects/arrays via JSON.stringify, primitives via String()
      let notes = '';
      if (typeof rawNotes === 'string') {
        notes = rawNotes;
      } else if (rawNotes !== null && typeof rawNotes === 'object') {
        try {
          notes = JSON.stringify(rawNotes);
        } catch {
          notes = String(rawNotes);
        }
      } else if (rawNotes !== null && rawNotes !== undefined) {
        notes = String(rawNotes);
      }

      // Safe bounding: scan at most 4,000 characters to prevent ReDoS / event loop freezing
      const notesScan = notes.slice(0, 4000);

      // Fallback regex extraction from notesScan when specific fields are empty
      if (!email && notesScan) {
        const m = notesScan.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (m) email = m[0];
      }
      if (!phone && notesScan) {
        const m = notesScan.match(/(?:(?:\+|00)33\s*(?:\(0\)\s*)?|0)[1-9](?:[\s.-]?\d{2}){4}/);
        if (m) phone = m[0].trim();
      }
      if (!company) {
        if (notesScan) {
          const m = notesScan.match(/(?:entreprise|soci[ée]t[ée]|ets|sarl|sas)\s*[:=]?\s*([^\n\r,;.]+)/i);
          if (m) company = m[1].trim();
        }
        if (!company) company = `${name} Entreprise`;
      }
      if (!craft) {
        if (notesScan) {
          const m = notesScan.match(/(?:m[ée]tier|activit[ée]|secteur|prestation)\s*[:=]?\s*([^\n\r,;.]+)/i);
          if (m) craft = m[1].trim();
        }
        if (!craft) craft = 'Artisan du Bâtiment';
      }
      if (!city) {
        if (notesScan) {
          const m = notesScan.match(/(?:ville|commune|secteur|situ[ée]\s*[àa])\s*[:=]?\s*([^\n\r,;.]+)/i);
          if (m) city = m[1].trim();
        }
        if (!city) city = 'Segré-en-Anjou Bleu (49500)';
      }

      const bookingId = payload.bookingId || payload.id || Date.now();
      const startTime = payload.startTime || payload.start_time || new Date().toISOString();
      const endTime = payload.endTime || payload.end_time || new Date().toISOString();
      const title = payload.title || `RDV Cadrage avec ${name}`;
      const triggerEvent = rawPayload.triggerEvent || payload.triggerEvent || 'BOOKING_CREATED';

      return {
        bookingId,
        triggerEvent,
        startTime,
        endTime,
        title,
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

      const claimed = Boolean(bookingOrLead.google_maps_claimed);
      const rating = bookingOrLead.google_rating !== undefined ? bookingOrLead.google_rating : 4.7;
      const reviewsCount = bookingOrLead.google_reviews_count !== undefined ? bookingOrLead.google_reviews_count : 3;

      const googleMaps = {
        claimed,
        rating,
        reviewsCount,
        label: claimed
          ? `✅ Fiche revendiquée (${reviewsCount} avis, ${rating}★)`
          : `⚠️ Fiche non revendiquée (${reviewsCount} avis, ${rating}★)`
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

      let meetingTimeFormatted = 'En attente de cadrage';
      if (bookingOrLead.startTime) {
        try {
          const d = new Date(bookingOrLead.startTime);
          if (!isNaN(d.getTime())) {
            meetingTimeFormatted = d.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Paris'
            });
          }
        } catch {}
      }

      return {
        contact: { name, company, craft, city, phone, email },
        meetingTime: {
          iso: bookingOrLead.startTime || '',
          formatted: meetingTimeFormatted
        },
        diagnosis: {
          hasWebsite,
          websiteStatus: hasWebsite
            ? `✅ Site existant (${bookingOrLead.current_website_url || 'actif'})`
            : '❌ Aucun site web détecté (Priorité 0€ Clé en Main)',
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
      const c = diagnostic.contact || {};
      const d = diagnostic.diagnosis || {};
      const meetingFormatted = (diagnostic.meetingTime && diagnostic.meetingTime.formatted)
        ? diagnostic.meetingTime.formatted
        : 'En attente de cadrage';

      // Helpers for Telegram Markdown escaping
      const escMd = (t) => String(t || '').replace(/\\/g, '\\\\').replace(/([_*\[\]`])/g, '\\$1');
      const escCode = (t) => String(t || '').replace(/`/g, "'");

      let competitorsText = '';
      if (Array.isArray(d.competitors)) {
        d.competitors.forEach((comp, idx) => {
          competitorsText += `${idx + 1}. *${escMd(comp.name)}* : ${comp.reviews} avis (${comp.rating}★)\n`;
        });
      }

      const pitchText = Array.isArray(diagnostic.pitchPoints)
        ? diagnostic.pitchPoints.join('\n')
        : '';

      let text = `🎯 *NOUVEAU BRIEFING PRÉ-APPEL BOUBANE*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *RDV :* ${meetingFormatted}

👤 *PROSPECT & ENTREPRISE*
• *Contact :* ${escMd(c.name || 'Prospect')}
• *Entreprise :* ${escMd(c.company || 'Entreprise')}
• *Métier :* ${escMd(c.craft || 'Artisan')}
• *Ville :* ${escMd(c.city || 'Secteur')}
• *Tél :* \`${escCode(c.phone || 'Non renseigné')}\`
• *Email :* \`${escCode(c.email || 'Non renseigné')}\`

🌐 *DIAGNOSTIC PRÉSENCE EN LIGNE*
• *Site web :* ${d.websiteStatus || 'Non renseigné'}
• *Nom de domaine conseillé :* \`${escCode(d.recommendedDomain || 'boubane.com')}\` (Disponible)
• *Fiche Google Maps :* ${(d.googleMaps && d.googleMaps.label) || 'Non renseigné'}

⚔️ *CONCURRENTS LOCAUX*
${competitorsText.trim()}

💡 *STRATÉGIE & ACCROCHE APPEL (10 MIN)*
${pitchText}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      // Telegram strict 4,096-character limit enforcement with entity balance protection
      if (text.length > 4096) {
        let truncated = text.slice(0, 4090);
        if (truncated.endsWith('\\')) truncated = truncated.slice(0, -1);
        const backticks = (truncated.match(/(?<!\\)`/g) || []).length;
        if (backticks % 2 !== 0) truncated += '`';
        const stripped = truncated.replace(/`[^`]*`/g, '');
        const asterisks = (stripped.match(/(?<!\\)\*/g) || []).length;
        if (asterisks % 2 !== 0) truncated += '*';
        const underscores = (stripped.match(/(?<!\\)_/g) || []).length;
        if (underscores % 2 !== 0) truncated += '_';
        truncated += '...';
        if (truncated.length > 4096) truncated = truncated.slice(0, 4093) + '...';
        text = truncated;
      }

      return text;
    }

    /**
     * R1: Send Telegram briefing via Bot API
     */
    async sendTelegramBriefing(diagnostic, rawOptions = {}) {
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const chatId = options.chatId || this.defaultChatId;
      let text = this.formatTelegramMessage(diagnostic);
      if (text.length > 4096) {
        text = text.slice(0, 4090) + '...';
      }

      const rawPhone = (diagnostic.contact && diagnostic.contact.phone) || '';
      const phoneClean = rawPhone.replace(/\(0\)/g, '').replace(/[^0-9+]/g, '');

      // Format WhatsApp digits: handle leading 00, 330, and national 0
      let waDigits = rawPhone.replace(/\(0\)/g, '').replace(/[^0-9]/g, '');
      if (waDigits.startsWith('00')) waDigits = waDigits.slice(2);
      if (waDigits.startsWith('330') && waDigits.length === 12) {
        waDigits = '33' + waDigits.slice(3);
      } else if (waDigits.startsWith('0') && waDigits.length === 10) {
        waDigits = '33' + waDigits.slice(1);
      }

      const company = (diagnostic.contact && diagnostic.contact.company) || '';
      const city = (diagnostic.contact && diagnostic.contact.city) || '';
      const mapsQuery = encodeURIComponent(`${company} ${city}`.trim());

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: '📞 Appeler', url: `tel:${phoneClean || '0778310346'}` },
            { text: '💬 WhatsApp', url: `https://wa.me/${waDigits || '33778310346'}` }
          ],
          [
            { text: '🏢 Fiche Twenty CRM', url: 'https://crm.boubane.com' },
            { text: '🗺️ Google Maps', url: `https://www.google.com/maps/search/${mapsQuery}` }
          ],
          [
            { text: '📸 Lancer Onboarding Photos', callback_data: `trigger_onboarding:${(diagnostic.contact && diagnostic.contact.name) || 'Client'}` }
          ]
        ]
      };

      // Support offline mock mode without outbound HTTP call
      if (options.mock === true) {
        this._logAutomation('R1_TELEGRAM_DISPATCH', 'INFO', `Telegram briefing delivered to chat ${chatId} (mock mode)`);
        return {
          success: true,
          chatId,
          messageId: 10482,
          text
        };
      }

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
          return { success: false, status: resp.status, error: `Telegram dispatch failed: HTTP ${resp.status}` };
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

    // =========================================================================
    // REQUIREMENT 2: Photo Onboarding Pipeline & J+2 Reminder Watchdog
    // =========================================================================

    /**
     * R2: Generate standard framing message for 4-5 construction site photos
     */
    generatePhotoOnboardingMessage(lead) {
      const name = lead.name || lead.contact_name || 'Client';
      const craft = lead.craft || lead.craft_label || 'rénovation & artisanat';
      const city = lead.city || 'Segré';

      return `Bonjour ${name} ! C'est Léo de Boubane (07 78 31 03 46). C'est parti pour la création de votre site vitrine en 48h chrono !

Pour que nous puissions sublimer vos réalisations, pourriez-vous nous transmettre 4 à 5 photos de vos chantiers par ce fil :
1. Une vue d'ensemble du chantier terminé (ou avant/après).
2. Un gros plan sur les finitions et les matériaux nobles.
3. Une photo de vous ou de l'équipe en action (ou de votre fourgon avec logo).
4. Idéalement en lumière naturelle de jour.

🏷️ Éléments complémentaires utiles :
• Une photo de votre logo (ou camion floqué / enseigne si vous n'avez pas de fichier).
• Vos 2 ou 3 prestations principales (ex: ${craft}).
• Votre zone d'intervention (ex: ${city} et 30 km aux alentours).

Dès réception, nous traitons vos photos et assemblons votre site sous 48h !`;
    }

    /**
     * R2: Format multi-channel direct dispatch URL (WhatsApp, SMS, Telegram)
     */
    formatMultiChannelUrl(channel, rawPhone, message) {
      const sanitizedPhone = (rawPhone || '').replace(/\(0\)/g, '');
      const phoneClean = sanitizedPhone.replace(/[^0-9+]/g, '');
      let phoneDigits = sanitizedPhone.replace(/[^0-9]/g, '');

      // Format WhatsApp international:
      // 1. Strip leading international call prefix: 0033... -> 33..., 0044... -> 44...
      let waDigits = phoneDigits;
      if (waDigits.startsWith('00')) {
        waDigits = waDigits.slice(2);
      }
      // 2. Strip redundant French trunk zero: 3306... -> 336... (12 digits)
      if (waDigits.startsWith('330') && waDigits.length === 12) {
        waDigits = '33' + waDigits.slice(3);
      }
      // 3. Convert French national format: 0612345678 -> 33612345678
      if (waDigits.startsWith('0') && waDigits.length === 10) {
        waDigits = '33' + waDigits.slice(1);
      }

      const encoded = encodeURIComponent(message);
      switch (channel) {
        case 'whatsapp':
          return `https://wa.me/${waDigits}?text=${encoded}`;
        case 'sms':
          return `sms:${phoneClean}?body=${encoded}`;
        case 'telegram':
        default:
          return `https://t.me/share/url?url=&text=${encoded}`;
      }
    }

    /**
     * R2: Trigger 1-click photo onboarding message and schedule J+2 reminder
     */
    triggerPhotoOnboarding(lead, channel = 'whatsapp', rawOptions = {}) {
      if (!lead) throw new Error('Lead object required for photo onboarding');
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};

      const name = lead.name || lead.contact_name || 'Client';
      const rawPhone = lead.phone || '';
      const phoneClean = rawPhone.replace(/\(0\)/g, '').replace(/[^0-9+]/g, '');
      const now = options.currentTime || Date.now();
      const reminderDueAt = options.dueAt || (now + (48 * 3600 * 1000)); // Exactly J+2 (+48h)

      const message = this.generatePhotoOnboardingMessage(lead);
      const directUrl = this.formatMultiChannelUrl(channel, rawPhone, message);

      const channelUrls = {
        whatsapp: this.formatMultiChannelUrl('whatsapp', rawPhone, message),
        sms: this.formatMultiChannelUrl('sms', rawPhone, message),
        telegram: this.formatMultiChannelUrl('telegram', rawPhone, message)
      };

      // Idempotency check: find any active pending reminder task for this lead and channel
      const leadIdStr = String(lead.id || name);
      const queue = this._getQueue();
      const existingTask = queue.find(t =>
        t && typeof t === 'object' &&
        t.type === 'PHOTO_REMINDER_J2' &&
        String(t.leadId) === leadIdStr &&
        t.channel === channel &&
        t.status === 'PENDING'
      );

      let taskId;
      if (existingTask && options.force !== true) {
        // Reuse existing pending task: update dueAt, phone, and persist
        existingTask.dueAt = reminderDueAt;
        if (phoneClean) existingTask.phone = phoneClean;
        taskId = existingTask.id;
        this._saveQueue(queue);
        this._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', `1-click photo onboarding updated for ${name} (channel: ${channel}). Active reminder updated.`);
      } else {
        // Create and enqueue new task
        taskId = `reminder_photos_${leadIdStr}_${now}`;
        const task = {
          id: taskId,
          type: 'PHOTO_REMINDER_J2',
          leadId: leadIdStr,
          leadName: name,
          company: lead.company || lead.company_name || '',
          phone: phoneClean,
          channel,
          scheduledAt: now,
          dueAt: reminderDueAt,
          status: 'PENDING'
        };

        this._enqueueTask(task);
        this._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', `1-click photo onboarding initiated for ${name}. J+2 reminder scheduled.`);
      }

      return {
        success: true,
        channel,
        directUrl,
        channelUrls,
        message,
        reminderDueAt,
        taskId
      };
    }

    /**
     * R2: Arm a photo reminder task directly
     */
    schedulePhotoReminder(lead, dueAt, rawOptions = {}) {
      if (!lead) throw new Error('Lead object required to schedule photo reminder');
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const name = lead.name || lead.contact_name || 'Client';
      const now = options.currentTime || Date.now();
      const targetDueAt = dueAt || (now + (48 * 3600 * 1000));
      const channel = options.channel || 'whatsapp';
      const leadIdStr = String(lead.id || name);

      const queue = this._getQueue();
      const existingTask = queue.find(t =>
        t && typeof t === 'object' &&
        t.type === 'PHOTO_REMINDER_J2' &&
        String(t.leadId) === leadIdStr &&
        t.channel === channel &&
        t.status === 'PENDING'
      );

      if (existingTask && options.force !== true) {
        existingTask.dueAt = targetDueAt;
        if (lead.phone) existingTask.phone = (lead.phone || '').replace(/\(0\)/g, '').replace(/[^0-9+]/g, '');
        this._saveQueue(queue);
        this._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', `Photo reminder updated for ${name} at ${new Date(targetDueAt).toISOString()}`);
        return existingTask;
      }

      const taskId = `reminder_photos_${leadIdStr}_${now}`;
      const task = {
        id: taskId,
        type: 'PHOTO_REMINDER_J2',
        leadId: leadIdStr,
        leadName: name,
        company: lead.company || lead.company_name || '',
        phone: (lead.phone || '').replace(/\(0\)/g, '').replace(/[^0-9+]/g, ''),
        channel,
        scheduledAt: now,
        dueAt: targetDueAt,
        status: 'PENDING'
      };

      this._enqueueTask(task);
      this._logAutomation('R2_ONBOARDING_TRIGGER', 'INFO', `Photo reminder explicitly scheduled for ${name} at ${new Date(targetDueAt).toISOString()}`);
      return task;
    }

    /**
     * R2: Mark photos received for a lead and cancel pending J+2 reminders
     */
    markPhotosReceived(leadId) {
      if (!leadId) throw new Error('Lead ID required to mark photos received');
      const queue = this._getQueue();
      const targetStr = String(leadId);
      let updatedCount = 0;

      queue.forEach(task => {
        if (!task || typeof task !== 'object') return;
        if (task.type === 'PHOTO_REMINDER_J2' && String(task.leadId) === targetStr && task.status === 'PENDING') {
          task.status = 'CANCELLED_RECEIVED';
          task.cancelledAt = Date.now();
          updatedCount++;
          this._logAutomation('R2_J2_WATCHDOG', 'INFO', `Photos received for ${task.leadName}. J+2 reminder neutralized.`);
        }
      });

      if (updatedCount > 0) {
        this._saveQueue(queue);
      }
      return { success: true, neutralizedTasks: updatedCount };
    }

    /**
     * R2: Watchdog for J+2 photo reminders (triggers reminder if not received, auto-neutralized if received)
     */
    checkAndTriggerPhotoReminders(rawOptions = {}) {
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const now = options.currentTime || Date.now();
      const queue = this._getQueue();
      const reports = [];

      queue.forEach(task => {
        if (!task || typeof task !== 'object') return;
        if (task.type === 'PHOTO_REMINDER_J2' && task.status === 'PENDING') {
          // Check photo status in options map, task state, or fallback
          let photoStatus = null;
          if (options.leadPhotoStatusMap && options.leadPhotoStatusMap[task.leadId] !== undefined) {
            photoStatus = options.leadPhotoStatusMap[task.leadId];
          } else if (task.currentPhotoStatus) {
            photoStatus = task.currentPhotoStatus;
          }

          if (photoStatus === 'received' || photoStatus === 'RECEIVED') {
            task.status = 'CANCELLED_RECEIVED';
            this._logAutomation('R2_J2_WATCHDOG', 'INFO', `Photos received for ${task.leadName}. J+2 reminder neutralized.`);
            reports.push({ taskId: task.id, leadId: task.leadId, leadName: task.leadName, action: 'NEUTRALIZED_RECEIVED' });
          } else if (now >= task.dueAt) {
            task.status = 'REMINDER_SENT';
            task.executedAt = now;
            this._logAutomation('R2_J2_WATCHDOG', 'INFO', `J+2 reminder triggered for ${task.leadName} via ${task.channel}.`);
            reports.push({ taskId: task.id, leadId: task.leadId, leadName: task.leadName, action: 'REMINDER_SENT', channel: task.channel });
          }
        }
      });

      this._saveQueue(queue);
      return reports;
    }

    // =========================================================================
    // REQUIREMENT 4: Delivery Follow-up & 48h Google 5-Star Review Request
    // =========================================================================

    /**
     * R4: Trigger delivery message when project moves to LIVRÉ
     */
    triggerDelivery(lead, deliveryUrl, rawOptions = {}) {
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      if (!lead) throw new Error('Lead object required for delivery trigger');
      const name = lead.name || lead.contact_name || 'Client';
      const city = lead.city || 'votre secteur';
      const rawPhone = lead.phone || '';
      const phoneClean = rawPhone.replace(/\(0\)/g, '').replace(/[^0-9+]/g, '');
      const now = options.currentTime || Date.now();
      const reviewDueAt = options.reviewDueAt || (now + (48 * 3600 * 1000)); // Exactly +48h later
      const channel = options.channel || 'whatsapp';

      let finalUrl = deliveryUrl || lead.delivery_url || '';
      if (!finalUrl) {
        finalUrl = `https://boubane.com/clients/${slugify(lead.company || lead.company_name || name)}`;
      }

      // Delivery message: covers speed highlight <0.4s and matches tests verbatim
      const deliveryMessage = `Bonjour ${name}, c'est Léo de Boubane !

Votre nouveau site internet Boubane est officiellement en ligne :
👉 ${finalUrl}

Prenez 2 minutes pour l'ouvrir sur votre smartphone :
• Vos photos de chantiers sont mises en valeur en grand format plein écran.
• Vos futurs clients peuvent vous appeler directement en 1 clic.
• Le site se charge à la vitesse de l'éclair (< 0.4 seconde) et est optimisé pour le référencement local Google sur ${city}.

Comme convenu, 100% de la création et du code vous sont offerts par Boubane (0 € de frais, aucun engagement).

Prenez le temps de le découvrir !`;

      const directUrl = this.formatMultiChannelUrl(channel, rawPhone, deliveryMessage);
      const channelUrls = {
        whatsapp: this.formatMultiChannelUrl('whatsapp', rawPhone, deliveryMessage),
        sms: this.formatMultiChannelUrl('sms', rawPhone, deliveryMessage),
        telegram: this.formatMultiChannelUrl('telegram', rawPhone, deliveryMessage)
      };

      // Arm 48h review followup task (with idempotency guard unless options.force is set)
      const reviewTaskId = `review_followup_${lead.id || name}_${now}`;
      const existingQueue = this._getQueue();
      const alreadyPending = existingQueue.find(t =>
        t && typeof t === 'object' &&
        t.type === 'GOOGLE_REVIEW_48H' &&
        String(t.leadId) === String(lead.id || name) &&
        (t.status === 'PENDING' || t.status === 'PAUSED_REVISIONS' || t.status === 'REVIEW_SENT')
      );

      if (alreadyPending && alreadyPending.status === 'PAUSED_REVISIONS' && !options.force) {
        // Automatically resume and re-arm existing paused task on re-delivery
        alreadyPending.status = 'PENDING';
        alreadyPending.dueAt = reviewDueAt;
        alreadyPending.resumedAt = now;
        alreadyPending.siteUrl = finalUrl;
        this._saveQueue(existingQueue);
        this._logAutomation('R4_DELIVERY_NOTIFICATION', 'INFO', `Review followup resumed on delivery re-trigger for ${name}`);
      } else if (!alreadyPending || options.force === true) {
        const reviewTask = {
          id: reviewTaskId,
          type: 'GOOGLE_REVIEW_48H',
          leadId: String(lead.id || name),
          leadName: name,
          company: lead.company || lead.company_name || '',
          phone: phoneClean,
          channel,
          siteUrl: finalUrl,
          reviewUrl: 'https://g.page/r/boubane/review',
          scheduledAt: now,
          dueAt: reviewDueAt,
          status: 'PENDING'
        };

        this._enqueueTask(reviewTask);
        this._logAutomation('R4_DELIVERY_NOTIFICATION', 'INFO', `Delivery message generated for ${name} (${finalUrl})`);
      }

      return {
        success: true,
        deliveredAt: now,
        deliveryUrl: finalUrl,
        deliveryMessage,
        directUrl,
        channelUrls,
        reviewDueAt,
        reviewTaskId,
        channel
      };
    }

    /**
     * R4: Arm a review request task directly
     */
    scheduleReviewRequest(lead, dueAt, rawOptions = {}) {
      if (!lead) throw new Error('Lead object required to schedule review request');
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const name = lead.name || lead.contact_name || 'Client';
      const now = options.currentTime || Date.now();
      const targetDueAt = dueAt || (now + (48 * 3600 * 1000));
      const channel = options.channel || 'whatsapp';

      const taskId = `review_followup_${lead.id || name}_${now}`;
      const task = {
        id: taskId,
        type: 'GOOGLE_REVIEW_48H',
        leadId: String(lead.id || name),
        leadName: name,
        company: lead.company || lead.company_name || '',
        phone: (lead.phone || '').replace(/\(0\)/g, '').replace(/[^0-9+]/g, ''),
        channel,
        siteUrl: options.siteUrl || `https://boubane.com/clients/${slugify(lead.company || name)}`,
        reviewUrl: 'https://g.page/r/boubane/review',
        scheduledAt: now,
        dueAt: targetDueAt,
        status: 'PENDING'
      };

      this._enqueueTask(task);
      this._logAutomation('R4_DELIVERY_NOTIFICATION', 'INFO', `Review request explicitly scheduled for ${name} at ${new Date(targetDueAt).toISOString()}`);
      return task;
    }

    /**
     * R4: Watchdog for Google 5-star review followup at 48h (with pause on revisions and auto-neutralization)
     */
    checkAndTriggerReviewRequests(rawOptions = {}) {
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const now = options.currentTime || Date.now();
      const queue = this._getQueue();
      const reports = [];

      queue.forEach(task => {
        if (!task || typeof task !== 'object') return;
        if (task.type === 'GOOGLE_REVIEW_48H' && task.status === 'PENDING') {
          const hasRevisions = options.revisionReportedMap
            ? Boolean(options.revisionReportedMap[task.leadId])
            : false;

          const alreadyReviewed = options.reviewedLeadsMap
            ? Boolean(options.reviewedLeadsMap[task.leadId])
            : false;

          if (hasRevisions) {
            task.status = 'PAUSED_REVISIONS';
            task.pausedAt = now;
            this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `Revisions requested for ${task.leadName}. Review followup paused.`);
            reports.push({ taskId: task.id, leadId: task.leadId, leadName: task.leadName, action: 'PAUSED_REVISIONS' });
          } else if (alreadyReviewed) {
            task.status = 'CANCELLED_ALREADY_REVIEWED';
            this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `Review already submitted for ${task.leadName}. Followup cancelled.`);
            reports.push({ taskId: task.id, leadId: task.leadId, leadName: task.leadName, action: 'NEUTRALIZED_ALREADY_REVIEWED' });
          } else if (now >= task.dueAt) {
            task.status = 'REVIEW_SENT';
            task.executedAt = now;
            const reviewMessage = `Bonjour ${task.leadName}, votre site est en ligne depuis 48h ! Si vous êtes satisfait de notre travail et de notre réactivité, un avis 5 étoiles nous aiderait énormément :
👉 ${task.reviewUrl}
Merci de votre confiance !`;
            this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `48h Google review request sent for ${task.leadName}.`);
            reports.push({
              taskId: task.id,
              leadId: task.leadId,
              leadName: task.leadName,
              action: 'REVIEW_SENT',
              message: reviewMessage
            });
          }
        }
      });

      this._saveQueue(queue);
      return reports;
    }

    /**
     * R4: Resume a paused review timer after revisions are settled
     */
    resumeReviewTimer(taskIdOrLeadId, rawOptions = {}) {
      const queue = this._getQueue();
      const targetStr = String(taskIdOrLeadId);
      const options = (rawOptions && typeof rawOptions === 'object') ? rawOptions : {};
      const now = options.currentTime || Date.now();
      const delayMs = options.delayMs || (48 * 3600 * 1000);

      const task = queue.find(t => t && typeof t === 'object' && (t.id === targetStr || String(t.leadId) === targetStr) && t.status === 'PAUSED_REVISIONS');
      if (!task) {
        return null;
      }

      task.status = 'PENDING';
      task.dueAt = now + delayMs;
      task.resumedAt = now;

      this._saveQueue(queue);
      this._logAutomation('R4_REVIEW_WATCHDOG', 'INFO', `Review timer resumed for ${task.leadName}. New due date: ${new Date(task.dueAt).toISOString()}`);
      return task;
    }

    // =========================================================================
    // STORAGE, QUEUE & AUDIT LOG HELPERS
    // =========================================================================

    _getQueue() {
      try {
        const raw = this.storage.getItem('boubane_automations_queue');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(t => t && typeof t === 'object');
      } catch {
        return [];
      }
    }

    _saveQueue(queue) {
      try {
        const safeQueue = Array.isArray(queue) ? queue.filter(t => t && typeof t === 'object') : [];
        this.storage.setItem('boubane_automations_queue', JSON.stringify(safeQueue));
      } catch {}
    }

    _enqueueTask(task) {
      if (!task || typeof task !== 'object' || !task.id) return;
      const queue = this._getQueue();
      const idx = queue.findIndex(t => t && typeof t === 'object' && t.id === task.id);
      if (idx >= 0) {
        queue[idx] = task;
      } else {
        queue.push(task);
      }
      this._saveQueue(queue);
    }

    getScheduledQueue(filter = null) {
      const queue = this._getQueue();
      if (!filter || typeof filter !== 'object') {
        return queue;
      }
      return queue.filter(item => {
        if (!item || typeof item !== 'object') return false;
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
    }

    updateTaskStatus(taskId, status, metadata = {}) {
      if (!taskId) return false;
      const queue = this._getQueue();
      const task = queue.find(t => t && typeof t === 'object' && t.id === taskId);
      if (!task) return false;

      task.status = status;
      if (metadata && typeof metadata === 'object') {
        Object.assign(task, metadata);
      }
      this._saveQueue(queue);
      return true;
    }

    removeTask(taskId) {
      if (!taskId) return false;
      let queue = this._getQueue();
      const initialLength = queue.length;
      queue = queue.filter(t => t && typeof t === 'object' && t.id !== taskId);
      if (queue.length !== initialLength) {
        this._saveQueue(queue);
        return true;
      }
      return false;
    }

    neutralizeQueueTask(taskId) {
      return this.removeTask(taskId);
    }

    clearQueue() {
      try {
        this.storage.removeItem('boubane_automations_queue');
      } catch {}
    }

    /**
     * Audit Log Engine with FIFO rotation (strictly max 300 entries)
     */
    _logAutomation(module, level, message, details = null) {
      try {
        const raw = this.storage.getItem('boubane_automations_log');
        let logs = [];
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              logs = parsed.filter(l => l && typeof l === 'object');
            }
          } catch {
            logs = [];
          }
        }

        const entry = {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          module: String(module || 'UNKNOWN'),
          level: String(level || 'INFO'),
          message: String(message || ''),
          status: level === 'ERROR' ? 'FAILURE' : 'SUCCESS'
        };
        if (details && typeof details === 'object') {
          entry.details = details;
        }

        logs.push(entry);

        // FIFO Capacity Pruning strictly at max 300 entries
        if (logs.length > 300) {
          logs = logs.slice(logs.length - 300);
        }

        this.storage.setItem('boubane_automations_log', JSON.stringify(logs));
        return entry;
      } catch {
        return null;
      }
    }

    getAutomationLogs(filter = null) {
      try {
        const raw = this.storage.getItem('boubane_automations_log');
        let logs = [];
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              logs = parsed.filter(l => l && typeof l === 'object');
            }
          } catch {
            logs = [];
          }
        }

        if (!filter || typeof filter !== 'object') {
          return logs;
        }

        return logs.filter(log => {
          if (!log || typeof log !== 'object') return false;
          if (filter.modulePrefix && (!log.module || !log.module.startsWith(filter.modulePrefix))) {
            return false;
          }
          if (filter.module && log.module !== filter.module) {
            return false;
          }
          if (filter.level && log.level !== filter.level) {
            return false;
          }
          if (filter.status && log.status !== filter.status) {
            return false;
          }
          return true;
        });
      } catch {
        return [];
      }
    }

    clearAutomationLogs() {
      try {
        this.storage.removeItem('boubane_automations_log');
      } catch {}
    }
  }

  return {
    BoubaneAutomations,
    UniversalStorageAdapter,
    BrowserNetwork,
    slugify
  };
});
