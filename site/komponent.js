/**
 * Boubane — Komponent Interactions (World-Class Pulsor Essence)
 * Modules interactifs ultra-légers sans dépendances tierces.
 */

// 1. Modales
function openModal(modalId) {
  const modal = document.getElementById(modalId || 'contactModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = modal.querySelector('input, textarea, button:not(.modal-close)');
    if (firstInput) firstInput.focus();
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = typeof modalId === 'string' ? document.getElementById(modalId) : (modalId || document.querySelector('.modal-overlay.active'));
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) closeModal(activeModal);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target);
  }
});

// 2. Accordéon FAQ Accessible
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const isExpanded = item.classList.contains('active');
  
  document.querySelectorAll('.faq-item').forEach(el => {
    if (el !== item) {
      el.classList.remove('active');
      const b = el.querySelector('.faq-question');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  });

  if (isExpanded) {
    item.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    item.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// 3. Soumission Formulaire & Enregistrement Lead
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const successMessage = document.getElementById('formSuccessMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  const contactName = document.getElementById('contactName')?.value || 'Client';
  const contactEmail = document.getElementById('contactEmail')?.value || '';
  const contactDetails = document.getElementById('contactDetails')?.value || '';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
  }

  // Enregistrer le lead pour le dashboard
  if (typeof window.boubaneRegisterLead === 'function') {
    window.boubaneRegisterLead({
      name: contactName,
      email: contactEmail,
      message: contactDetails
    });
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer ma demande';
    }
    form.reset();
    if (successMessage) {
      successMessage.style.display = 'flex';
      setTimeout(() => {
        successMessage.style.display = 'none';
        closeModal();
      }, 4000);
    } else {
      alert('Merci ! Votre message a bien été envoyé. Je vous réponds sous 24h.');
      closeModal();
    }
  }, 600);
}

// 4. Review Rotator (Carrousel d'Avis Centré Pulsor-Style)
function initReviewRotator() {
  const slides = document.querySelectorAll('.hero-review-slide');
  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 3800);
}

// 6. Interactive Pricing Toggle (Mise en lumière cinématographique)
function initPricingToggle() {
  const switchBtn = document.getElementById('pricingSwitch');
  const labelAgency = document.getElementById('labelAgency');
  const labelBoubane = document.getElementById('labelBoubane');
  const cardAgency = document.getElementById('cardAgency');
  const cardBoubane = document.getElementById('cardBoubane');

  if (!switchBtn || !cardAgency || !cardBoubane) return;

  let isBoubaneMode = true; // Par défaut Boubane en avant

  function setMode(boubane) {
    isBoubaneMode = boubane;

    if (isBoubaneMode) {
      switchBtn.classList.add('active');
      switchBtn.classList.remove('agency-active');
      switchBtn.setAttribute('aria-checked', 'true');

      if (labelBoubane) labelBoubane.classList.add('active');
      if (labelAgency) labelAgency.classList.remove('active');

      cardBoubane.classList.add('highlight');
      cardAgency.classList.remove('highlight');
    } else {
      switchBtn.classList.remove('active');
      switchBtn.classList.add('agency-active');
      switchBtn.setAttribute('aria-checked', 'false');

      if (labelAgency) labelAgency.classList.add('active');
      if (labelBoubane) labelBoubane.classList.remove('active');

      cardAgency.classList.add('highlight');
      cardBoubane.classList.remove('highlight');
    }
  }

  switchBtn.addEventListener('click', () => setMode(!isBoubaneMode));
  if (labelAgency) labelAgency.addEventListener('click', () => setMode(false));
  if (labelBoubane) labelBoubane.addEventListener('click', () => setMode(true));

  // Clic direct sur une carte pour transférer la mise en lumière
  cardAgency.addEventListener('click', (e) => {
    if (!e.target.closest('a, button')) {
      setMode(false);
    }
  });
  cardBoubane.addEventListener('click', (e) => {
    if (!e.target.closest('a, button')) {
      setMode(true);
    }
  });

  setMode(true);
}

// 7. Scroll Reveal Observer (Transitions Fluides au Défilement)
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  elements.forEach(el => observer.observe(el));
}

// 8. Initialisation au chargement & Micro-interactions 3D Tilt
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#contact') {
    openModal('contactModal');
  } else if (window.location.hash === '#mentions-legales') {
    openModal('legalModal');
  }

  initReviewRotator();
  initPricingToggle();
  initScrollReveal();

  // 8. Interaction 3D Interactive Ramp Card (The Boubane Studio Card)
  const boubaneCard = document.getElementById('boubaneCard3d');
  const cardStage = document.querySelector('.boubane-card-stage');
  const cardGlare = boubaneCard?.querySelector('.card-glare');

  if (boubaneCard && cardStage && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let bounds;
    function rotateToMouse(e) {
      bounds = boubaneCard.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };

      const maxRotate = 14;
      const rotateX = (center.y / (bounds.height / 2)) * -maxRotate;
      const rotateY = (center.x / (bounds.width / 2)) * maxRotate;

      boubaneCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

      if (cardGlare) {
        const glareX = (leftX / bounds.width) * 100;
        const glareY = (topY / bounds.height) * 100;
        cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`;
      }
    }

    cardStage.addEventListener('mouseenter', () => {
      boubaneCard.style.transition = 'transform 0.1s ease-out';
    });

    cardStage.addEventListener('mousemove', rotateToMouse);

    cardStage.addEventListener('mouseleave', () => {
      boubaneCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      boubaneCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (cardGlare) {
        cardGlare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)';
      }
    });
  }

  // 3D Tilt sur les cartes piliers et cartes tarifs (les maquettes sont exemptées pour la précision des clics)
  const tiltCards = document.querySelectorAll('.pillar-card, .pricing-plan-card');
  if (tiltCards.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -2.5;
        const rotateY = ((x - centerX) / centerX) * 2.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.transition = 'transform 0.4s ease';
      });

    });
  }
});

// 9. Moteur de Navigation des Maquettes Interactives de Sites Web
const mockupState = {
  astra: {
    views: ['home', 'audit', 'gestion', 'calc'],
    paths: ['/audit-operationnel', '/audit-terrain-360', '/pilotage-exploitation', '/simulateur-rentabilite'],
    current: 0
  },
  achille: {
    views: ['auto', 'copilot', 'insights', 'calc'],
    paths: ['/automation', '/mode-copilote', '/insights-racine', '/simulateur-economie'],
    current: 0
  },
  valmy: {
    views: ['deals', 'method', 'team', 'audit'],
    paths: ['/mandats', '/methode', '/associes', '/audit-préalable'],
    current: 0
  }
};

function switchMockupPage(site, viewKey, path, btnElement) {
  const container = document.getElementById(
    site === 'astra' ? 'mockupAstra' : (site === 'achille' ? 'mockupAchille' : 'mockupValmy')
  );
  if (!container) return;

  // Mise à jour de l'état
  if (mockupState[site]) {
    const idx = mockupState[site].views.indexOf(viewKey);
    if (idx !== -1) mockupState[site].current = idx;
  }

  // Activer l'onglet cliqué
  const tabs = container.querySelectorAll('.cs-mockup-tab-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Basculer la vue visible
  const views = container.querySelectorAll('.cs-page-view');
  views.forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`${site}View_${viewKey}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Mettre à jour l'URL path
  const urlPath = document.getElementById(`${site}UrlPath`);
  if (urlPath) {
    urlPath.textContent = path;
  }

  // Micro-flash sur le badge de vitesse (< 0.28s)
  const speedBadge = document.getElementById(`${site}SpeedBadge`);
  if (speedBadge) {
    speedBadge.style.opacity = '0.3';
    setTimeout(() => {
      speedBadge.style.opacity = '1';
    }, 120);
  }

  // Scroll to top of viewport
  const viewport = container.querySelector('.cs-viewport');
  if (viewport) {
    viewport.scrollTop = 0;
  }
}

function navigateMockup(site, direction) {
  const state = mockupState[site];
  if (!state) return;

  state.current = (state.current + direction + state.views.length) % state.views.length;
  const viewKey = state.views[state.current];
  const path = state.paths[state.current];

  const container = document.getElementById(
    site === 'astra' ? 'mockupAstra' : (site === 'achille' ? 'mockupAchille' : 'mockupValmy')
  );
  if (!container) return;

  const tabs = container.querySelectorAll('.cs-mockup-tab-btn');
  const targetTab = tabs[state.current];
  switchMockupPage(site, viewKey, path, targetTab);
}

// Interactions des simulateurs intégrés
function setAstraProject(btn, name, price) {
  const parent = btn.closest('.cs-mock-calc-row');
  if (parent) {
    parent.querySelectorAll('.cs-mock-calc-btn').forEach(b => b.classList.remove('selected'));
  }
  btn.classList.add('selected');
  const priceDisplay = document.getElementById('astraPriceDisplay');
  if (priceDisplay) {
    priceDisplay.textContent = `${price} / saison`;
  }
}

function setAchilleTickets(btn, volume, economy, hours) {
  const parent = btn.closest('.cs-mock-calc-row');
  if (parent) {
    parent.querySelectorAll('.cs-mock-calc-btn').forEach(b => b.classList.remove('selected'));
  }
  btn.classList.add('selected');
  const priceDisplay = document.getElementById('achillePriceDisplay');
  if (priceDisplay) {
    priceDisplay.textContent = `${economy} · ${hours} gagnées`;
  }
}

// 9b. Gestion du Portail Plein Écran Universel (Immersion Vitrines Web)
let activeFullscreenSite = null;

function toggleFullscreenMockup(site) {
  openPortalFullscreen(site || 'astra');
}

function openActiveFullscreen() {
  const sites = ['astra', 'achille', 'valmy', 'studio'];
  const siteKey = sites[currentHeroCardIndex] || 'astra';
  openPortalFullscreen(siteKey === 'studio' ? 'astra' : siteKey);
}

function openPortalFullscreen(siteKey) {
  const portal = document.getElementById('mockupFullscreenPortal');
  if (!portal) return;

  const validKey = (siteKey === 'astra' || siteKey === 'achille' || siteKey === 'valmy') ? siteKey : 'astra';
  switchPortalSite(validKey);

  portal.classList.add('active');
  portal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mockup-modal-open');
  activeFullscreenSite = validKey;
  stopHeroCardTimer();
  document.addEventListener('keydown', handleMockupKeydown);
}

function closeFullscreenMockup() {
  const portal = document.getElementById('mockupFullscreenPortal');
  if (portal) {
    portal.classList.remove('active');
    portal.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.cs-cell--windowed.is-fullscreen').forEach(el => el.classList.remove('is-fullscreen'));
  document.body.classList.remove('mockup-modal-open');
  activeFullscreenSite = null;
  document.removeEventListener('keydown', handleMockupKeydown);
  startHeroCardTimer();
}

function switchPortalSite(siteKey) {
  const key = (siteKey === 'astra' || siteKey === 'achille' || siteKey === 'valmy') ? siteKey : 'astra';
  activeFullscreenSite = key;

  // Mettre à jour les onglets de switch dans la fenêtre portail
  const tabAstra = document.getElementById('portalTabAstra');
  const tabAchille = document.getElementById('portalTabAchille');
  const tabValmy = document.getElementById('portalTabValmy');
  if (tabAstra) tabAstra.classList.toggle('active', key === 'astra');
  if (tabAchille) tabAchille.classList.toggle('active', key === 'achille');
  if (tabValmy) tabValmy.classList.toggle('active', key === 'valmy');

  const iframe = document.getElementById('portalIframe');
  const inlineContainer = document.getElementById('portalInlineContainer');
  const urlText = document.getElementById('portalUrlText');
  const extLink = document.getElementById('portalExtLink');
  const capDot = document.getElementById('portalCapDot');
  const capTitle = document.getElementById('portalCapTitle');
  const capVisitBtn = document.getElementById('portalCapVisitBtn');

  if (key === 'astra') {
    if (iframe) {
      iframe.style.display = 'block';
      if (!iframe.src || !iframe.src.includes('showcase-astra.html')) {
        iframe.src = 'showcase-astra.html';
      }
    }
    if (inlineContainer) inlineContainer.style.display = 'none';
    if (urlText) urlText.textContent = 'astravacances.fr/audit-operationnel';
    if (extLink) extLink.href = 'showcase-astra.html';
    if (capDot) capDot.style.background = '#2B9BBD';
    if (capTitle) capTitle.textContent = 'Astravacances.fr — Vitrine Réalisée par Studio Boubane (Vitesse < 0.3s)';
    if (capVisitBtn) {
      capVisitBtn.href = 'showcase-astra.html';
      capVisitBtn.textContent = 'Ouvrir en pleine page ↗';
    }
  } else if (key === 'achille') {
    if (iframe) iframe.style.display = 'none';
    if (inlineContainer) {
      inlineContainer.style.display = 'block';
      const origViewport = document.querySelector('#mockupAchille .cs-viewport');
      if (origViewport && inlineContainer.innerHTML.trim() === '') {
        inlineContainer.innerHTML = origViewport.innerHTML;
      }
    }
    if (urlText) urlText.textContent = 'achille.ai/automation';
    if (extLink) extLink.href = 'https://achille.ai';
    if (capDot) capDot.style.background = '#6366F1';
    if (capTitle) capTitle.textContent = 'Achille.ai — Support Client AI-First (Latence 18ms)';
    if (capVisitBtn) {
      capVisitBtn.href = 'https://achille.ai';
      capVisitBtn.textContent = 'Visiter achille.ai ↗';
    }
  } else if (key === 'valmy') {
    if (iframe) iframe.style.display = 'none';
    if (inlineContainer) {
      inlineContainer.style.display = 'block';
      const origViewport = document.querySelector('#mockupValmy .cs-viewport');
      if (origViewport && inlineContainer.innerHTML.trim() === '') {
        inlineContainer.innerHTML = origViewport.innerHTML;
      }
    }
    if (urlText) urlText.textContent = 'cabinet-valmy.com/mandats';
    if (extLink) extLink.href = 'https://cabinet-valmy.com';
    if (capDot) capDot.style.background = '#F59E0B';
    if (capTitle) capTitle.textContent = 'Cabinet Valmy — Barreau d\'affaires M&A & Cession d\'entreprises';
    if (capVisitBtn) {
      capVisitBtn.href = 'https://cabinet-valmy.com';
      capVisitBtn.textContent = 'Visiter cabinet-valmy.com ↗';
    }
  }
}

function reloadPortalIframe() {
  const iframe = document.getElementById('portalIframe');
  if (iframe && iframe.style.display !== 'none') {
    iframe.src = iframe.src;
    showBoubaneToast('↻ Page rechargée (< 0.3s)');
  }
}

function toggleNativeFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function handleMockupKeydown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeFullscreenMockup();
  } else if (e.key === 'ArrowRight') {
    const sites = ['astra', 'achille', 'valmy'];
    const currentIdx = sites.indexOf(activeFullscreenSite);
    const nextIdx = (currentIdx + 1) % sites.length;
    switchPortalSite(sites[nextIdx]);
  } else if (e.key === 'ArrowLeft') {
    const sites = ['astra', 'achille', 'valmy'];
    const currentIdx = sites.indexOf(activeFullscreenSite);
    const prevIdx = (currentIdx - 1 + sites.length) % sites.length;
    switchPortalSite(sites[prevIdx]);
  }
}

function openActiveSiteExternal() {
  const urls = [
    'showcase-astra.html',
    'https://achille.ai',
    'https://cabinet-valmy.com',
    '#tarifs'
  ];
  const url = urls[currentHeroCardIndex] || 'showcase-astra.html';
  if (url.startsWith('http') || url.endsWith('.html')) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.hash = url;
  }
}

// Sélecteur Responsive Device (Desktop / Tablette / Mobile)
function setMockupDevice(site, device, btn) {
  const containerId = site === 'astra' ? 'mockupAstra' : (site === 'achille' ? 'mockupAchille' : 'mockupValmy');
  const container = document.getElementById(containerId);
  if (!container) return;

  container.classList.remove('device-tablet', 'device-mobile');
  if (device === 'tablet') {
    container.classList.add('device-tablet');
    showBoubaneToast('📱 Vue Tablette activée (768px)');
  } else if (device === 'mobile') {
    container.classList.add('device-mobile');
    showBoubaneToast('📲 Vue Mobile activée (390px)');
  } else {
    showBoubaneToast('🖥️ Vue Plein Écran Desktop rétablie');
  }

  // Activer le bouton cliqué
  const parent = btn.closest('.cs-device-switch');
  if (parent) {
    parent.querySelectorAll('.cs-device-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// Simulation de rechargement éclair
function reloadMockup(site, btn) {
  if (btn) {
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 500);
  }

  const containerId = site === 'astra' ? 'mockupAstra' : (site === 'achille' ? 'mockupAchille' : 'mockupValmy');
  const container = document.getElementById(containerId);
  if (container) {
    const iframe = container.querySelector('iframe');
    if (iframe) {
      try {
        iframe.contentWindow.location.reload();
      } catch (e) {
        iframe.src = iframe.src;
      }
    }
    const vp = container.querySelector('.cs-viewport');
    if (vp) {
      vp.style.opacity = '0.35';
      setTimeout(() => {
        vp.style.opacity = '1';
      }, 160);
    }
  }
  showBoubaneToast('⚡ Rechargé en 0.22s · Cache Cloudflare Edge Actif');
}

// Copie de l'URL dans le presse-papier
function copyMockupUrl(url, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showBoubaneToast(`📋 Lien copié : ${url}`);
    }).catch(() => {
      showBoubaneToast(`Lien : ${url}`);
    });
  } else {
    showBoubaneToast(`Lien : ${url}`);
  }
}

// Toast notification
let toastTimer = null;
function showBoubaneToast(message) {
  let toast = document.getElementById('boubaneToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'boubaneToast';
    toast.className = 'boubane-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// Slider interactif d'emplacements Astravacances
let astraMultiplier = 160;

function setAstraStructure(multiplier, name, btn) {
  astraMultiplier = multiplier;
  const parent = btn.closest('.cs-mock-segment-row');
  if (parent) {
    parent.querySelectorAll('.cs-mock-segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const slider = document.getElementById('astraRangeInput');
  const val = slider ? slider.value : 150;
  updateAstraSlider(val);
  showBoubaneToast(`✦ Profil appliqué : ${name}`);
}

function updateAstraSlider(val) {
  const lbl = document.getElementById('astraSliderVal');
  const priceDisplay = document.getElementById('astraPriceDisplay');
  if (lbl) lbl.textContent = `${val} emplacements`;

  // Formule de calcul réaliste HPA selon le multiplicateur sélectionné
  const gain = Math.round((val * astraMultiplier) / 500) * 500;
  if (priceDisplay) {
    priceDisplay.textContent = `+${gain.toLocaleString('fr-FR')} € / saison`;
  }
}

// Chatbot interactif Achille.ai
function sendAchillePrompt(question, answer) {
  const msgsContainer = document.getElementById('achilleChatMsgs');
  if (!msgsContainer) return;

  // Ajout du message utilisateur
  const userMsg = document.createElement('div');
  userMsg.className = 'cs-mock-chat-msg cs-mock-chat-msg--user';
  userMsg.innerHTML = `<div class="cs-mock-chat-bubble">${question}</div>`;
  msgsContainer.appendChild(userMsg);

  // Indicateur de frappe temporaire
  const typingMsg = document.createElement('div');
  typingMsg.className = 'cs-mock-chat-msg cs-mock-chat-msg--bot typing';
  typingMsg.innerHTML = `<div class="cs-mock-chat-bubble" style="opacity: 0.6; font-style: italic;">✦ Achille IA analyse... (18ms)</div>`;
  msgsContainer.appendChild(typingMsg);
  msgsContainer.scrollTop = msgsContainer.scrollHeight;

  setTimeout(() => {
    typingMsg.remove();
    const botMsg = document.createElement('div');
    botMsg.className = 'cs-mock-chat-msg cs-mock-chat-msg--bot';
    botMsg.innerHTML = `
      <div class="cs-mock-chat-bubble">
        <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #818CF8; margin-bottom: 4px;">✦ ACHILLE IA · 18ms</div>
        <div>${answer}</div>
      </div>
    `;
    msgsContainer.appendChild(botMsg);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }, 220);
}

// Soumission libre du formulaire de chat Achille
function handleAchilleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('achilleUserInput');
  if (!input) return;
  const q = input.value.trim();
  if (!q) return;

  input.value = '';
  const lower = q.toLowerCase();
  let answer = "Votre demande a été prise en charge en 18ms. Une confirmation vous a été transmise par e-mail et synchronisée dans votre CRM Shopify.";

  if (lower.includes('colis') || lower.includes('suivi') || lower.includes('livraison') || lower.includes('où')) {
    answer = "Votre commande est expédiée via Colissimo Expert (n° 6A91024). Arrivée programmée demain entre 09h et 12h à votre domicile !";
  } else if (lower.includes('retour') || lower.includes('échange') || lower.includes('remboursement') || lower.includes('taille')) {
    answer = "Étiquette Mondial Relay prépayée générée instantanément. Le remboursement de 89,00 € sera automatiquement recrédité sous 24h ouvrées.";
  } else if (lower.includes('suisse') || lower.includes('belgique') || lower.includes('international') || lower.includes('délais')) {
    answer = "Livraison express assurée sous 48h ouvrées avec suivi temps réel et formalités douanières automatisées sans frais annexes.";
  } else if (lower.includes('prix') || lower.includes('tarif') || lower.includes('cout') || lower.includes('coût')) {
    answer = "Achille s'amortit dès 150 tickets mensuels. Essai gratuit 14 jours sans engagement avec configuration clé en main en 15 minutes.";
  } else if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) {
    answer = "Bonjour ! Je suis l'IA Achille, conçue pour automatiser 50% de vos tickets clients e-commerce en 18ms. Que puis-je faire pour vous ?";
  }

  sendAchillePrompt(q, answer);
}

// Simulateur de valorisation M&A Cabinet Valmy
function updateValmyValuation(caValue) {
  const ca = parseFloat(caValue);
  const caValLabel = document.getElementById('valmyCaVal');
  const priceDisplay = document.getElementById('valmyPriceDisplay');

  if (caValLabel) {
    caValLabel.textContent = `${ca.toFixed(1)} M€`;
  }

  // Formule M&A : Marge EBITDA estimée ~18%, Multiple moyen de 5.5x à 7.5x
  const ebitda = ca * 0.18;
  const valLow = (ebitda * 5.5).toFixed(1);
  const valHigh = (ebitda * 7.5).toFixed(1);

  if (priceDisplay) {
    priceDisplay.textContent = `${valLow} M€ — ${valHigh} M€`;
  }
}

// Filtre des mandats Cabinet Valmy
function filterValmyDeals(category, btn) {
  const cards = document.querySelectorAll('.cs-valmy-deal-card');
  const buttons = document.querySelectorAll('.cs-valmy-filter-btn');

  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-sector');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.animation = 'csChatFade 0.2s ease-out forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// 10. Contrôleur du Hero Showcase : Défilement et sélection des cartes de sites sur la Hero
let currentHeroCardIndex = 0;
let heroCardTimer = null;
let isHeroInteracting = false;

const heroSiteMetadata = [
  {
    key: "astra",
    name: "Astravacances.fr",
    badge: "Tourisme",
    logo: "assets/astra-logo.png",
    kpi: "⚡ Vitesse : 0.27s · PageSpeed 100/100",
    desc: "Astravacances.fr — Plateforme d'audit et gestion opérationnelle pour campings et résidences avec simulateur de gain d'EBITDA."
  },
  {
    key: "achille",
    name: "Achille.ai",
    badge: "IA SaaS",
    logo: "assets/achille-logo.png",
    kpi: "⚡ Vitesse : 0.24s · IA 18ms",
    desc: "Achille.ai — Support client e-commerce & SaaS AI-first automatisant 50% des tickets avec synchronisation Shopify et Gorgias."
  },
  {
    key: "valmy",
    name: "Cabinet Valmy",
    badge: "M&A",
    logo: null,
    seal: "V",
    kpi: "⚡ Vitesse : 0.26s · Audit 0 €",
    desc: "Cabinet Valmy — Barreau d'affaires M&A, transmission d'entreprises confidentielle et simulateur d'audit préalable."
  },
  {
    key: "studio",
    name: "Studio",
    badge: "Carte 3D",
    logo: "assets/boubane-logo.png",
    kpi: "⚡ Vitesse < 0.3s · Carte Membre",
    desc: "Boubane Studio — Passeport digital haute autorité avec puce dorée gravée, effet gyroscopique 3D et zéro frais d'agence."
  }
];

// État de la fenêtre active et du Dock macOS
let isWindowMinimized = false;
let isDockTransitioning = false;

// 1. Déclenchement de l'animation de minimisation macOS (Pastille orange/jaune, bouton rouge ou clic Dock sur l'application active)
function minimizeMockupAnimated(targetIndex, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (isDockTransitioning || isWindowMinimized) return;

  const idx = (typeof targetIndex === 'number') ? targetIndex : currentHeroCardIndex;
  const activeSlide = document.getElementById(`heroSlide${idx}`) || document.querySelector('.hero-card-slide.active');

  // Si la fenêtre est en plein écran, fermer d'abord le mode plein écran
  if (activeFullscreenSite) {
    closeFullscreenMockup();
  }

  if (activeSlide) {
    isDockTransitioning = true;
    const windowCell = activeSlide.querySelector('.cs-cell--windowed') || activeSlide;

    // Onde de choc lumineuse orange sur la pastille
    const orangeDot = windowCell.querySelector('.cs-dot--orange, .cs-dot--yellow');
    if (orangeDot) {
      const shockwave = document.createElement('div');
      shockwave.className = 'cs-orange-shockwave';
      orangeDot.appendChild(shockwave);
      setTimeout(() => shockwave.remove(), 450);
    }

    // Animation macOS Échelle / Génie vers le bas (Dock)
    windowCell.classList.remove('animating-restore');
    windowCell.classList.add('animating-minimize');

    // Mettre à jour visuellement le Dock : l'application se referme dans la barre
    const dockBtns = document.querySelectorAll('.cs-dock-app-btn');
    dockBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    setTimeout(() => {
      windowCell.classList.remove('animating-minimize');
      activeSlide.classList.remove('active');
      isWindowMinimized = true;
      isDockTransitioning = false;
    }, 400);
  } else {
    isWindowMinimized = true;
  }
}

// 2. Restauration / Déploiement de la fenêtre depuis le Dock (animation macOS vers le haut)
function restoreMockupAnimated(targetIndex) {
  if (isDockTransitioning) return;
  const idx = (typeof targetIndex === 'number') ? targetIndex : currentHeroCardIndex;
  currentHeroCardIndex = idx;

  const slides = document.querySelectorAll('.hero-card-slide');
  const targetSlide = document.getElementById(`heroSlide${idx}`);
  if (!targetSlide) return;

  isDockTransitioning = true;

  // Masquer les autres slides
  slides.forEach(s => {
    s.classList.remove('active');
    const cell = s.querySelector('.cs-cell--windowed');
    if (cell) cell.classList.remove('animating-minimize', 'animating-restore');
  });

  targetSlide.classList.add('active');

  const windowCell = targetSlide.querySelector('.cs-cell--windowed') || targetSlide;
  windowCell.classList.remove('animating-minimize');
  windowCell.classList.add('animating-restore');

  // Mettre à jour les boutons du Dock : l'application sélectionnée brille
  const dockBtns = document.querySelectorAll('.cs-dock-app-btn');
  dockBtns.forEach((btn, i) => {
    const isActive = (i === idx);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  isWindowMinimized = false;

  setTimeout(() => {
    windowCell.classList.remove('animating-restore');
    isDockTransitioning = false;
  }, 460);
}

// 3. Comportement authentique Barre des Tâches / Dock Mac :
// Si la fenêtre est déjà ouverte sur cette app -> la refermer dans le dock
// Si la fenêtre est fermée ou sur une autre app -> l'ouvrir / restaurer depuis le dock
function toggleDockApp(index) {
  if (isDockTransitioning) return;

  if (!isWindowMinimized && currentHeroCardIndex === index) {
    // La fenêtre est actuellement affichée : on la referme dans la barre comme sur un Mac !
    minimizeMockupAnimated(index);
  } else {
    // La fenêtre était fermée ou on change d'app : on la déploie
    restoreMockupAnimated(index);
  }
}

// Rétrocompatibilité : selectHeroCard appelle toggleDockApp
function selectHeroCard(index) {
  toggleDockApp(index);
}

// Fermeture de l'onglet actif (bouton rouge ou raccourci)
function closeActiveTabAnimated(event) {
  minimizeMockupAnimated(currentHeroCardIndex, event);
}

function cycleHeroCard(direction) {
  const total = heroSiteMetadata.length;
  const nextIdx = (currentHeroCardIndex + direction + total) % total;
  restoreMockupAnimated(nextIdx);
}

function openHeroProject(index, autoExpand = false) {
  selectHeroCard(index);
  const heroShowcase = document.getElementById('heroShowcase');
  if (heroShowcase) {
    const yOffset = -90;
    const y = heroShowcase.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  isHeroInteracting = true;

  if (autoExpand) {
    setTimeout(() => {
      const siteNames = ['astra', 'achille', 'valmy'];
      if (siteNames[index]) {
        toggleFullscreenMockup(siteNames[index]);
      }
    }, 400);
  }
}

function startHeroCardTimer() {
  stopHeroCardTimer();
  heroCardTimer = setInterval(() => {
    if (!isHeroInteracting) {
      cycleHeroCard(1);
    }
  }, 7000);
}

function stopHeroCardTimer() {
  if (heroCardTimer) {
    clearInterval(heroCardTimer);
    heroCardTimer = null;
  }
}

// Initialisation des écouteurs de survol sur le Hero Showcase
document.addEventListener('DOMContentLoaded', () => {
  const showcase = document.getElementById('heroShowcase');
  if (showcase) {
    showcase.addEventListener('mouseenter', () => {
      isHeroInteracting = true;
    });
    showcase.addEventListener('mouseleave', () => {
      isHeroInteracting = false;
    });
    showcase.addEventListener('touchstart', () => {
      isHeroInteracting = true;
    }, { passive: true });
  }
  startHeroCardTimer();
});



