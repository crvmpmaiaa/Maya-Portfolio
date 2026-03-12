/* ============================================
   NATIVE NATURE — Landing Page JavaScript
   Shared across all product landing pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // FAQ Accordion
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => i.classList.remove('open'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ========================================
    // Scroll reveal for landing page sections
    // ========================================
    const revealSections = document.querySelectorAll(
        '.benefit-item, .ingredient-card, .result-card, .review-card, .ba-card, .faq-item, .howto-step'
    );

    revealSections.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealSections.forEach(el => observer.observe(el));

    // ========================================
    // Stagger animations for grids
    // ========================================
    const staggerGrids = document.querySelectorAll(
        '.benefits-grid, .ingredients-grid, .results-grid, .ba-grid'
    );

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Array.from(entry.target.children).forEach((child, i) => {
                    child.style.transitionDelay = `${i * 120}ms`;
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    staggerGrids.forEach(grid => staggerObserver.observe(grid));

    // ========================================
    // Animate review bars on scroll
    // ========================================
    const reviewBars = document.querySelector('.reviews-bars');
    if (reviewBars) {
        const barsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.bar-fill');
                    fills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0%';
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                fill.style.width = width;
                            });
                        });
                    });
                    barsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        barsObserver.observe(reviewBars);
    }

    // ========================================
    // Smooth scroll to reviews from star count
    // ========================================
    const reviewLink = document.querySelector('.pdp-stars span');
    if (reviewLink) {
        reviewLink.style.cursor = 'pointer';
        reviewLink.addEventListener('click', () => {
            const reviewsSection = document.querySelector('.pdp-reviews');
            if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});
