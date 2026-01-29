import './style.css';

console.log('Sushi Norte - Experience Init');

// 1. Sticky Header
const header = document.querySelector('.header');
const heroHeight = document.querySelector('#hero').offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Scroll Reveal Animation
const revealElements = document.querySelectorAll('.section-title, .pricing-card, .menu-item, .hero-title, .hero-subtitle, .gallery-img, .map-info');

// Add initial class
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed
            // revealObserver.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px"
});

// Start Observing
revealElements.forEach(el => revealObserver.observe(el));

// 3. Auto-Scroll Carousel
const carousel = document.querySelector('.menu-carousel');

if (carousel) {
    const speed = 0.5; // Natural slow speed
    let isHovering = false;

    // Pause on Hover
    carousel.addEventListener('mouseenter', () => isHovering = true);
    carousel.addEventListener('mouseleave', () => isHovering = false);
    carousel.addEventListener('touchstart', () => isHovering = true);
    carousel.addEventListener('touchend', () => isHovering = false);

    function smoothScroll() {
        if (!isHovering) {
            // Logic: Reset when we've scrolled 1/3 of the TOTAL width.
            // This assumes the HTML has 3 identical sets of items manually added.
            if (carousel.scrollLeft >= carousel.scrollWidth / 3) {
                carousel.scrollLeft = 0;
            } else {
                carousel.scrollLeft += speed;
            }
        }
        requestAnimationFrame(smoothScroll);
    }

    // Start only after images are loaded to ensure correct scrollWidth calculation
    window.addEventListener('load', () => {
        requestAnimationFrame(smoothScroll);
    });
}
