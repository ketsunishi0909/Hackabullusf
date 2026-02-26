document.addEventListener('DOMContentLoaded', function() {

    /* ═══════════════════════════════════════════
       SCROLL-REVEAL OBSERVER
    ═══════════════════════════════════════════ */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ═══════════════════════════════════════════
       HEADER HIDE ON SCROLL DOWN / SHOW ON UP
    ═══════════════════════════════════════════ */
    const header = document.querySelector('.top-bar');
    let lastScroll = 0;
    const scrollThreshold = 60;

    window.addEventListener('scroll', () => {
        const cur = window.scrollY;
        if (cur > lastScroll && cur > scrollThreshold) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScroll = cur;
    }, { passive: true });

    /* ═══════════════════════════════════════════
       FAQ — TABS + ACCORDION
    ═══════════════════════════════════════════ */
    const faqTabs     = document.querySelectorAll('.faq-tab');
    const allFaqItems = document.querySelectorAll('.faq-item');

    faqTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.cat;

            faqTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            allFaqItems.forEach(item => {
                item.classList.remove('open');
                const q = item.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');

                if (item.dataset.cat === cat) {
                    item.style.display = '';
                    item.classList.add('visible');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains('open');

            allFaqItems.forEach(item => {
                item.classList.remove('open');
                const q = item.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                faqItem.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ═══════════════════════════════════════════
       3-D CAROUSEL
    ═══════════════════════════════════════════ */
    const tracks = [
        { title: "Tech for good",  desc: "Build technology that creates positive social impact and helps communities around the world." },
        { title: "Art design",     desc: "Combine creativity and code to build visually stunning and innovative digital experiences." },
        { title: "Hello world",    desc: "Perfect for beginners — build your first project and take your first steps into hacking." },
        { title: "Hardware",       desc: "Get hands-on with physical computing, circuits, and embedded systems to build real devices." },
    ];
    const carousel = document.getElementById('carousel');
    const titleEl  = document.getElementById('carousel-title');
    const descEl   = document.getElementById('carousel-desc');
    const items    = document.querySelectorAll('.carousel-item');

    if (!carousel) return;

    let currentAngle = 0;
    let autoRotate = setInterval(() => {
        currentAngle -= 0.4;
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
    }, 16);

    items[0].classList.add('active');

    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            clearInterval(autoRotate);
            const targetAngle = -(i * 90);
            currentAngle = targetAngle;
            carousel.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            carousel.style.transform = `rotateY(${targetAngle}deg)`;

            titleEl.style.opacity = '0';
            titleEl.style.transform = 'translateY(8px)';
            descEl.style.opacity = '0';
            descEl.style.transform = 'translateY(8px)';

            setTimeout(() => {
                titleEl.textContent = tracks[i].title;
                descEl.textContent  = tracks[i].desc;
                titleEl.style.opacity = '1';
                titleEl.style.transform = 'translateY(0)';
                descEl.style.opacity = '1';
                descEl.style.transform = 'translateY(0)';
            }, 350);

            items.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            setTimeout(() => {
                carousel.style.transition = '';
                autoRotate = setInterval(() => {
                    currentAngle -= 0.4;
                    carousel.style.transform = `rotateY(${currentAngle}deg)`;
                }, 16);
            }, 3000);
        });
    });

    /* ═══════════════════════════════════════════
       GALLERY SLIDESHOW
    ═══════════════════════════════════════════ */
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    if (!slides.length || !dotsContainer) return;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { goToSlide(i); resetInterval(); });
        dotsContainer.appendChild(dot);
    });

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3800);
    }

    slideInterval = setInterval(nextSlide, 3800);

    /* ═══════════════════════════════════════════
       SPONSOR CARDS — scroll-reveal
    ═══════════════════════════════════════════ */
    const sponsorCards = document.querySelectorAll('.sponsor-card');

    if ('IntersectionObserver' in window) {
        const sponsorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    sponsorObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        sponsorCards.forEach(card => sponsorObserver.observe(card));
    } else {
        sponsorCards.forEach(card => card.classList.add('visible'));
    }

});
