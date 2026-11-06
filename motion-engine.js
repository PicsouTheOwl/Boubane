/**
 * Boubane Studio · Motion Engine (Inspiration Two26 Studio)
 * Lead Creative Developer & Motion Designer
 * 
 * Stack: Lenis 1.1 + GSAP 3.12 + ScrollTrigger
 * Physique d'animation 60fps accélérée matériellement
 */

(function () {
    "use strict";

    // 0. Respect de la sensibilité au mouvement (Accessibilité WCAG)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        console.log("Boubane Motion Engine: prefers-reduced-motion actif, animations cinétiques désactivées.");
        return;
    }

    function initMotion() {
        if (!window.gsap || !window.ScrollTrigger) {
            console.warn("GSAP ou ScrollTrigger manquant.");
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        /* ==========================================================================
           1. SMOOTH SCROLL LENIS ⟷ SYNC GSAP SCROLLTRIGGER
           ========================================================================== */
        let lenis = null;
        if (typeof window.Lenis !== "undefined") {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: "vertical",
                gestureDirection: "vertical",
                smooth: true,
                smoothTouch: false, // Ne pas altérer le scroll tactile natif mobile
                touchMultiplier: 1.5
            });

            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        /* ==========================================================================
           2. RÉVÉLATIONS TYPOGRAPHIQUES (SPLIT-TEXT REVEALS)
           ========================================================================== */
        const splitElements = document.querySelectorAll("[data-split-reveal]");
        splitElements.forEach((el) => {
            const text = el.innerText.trim();
            if (!text) return;

            const words = text.split(" ");
            el.innerHTML = "";

            words.forEach((word) => {
                const mask = document.createElement("span");
                mask.className = "split-word-mask";
                mask.style.cssText = "display: inline-block; overflow: hidden; vertical-align: top; margin-right: 0.28em;";

                const span = document.createElement("span");
                span.className = "split-char";
                span.textContent = word;
                span.style.cssText = "display: inline-block; will-change: transform, opacity; transform: translateY(115%) rotate(3deg); opacity: 0;";

                mask.appendChild(span);
                el.appendChild(mask);
            });

            const targets = el.querySelectorAll(".split-char");
            gsap.to(targets, {
                y: "0%",
                rotate: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.035,
                ease: "cubic-bezier(0.16, 1, 0.3, 1)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        /* ==========================================================================
           3. INFINITE MARQUEE ASSERVI À LA VÉLOCITÉ DU SCROLL
           ========================================================================== */
        const marquee = document.querySelector(".marquee-content");
        if (marquee && marquee.parentNode) {
            let xPos = 0;
            const baseSpeed = 1.2;
            let currentSpeed = baseSpeed;

            const clone = marquee.cloneNode(true);
            marquee.parentNode.appendChild(clone);

            if (lenis) {
                lenis.on("scroll", (e) => {
                    const velocity = Math.abs(e.velocity || 0);
                    const direction = e.direction || 1;
                    currentSpeed = (baseSpeed + velocity * 0.12) * direction;
                });
            }

            function tickMarquee() {
                xPos -= currentSpeed;
                currentSpeed += (baseSpeed - currentSpeed) * 0.05;

                const width = marquee.offsetWidth;
                if (xPos <= -width) xPos = 0;
                if (xPos > 0) xPos = -width;

                gsap.set([marquee, clone], { x: xPos });
                requestAnimationFrame(tickMarquee);
            }
            tickMarquee();
        }

        /* ==========================================================================
           4. BOUTONS MAGNÉTIQUES AVEC RESSORT ÉLASTIQUE
           ========================================================================== */
        const magneticBtns = document.querySelectorAll(".btn-magnetic, .btn-primary");
        magneticBtns.forEach((btn) => {
            const inner = btn.querySelector("span") || btn;
            const radius = 45;

            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const dist = Math.hypot(deltaX, deltaY);

                if (dist < radius + rect.width / 2) {
                    gsap.to(btn, {
                        x: deltaX * 0.32,
                        y: deltaY * 0.32,
                        duration: 0.35,
                        ease: "power2.out"
                    });
                    if (inner !== btn) {
                        gsap.to(inner, {
                            x: deltaX * 0.18,
                            y: deltaY * 0.18,
                            duration: 0.35,
                            ease: "power2.out"
                        });
                    }
                }
            });

            btn.addEventListener("mouseleave", () => {
                gsap.to([btn, inner], {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.35)"
                });
            });
        });

        /* ==========================================================================
           5. CARTES EN PARALLAXE & ZOOM SUBTIL (SCALE: 1.04)
           ========================================================================== */
        const cards = document.querySelectorAll(".bento-card, .showcase-card, .motion-card");
        cards.forEach((card) => {
            const img = card.querySelector("img");
            if (img) {
                card.style.overflow = "hidden";
                img.style.willChange = "transform";
                img.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

                card.addEventListener("mouseenter", () => {
                    img.style.transform = "scale(1.045)";
                });
                card.addEventListener("mouseleave", () => {
                    img.style.transform = "scale(1)";
                });
            }
        });

        /* ==========================================================================
           6. DÉVOILEMENT ÉLASTIQUE DE LA SECTION CONTACT / FOOTER
           ========================================================================== */
        const footer = document.querySelector(".footer, .contact-section");
        if (footer) {
            gsap.fromTo(footer,
                { y: 50, opacity: 0.85 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "back.out(1.2)",
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: footer,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMotion);
    } else {
        initMotion();
    }
})();

