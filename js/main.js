/* ============================================
   maiaa.ai — Main Application Script
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* --- Loader --- */
  function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    if (!loader) return Promise.resolve();

    return new Promise(resolve => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          progress.style.width = '100%';
          setTimeout(() => {
            loader.classList.add('loaded');
            resolve();
          }, 400);
        } else {
          progress.style.width = p + '%';
        }
      }, 80);
    });
  }

  /* --- Smooth Scroll (Lenis) --- */
  function initSmoothScroll() {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60 });
          // Close mobile menu if open
          closeMobileMenu();
        }
      });
    });

    return lenis;
  }

  /* --- Navigation --- */
  function initNav() {
    const nav = document.getElementById('nav');

    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.scroll() > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    });
  }

  /* --- Mobile Menu --- */
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (hamburger && mobileMenu) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function initMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';

      if (!isOpen) {
        // Stagger in links
        gsap.fromTo('.mobile-menu-link',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
      }
    });

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* --- Hero Animations --- */
  function initHero() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Word reveals
    tl.to('.hero-line .word', {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Label
    tl.to('.hero-label', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');

    // Subtitle
    tl.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');

    // CTAs
    tl.to('.hero-ctas', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

    // Stats counter
    tl.add(() => initCounters('.hero-stat-number'), '-=0.2');
  }

  /* --- Counter Animations --- */
  function initCounters(selector) {
    document.querySelectorAll(selector).forEach(el => {
      if (el.hasAttribute('data-no-count')) return;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals) || 0;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toLocaleString();
        }
      });
    });
  }

  /* --- Scroll Animations --- */
  function initScrollAnimations() {
    // Fade up animations
    document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
      const delay = parseFloat(el.dataset.delay) || 0;

      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Scale up (CTA section)
    document.querySelectorAll('[data-animate="scale-up"]').forEach(el => {
      gsap.fromTo(el,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Pricing counter animation
    ScrollTrigger.create({
      trigger: '.pricing',
      start: 'top 70%',
      once: true,
      onEnter: () => { initCounters('.pricing-amount'); initCounters('.pricing-amount-gbp'); }
    });

    // Pricing tabs
    document.querySelectorAll('.pricing-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = 'pricing-' + tab.dataset.tab;
        const panel = document.getElementById(panelId);
        if (panel) {
          panel.classList.add('active');
          initCounters('.pricing-amount');
          initCounters('.pricing-amount-gbp');
        }
      });
    });
  }

  /* --- Testimonials Carousel --- */
  function initTestimonials() {
    const inner = document.querySelector('.testimonials-inner');
    if (!inner) return;

    // Duplicate cards for infinite scroll
    const cards = inner.innerHTML;
    inner.innerHTML = cards + cards;

    const totalWidth = inner.scrollWidth / 2;

    const carouselTween = gsap.to(inner, {
      x: -totalWidth,
      duration: 40,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });

    // Pause on hover (only this tween, not the global timeline)
    const track = document.getElementById('testimonialsTrack');
    if (track) {
      track.addEventListener('mouseenter', () => carouselTween.timeScale(0.1));
      track.addEventListener('mouseleave', () => carouselTween.timeScale(1));
    }
  }

  /* --- FAQ Accordion --- */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item.active').forEach(open => {
          if (open !== item) {
            open.classList.remove('active');
            gsap.to(open.querySelector('.faq-answer'), {
              height: 0,
              duration: 0.35,
              ease: 'power2.inOut'
            });
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('active');
          gsap.to(answer, { height: 0, duration: 0.35, ease: 'power2.inOut' });
        } else {
          item.classList.add('active');
          gsap.fromTo(answer,
            { height: 0 },
            { height: 'auto', duration: 0.35, ease: 'power2.inOut' }
          );
        }
      });
    });
  }

  /* --- Page Transitions --- */
  function initPageTransitions() {
    const overlay = document.getElementById('pageTransition');
    if (!overlay) return;

    // Entry animation if coming from internal nav
    if (sessionStorage.getItem('pageTransition') === 'true') {
      sessionStorage.removeItem('pageTransition');
      overlay.style.transformOrigin = 'top';
      overlay.style.transform = 'scaleY(1)';
      gsap.to(overlay, {
        scaleY: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: 0.1
      });
    }

    // Exit animation on internal links
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('pageTransition', 'true');
          overlay.style.transformOrigin = 'bottom';
          gsap.fromTo(overlay,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => { window.location.href = href; }
            }
          );
        });
      }
    });
  }

  /* --- Initialize Everything --- */
  async function init() {
    await initLoader();

    initSmoothScroll();
    initNav();
    initMobileMenu();
    initHero();

    // Effects
    Effects.initCustomCursor();
    Effects.initTiltCards();
    Effects.initMagneticButtons();
    Effects.initShaderBackground('heroCanvas');
    Effects.initGradientMesh('ctaCanvas', { blobCount: 3, speed: 0.2 });

    // Scroll-driven
    initScrollAnimations();
    initTestimonials();
    initFAQ();
    initPageTransitions();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
