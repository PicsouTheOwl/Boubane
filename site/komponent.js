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

  // 3D Tilt sur les cellules de la Bento Grid Ramp et cartes piliers
  const tiltCards = document.querySelectorAll('.cs-cell--windowed, .pillar-card, .pricing-plan-card');
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

// 10. Contrôleur du Hero Showcase : Défilement et sélection des cartes de sites sur la Hero
let currentHeroCardIndex = 0;
let heroCardTimer = null;
let isHeroInteracting = false;

const heroSiteMetadata = [
  {
    kpi: "⚡ Vitesse : 0.27s · PageSpeed 100/100",
    desc: "Astravacances.fr — Plateforme d'audit et gestion opérationnelle pour campings et résidences avec simulateur de gain d'EBITDA."
  },
  {
    kpi: "⚡ Vitesse : 0.24s · IA 18ms",
    desc: "Achille.ai — Support client e-commerce & SaaS AI-first automatisant 50% des tickets avec synchronisation Shopify et Gorgias."
  },
  {
    kpi: "⚡ Vitesse : 0.26s · Audit 0 €",
    desc: "Cabinet Valmy — Barreau d'affaires M&A, transmission d'entreprises confidentielle et simulateur d'audit préalable."
  },
  {
    kpi: "⚡ Vitesse < 0.3s · Carte Membre",
    desc: "Boubane Studio — Passeport digital haute autorité avec puce dorée gravée, effet gyroscopique 3D et zéro frais d'agence."
  }
];

function selectHeroCard(index) {
  const slides = document.querySelectorAll('.hero-card-slide');
  const pills = document.querySelectorAll('.hero-pill-btn');
  if (!slides.length) return;

  currentHeroCardIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentHeroCardIndex);
  });

  pills.forEach((pill, i) => {
    const isActive = i === currentHeroCardIndex;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const metaKpi = document.getElementById('heroMetaKpi');
  const metaDesc = document.getElementById('heroMetaDesc');
  if (metaKpi && metaDesc && heroSiteMetadata[currentHeroCardIndex]) {
    metaKpi.textContent = heroSiteMetadata[currentHeroCardIndex].kpi;
    metaDesc.textContent = heroSiteMetadata[currentHeroCardIndex].desc;
  }
}

function cycleHeroCard(direction) {
  selectHeroCard(currentHeroCardIndex + direction);
}

function openHeroProject(index) {
  selectHeroCard(index);
  const heroShowcase = document.getElementById('heroShowcase');
  if (heroShowcase) {
    const yOffset = -90;
    const y = heroShowcase.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  isHeroInteracting = true;
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



