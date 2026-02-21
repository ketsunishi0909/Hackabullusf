// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains('open');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
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

items.forEach((item, i) => {
    item.addEventListener('click', () => {
        carousel.style.animation = 'none';
        const angle = i * 90;
        carousel.style.transform = `rotateY(${-angle}deg)`;

        titleEl.textContent = tracks[i].title;
        descEl.textContent  = tracks[i].desc;

        items.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });
});
