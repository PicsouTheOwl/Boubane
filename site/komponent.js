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

// 3. Soumission Formulaire
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const successMessage = document.getElementById('formSuccessMessage');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer ma demande';
    }
    form.reset();
    if (successMessage) {
      successMessage.style.display = 'block';
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

// 4. Canvas Dot-Grid Dynamique (Signature Visuelle Pulsor)
function initDotCanvas() {
  const canvas = document.getElementById('dotCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  let mouseX = width / 2;
  let mouseY = 200;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    draw();
  });

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    requestAnimationFrame(draw);
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const spacing = 32;
    const dotRadius = 1.15;

    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 280;

        let alpha = 0.12;
        let radius = dotRadius;

        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          alpha += factor * 0.48;
          radius += factor * 1.6;
        }

        ctx.fillStyle = `rgba(237, 91, 4, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  draw();
}

// 5. Review Rotator (Carrousel d'Avis Centré Pulsor-Style)
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

// 7. Simulateur ROI Interactif (Calculateur en Direct)
function initRoiSimulator() {
  const rangeInput = document.getElementById('agencyBudgetRange');
  const budgetDisplay = document.getElementById('agencyBudgetValue');
  const savingsDisplay = document.getElementById('savingsNumberValue');

  if (!rangeInput || !budgetDisplay || !savingsDisplay) return;

  function updateSavings() {
    const budget = parseInt(rangeInput.value, 10);
    budgetDisplay.textContent = budget.toLocaleString('fr-FR') + ' €';

    const agencyHosting3Years = 80 * 36; // 2 880 €
    const directHosting3Years = 5 * 36;  // 180 €
    const totalSavings = budget + (agencyHosting3Years - directHosting3Years);

    savingsDisplay.textContent = totalSavings.toLocaleString('fr-FR') + ' €';
  }

  rangeInput.addEventListener('input', updateSavings);
  updateSavings();
}

// 8. Initialisation au chargement & Micro-interactions 3D Tilt
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#contact') {
    openModal('contactModal');
  } else if (window.location.hash === '#mentions-legales') {
    openModal('legalModal');
  }

  initDotCanvas();
  initReviewRotator();
  initPricingToggle();
  initRoiSimulator();

  // 3D Tilt sur les cartes de projets et browser flottant
  const tiltCards = document.querySelectorAll('.hero-floating-browser, .project-card, .simulator-card, .pricing-plan-card');
  if (tiltCards.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.transition = 'transform 0.4s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }
});
