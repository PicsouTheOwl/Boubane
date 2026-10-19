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
  } else if (window.location.hash === '#cookies') {
    openCookieSettings();
  }

  initReviewRotator();
  initPricingToggle();
  initScrollReveal();
  initCookieConsent();

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

  // 8 bis. Moteur Physique 3D Hyper-Premium (LERP 60/120fps + Ombres Portées Dynamiques + Z-Lift)
  const heroViewport = document.getElementById('heroCardsViewport');
  if (heroViewport && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let bounds = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetLift = 0;
    let currentLift = 0;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let targetGlareX = 50;
    let targetGlareY = 50;
    let currentGlareX = 50;
    let currentGlareY = 50;
    let isHovering = false;
    let rafId = null;

    function getActiveElements() {
      const activeSlide = heroViewport.querySelector('.hero-card-slide.active');
      if (!activeSlide) return null;
      const activeWin = activeSlide.querySelector('.cs-cell--windowed');
      if (!activeWin || activeWin.classList.contains('is-fullscreen') || document.body.classList.contains('mockup-modal-open')) return null;
      return { win: activeWin, glare: activeWin.querySelector('.cs-window-glare') };
    }

    function updateBounds() {
      const active = getActiveElements();
      if (active) {
        bounds = active.win.getBoundingClientRect();
      }
    }

    function renderLoop() {
      const active = getActiveElements();
      if (!active) {
        rafId = null;
        return;
      }

      // Amorti cinématique ultra-soyeux (Spring-LERP)
      const ease = isHovering ? 0.08 : 0.055;
      currentRotateX += (targetRotateX - currentRotateX) * ease;
      currentRotateY += (targetRotateY - currentRotateY) * ease;
      currentLift += (targetLift - currentLift) * ease;
      currentScale += (targetScale - currentScale) * ease;
      currentGlareX += (targetGlareX - currentGlareX) * ease;
      currentGlareY += (targetGlareY - currentGlareY) * ease;

      const diff = Math.abs(targetRotateX - currentRotateX) + Math.abs(targetRotateY - currentRotateY) + Math.abs(targetLift - currentLift);

      // Application du transform 3D spatial (Rotation + Élévation Z + Micro-scale)
      active.win.style.transform = `perspective(1400px) rotateX(${currentRotateX.toFixed(3)}deg) rotateY(${currentRotateY.toFixed(3)}deg) translateZ(${currentLift.toFixed(2)}px) scale(${currentScale.toFixed(4)})`;

      // Ombre portée tridimensionnelle calculée en temps réel (l'ombre réagit physiquement à la lumière)
      const shadowOffsetX = (-currentRotateY * 4.2).toFixed(1);
      const shadowOffsetY = (28 + currentRotateX * 3.4 + currentLift * 0.9).toFixed(1);
      const shadowBlur = (65 + Math.abs(currentRotateX) * 2.5 + Math.abs(currentRotateY) * 2.5 + currentLift * 1.4).toFixed(1);
      const shadowSpread = (-14 + currentLift * 0.35).toFixed(1);
      const shadowAlpha = (0.24 + (currentLift / 12) * 0.08).toFixed(2);
      const innerHighlight = (0.90 + (currentRotateX < 0 ? 0.15 : -0.10)).toFixed(2);

      active.win.style.boxShadow = `
        ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px rgba(12, 10, 8, ${shadowAlpha}),
        ${(shadowOffsetX * 0.35).toFixed(1)}px ${(shadowOffsetY * 0.4).toFixed(1)}px 22px -4px rgba(12, 10, 8, 0.15),
        0 2px 6px rgba(12, 10, 8, 0.05),
        inset 0 1px 1.5px rgba(255, 255, 255, ${innerHighlight}),
        inset 0 -1px 1.5px rgba(0, 0, 0, 0.08)
      `;

      // Reflet spéculaire double-couche façon verre antireflet Apple Pro Display
      if (active.glare) {
        const glareAngle = (118 + currentRotateY * 2.2).toFixed(1);
        active.glare.style.background = `
          radial-gradient(circle at ${currentGlareX.toFixed(1)}% ${currentGlareY.toFixed(1)}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0) 68%),
          linear-gradient(${glareAngle}deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.04) 100%)
        `;
        active.glare.style.opacity = isHovering ? '0.75' : '0.35';
      }

      // Repos complet : stabilisation parfaite et extinction de la boucle
      if (!isHovering && diff < 0.015) {
        active.win.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        active.win.style.boxShadow = `
          0 32px 75px -14px rgba(12, 10, 8, 0.25),
          0 12px 28px -4px rgba(12, 10, 8, 0.14),
          0 2px 6px rgba(12, 10, 8, 0.05),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.95),
          inset 0 -1px 1.5px rgba(0, 0, 0, 0.10)
        `;
        if (active.glare) {
          active.glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)';
          active.glare.style.opacity = '0.35';
        }
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(renderLoop);
    }

    function startLoop() {
      if (!rafId) {
        rafId = requestAnimationFrame(renderLoop);
      }
    }

    heroViewport.addEventListener('mouseenter', () => {
      isHovering = true;
      targetLift = 12; // Élévation aérienne de 12px
      targetScale = 1.008; // Micro-scale de prestance
      updateBounds();
      const active = getActiveElements();
      if (active) {
        active.win.style.transition = 'none'; // Fluidité native 120fps sans conflit
      }
      startLoop();
    });

    heroViewport.addEventListener('mousemove', (e) => {
      if (!bounds) updateBounds();
      if (!bounds) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.left;
      const topY = mouseY - bounds.top;

      // Amplitude calibrée haute autorité (4.8° max)
      const maxRotate = 4.8;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      targetRotateX = ((topY - centerY) / centerY) * -maxRotate;
      targetRotateY = ((leftX - centerX) / centerX) * maxRotate;

      targetGlareX = Math.max(0, Math.min(100, (leftX / bounds.width) * 100));
      targetGlareY = Math.max(0, Math.min(100, (topY / bounds.height) * 100));

      startLoop();
    });

    heroViewport.addEventListener('mouseleave', () => {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
      targetLift = 0;
      targetScale = 1.0;
      targetGlareX = 50;
      targetGlareY = 50;
      startLoop();
    });

    window.addEventListener('resize', () => {
      bounds = null;
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

// 9b. Gestion du Portail Plein Écran Universel (Immersion Vitrines Web Sans Conflit)
let activeFullscreenSite = null;
let reparentedViewport = null;
let reparentedOriginalParent = null;

function restoreReparentedViewport() {
  if (reparentedViewport && reparentedOriginalParent) {
    reparentedOriginalParent.appendChild(reparentedViewport);
    reparentedViewport = null;
    reparentedOriginalParent = null;
  }
}

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

  const validKey = (siteKey === 'astra' || siteKey === 'achille' || siteKey === 'valmy' || siteKey === 'votresite') ? siteKey : 'astra';
  switchPortalSite(validKey);

  portal.classList.add('active', 'is-active');
  portal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mockup-modal-open');
  activeFullscreenSite = validKey;
  stopHeroCardTimer();
  document.addEventListener('keydown', handleMockupKeydown);
}

function closeFullscreenMockup() {
  const portal = document.getElementById('mockupFullscreenPortal');
  if (portal) {
    portal.classList.remove('active', 'is-active');
    portal.setAttribute('aria-hidden', 'true');
  }
  
  // Rétablir le viewport déplacé dans son parent d'origine sur la hero
  restoreReparentedViewport();

  document.querySelectorAll('.cs-cell--windowed.is-fullscreen').forEach(el => el.classList.remove('is-fullscreen'));
  document.body.classList.remove('mockup-modal-open');
  activeFullscreenSite = null;
  document.removeEventListener('keydown', handleMockupKeydown);
  startHeroCardTimer();
}

function switchPortalSite(siteKey) {
  const key = (siteKey === 'astra' || siteKey === 'achille' || siteKey === 'valmy' || siteKey === 'votresite') ? siteKey : 'astra';
  activeFullscreenSite = key;

  // Rétablir d'abord un éventuel viewport reparenté
  restoreReparentedViewport();

  // Mettre à jour les onglets de switch dans la fenêtre portail
  const tabAstra = document.getElementById('portalTabAstra');
  const tabAchille = document.getElementById('portalTabAchille');
  const tabValmy = document.getElementById('portalTabValmy');
  if (tabAstra) tabAstra.classList.toggle('active', key === 'astra');
  if (tabAchille) tabAchille.classList.toggle('active', key === 'achille');
  if (tabValmy) tabValmy.classList.toggle('active', key === 'valmy' || key === 'votresite');

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
    if (inlineContainer) {
      inlineContainer.style.display = 'none';
      inlineContainer.innerHTML = '';
    }
    if (urlText) urlText.textContent = 'astravacances.fr';
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
      if (origViewport) {
        reparentedOriginalParent = origViewport.parentElement;
        reparentedViewport = origViewport;
        inlineContainer.appendChild(origViewport);
      }
    }
    if (urlText) urlText.textContent = 'achille.ai';
    if (extLink) extLink.href = 'https://achille.ai';
    if (capDot) capDot.style.background = '#6366F1';
    if (capTitle) capTitle.textContent = 'Achille.ai — Solution Service Client E-commerce & SaaS';
    if (capVisitBtn) {
      capVisitBtn.href = 'https://achille.ai';
      capVisitBtn.textContent = 'Visiter achille.ai ↗';
    }
  } else if (key === 'valmy' || key === 'votresite') {
    if (iframe) {
      iframe.style.display = 'block';
      if (!iframe.src || !iframe.src.includes('showcase-votre-site.html')) {
        iframe.src = 'showcase-votre-site.html';
      }
    }
    if (inlineContainer) {
      inlineContainer.style.display = 'none';
      inlineContainer.innerHTML = '';
    }
    if (urlText) urlText.textContent = 'votre-prochain-site.fr';
    if (extLink) extLink.href = '#tarifs';
    if (capDot) capDot.style.background = '#EEF85A';
    if (capTitle) capTitle.textContent = 'Votre Prochain Site — Conception 100% Offerte par Studio Boubane (< 0.3s)';
    if (capVisitBtn) {
      capVisitBtn.href = '#tarifs';
      capVisitBtn.textContent = 'Commander mon site (0 €) ↗';
      capVisitBtn.onclick = () => { closeFullscreenMockup(); };
    }
  }
}

function reloadPortalIframe() {
  const iframe = document.getElementById('portalIframe');
  if (iframe && iframe.style.display !== 'none') {
    iframe.src = iframe.src;
    showBoubaneToast('Page rechargée (< 0.3s)');
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
  const containerId = site === 'astra' ? 'mockupAstra' : (site === 'achille' ? 'mockupAchille' : (site === 'valmy' ? 'mockupValmy' : 'mockupStudio'));
  const container = document.getElementById(containerId);
  if (!container) return;

  container.style.transform = '';

  // Déclenchement de la transition cinématique de morphing hardware
  container.classList.remove('is-morphing-device');
  void container.offsetWidth; // Force reflow
  container.classList.add('is-morphing-device');
  setTimeout(() => {
    container.classList.remove('is-morphing-device');
  }, 480);

  container.classList.remove('device-tablet', 'device-mobile');
  if (device === 'tablet') {
    container.classList.add('device-tablet');
    showBoubaneToast('Format iPad Pro activé');
  } else if (device === 'mobile') {
    container.classList.add('device-mobile');
    showBoubaneToast('Format iPhone Pro activé');
  } else {
    showBoubaneToast('Format Ordinateur rétabli');
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
  showBoubaneToast('Rechargé en 0.22s · Cache Cloudflare Edge Actif');
}

// Copie de l'URL dans le presse-papier
function copyMockupUrl(url, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showBoubaneToast(`Lien copié : ${url}`);
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
    key: "votresite",
    name: "Votre prochain site",
    badge: "Sur-Mesure",
    logo: null,
    seal: "✦",
    kpi: "⚡ Vitesse : < 0.3s · 0 € d'acompte",
    desc: "Votre prochain site — Conception sur-mesure offerte livrée sur GitHub sous 7 jours."
  }
];

// État de la fenêtre active et du Dock macOS
let isWindowMinimized = false;
let isDockTransitioning = false;

// Calcule la coordonnée horizontale relative (%) du bouton cliqué par rapport au conteneur de la vitrine
function getDockButtonOrigin(idx) {
  const btn = document.getElementById(`dockBtn${idx}`);
  const stage = document.getElementById('heroCardsViewport') || document.getElementById('heroShowcase');
  if (btn && stage) {
    const btnRect = btn.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width > 0) {
      const btnCenter = btnRect.left + btnRect.width / 2;
      const originPct = ((btnCenter - stageRect.left) / stageRect.width) * 100;
      return Math.max(6, Math.min(94, originPct));
    }
  }
  return 50;
}

// 1. Déclenchement de l'animation de minimisation macOS (Pastille jaune ou clic Dock sur l'application active)
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

    // Calculer le point d'ancrage vers l'onglet du dock d'où elle provient
    const originX = getDockButtonOrigin(idx);
    windowCell.style.transformOrigin = `${originX.toFixed(1)}% 100%`;

    // Animation macOS fluide qui s'aspire vers le bas dans l'onglet
    windowCell.classList.remove('animating-restore', 'animating-close');
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
    }, 280);
  } else {
    isWindowMinimized = true;
  }
}

// 2. Restauration / Déploiement de la fenêtre depuis le Dock (animation macOS : jaillit depuis son onglet !)
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
    if (cell) cell.classList.remove('animating-minimize', 'animating-restore', 'animating-close');
  });

  targetSlide.classList.add('active');

  const windowCell = targetSlide.querySelector('.cs-cell--windowed') || targetSlide;

  // Calcul dynamique du point d'émergence depuis l'icône cliquée dans le Dock
  const originX = getDockButtonOrigin(idx);
  windowCell.style.transformOrigin = `${originX.toFixed(1)}% 100%`;

  windowCell.classList.remove('animating-minimize', 'animating-close');
  windowCell.classList.add('animating-restore');

  // Animation de rebond authentique macOS de l'icône cliquée dans le Dock
  const clickedBtn = document.getElementById(`dockBtn${idx}`);
  if (clickedBtn) {
    clickedBtn.classList.remove('is-bouncing');
    void clickedBtn.offsetWidth; // Force reflow
    clickedBtn.classList.add('is-bouncing');
    setTimeout(() => {
      clickedBtn.classList.remove('is-bouncing');
    }, 650);
  }

  // Mettre à jour les boutons du Dock : l'application sélectionnée allume son indicateur LED
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
  }, 380);
}

// Dictionnaire d'association entre fenêtres du bureau et boutons de la barre des tâches (Dock)
const BUREAU_WIN_DOCK_MAP = {
  'bureauWinAstra': 0,
  'bureauWinAchille': 1,
  'bureauWinValmy': 2
};

// Replier une fenêtre dans la barre des tâches avec effet macOS Genie
function minimizeBureauWindow(win) {
  if (!win) return;
  const idx = BUREAU_WIN_DOCK_MAP[win.id];
  const dockBtn = (typeof idx === 'number') ? document.getElementById(`dockBtn${idx}`) : null;

  // Sauvegarder la transformation actuelle pour pouvoir la restaurer fidèlement
  if (win.getAttribute('data-minimized') !== 'true') {
    win.setAttribute('data-saved-transform', win.style.transform || '');
  }
  win.setAttribute('data-minimized', 'true');

  if (dockBtn) {
    const winRect = win.getBoundingClientRect();
    const btnRect = dockBtn.getBoundingClientRect();
    const deltaX = (btnRect.left + btnRect.width / 2) - (winRect.left + winRect.width / 2);
    const deltaY = (btnRect.top + btnRect.height / 2) - (winRect.top + winRect.height / 2);

    win.classList.add('is-transitioning');
    win.style.transform = `translate(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px) scale(0.06)`;
    win.style.opacity = '0';
    win.style.pointerEvents = 'none';

    dockBtn.classList.remove('active');
    dockBtn.setAttribute('aria-selected', 'false');

    // Rebond sur l'icône du Dock pour confirmer la réception de la fenêtre
    dockBtn.classList.remove('is-bouncing');
    void dockBtn.offsetWidth;
    dockBtn.classList.add('is-bouncing');
    setTimeout(() => {
      dockBtn.classList.remove('is-bouncing');
    }, 600);
  } else {
    win.classList.add('is-transitioning');
    win.style.transform = 'translateY(120px) scale(0.2)';
    win.style.opacity = '0';
    win.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    win.classList.remove('is-transitioning');
  }, 450);
}

// Déplier / Restaurer une fenêtre depuis la barre des tâches (Dock)
function restoreBureauWindow(win) {
  if (!win) return;
  const idx = BUREAU_WIN_DOCK_MAP[win.id];
  const dockBtn = (typeof idx === 'number') ? document.getElementById(`dockBtn${idx}`) : null;

  highestBureauZIndex += 1;
  win.style.zIndex = highestBureauZIndex;
  win.removeAttribute('data-minimized');
  win.style.pointerEvents = '';

  const savedTransform = win.getAttribute('data-saved-transform');
  const defaultTransforms = {
    'bureauWinAstra': 'rotate(-1.5deg)',
    'bureauWinAchille': 'rotate(1.8deg)',
    'bureauWinValmy': 'rotate(-0.8deg)'
  };
  const targetTransform = savedTransform || defaultTransforms[win.id] || 'rotate(0deg)';

  win.classList.add('is-transitioning');
  win.style.transform = targetTransform;
  win.style.opacity = '1';

  if (dockBtn) {
    dockBtn.classList.add('active');
    dockBtn.setAttribute('aria-selected', 'true');
    dockBtn.classList.remove('is-bouncing');
    void dockBtn.offsetWidth;
    dockBtn.classList.add('is-bouncing');
    setTimeout(() => {
      dockBtn.classList.remove('is-bouncing');
    }, 600);
  }

  // Micro-focus visuel
  win.style.boxShadow = '0 32px 85px -10px rgba(12, 10, 8, 0.35), 0 14px 30px -4px rgba(12, 10, 8, 0.20)';
  setTimeout(() => {
    win.classList.remove('is-transitioning');
    win.style.boxShadow = '';
  }, 460);
}

// 3. Comportement du Dock macOS connecté au Bureau Virtuel (Repli & Déploiement) :
function toggleDockApp(index) {
  currentHeroCardIndex = index;
  const winIds = ['bureauWinAstra', 'bureauWinAchille', 'bureauWinValmy'];
  const targetId = winIds[index];
  if (!targetId) return;

  const targetWin = document.getElementById(targetId);
  if (!targetWin) return;

  const isMinimized = targetWin.getAttribute('data-minimized') === 'true' || targetWin.style.opacity === '0';

  if (isMinimized) {
    // Déplier la fenêtre depuis la barre des tâches
    restoreBureauWindow(targetWin);
  } else {
    // Si la fenêtre est déjà ouverte et au premier plan : un clic sur son icône la replie dans la barre des tâches
    const currentZ = parseInt(targetWin.style.zIndex || '0', 10);
    if (currentZ === highestBureauZIndex) {
      minimizeBureauWindow(targetWin);
    } else {
      // Sinon l'amener au premier plan absolu
      highestBureauZIndex += 1;
      targetWin.style.zIndex = highestBureauZIndex;
      targetWin.classList.add('is-transitioning');
      targetWin.style.boxShadow = '0 32px 85px -10px rgba(12, 10, 8, 0.35), 0 14px 30px -4px rgba(12, 10, 8, 0.20)';
      setTimeout(() => {
        targetWin.classList.remove('is-transitioning');
        targetWin.style.boxShadow = '';
      }, 450);

      const dockBtns = document.querySelectorAll('.cs-dock-app-btn');
      dockBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
        btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }
  }
}

// Rétrocompatibilité : selectHeroCard appelle toggleDockApp
function selectHeroCard(index) {
  toggleDockApp(index);
}

// Fermeture pure macOS de la fenêtre active (Pastille rouge) : disparition douce et rétraction vers l'onglet
function closeActiveTabAnimated(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (isDockTransitioning || isWindowMinimized) return;

  const idx = currentHeroCardIndex;
  const activeSlide = document.getElementById(`heroSlide${idx}`) || document.querySelector('.hero-card-slide.active');
  if (activeSlide) {
    isDockTransitioning = true;
    const windowCell = activeSlide.querySelector('.cs-cell--windowed') || activeSlide;
    const originX = getDockButtonOrigin(idx);
    windowCell.style.transformOrigin = `${originX.toFixed(1)}% 100%`;
    windowCell.classList.remove('animating-restore', 'animating-minimize');
    windowCell.classList.add('animating-close');

    const dockBtns = document.querySelectorAll('.cs-dock-app-btn');
    dockBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    setTimeout(() => {
      windowCell.classList.remove('animating-close');
      activeSlide.classList.remove('active');
      isWindowMinimized = true;
      isDockTransitioning = false;
    }, 220);
  }
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
  initBureauCanvas();
});

/* ==========================================================================
   Module Bureau Virtuel Multi-Fenêtres — macOS Messy Desk & Drag Engine
   ========================================================================== */

let highestBureauZIndex = 20;

function initBureauCanvas() {
  const canvas = document.getElementById('bureauCanvas');
  if (!canvas) return;

  const windows = Array.from(canvas.querySelectorAll('.bureau-window'));
  if (!windows.length) return;

  // Amener au premier plan au clic ou touch
  function bringToFront(win) {
    highestBureauZIndex += 1;
    win.style.zIndex = highestBureauZIndex;
  }

  // Si petit écran mobile au chargement, ranger harmonieusement pour éviter tout chevauchement
  if (window.innerWidth < 768) {
    windows.forEach((win, i) => {
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      win.style.left = '12px';
      win.style.top = (16 + i * 65) + 'px';
      win.style.transform = 'rotate(0deg)';
      win.style.zIndex = 10 + i;
    });
  }

  windows.forEach((win) => {
    win.addEventListener('pointerdown', () => {
      bringToFront(win);
    }, { passive: true });

    const bar = win.querySelector('.bureau-window-bar');
    if (!bar) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    bar.addEventListener('pointerdown', (e) => {
      // Ignorer si clic sur un bouton ou lien
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cs-dot')) {
        return;
      }

      isDragging = true;
      bringToFront(win);
      win.classList.add('is-dragging');
      win.classList.remove('is-transitioning');

      startX = e.clientX;
      startY = e.clientY;

      // Position absolue relative au canvas
      const canvasRect = canvas.getBoundingClientRect();
      const winRect = win.getBoundingClientRect();

      initialLeft = winRect.left - canvasRect.left;
      initialTop = winRect.top - canvasRect.top;

      // Fixer left & top en px pour éviter les sauts si c'était en right ou bottom
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      win.style.left = initialLeft + 'px';
      win.style.top = initialTop + 'px';

      if (bar.setPointerCapture) {
        try {
          bar.setPointerCapture(e.pointerId);
        } catch (_) {}
      }

      e.preventDefault();
    });

    bar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Contraintes ultra-souples : autorise le débordement libre sur les bords et vers le bas (survoler le dock)
      const minVisibleX = 60;
      const canvasWidth = canvas.clientWidth;
      const canvasHeight = canvas.clientHeight;
      const winWidth = win.offsetWidth;

      const minLeft = -winWidth + minVisibleX;
      const maxLeft = canvasWidth - minVisibleX;
      const minTop = -60;
      const maxTop = canvasHeight + 350; // Permet de glisser librement sur et sous le dock sans blocage

      newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
      newTop = Math.max(minTop, Math.min(newTop, maxTop));

      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      win.classList.remove('is-dragging');
      if (bar.releasePointerCapture && e && e.pointerId) {
        try {
          bar.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    bar.addEventListener('pointerup', stopDrag);
    bar.addEventListener('pointercancel', stopDrag);

    // Boutons de la barre macOS : fermer (rouge) et minimiser (jaune) replient dans la barre des tâches
    const closeBtn = win.querySelector('.bureau-win-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeBureauWindow(win);
      });
    }

    const minBtn = win.querySelector('.bureau-win-min');
    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeBureauWindow(win);
      });
    }

    const maxBtns = win.querySelectorAll('.bureau-win-max, .bureau-expand-pill');
    maxBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const siteKey = btn.getAttribute('data-site');
        if (siteKey && typeof openPortalFullscreen === 'function') {
          e.stopPropagation();
          openPortalFullscreen(siteKey);
        }
      });
    });
  });

  // Restaurer l'affichage de toutes les fenêtres (si repliées ou fermées)
  function restoreAllWindows() {
    windows.forEach((win) => {
      win.removeAttribute('data-minimized');
      win.style.opacity = '1';
      win.style.pointerEvents = '';
      const body = win.querySelector('.bureau-window-body');
      if (body) body.style.display = '';
      win.style.height = '';
      const saved = win.getAttribute('data-saved-transform');
      if (saved && (win.style.transform === '' || win.style.transform.includes('translate'))) {
        win.style.transform = saved;
      }
    });
    const dockBtns = document.querySelectorAll('.cs-dock-app-btn');
    dockBtns.forEach(btn => {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    });
  }
}

/* ==========================================================================
   11. Gestion Professionnelle des Cookies & Confidentialité (RGPD & CNIL)
   ========================================================================== */

const COOKIE_STORAGE_KEY = 'boubane_cookie_consent';

function getStoredCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveCookieConsent(consent) {
  try {
    const data = {
      essential: true,
      analytics: Boolean(consent.analytics),
      preferences: Boolean(consent.preferences),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(data));
    applyCookiePreferences(data);
    return data;
  } catch (e) {
    console.warn("Impossible d'enregistrer le consentement cookies:", e);
    return null;
  }
}

function applyCookiePreferences(consent) {
  // Respect des choix de l'utilisateur : métriques anonymisées & télémétrie de vitesse
  if (consent.analytics) {
    window['boubane_analytics_enabled'] = true;
  } else {
    window['boubane_analytics_enabled'] = false;
  }
  if (consent.preferences) {
    window['boubane_preferences_enabled'] = true;
  } else {
    window['boubane_preferences_enabled'] = false;
  }
}

function showCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(24px) scale(0.96)';
  banner.style.display = 'block';
  void banner.offsetWidth; // Force reflow
  banner.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
  banner.style.opacity = '1';
  banner.style.transform = 'translateY(0) scale(1)';
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(16px) scale(0.96)';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 250);
}

function acceptAllCookies() {
  saveCookieConsent({ analytics: true, preferences: true });
  hideCookieBanner();
  if (typeof closeModal === 'function') {
    closeModal('cookieModal');
  }
  if (typeof showBoubaneToast === 'function') {
    showBoubaneToast('Vos préférences de confidentialité ont été enregistrées.');
  }
}

function rejectAllCookies() {
  saveCookieConsent({ analytics: false, preferences: false });
  hideCookieBanner();
  if (typeof closeModal === 'function') {
    closeModal('cookieModal');
  }
  if (typeof showBoubaneToast === 'function') {
    showBoubaneToast('Seuls les cookies strictement nécessaires restent actifs.');
  }
}

function openCookieSettings() {
  const current = getStoredCookieConsent();
  const analyticsSwitch = document.getElementById('cookieSwitchAnalytics');
  const preferencesSwitch = document.getElementById('cookieSwitchPreferences');

  if (analyticsSwitch) {
    analyticsSwitch.checked = current ? Boolean(current.analytics) : false;
  }
  if (preferencesSwitch) {
    preferencesSwitch.checked = current ? Boolean(current.preferences) : true;
  }

  if (typeof openModal === 'function') {
    openModal('cookieModal');
  }
}

function saveCustomCookies() {
  const analyticsSwitch = document.getElementById('cookieSwitchAnalytics');
  const preferencesSwitch = document.getElementById('cookieSwitchPreferences');

  const analytics = analyticsSwitch ? analyticsSwitch.checked : false;
  const preferences = preferencesSwitch ? preferencesSwitch.checked : false;

  saveCookieConsent({ analytics, preferences });
  hideCookieBanner();
  if (typeof closeModal === 'function') {
    closeModal('cookieModal');
  }
  if (typeof showBoubaneToast === 'function') {
    showBoubaneToast('Vos préférences personnalisées ont été enregistrées.');
  }
}

function initCookieConsent() {
  const stored = getStoredCookieConsent();
  if (stored) {
    applyCookiePreferences(stored);
  } else {
    // Affichage délicat et fluide après 900ms
    setTimeout(() => {
      showCookieBanner();
    }, 900);
  }
}



