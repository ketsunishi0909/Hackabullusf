document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // Carousel
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
    let currentAngle = 0;
    let autoRotate = setInterval(() => {
        currentAngle -= 1;
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
    }, 30);
    items[0].classList.add('active');
    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            clearInterval(autoRotate);
            const targetAngle = -(i * 90);
            currentAngle = targetAngle;
            carousel.style.transition = 'transform 0.6s ease';
            carousel.style.transform = `rotateY(${targetAngle}deg)`;
            titleEl.style.opacity = '0';
            descEl.style.opacity = '0';
            setTimeout(() => {
                titleEl.textContent = tracks[i].title;
                descEl.textContent  = tracks[i].desc;
                titleEl.style.opacity = '1';
                descEl.style.opacity = '1';
            }, 300);
            items.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            setTimeout(() => {
                carousel.style.transition = '';
                autoRotate = setInterval(() => {
                    currentAngle -= 1;
                    carousel.style.transform = `rotateY(${currentAngle}deg)`;
                }, 30);
            }, 3000);
        });
    });

    // Gallery Slideshow
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
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
        slideInterval = setInterval(nextSlide, 3500);
    }

    slideInterval = setInterval(nextSlide, 3500);

}); // ← this is the closing of DOMContentLoaded
