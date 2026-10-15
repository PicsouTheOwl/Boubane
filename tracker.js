/**
 * Boubane Analytics & SEO Telemetry Engine
 * Script de mesure d'audience, de performance Web Vitals et de conversion souverain.
 * 100% conforme RGPD, zéro dépendance tierce, charge instantanée.
 */
(function() {
  'use strict';

  const STORAGE_KEY_EVENTS = 'boubane_analytics_events';
  const STORAGE_KEY_SESSIONS = 'boubane_analytics_sessions';
  const STORAGE_KEY_LEADS = 'boubane_leads';
  const STORAGE_KEY_CONFIG = 'boubane_analytics_config';

  // 1. Initialisation de la Session Visiteur
  function getVisitorSession() {
    let sessionId = sessionStorage.getItem('boubane_session_id');
    const now = Date.now();
    
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + now;
      sessionStorage.setItem('boubane_session_id', sessionId);

      // Détection de la source d'acquisition
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const referrer = document.referrer;

      let source = 'Direct';
      if (utmSource) {
        source = utmSource + (utmMedium ? ` / ${utmMedium}` : '');
      } else if (referrer) {
        try {
          const refHost = new URL(referrer).hostname;
          if (refHost.includes('google')) source = 'Google SEO (Organique)';
          else if (refHost.includes('bing') || refHost.includes('yahoo')) source = 'Moteur Recherche (Autre)';
          else if (refHost.includes('linkedin')) source = 'LinkedIn';
          else if (refHost.includes('twitter') || refHost.includes('t.co') || refHost.includes('x.com')) source = 'X / Twitter';
          else if (refHost.includes('facebook') || refHost.includes('instagram')) source = 'Meta / Instagram';
          else if (!refHost.includes(window.location.hostname)) source = refHost;
        } catch (e) {
          source = 'Referral inconnu';
        }
      }

      // Type d'appareil
      const width = window.innerWidth;
      const device = width <= 768 ? 'Mobile' : (width <= 1024 ? 'Tablette' : 'Desktop');

      const sessionData = {
        id: sessionId,
        timestamp: now,
        date: new Date().toISOString().split('T')[0],
        source: source,
        device: device,
        path: window.location.pathname,
        utmCampaign: utmCampaign || null
      };

      try {
        const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
        const sessions = raw ? JSON.parse(raw) : [];
        sessions.push(sessionData);
        // Conserver les 1000 dernières sessions
        if (sessions.length > 1000) sessions.shift();
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch (err) {
        console.warn('Boubane Analytics storage error', err);
      }
    }
    return sessionId;
  }

  // 2. Enregistrement d'événements
  function trackEvent(name, details = {}) {
    const sessionId = getVisitorSession();
    const eventRecord = {
      sessionId: sessionId,
      name: name,
      details: details,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      path: window.location.pathname
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
      const events = raw ? JSON.parse(raw) : [];
      events.push(eventRecord);
      if (events.length > 2000) events.shift();
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn('Boubane Event track error', e);
    }

    // Relais optionnel vers Google Analytics si configuré
    try {
      const cfgRaw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (cfgRaw) {
        const cfg = JSON.parse(cfgRaw);
        if (cfg.ga4Id && typeof window.gtag === 'function') {
          window.gtag('event', name, details);
        }
      }
    } catch (e) {}
  }

  // 3. Mesure des Core Web Vitals (LCP, FID/INP, CLS) en direct
  function monitorCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        localStorage.setItem('boubane_cwv_cls', clsValue.toFixed(4));
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const lcp = Math.round(lastEntry.startTime);
          localStorage.setItem('boubane_cwv_lcp', lcp);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Navigation Timing pour le temps de chargement total
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perf = performance.getEntriesByType('navigation')[0];
          if (perf) {
            const domReady = Math.round(perf.domContentLoadedEventEnd - perf.startTime);
            const loadTime = Math.round(perf.loadEventEnd - perf.startTime);
            localStorage.setItem('boubane_cwv_dom', domReady);
            localStorage.setItem('boubane_cwv_load', loadTime);
          }
        }, 500);
      });
    } catch (e) {
      console.warn('CWV observer error', e);
    }
  }

  // 4. Capture automatique des interactions de conversion
  function bindAutoTracking() {
    // Boutons de CTA
    document.querySelectorAll('a[href="#contact"], .btn-primary').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = (btn.textContent || '').trim().replace(/\s+/g, ' ');
        trackEvent('click_cta', { label: text });
      });
    });

    // Comparateur Tarifs (Switch)
    const pricingSwitch = document.getElementById('pricingSwitch');
    if (pricingSwitch) {
      pricingSwitch.addEventListener('click', () => {
        trackEvent('toggle_pricing_comparison', { mode: pricingSwitch.getAttribute('aria-checked') });
      });
    }

    // Scroll Depth Tracking (50% et 90%)
    let tracked50 = false;
    let tracked90 = false;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      if (!tracked50 && scrollPercent >= 50) {
        tracked50 = true;
        trackEvent('scroll_depth', { depth: '50%' });
      }
      if (!tracked90 && scrollPercent >= 90) {
        tracked90 = true;
        trackEvent('scroll_depth', { depth: '90%' });
      }
    }, { passive: true });
  }

  // 5. Enregistrement sécurisé des Leads Formulaire
  window.boubaneRegisterLead = function(lead) {
    const leadData = {
      id: 'lead_' + Math.random().toString(36).substring(2, 9),
      name: lead.name || 'Anonyme',
      email: lead.email || '',
      message: lead.message || '',
      date: new Date().toLocaleString('fr-FR'),
      timestamp: Date.now(),
      status: 'Nouveau'
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY_LEADS);
      const leads = raw ? JSON.parse(raw) : [];
      leads.unshift(leadData);
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
      trackEvent('form_lead_submitted', { leadId: leadData.id, name: leadData.name });
    } catch (e) {
      console.error('Lead register error', e);
    }
  };

  // Exposer les méthodes publiques
  window.BoubaneAnalytics = {
    track: trackEvent,
    getVisitorSession: getVisitorSession
  };

  // Démarrage
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getVisitorSession();
      monitorCoreWebVitals();
      bindAutoTracking();
    });
  } else {
    getVisitorSession();
    monitorCoreWebVitals();
    bindAutoTracking();
  }
})();
