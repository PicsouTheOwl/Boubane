        // 1. Initialisation de Lenis (Smooth Momentum Scrolling moderne)
        let lenis;
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 1.5,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }
        }

        // 2. Initialisation des icônes Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // 3. Effet 3D Tilt interactif sur l'Arche du Chat Mascotte
        const mascotArch = document.getElementById('mascotArch');
        const mascotGlare = document.getElementById('mascotGlare');

        if (mascotArch) {
            mascotArch.addEventListener('mousemove', (e) => {
                const rect = mascotArch.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                
                mascotArch.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -4px, 0)`;
                mascotArch.style.boxShadow = `${-rotateY * 0.8 - 8}px ${rotateX * 0.8 + 8}px 0px var(--color-ink)`;
                
                if (mascotGlare) {
                    mascotGlare.style.opacity = '1';
                    mascotGlare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
                }
            });

            mascotArch.addEventListener('mouseleave', () => {
                mascotArch.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
                mascotArch.style.boxShadow = '-8px 8px 0px var(--color-ink)';
                if (mascotGlare) mascotGlare.style.opacity = '0';
            });
        }

        // 4. Lueur ambiante Canvas fluide qui suit le curseur
        const canvas = document.getElementById('ambientCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let currentX = mouseX;
            let currentY = mouseY;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateAura() {
                currentX += (mouseX - currentX) * 0.08;
                currentY += (mouseY - currentY) * 0.08;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const grad = ctx.createRadialGradient(currentX, currentY, 20, currentX, currentY, 320);
                grad.addColorStop(0, 'rgba(237, 92, 1, 0.16)');
                grad.addColorStop(1, 'rgba(237, 92, 1, 0)');

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                requestAnimationFrame(animateAura);
            }
            animateAura();
        }

        // 7. Accordéon FAQ
        function toggleFaq(btn) {
            const item = btn.parentElement;
            const wasActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            
            if (!wasActive) {
                item.classList.add('active');
            }
        }

        // 8. Gestion des Modales (Réservation & Mentions Légales)
        function openVisioModal() {
            document.getElementById('visioModal').classList.add('active');
        }

        function closeVisioModal(e) {
            if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
            document.getElementById('visioModal').classList.remove('active');
        }

        function openLegalModal(e) {
            if (e && e.preventDefault) e.preventDefault();
            document.getElementById('legalModal').classList.add('active');
            try {
                history.pushState(null, "", "#mentions-legales");
            } catch (err) {}
        }

        function closeLegalModal(e) {
            if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close') && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) return;
            document.getElementById('legalModal').classList.remove('active');
            if (window.location.hash === '#mentions-legales') {
                try {
                    history.pushState("", document.title, window.location.pathname + window.location.search);
                } catch (err) {}
            }
        }

        // Fermeture automatique sur la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeVisioModal();
                closeLegalModal();
            }
        });

        // Détection de l'ancre #mentions-legales dans l'URL
        function checkLegalHash() {
            if (window.location.hash === '#mentions-legales') {
                document.getElementById('legalModal').classList.add('active');
            }
        }
        window.addEventListener('hashchange', checkLegalHash);

        function scrollToContact() {
            closeVisioModal();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                if (lenis) {
                    lenis.scrollTo(contactSection);
                } else {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }

        // 9. Soumission du formulaire
        function handleFormSubmit(e) {
            e.preventDefault();
            const successDiv = document.getElementById('formSuccess');
            if (successDiv) {
                successDiv.style.display = 'block';
                e.target.reset();
                setTimeout(() => {
                    successDiv.style.display = 'none';
                }, 6000);
            }
        }

        // 10. Initialisation au chargement
        document.addEventListener('DOMContentLoaded', () => {
            syncBoubaneLogos();
            if (typeof lucide !== 'undefined') lucide.createIcons();
            checkLegalHash();
        });
    </script>
</body>
</html>
